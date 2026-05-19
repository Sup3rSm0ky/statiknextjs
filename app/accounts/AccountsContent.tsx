'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { type Account, type Transaction, fmt, getAccountBalance } from '@/lib/utils';
import Modal from '@/components/Modal';

type Props = {
  initialAccounts: Account[];
  transactions: Transaction[];
};

export default function AccountsContent({ initialAccounts, transactions }: Props) {
  const router = useRouter();
  const [accounts, setAccounts] = useState(initialAccounts);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'bank' | 'ewallet' | 'cash' | 'credit'>('bank');
  const [balance, setBalance] = useState('');
  const [error, setError] = useState('');

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!name.trim()) return setError('Nama wajib diisi');

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase.from('accounts').insert({
      user_id: user.id, name: name.trim(), type, initial_balance: parseFloat(balance) || 0,
    }).select().single();

    if (error) return setError(error.message);
    setAccounts([...accounts, data]);
    setName(''); setBalance(''); setType('bank'); setShowModal(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    const hasTxn = transactions.some((t) => t.account_id === id || t.account_to_id === id);
    if (hasTxn) {
      if (!confirm('Rekening ini punya transaksi. Yakin hapus? Semua transaksinya juga ke hapus.')) return;
    } else {
      if (!confirm('Hapus rekening ini?')) return;
    }
    const supabase = createClient();
    const { error } = await supabase.from('accounts').delete().eq('id', id);
    if (error) return alert(error.message);
    setAccounts(accounts.filter((a) => a.id !== id));
    router.refresh();
  }

  return (
    <div className="fadeIn">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <h1 className="page-title"><em>Rekening</em> Saya</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ Tambah Rekening</button>
      </div>

      {accounts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--bg-card)', border: '1px dashed var(--border-strong)', borderRadius: 24 }}>
          <h3 style={{ fontFamily: 'Instrument Serif', fontSize: 32, letterSpacing: -1, marginBottom: 8 }}>Belum ada rekening</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>Tambah bank, e-wallet, atau cash lo</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {accounts.map((a) => (
            <div key={a.id} style={{
              background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-elevated) 100%)',
              border: '1px solid var(--border)', borderRadius: 20, padding: 24,
              position: 'relative', overflow: 'hidden', transition: 'all 0.3s',
            }}>
              <div style={{
                position: 'absolute', top: '-30%', right: '-30%', width: 200, height: 200,
                background: 'radial-gradient(circle, var(--accent-glow), transparent 70%)', opacity: 0.3,
              }} />
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--ink-soft)', marginBottom: 8 }}>{a.type}</div>
              <div style={{ fontFamily: 'Instrument Serif', fontSize: 24, letterSpacing: -0.5, marginBottom: 16, position: 'relative', zIndex: 1 }}>{a.name}</div>
              <div style={{ fontFamily: 'Instrument Serif', fontSize: 28, letterSpacing: -1, color: 'var(--accent)', position: 'relative', zIndex: 1 }}>
                Rp {fmt(getAccountBalance(a.id, accounts, transactions))}
              </div>
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--ink-soft)' }}>
                <span>Awal: Rp {fmt(Number(a.initial_balance))}</span>
                <button className="btn-icon" onClick={() => handleDelete(a.id)}>✕ Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Tambah Rekening">
        <form onSubmit={handleAdd}>
          {error && <div className="error-box">{error}</div>}
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Nama Rekening</label>
            <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="BCA Tabungan" required />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Tipe</label>
            <select className="form-select" value={type} onChange={(e) => setType(e.target.value as 'bank' | 'ewallet' | 'cash' | 'credit')}>
              <option value="bank">Bank</option>
              <option value="ewallet">E-Wallet</option>
              <option value="cash">Cash</option>
              <option value="credit">Kartu Kredit</option>
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Saldo Awal (Rp)</label>
            <input type="number" className="form-input" value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="0" />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
            <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
            <button type="submit" className="btn-primary">Simpan</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
