'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/supabase';
import styles from './page.module.css';
import Link from 'next/link';

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [id, setId] = useState<string>('');

  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    async function fetchProduct() {
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      if (data) setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  if (loading) return <div className={styles.loading}>Loading product details...</div>;
  
  if (!product) return (
    <div className={styles.notFound}>
      <h2>Product not found</h2>
      <Link href="/products" className={styles.backBtn}>Back to Products</Link>
    </div>
  );

  const discount = Math.round(((product.original_price - product.price) / product.original_price) * 100);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('al_cart') || '[]');
    const idx = cart.findIndex((i: { id: string }) => i.id === product.id);
    if (idx >= 0) cart[idx].quantity += 1;
    else cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image_url });
    localStorage.setItem('al_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('al_cart_update'));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link> &gt; <Link href="/products">Products</Link> &gt; <span>{product.name}</span>
        </div>
        
        <div className={styles.productLayout}>
          <div className={styles.imageSection}>
            <div className={styles.imageWrapper}>
              {product.badge && (
                <span className={`${styles.badge} ${product.badge === 'Best Seller' ? styles.badgeGold : styles.badgeGreen}`}>
                  {product.badge}
                </span>
              )}
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} />
              ) : (
                <div className={styles.placeholder}>No Image Available</div>
              )}
            </div>
          </div>
          
          <div className={styles.detailsSection}>
            <p className={styles.category}>{product.category}</p>
            <h1 className={styles.title}>{product.name}</h1>
            
            <div className={styles.priceContainer}>
              <span className={styles.price}>₹{product.price}</span>
              <span className={styles.originalPrice}>₹{product.original_price}</span>
              <span className={styles.discountBadge}>{discount}% OFF</span>
            </div>
            
            <p className={styles.taxInfo}>Inclusive of all taxes</p>
            
            <div className={styles.description}>
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
            
            <div className={styles.features}>
              <div className={styles.feature}><span className={styles.icon}>🌿</span> 100% Ayurvedic Formula</div>
              <div className={styles.feature}><span className={styles.icon}>🚫</span> No Harmful Chemicals</div>
              <div className={styles.feature}><span className={styles.icon}>✅</span> Clinically Tested</div>
            </div>
            
            <div className={styles.actions}>
              <button 
                className={`${styles.addToCartBtn} ${added ? styles.added : ''}`} 
                onClick={addToCart}
                disabled={!product.in_stock}
              >
                {product.in_stock ? (added ? '✓ Added to Cart!' : 'Add to Cart') : 'Out of Stock'}
              </button>
            </div>
            
            <div className={styles.trustBanner}>
              <p>🚚 Free Delivery on orders over ₹999</p>
              <p>🔒 Secure Encrypted Payments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
