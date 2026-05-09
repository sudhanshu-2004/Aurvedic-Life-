'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

type CartItem = { id: string; name: string; price: number; quantity: number };

declare global {
  interface Window { Razorpay: new (opts: Record<string, unknown>) => { open(): void }; }
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', pincode: '' });
  const [payMethod, setPayMethod] = useState<'cod' | 'razorpay'>('cod');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('al_cart') || '[]'));
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser({ id: data.user.id, email: data.user.email! });
    });
  }, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery = subtotal >= 999 ? 0 : 50;
  const total = subtotal + delivery;

  const createOrder = async (paymentId: string | null) => {
    if (!user) { router.push('/login?next=/checkout'); return; }
    setLoading(true);

    const { data: order, error: oErr } = await supabase.from('orders').insert({
      user_id: user.id,
      total_amount: total,
      delivery_charge: delivery,
      status: paymentId ? 'paid' : 'pending',
      payment_method: payMethod,
      razorpay_payment_id: paymentId ?? '',
      delivery_name: form.name,
      delivery_phone: form.phone,
      delivery_address: `${form.address}, ${form.city} - ${form.pincode}`,
    }).select('id').single();

    if (oErr || !order) { setMsg('Order failed: ' + oErr?.message); setLoading(false); return; }

    await supabase.from('order_items').insert(
      cart.map(i => ({ order_id: order.id, product_name: i.name, price: i.price, quantity: i.quantity }))
    );

    localStorage.setItem('al_cart', '[]');
    window.dispatchEvent(new Event('al_cart_update'));
    router.push('/orders?success=1');
  };

  const handleCOD = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push('/login?next=/checkout'); return; }
    await createOrder(null);
  };

  const handleRazorpay = async () => {
    if (!user) { router.push('/login?next=/checkout'); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(script);
    script.onload = () => {
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_Si3BnpqzknWBM1',
        amount: total * 100,
        currency: 'INR',
        name: 'Ayurved Life',
        description: 'Wellness Products',
        prefill: { name: form.name, contact: form.phone, email: user.email },
        theme: { color: '#1f6b35' },
        handler: (response: { razorpay_payment_id: string }) => {
          createOrder(response.razorpay_payment_id);
        },
      });
      rzp.open();
    };
  };

  if (cart.length === 0) return (
    <div className={styles.page}>
      <div className={styles.empty}>
        <span>🛒</span>
        <h2>Your cart is empty</h2>
        <Link href="/products" className={styles.backBtn}>Browse Products</Link>
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Checkout</h1>
        {msg && <div className={styles.error}>{msg}</div>}
        {!user && (
          <div className={styles.loginPrompt}>
            <Link href="/login?next=/checkout">Login to place your order →</Link>
          </div>
        )}

        <div className={styles.layout}>
          {/* Delivery Form */}
          <form onSubmit={handleCOD} className={styles.formSection}>
            <h2>Delivery Details</h2>
            <div className={styles.field}>
              <label>Full Name</label>
              <input value={form.name} onChange={set('name')} placeholder="Priya Sharma" required />
            </div>
            <div className={styles.field}>
              <label>Phone Number</label>
              <input type="tel" value={form.phone} onChange={set('phone')} placeholder="9876543210" required />
            </div>
            <div className={styles.field}>
              <label>Address</label>
              <textarea value={form.address} onChange={set('address')} placeholder="House No, Street, Area" required rows={3} />
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>City</label>
                <input value={form.city} onChange={set('city')} placeholder="Mumbai" required />
              </div>
              <div className={styles.field}>
                <label>Pincode</label>
                <input value={form.pincode} onChange={set('pincode')} placeholder="400001" required maxLength={6} />
              </div>
            </div>

            <h2 style={{ marginTop: '2rem' }}>Payment Method</h2>
            <div className={styles.payOptions}>
              {(['cod', 'razorpay'] as const).map(m => (
                <label key={m} className={`${styles.payOpt} ${payMethod === m ? styles.payOptActive : ''}`}>
                  <input type="radio" name="pay" value={m} checked={payMethod === m} onChange={() => setPayMethod(m)} />
                  {m === 'cod' ? '💵 Cash on Delivery' : '💳 Pay Online (Razorpay)'}
                </label>
              ))}
            </div>

            {payMethod === 'cod' ? (
              <button type="submit" className={styles.placeBtn} disabled={loading || !user}>
                {loading ? 'Placing Order…' : 'Place Order (COD)'}
              </button>
            ) : (
              <button type="button" className={styles.placeBtn} onClick={handleRazorpay} disabled={loading || !user}>
                {loading ? 'Processing…' : `Pay ₹${total} Online`}
              </button>
            )}
          </form>

          {/* Order Summary */}
          <div className={styles.summary}>
            <h2>Order Summary</h2>
            {cart.map(i => (
              <div key={i.id} className={styles.summaryItem}>
                <span>{i.name} × {i.quantity}</span>
                <span>₹{(i.price * i.quantity).toFixed(0)}</span>
              </div>
            ))}
            <div className={styles.divider} />
            <div className={styles.summaryRow}><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className={styles.summaryRow}>
              <span>Delivery</span>
              <span>{delivery === 0 ? <span className={styles.free}>FREE</span> : `₹${delivery}`}</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.totalRow}`}><span>Total</span><span>₹{total}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
