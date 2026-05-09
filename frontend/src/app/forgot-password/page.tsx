'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from '../login/page.module.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSent(true);
  };

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.leftBg} /><div className={styles.leftOverlay} />
        <div className={styles.leftContent}>
          <Link href="/" className={styles.logo}><span>Ayurved Life</span></Link>
          <div className={styles.leftBody}>
            <h2>Reset Your <span>Password.</span></h2>
            <p>Enter your email and we'll send a secure reset link to your inbox.</p>
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.formWrap}>
          <h1>Forgot Password</h1>
          <p className={styles.sub}><Link href="/login">← Back to Sign In</Link></p>
          {sent ? (
            <div className={styles.infoBox} style={{ marginTop: '2rem', fontSize: '1rem', lineHeight: 1.7 }}>
              ✅ Password reset email sent to <strong>{email}</strong>.<br/>
              Check your inbox and click the link to reset your password.
            </div>
          ) : (
            <form onSubmit={handle} className={styles.form} style={{ marginTop: '1.5rem' }}>
              {error && <div className={styles.error}>{error}</div>}
              <div className={styles.field}>
                <label>Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus />
              </div>
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
