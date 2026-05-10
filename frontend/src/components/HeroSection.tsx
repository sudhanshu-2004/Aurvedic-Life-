'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './HeroSection.module.css';

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.bg} />
      <div className={styles.overlay} />
      <div className={styles.content}>

        <span className={styles.pill}>🌿 The Soul of Ayurveda</span>
        <h1 className={styles.heading}>
          Heal with the<br/><span>Wisdom of Ayurveda</span>
        </h1>
        <p className={styles.sub}>
          Premium Ayurvedic formulations crafted from the finest herbs.
          Trusted by 50,000+ customers across India.
        </p>
        <div className={styles.ctas}>
          <Link href="/products" className={styles.btnPrimary}>
            Shop Now →
          </Link>
          <Link href="#products" className={styles.btnSecondary}>
            Explore Products
          </Link>
        </div>
        <div className={styles.stats}>
          {[['50K+', 'Happy Customers'], ['4', 'Products'], ['100%', 'Herbal & Natural'], ['4.8★', 'Avg Rating']].map(([n, l]) => (
            <div key={l} className={styles.stat}>
              <strong>{n}</strong><span>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
