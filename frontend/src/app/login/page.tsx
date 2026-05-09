'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

type Tab = 'email' | 'phone' | 'google';

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const nextPath = params.get('next') ?? '/';

  const [tab, setTab] = useState<Tab>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  // ── Email + Password ────────────────────────────────────────────────────────
  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    router.push(nextPath);
  };

  // ── Google OAuth ────────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    setError(''); setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${nextPath}` },
    });
  };

  // ── Phone OTP ───────────────────────────────────────────────────────────────
  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    // Normalize: ensure +91 prefix
    const normalized = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;
    const { error: err } = await supabase.auth.signInWithOtp({ phone: normalized });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setOtpSent(true);
    setInfo(`OTP sent to ${normalized}`);
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    const normalized = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;
    const { error: err } = await supabase.auth.verifyOtp({ phone: normalized, token: otp, type: 'sms' });
    setLoading(false);
    if (err) { setError(err.message); return; }
    router.push(nextPath);
  };

  return (
    <div className={styles.page}>
      {/* Left Panel */}
      <div className={styles.left}>
        <div className={styles.leftBg} />
        <div className={styles.leftOverlay} />
        <div className={styles.leftContent}>
          <Link href="/" className={styles.logo}>
            <svg viewBox="0 0 48 48" height="44" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 4 C14 16 10 28 18 42 C22 34 26 22 24 4Z" fill="#4caf70"/>
              <path d="M18 12 C8 20 6 34 14 43 C18 34 20 24 18 12Z" fill="#2d8c4e"/>
              <path d="M30 8 C36 14 38 24 34 36 C30 28 28 18 30 8Z" fill="#1f6b35"/>
            </svg>
            <span>Ayurved Life</span>
          </Link>
          <div className={styles.leftBody}>
            <h2>Welcome<br/>Back to <span>Wellness.</span></h2>
            <p>Sign in to access your Ayurvedic journey, manage orders, and discover member benefits.</p>
            <div className={styles.benefits}>
              {['🎁 Exclusive discounts & early access','📦 Track all your orders in one place','💊 Personalized wellness recommendations','🌿 Earn wellness points on every purchase'].map(b => (
                <div key={b} className={styles.benefit}>{b}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className={styles.right}>
        <div className={styles.formWrap}>
          <h1>Sign In</h1>
          <p className={styles.sub}>New here? <Link href="/register">Create an account</Link></p>

          {/* Google Button */}
          <button className={styles.googleBtn} onClick={handleGoogle} disabled={loading}>
            <svg viewBox="0 0 24 24" width="18"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          {/* Tab Switcher */}
          <div className={styles.tabs}>
            <button className={`${styles.tabBtn} ${tab === 'email' ? styles.tabActive : ''}`} onClick={() => { setTab('email'); setError(''); setInfo(''); }}>📧 Email</button>
            <button className={`${styles.tabBtn} ${tab === 'phone' ? styles.tabActive : ''}`} onClick={() => { setTab('phone'); setError(''); setInfo(''); setOtpSent(false); }}>📱 Phone OTP</button>
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {info && <div className={styles.infoBox}>{info}</div>}

          {/* Email Form */}
          {tab === 'email' && (
            <form onSubmit={handleEmail} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="email">Email Address</label>
                <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div className={styles.field}>
                <label htmlFor="password">Password</label>
                <div className={styles.passWrap}>
                  <input id="password" type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                  <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>{showPass ? '🙈' : '👁️'}</button>
                </div>
              </div>
              <div className={styles.forgotRow}>
                <Link href="/forgot-password">Forgot Password?</Link>
              </div>
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In to Ayurved Life'}
              </button>
            </form>
          )}

          {/* Phone OTP Form */}
          {tab === 'phone' && (
            <form onSubmit={otpSent ? verifyOtp : sendOtp} className={styles.form}>
              <div className={styles.field}>
                <label>Phone Number</label>
                <div className={styles.phoneWrap}>
                  <span className={styles.prefix}>🇮🇳 +91</span>
                  <input
                    type="tel" value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210" maxLength={10} required disabled={otpSent}
                  />
                </div>
              </div>
              {otpSent && (
                <div className={styles.field}>
                  <label>Enter OTP</label>
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="6-digit OTP" maxLength={6} required autoFocus />
                  <button type="button" className={styles.resendBtn} onClick={() => { setOtpSent(false); setOtp(''); setInfo(''); }}>
                    ← Change number / Resend
                  </button>
                </div>
              )}
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Please wait…' : otpSent ? 'Verify OTP & Login' : 'Send OTP'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading…</div>}>
      <LoginInner />
    </Suspense>
  );
}
