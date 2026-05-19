'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { getInitials } from '@/lib/utils';

type Props = {
  userName: string;
  userEmail: string;
};

export default function Header({ userName, userEmail }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    if (!confirm('Yakin mau keluar?')) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/transactions', label: 'Transaksi' },
    { href: '/accounts', label: 'Rekening' },
    { href: '/budget', label: 'Budget' },
  ];

  return (
    <header style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: 40, padding: '16px 24px', background: 'rgba(26, 26, 35, 0.6)',
      backdropFilter: 'blur(20px)', border: '1px solid var(--border)', borderRadius: 20,
    }}>
      <div style={{
        fontFamily: 'Instrument Serif', fontStyle: 'italic', fontSize: 32,
        letterSpacing: '-1px', display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div className="pulse-dot" style={{
          width: 10, height: 10, background: 'var(--accent)', borderRadius: '50%',
          boxShadow: '0 0 20px var(--accent-glow)',
        }} />
        <div>Catat<em style={{ color: 'var(--accent)' }}>Duit</em></div>
      </div>

      <nav style={{
        display: 'flex', gap: 4, background: 'var(--bg-elevated)',
        padding: 4, borderRadius: 999, border: '1px solid var(--border)',
      }}>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} style={{
            textDecoration: 'none', fontSize: 13, fontWeight: pathname === item.href ? 600 : 500,
            padding: '8px 16px', borderRadius: 999, transition: 'all 0.25s',
            background: pathname === item.href ? 'var(--accent)' : 'transparent',
            color: pathname === item.href ? '#0a0a0f' : 'var(--ink-soft)',
          }}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div onClick={() => setMenuOpen(!menuOpen)} style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent), #8eb82b)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 14, color: 'var(--bg)', cursor: 'pointer',
        }}>
          {getInitials(userName || userEmail)}
        </div>

        {menuOpen && (
          <div className="fadeIn" style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
            background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)',
            borderRadius: 14, padding: 8, minWidth: 220, zIndex: 50,
            boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
          }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', marginBottom: 6 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{userName || 'User'}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontFamily: 'JetBrains Mono' }}>{userEmail}</div>
            </div>
            <button onClick={handleLogout} style={{
              width: '100%', textAlign: 'left', padding: '10px 14px',
              background: 'transparent', border: 'none', color: 'var(--red)',
              fontFamily: 'Space Grotesk', fontSize: 13, cursor: 'pointer', borderRadius: 8,
            }}>
              → Keluar
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
