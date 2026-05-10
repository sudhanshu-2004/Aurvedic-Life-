'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import styles from './Navbar.module.css';

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setUser(s?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem('al_cart') || '[]');
      setCartCount(cart.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0));
    };
    updateCart();
    window.addEventListener('al_cart_update', updateCart);
    return () => window.removeEventListener('al_cart_update', updateCart);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <Image src="/images/logo.png" alt="Ayurved Life" width={140} height={48} priority style={{ objectFit: 'contain' }} />
        </Link>

        <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {['/', '/products', '/about', '/reviews', '/contact'].map((href, i) => (
            <li key={i}><Link href={href} onClick={() => setMenuOpen(false)}>
              {['Home','Products','About','Reviews','Contact'][i]}
            </Link></li>
          ))}
        </ul>

        <div className={styles.actions}>
          <Link href="/cart" className={styles.iconBtn} title="Cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </Link>

          {user ? (
            <div className={styles.userMenu}>
              <Link href="/profile" className={styles.avatar} title="Profile">
                {user.email?.[0].toUpperCase()}
              </Link>
              <div className={styles.dropdown}>
                <Link href="/profile">My Profile</Link>
                <Link href="/orders">My Orders</Link>
                <button onClick={handleSignOut}>Sign Out</button>
              </div>
            </div>
          ) : (
            <Link href="/login" className={styles.loginBtn}>Login</Link>
          )}

          <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span/><span/><span/>
          </button>
        </div>
      </div>
    </nav>
  );
}
