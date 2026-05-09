'use client';

import Link from 'next/link';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <svg viewBox="0 0 48 48" height="40" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 4 C14 16 10 28 18 42 C22 34 26 22 24 4Z" fill="#4caf70"/>
              <path d="M18 12 C8 20 6 34 14 43 C18 34 20 24 18 12Z" fill="#2d8c4e"/>
              <path d="M30 8 C36 14 38 24 34 36 C30 28 28 18 30 8Z" fill="#1f6b35"/>
            </svg>
            <span>Ayurved Life</span>
          </div>
          <p>The Soul of Ayurveda. Ancient wisdom, modern wellness.</p>
          <div className={styles.socials}>
            {['Instagram','Facebook','Twitter','YouTube'].map(s => (
              <a key={s} href="#" aria-label={s} className={styles.socialIcon}>
                {s[0]}
              </a>
            ))}
          </div>
        </div>

        <div className={styles.col}>
          <h4>Quick Links</h4>
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/profile">My Account</Link>
        </div>

        <div className={styles.col}>
          <h4>Policies</h4>
          <Link href="#">Privacy Policy</Link>
          <Link href="#">Return Policy</Link>
          <Link href="#">Shipping Policy</Link>
          <Link href="#">Terms of Service</Link>
        </div>

        <div className={styles.col}>
          <h4>Newsletter</h4>
          <p className={styles.newsletterText}>Get wellness tips & exclusive offers.</p>
          <form className={styles.newsletterForm} onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="your@email.com" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Ayurved Life. All rights reserved. Made with 🌿 in India.</p>
        <div className={styles.trust}>
          <span>🔒 Secure Payments</span>
          <span>🚚 Free Delivery ₹999+</span>
          <span>✅ 100% Authentic</span>
        </div>
      </div>
    </footer>
  );
}
