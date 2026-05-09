'use client';
import { useState } from 'react';
import type { Product } from '@/lib/supabase';
import styles from './ProductCard.module.css';

interface Props { product: Product; }

export function ProductCard({ product }: Props) {
  const [added, setAdded] = useState(false);

  const discount = Math.round(((product.original_price - product.price) / product.original_price) * 100);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('al_cart') || '[]');
    const idx = cart.findIndex((i: { id: string }) => i.id === product.id);
    if (idx >= 0) cart[idx].quantity += 1;
    else cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image_url });
    localStorage.setItem('al_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('al_cart_update'));
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className={styles.card}>
      {product.badge && (
        <span className={`${styles.badge} ${product.badge === 'Best Seller' ? styles.badgeGold : styles.badgeGreen}`}>
          {product.badge}
        </span>
      )}
      <div className={styles.imgWrap}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} />
        ) : (
          <div className={styles.placeholder}>
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
              <path d="M32 8 C20 22 16 38 24 58 C28 46 34 30 32 8Z" fill="#2d8c4e" opacity="0.7"/>
              <path d="M24 18 C12 28 10 46 20 58 C24 46 26 32 24 18Z" fill="#1f6b35" opacity="0.5"/>
              <path d="M40 12 C48 20 50 34 44 52 C40 40 38 26 40 12Z" fill="#4caf70" opacity="0.6"/>
            </svg>
          </div>
        )}
        {!product.in_stock && <div className={styles.outOfStock}>Out of Stock</div>}
      </div>
      <div className={styles.body}>
        <p className={styles.category}>{product.category}</p>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.desc}>{product.description}</p>
        <div className={styles.priceRow}>
          <span className={styles.price}>₹{product.price}</span>
          <span className={styles.original}>₹{product.original_price}</span>
          <span className={styles.discount}>{discount}% OFF</span>
        </div>
        <button
          className={`${styles.addBtn} ${added ? styles.added : ''}`}
          onClick={addToCart}
          disabled={!product.in_stock}
        >
          {added ? '✓ Added to Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
