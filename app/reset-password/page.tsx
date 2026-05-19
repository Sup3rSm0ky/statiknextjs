'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: 13 }}>← Kembali ke login</Link>
        </div>

        <div className="card fadeIn">
          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div className="scaleIn" style={{
                width: 64, height: 64, borderRadius: '50%', background: 'var(--green-soft)',
                border: '2px solid var(--green)', color: 'var(--green)', fontSize: 32, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
              }}>✓</div>
              <h1 style={{ fontFamily: 'Instrument Serif', fontSize: 26, marginBottom: 6 }}>Cek Email Lo</h1>
              <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginBottom: 20 }}>
                Kami baru aja kirim link reset password ke <strong style={{ color: 'var(--accent)' }}>{email}</strong>.
                Klik link di email itu buat bikin password baru.
              </p>
              <p style={{ color: 'var(--ink-faint)', fontSize: 12, fontStyle: 'italic' }}>
                Ga keliatan email? Cek folder Spam atau Promotions.
              </p>
              <Link href="/login" style={{ display: 'inline-block', marginTop: 20 }}>
                <button className="btn-primary btn-full">Balik ke Login</button>
              </Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontFamily: 'Instrument Serif', fontSize: 26, marginBottom: 6 }}>
                Reset <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Password</em>
              </h1>
              <p style={{ color: 'var(--ink-soft)', fontSize: 13, marginBottom: 24 }}>
                Masukin email lo, kami bakal kirim link reset password ke sana
              </p>

              {error && <div className="error-box">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label className="form-label">Email</label>
                  <input
                    type="email" className="form-input" required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@lo.com" autoComplete="email"
                  />
                </div>

                <button type="submit" className="btn-primary btn-full" disabled={loading}>
                  {loading ? 'Mengirim...' : 'Kirim Link Reset →'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
