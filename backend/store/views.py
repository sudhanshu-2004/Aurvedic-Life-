import random
import hmac
import hashlib

from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.conf import settings
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from .models import UserProfile, OTPRecord, Order, OrderItem

# ─────────────────────────────────────────────
# REGISTER
# ─────────────────────────────────────────────
@api_view(['POST'])
def register(request):
    data = request.data
    email = data.get('email', '').strip()
    password = data.get('password', '')
    first_name = data.get('first_name', '').strip()
    last_name = data.get('last_name', '').strip()
    phone = data.get('phone', '').strip()

    if not email or not password:
        return Response({'error': 'Email and password are required.'}, status=400)

    if User.objects.filter(username=email).exists():
        return Response({'error': 'Email already registered.'}, status=400)

    user = User.objects.create_user(
        username=email, email=email, password=password,
        first_name=first_name, last_name=last_name
    )
    UserProfile.objects.create(user=user, phone=phone)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'message': 'Account created successfully!',
        'token': token.key,
        'name': user.first_name or email,
        'email': user.email,
    }, status=201)


# ─────────────────────────────────────────────
# LOGIN
# ─────────────────────────────────────────────
@api_view(['POST'])
def login_view(request):
    email = request.data.get('email', '').strip()
    password = request.data.get('password', '')
    user = authenticate(username=email, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        profile = getattr(user, 'profile', None)
        photo_url = None
        if profile and profile.photo:
            photo_url = request.build_absolute_uri(profile.photo.url)
        return Response({
            'message': 'Login successful',
            'token': token.key,
            'name': user.first_name or email,
            'email': user.email,
            'photo': photo_url,
        })
    return Response({'error': 'Invalid email or password.'}, status=401)


# ─────────────────────────────────────────────
# GOOGLE AUTH
# ─────────────────────────────────────────────
@api_view(['POST'])
def google_auth(request):
    credential = request.data.get('token')
    if not credential:
        return Response({'error': 'Google token missing.'}, status=400)
    try:
        idinfo = id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID
        )
        email = idinfo['email']
        first_name = idinfo.get('given_name', '')
        last_name = idinfo.get('family_name', '')

        user, created = User.objects.get_or_create(
            username=email,
            defaults={'email': email, 'first_name': first_name, 'last_name': last_name}
        )
        if created:
            user.set_unusable_password()
            user.save()
            UserProfile.objects.create(user=user)

        token, _ = Token.objects.get_or_create(user=user)
        profile = getattr(user, 'profile', None)
        photo_url = None
        if profile and profile.photo:
            photo_url = request.build_absolute_uri(profile.photo.url)

        return Response({
            'token': token.key,
            'name': user.first_name or email,
            'email': user.email,
            'photo': photo_url,
        })
    except ValueError as e:
        return Response({'error': f'Invalid Google token: {str(e)}'}, status=400)


# ─────────────────────────────────────────────
# PHONE OTP – SEND
# ─────────────────────────────────────────────
@api_view(['POST'])
def send_otp(request):
    phone = request.data.get('phone', '').strip()
    if not phone:
        return Response({'error': 'Phone number required.'}, status=400)

    otp = str(random.randint(100000, 999999))
    OTPRecord.objects.create(phone=phone, otp=otp)

    # Try sending via Twilio; fall back to console in dev
    try:
        if settings.TWILIO_API_KEY_SID and settings.TWILIO_API_SECRET and settings.TWILIO_ACCOUNT_SID and settings.TWILIO_PHONE_NUMBER:
            from twilio.rest import Client
            client = Client(settings.TWILIO_API_KEY_SID, settings.TWILIO_API_SECRET, settings.TWILIO_ACCOUNT_SID)
            client.messages.create(
                body=f'Your Ayurved Life OTP is: {otp}. Valid for 5 minutes.',
                from_=settings.TWILIO_PHONE_NUMBER,
                to=f'+91{phone}'
            )
        else:
            raise Exception("Twilio credentials not fully configured.")
    except Exception as e:
        # Dev fallback: print OTP to console
        print(f'[DEV] OTP for {phone}: {otp}  (Twilio error: {e})')

    return Response({'message': 'OTP sent successfully.'})


# ─────────────────────────────────────────────
# PHONE OTP – VERIFY
# ─────────────────────────────────────────────
@api_view(['POST'])
def verify_otp(request):
    phone = request.data.get('phone', '').strip()
    otp = request.data.get('otp', '').strip()

    record = OTPRecord.objects.filter(
        phone=phone, otp=otp, is_verified=False
    ).order_by('-created_at').first()

    if not record:
        return Response({'error': 'Invalid OTP. Please try again.'}, status=400)

    if record.is_expired():
        return Response({'error': 'OTP has expired. Please request a new one.'}, status=400)

    record.is_verified = True
    record.save()
    return Response({'message': 'Phone verified successfully.'})


