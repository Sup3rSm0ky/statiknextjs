'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { type Account, type Transaction, type Category, fmt, fmtDate } from '@/lib/utils';
import Modal from '@/components/Modal';

type Props = {
  initialTransactions: Transaction[];
  accounts: Account[];
  categories: Category[];
};

export default function TransactionsContent({ initialTransactions, accounts, categories }: Props) {
  const router = useRouter();
  const [transactions, setTransactions] = useState(initialTransactions);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState<'expense' | 'income' | 'transfer'>('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState('');
  const [accountToId, setAccountToId] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const filteredTxns = useMemo(() => {
    if (filter === 'all') return transactions;
    return transactions.filter((t) => t.account_id === filter || t.account_to_id === filter);
  }, [transactions, filter]);

  const availableCategories = useMemo(
    () => categories.filter((c) => c.type === (type === 'income' ? 'income' : 'expense')),
    [categories, type]
  );

  function openModal() {
    if (accounts.length === 0) {
      alert('Tambah minimal 1 rekening dulu di tab Rekening');
      return;
    }
    setDate(new Date().toISOString().split('T')[0]);
    setAmount('');
    setDescription('');
    setError('');
    setAccountId(accounts[0]?.id || '');
    setAccountToId(accounts[1]?.id || accounts[0]?.id || '');
    const expenseCats = categories.filter((c) => c.type === 'expense');
    setCategory(expenseCats[0]?.name || '');
    setType('expense');
    setShowModal(true);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return setError('Jumlah harus lebih dari 0');
    if (type === 'transfer' && accountId === accountToId) return setError('Rekening asal dan tujuan harus beda');

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const txn: any = {
      user_id: user.id, type, date, amount: amt, account_id: accountId,
      description: description || null,
    };
    if (type === 'transfer') txn.account_to_id = accountToId;
    else txn.category = category;

    const { data, error } = await supabase.from('transactions').insert(txn).select().single();
    if (error) return setError(error.message);

    setTransactions([data, ...transactions]);
    setShowModal(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus transaksi ini?')) return;
    const supabase = createClient();
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) return alert(error.message);
    setTransactions(transactions.filter((t) => t.id !== id));
    router.refresh();
  }

  function changeType(newType: 'expense' | 'income' | 'transfer') {
    setType(newType);
    if (newType !== 'transfer') {
      const cats = categories.filter((c) => c.type === (newType === 'income' ? 'income' : 'expense'));
      setCategory(cats[0]?.name || '');
    }
  }

  return (
    <div className="fadeIn">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <h1 className="page-title">Semua <em>Transaksi</em></h1>
        <button className="btn-primary" onClick={openModal}>+ Tambah Transaksi</button>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        <FilterPill active={filter === 'all'} onClick={() => setFilter('all')}>Semua</FilterPill>
        {accounts.map((a) => (
          <FilterPill key={a.id} active={filter === a.id} onClick={() => setFilter(a.id)}>{a.name}</FilterPill>
        ))}
      </div>

      {filteredTxns.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--bg-card)', border: '1px dashed var(--border-strong)', borderRadius: 24 }}>
          <h3 style={{ fontFamily: 'Instrument Serif', fontSize: 32, letterSpacing: -1, marginBottom: 8 }}>Belum ada transaksi</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>Klik &quot;+ Tambah Transaksi&quot; untuk mulai catat</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filteredTxns.map((t) => {
            const acc = accounts.find((a) => a.id === t.account_id);
            const accTo = accounts.find((a) => a.id === t.account_to_id);
            const sign = t.type === 'income' ? '+' : t.type === 'expense' ? '-' : '⇄';
            const color = t.type === 'income' ? 'var(--green)' : t.type === 'expense' ? 'var(--red)' : 'var(--ink-soft)';
            const meta = t.type === 'transfer' ? `${acc?.name || '?'} → ${accTo?.name || '?'}` : `${acc?.name || '?'}`;

            return (
              <div key={t.id} style={{
                display: 'grid', gridTemplateColumns: '70px 1fr auto auto auto',
                alignItems: 'center', gap: 16, padding: '16px 20px',
                background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, transition: 'all 0.2s',
              }}>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: 1 }}>{fmtDate(t.date)}</div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 15 }}>{t.description || (t.type === 'transfer' ? 'Transfer' : t.category)}</div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 3 }}>{meta}</div>
                </div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, padding: '5px 10px', background: 'var(--bg-soft)', borderRadius: 999, color: 'var(--ink-soft)' }}>
                  {t.type === 'transfer' ? 'Transfer' : t.category}
                </div>
                <div style={{ fontFamily: 'Instrument Serif', fontSize: 18, letterSpacing: -0.3, color }}>
                  {sign === '⇄' ? '⇄ ' : sign}Rp {fmt(Number(t.amount))}
                </div>
                <button className="btn-icon" onClick={() => handleDelete(t.id)}>✕</button>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Tambah Transaksi">
        <form onSubmit={handleAdd}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, marginBottom: 20,
            padding: 4, background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border)',
          }}>
            {(['expense', 'income', 'transfer'] as const).map((t) => {
              const colors: Record<typeof t, string> = { expense: 'var(--red)', income: 'var(--green)', transfer: 'var(--accent)' };
              const labels: Record<typeof t, string> = { expense: 'Keluar', income: 'Masuk', transfer: 'Transfer' };
              return (
                <button key={t} type="button" onClick={() => changeType(t)} style={{
                  padding: 11, border: 'none', borderRadius: 10, cursor: 'pointer',
                  fontFamily: 'Space Grotesk', fontWeight: type === t ? 600 : 500, fontSize: 13,
                  background: type === t ? colors[t] : 'transparent',
                  color: type === t ? 'var(--bg)' : 'var(--ink-soft)',
                }}>{labels[t]}</button>
              );
            })}
          </div>

          {error && <div className="error-box">{error}</div>}

          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Tanggal</label>
            <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Jumlah (Rp)</label>
            <input type="number" className="form-input" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" required />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">{type === 'transfer' ? 'Dari Rekening' : 'Rekening'}</label>
            <select className="form-select" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          {type === 'transfer' && (
            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Ke Rekening</label>
              <select className="form-select" value={accountToId} onChange={(e) => setAccountToId(e.target.value)}>
                {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          )}
          {type !== 'transfer' && (
            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Kategori</label>
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                {availableCategories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Deskripsi (opsional)</label>
            <input className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Beli kopi di starbucks" />
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

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: active ? 600 : 500,
      padding: '8px 14px', border: '1px solid var(--border)',
      background: active ? 'var(--accent)' : 'var(--bg-card)',
      color: active ? 'var(--bg)' : 'var(--ink-soft)',
      borderRadius: 999, cursor: 'pointer', transition: 'all 0.2s',
    }}>
      {children}
    </button>
  );
}
