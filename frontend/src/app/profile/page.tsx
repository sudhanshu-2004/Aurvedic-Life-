'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import styles from './page.module.css';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState({ first_name: '', last_name: '', phone: '', gender: '', avatar_url: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return; }
      setUser(data.user);
      const { data: p } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      if (p) setProfile({ first_name: p.first_name || '', last_name: p.last_name || '', phone: p.phone || '', gender: p.gender || '', avatar_url: p.avatar_url || '' });
      setLoading(false);
    });
  }, [router]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setMsg('');
    const { error } = await supabase.from('profiles').upsert({ id: user!.id, ...profile });
    setSaving(false);
    setMsg(error ? error.message : 'Profile updated successfully! ✓');
  };

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file || !user) return;
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (error) { setMsg(error.message); return; }
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
    setProfile(p => ({ ...p, avatar_url: publicUrl }));
    await supabase.from('profiles').upsert({ id: user.id, avatar_url: publicUrl });
  };

  const signOut = async () => { await supabase.auth.signOut(); router.push('/'); };

  if (loading) return <div className={styles.loading}><div className={styles.spinner} /></div>;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div className={styles.avatarWrap}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className={styles.avatar} />
            ) : (
              <div className={styles.avatarPlaceholder}>{profile.first_name?.[0] || user?.email?.[0]?.toUpperCase()}</div>
            )}
            <label className={styles.avatarUpload}>
              📷 Change Photo
              <input type="file" accept="image/*" onChange={handleAvatar} hidden />
            </label>
          </div>
          <div className={styles.sidebarInfo}>
            <h2>{profile.first_name || 'My'} {profile.last_name || 'Account'}</h2>
            <p>{user?.email}</p>
          </div>
          <button onClick={signOut} className={styles.signOutBtn}>Sign Out</button>
        </div>

        <div className={styles.main}>
          <h1>My Profile</h1>
          {msg && <div className={`${styles.msg} ${msg.includes('✓') ? styles.msgSuccess : styles.msgError}`}>{msg}</div>}
          <form onSubmit={save} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.field}><label>First Name</label><input value={profile.first_name} onChange={e => setProfile(p => ({ ...p, first_name: e.target.value }))} placeholder="Priya" /></div>
              <div className={styles.field}><label>Last Name</label><input value={profile.last_name} onChange={e => setProfile(p => ({ ...p, last_name: e.target.value }))} placeholder="Sharma" /></div>
            </div>
            <div className={styles.field}><label>Email</label><input value={user?.email || ''} disabled /></div>
            <div className={styles.field}><label>Phone</label><input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="9876543210" /></div>
            <div className={styles.field}>
              <label>Gender</label>
              <select value={profile.gender} onChange={e => setProfile(p => ({ ...p, gender: e.target.value }))}>
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
