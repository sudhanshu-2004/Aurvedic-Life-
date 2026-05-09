'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from '../login/page.module.css';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    router.push('/?reset=success');
  };

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.leftBg} /><div className={styles.leftOverlay} />
        <div className={styles.leftContent}>
          <Link href="/" className={styles.logo}><span>Ayurved Life</span></Link>
          <div className={styles.leftBody}>
            <h2>Set New <span>Password.</span></h2>
            <p>Choose a strong password for your Ayurved Life account.</p>
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.formWrap}>
          <h1>New Password</h1>
          {error && <div className={styles.error}>{error}</div>}
          <form onSubmit={handle} className={styles.form} style={{ marginTop: '1.5rem' }}>
            <div className={styles.field}>
              <label>New Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required autoFocus />
            </div>
            <div className={styles.field}>
              <label>Confirm Password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" required />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
