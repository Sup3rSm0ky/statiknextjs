'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }
    if (password !== confirm) {
      setError('Password ga sama');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 2000);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div className="card fadeIn">
          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div className="scaleIn" style={{
                width: 64, height: 64, borderRadius: '50%', background: 'var(--green-soft)',
                border: '2px solid var(--green)', color: 'var(--green)', fontSize: 32, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
              }}>✓</div>
              <h1 style={{ fontFamily: 'Instrument Serif', fontSize: 26, marginBottom: 6 }}>Berhasil!</h1>
              <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>
                Password lo udah berhasil di-update. Lo bakal di-redirect ke dashboard...
              </p>
            </div>
          ) : (
            <>
              <h1 style={{ fontFamily: 'Instrument Serif', fontSize: 26, marginBottom: 6 }}>
                Password <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Baru</em>
              </h1>
              <p style={{ color: 'var(--ink-soft)', fontSize: 13, marginBottom: 24 }}>
                Bikin password baru buat akun lo
              </p>

              {error && <div className="error-box">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label className="form-label">Password Baru (min. 6 karakter)</label>
                  <input
                    type="password" className="form-input" required
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" autoComplete="new-password"
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label className="form-label">Konfirmasi Password</label>
                  <input
                    type="password" className="form-input" required
                    value={confirm} onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••" autoComplete="new-password"
                  />
                </div>

                <button type="submit" className="btn-primary btn-full" disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Simpan Password Baru →'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
