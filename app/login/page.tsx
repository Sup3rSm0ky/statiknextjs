'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message === 'Invalid login credentials' ? 'Email atau password salah' : error.message);
        setLoading(false);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } else {
      if (password.length < 6) {
        setError('Password minimal 6 karakter');
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative' }}>
      <div style={{
        position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 600, background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 60%)',
        opacity: 0.4, pointerEvents: 'none', filter: 'blur(40px)',
      }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 40 }}>
          <div className="float" style={{
            width: 56, height: 56, background: 'var(--accent)', borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px var(--accent-glow)',
          }}>
            <span style={{ fontFamily: 'Instrument Serif', fontStyle: 'italic', fontSize: 32, color: '#0a0a0f', fontWeight: 700 }}>$</span>
          </div>
          <div style={{ fontFamily: 'Instrument Serif', fontStyle: 'italic', fontSize: 38, letterSpacing: '-1.5px', marginTop: 8 }}>
            Catat<em style={{ color: 'var(--accent)' }}>Duit</em>
          </div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
            Personal Finance Tracker
          </div>
        </div>

        <div className="card fadeIn">
          <h1 style={{ fontFamily: 'Instrument Serif', fontSize: 26, letterSpacing: '-0.5px', marginBottom: 6 }}>
            {mode === 'login' ? 'Selamat datang kembali' : 'Bikin akun baru'}
          </h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, marginBottom: 24 }}>
            {mode === 'login' ? 'Masuk untuk akses laporan keuangan lo' : 'Mulai catat keuangan lo dari sini'}
          </p>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div style={{ marginBottom: 16 }}>
                <label className="form-label">Nama Lengkap</label>
                <input
                  type="text" className="form-input" required
                  value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lo"
                />
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Email</label>
              <input
                type="email" className="form-input" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="email@lo.com" autoComplete="email"
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label className="form-label">Password</label>
              <input
                type="password" className="form-input" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {mode === 'login' && (
              <div style={{ textAlign: 'right', marginBottom: 16 }}>
                <Link href="/reset-password" className="link-btn" style={{ textDecoration: 'none' }}>
                  Lupa password?
                </Link>
              </div>
            )}

            <button type="submit" className="btn-primary btn-full" disabled={loading} style={{ marginTop: mode === 'register' ? 8 : 0 }}>
              {loading ? 'Loading...' : mode === 'login' ? 'Masuk →' : 'Daftar Sekarang →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--ink-soft)' }}>
            {mode === 'login' ? (
              <>Belum punya akun? <button onClick={() => { setMode('register'); setError(''); }} className="link-btn">Daftar di sini</button></>
            ) : (
              <>Udah punya akun? <button onClick={() => { setMode('login'); setError(''); }} className="link-btn">Masuk</button></>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: 'var(--ink-faint)', fontFamily: 'JetBrains Mono', letterSpacing: '0.5px' }}>
          CatatDuit · v1.0 · Powered by Next.js + Supabase
        </div>
      </div>
    </div>
  );
}
