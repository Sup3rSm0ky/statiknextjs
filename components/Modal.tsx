'use client';

import { useEffect } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function Modal({ open, onClose, title, children }: Props) {
  useEffect(() => {
    if (!open) return;
    function onEsc(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{
      position: 'fixed', inset: 0, background: 'rgba(10, 10, 15, 0.7)',
      backdropFilter: 'blur(12px)', zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div className="fadeIn" style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)',
        borderRadius: 24, padding: 36, width: '100%', maxWidth: 480,
        maxHeight: '90vh', overflowY: 'auto', position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: -1, left: '30%', right: '30%', height: 1,
          background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
        }} />
        <h2 style={{ fontFamily: 'Instrument Serif', fontSize: 30, letterSpacing: -1, marginBottom: 24 }}>{title}</h2>
        {children}
      </div>
    </div>
  );
}
