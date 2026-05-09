'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

type CartItem = { id: string; name: string; price: number; quantity: number; image?: string };

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const load = () => setCart(JSON.parse(localStorage.getItem('al_cart') || '[]'));
    load();
    window.addEventListener('al_cart_update', load);
    return () => window.removeEventListener('al_cart_update', load);
  }, []);

  const update = (id: string, delta: number) => {
    const updated = cart.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i);
    setCart(updated);
    localStorage.setItem('al_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('al_cart_update'));
  };

  const remove = (id: string) => {
    const updated = cart.filter(i => i.id !== id);
    setCart(updated);
    localStorage.setItem('al_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('al_cart_update'));
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery = subtotal >= 999 ? 0 : 50;
  const total = subtotal + delivery;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Your Cart</h1>

        {cart.length === 0 ? (
          <div className={styles.empty}>
            <span>🛒</span>
            <h3>Your cart is empty</h3>
            <p>Add some Ayurvedic goodness to get started!</p>
            <Link href="/products" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className={styles.layout}>
            <div className={styles.items}>
              {cart.map(item => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemImg}>🌿</div>
                  <div className={styles.itemInfo}>
                    <h3>{item.name}</h3>
                    <span className={styles.itemPrice}>₹{item.price}</span>
                  </div>
                  <div className={styles.qtyControl}>
                    <button onClick={() => update(item.id, -1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => update(item.id, 1)}>+</button>
                  </div>
                  <div className={styles.itemTotal}>₹{(item.price * item.quantity).toFixed(0)}</div>
                  <button className={styles.removeBtn} onClick={() => remove(item.id)}>✕</button>
                </div>
              ))}
            </div>

            <div className={styles.summary}>
              <h2>Order Summary</h2>
              <div className={styles.summaryRow}><span>Subtotal</span><span>₹{subtotal.toFixed(0)}</span></div>
              <div className={styles.summaryRow}>
                <span>Delivery</span>
                <span>{delivery === 0 ? <span className={styles.free}>FREE</span> : `₹${delivery}`}</span>
              </div>
              {delivery > 0 && <p className={styles.freeHint}>Add ₹{(999 - subtotal).toFixed(0)} more for free delivery</p>}
              <div className={`${styles.summaryRow} ${styles.totalRow}`}><span>Total</span><span>₹{total.toFixed(0)}</span></div>
              <Link href="/checkout" className={styles.checkoutBtn}>Proceed to Checkout →</Link>
              <Link href="/products" className={styles.continueBtn}>← Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