# ─────────────────────────────────────────────
# USER PROFILE – GET / UPDATE
# ─────────────────────────────────────────────
@api_view(['GET', 'PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    profile_obj, _ = UserProfile.objects.get_or_create(user=user)

    if request.method == 'GET':
        photo_url = None
        if profile_obj.photo:
            photo_url = request.build_absolute_uri(profile_obj.photo.url)
        return Response({
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'phone': profile_obj.phone,
            'gender': profile_obj.gender,
            'photo': photo_url,
        })

    # PUT – update name, phone, gender
    user.first_name = request.data.get('first_name', user.first_name)
    user.last_name = request.data.get('last_name', user.last_name)
    user.save()
    profile_obj.phone = request.data.get('phone', profile_obj.phone)
    profile_obj.gender = request.data.get('gender', profile_obj.gender)
    profile_obj.save()
    return Response({'message': 'Profile updated.'})


# ─────────────────────────────────────────────
# PROFILE PHOTO UPLOAD
# ─────────────────────────────────────────────
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def upload_photo(request):
    profile_obj, _ = UserProfile.objects.get_or_create(user=request.user)
    if 'photo' not in request.FILES:
        return Response({'error': 'No photo provided.'}, status=400)
    profile_obj.photo = request.FILES['photo']
    profile_obj.save()
    photo_url = request.build_absolute_uri(profile_obj.photo.url)
    return Response({'message': 'Photo uploaded.', 'photo': photo_url})


# ─────────────────────────────────────────────
# CREATE ORDER (Cart → Order)
# ─────────────────────────────────────────────
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_order(request):
    data = request.data
    items = data.get('items', [])
    payment_method = data.get('payment_method', 'cod')
    delivery_name = data.get('delivery_name', '')
    delivery_phone = data.get('delivery_phone', '')
    delivery_address = data.get('delivery_address', '')

    if not items:
        return Response({'error': 'Cart is empty.'}, status=400)

    subtotal = sum(float(i['price']) * int(i['quantity']) for i in items)
    delivery_charge = 0 if subtotal >= 999 else 50
    total = subtotal + delivery_charge

    order = Order.objects.create(
        user=request.user,
        total_amount=total,
        delivery_charge=delivery_charge,
        payment_method=payment_method,
        delivery_name=delivery_name,
        delivery_phone=delivery_phone,
        delivery_address=delivery_address,
        status='pending' if payment_method == 'cod' else 'pending',
    )

    for item in items:
        OrderItem.objects.create(
            order=order,
            product_name=item['name'],
            price=float(item['price']),
            quantity=int(item['quantity']),
        )

    if payment_method == 'cod':
        order.status = 'paid'
        order.save()
        return Response({
            'message': 'Order placed successfully! Pay on delivery.',
            'order_id': order.id,
        })

    # Razorpay – create payment order
    try:
        import razorpay
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        rz_order = client.order.create({
            'amount': int(total * 100),  # paise
            'currency': 'INR',
            'receipt': f'order_{order.id}',
        })
        order.razorpay_order_id = rz_order['id']
        order.save()
        return Response({
            'razorpay_order_id': rz_order['id'],
            'razorpay_key': settings.RAZORPAY_KEY_ID,
            'amount': int(total * 100),
            'order_id': order.id,
            'name': request.user.first_name or request.user.email,
            'email': request.user.email,
        })
    except Exception as e:
        order.delete()
        return Response({'error': f'Payment init failed: {str(e)}'}, status=500)


# ─────────────────────────────────────────────
# VERIFY RAZORPAY PAYMENT
# ─────────────────────────────────────────────
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    data = request.data
    razorpay_order_id = data.get('razorpay_order_id', '')
    razorpay_payment_id = data.get('razorpay_payment_id', '')
    razorpay_signature = data.get('razorpay_signature', '')

    body = f"{razorpay_order_id}|{razorpay_payment_id}"
    expected = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode(),
        body.encode(),
        hashlib.sha256
    ).hexdigest()

    if expected != razorpay_signature:
        return Response({'error': 'Payment verification failed.'}, status=400)

    try:
        order = Order.objects.get(razorpay_order_id=razorpay_order_id, user=request.user)
        order.razorpay_payment_id = razorpay_payment_id
        order.status = 'paid'
        order.save()
        return Response({'message': 'Payment successful! Order confirmed.', 'order_id': order.id})
    except Order.DoesNotExist:
        return Response({'error': 'Order not found.'}, status=404)
