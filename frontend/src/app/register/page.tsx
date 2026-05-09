'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from '../login/page.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { first_name: form.firstName, last_name: form.lastName, phone: form.phone } },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    router.push('/?registered=1');
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/` } });
  };

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.leftBg} />
        <div className={styles.leftOverlay} />
        <div className={styles.leftContent}>
          <Link href="/" className={styles.logo}><span>Ayurved Life</span></Link>
          <div className={styles.leftBody}>
            <h2>Join the<br/><span>Wellness Journey.</span></h2>
            <p>Create your account and get access to exclusive Ayurvedic wellness products, order tracking, and personalized recommendations.</p>
            <div className={styles.benefits}>
              {['🎁 Welcome gift on first order','🌿 Personalized Ayurvedic recommendations','📦 Easy order tracking & returns','⭐ Earn wellness points on purchases'].map(b => (
                <div key={b} className={styles.benefit}>{b}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.formWrap}>
          <h1>Create Account</h1>
          <p className={styles.sub}>Already have an account? <Link href="/login">Sign in</Link></p>

          <button className={styles.googleBtn} onClick={handleGoogle}>
            <svg viewBox="0 0 24 24" width="18"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Sign Up with Google
          </button>
          <div className={styles.divider}><span>or register with email</span></div>
          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleRegister} className={styles.form}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className={styles.field}><label>First Name</label><input value={form.firstName} onChange={set('firstName')} placeholder="Priya" required /></div>
              <div className={styles.field}><label>Last Name</label><input value={form.lastName} onChange={set('lastName')} placeholder="Sharma" required /></div>
            </div>
            <div className={styles.field}><label>Email</label><input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required /></div>
            <div className={styles.field}><label>Phone</label><input type="tel" value={form.phone} onChange={set('phone')} placeholder="9876543210" /></div>
            <div className={styles.field}><label>Password</label><input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" required /></div>
            <div className={styles.field}><label>Confirm Password</label><input type="password" value={form.confirm} onChange={set('confirm')} placeholder="••••••••" required /></div>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Creating Account…' : 'Create My Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
