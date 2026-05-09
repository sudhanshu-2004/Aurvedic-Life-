'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

type Order = {
  id: string; status: string; total_amount: number; delivery_charge: number;
  payment_method: string; delivery_name: string; delivery_address: string; created_at: string;
  order_items: { product_name: string; price: number; quantity: number }[];
};

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b', paid: '#3b82f6', shipped: '#8b5cf6',
  delivered: '#10b981', cancelled: '#ef4444',
};

function OrdersInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const success = params.get('success') === '1';

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return; }
      const { data: ord } = await supabase
        .from('orders')
        .select('*, order_items(product_name, price, quantity)')
        .eq('user_id', data.user.id)
        .order('created_at', { ascending: false });
      setOrders(ord ?? []);
      setLoading(false);
    });
  }, [router]);

  if (loading) return (
    <div className={styles.loading}><div className={styles.spinner} /></div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>My Orders</h1>
          <Link href="/products" className={styles.shopBtn}>Continue Shopping →</Link>
        </div>

        {success && (
          <div className={styles.successBanner}>
            🎉 Order placed successfully! We'll send updates on your phone.
          </div>
        )}

        {orders.length === 0 ? (
          <div className={styles.empty}>
            <span>📦</span>
            <h3>No orders yet</h3>
            <p>Start your wellness journey today!</p>
            <Link href="/products" className={styles.shopBtn}>Browse Products</Link>
          </div>
        ) : (
          <div className={styles.list}>
            {orders.map(o => (
              <div key={o.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <span className={styles.orderId}>#{o.id.slice(0, 8).toUpperCase()}</span>
                    <span className={styles.date}>{new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <span className={styles.status} style={{ background: STATUS_COLORS[o.status] + '22', color: STATUS_COLORS[o.status], border: `1px solid ${STATUS_COLORS[o.status]}44` }}>
                    {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                  </span>
                </div>

                <div className={styles.items}>
                  {o.order_items.map((item, i) => (
                    <div key={i} className={styles.item}>
                      <span>🌿 {item.product_name}</span>
                      <span>× {item.quantity} — ₹{(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.delivery}>📍 {o.delivery_address}</span>
                  <div className={styles.totals}>
                    <span>{o.payment_method === 'cod' ? '💵 COD' : '💳 Online'}</span>
                    <strong>₹{o.total_amount}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div /></div>}>
      <OrdersInner />
    </Suspense>
  );
}
