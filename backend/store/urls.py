from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register),
    path('login/', views.login_view),
    path('google-auth/', views.google_auth),
    path('send-otp/', views.send_otp),
    path('verify-otp/', views.verify_otp),
    path('profile/', views.profile),
    path('profile/photo/', views.upload_photo),
    path('orders/create/', views.create_order),
    path('payment/verify/', views.verify_payment),
]
