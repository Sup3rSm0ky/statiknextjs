'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { type Budget, type Transaction, type Category, fmt } from '@/lib/utils';
import Modal from '@/components/Modal';

type Props = {
  initialBudgets: Budget[];
  transactions: Transaction[];
  categories: Category[];
};

export default function BudgetContent({ initialBudgets, transactions, categories }: Props) {
  const router = useRouter();
  const [budgets, setBudgets] = useState(initialBudgets);
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState(categories[0]?.name || '');
  const [limit, setLimit] = useState('');
  const [error, setError] = useState('');

  const budgetsWithSpent = useMemo(() => {
    const now = new Date();
    const m = now.getMonth(), y = now.getFullYear();
    return budgets.map((b) => {
      let spent = 0;
      transactions.forEach((t) => {
        const d = new Date(t.date);
        if (t.type === 'expense' && t.category === b.category && d.getMonth() === m && d.getFullYear() === y) {
          spent += Number(t.amount);
        }
      });
      return { ...b, spent };
    });
  }, [budgets, transactions]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const lim = parseFloat(limit);
    if (!lim || lim <= 0) return setError('Limit harus lebih dari 0');

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Upsert: kalau udah ada untuk kategori ini, update; kalau belum, insert
    const { data, error } = await supabase.from('budgets').upsert({
      user_id: user.id, category, monthly_limit: lim,
    }, { onConflict: 'user_id,category' }).select().single();

    if (error) return setError(error.message);

    setBudgets([...budgets.filter((b) => b.category !== category), data]);
    setLimit('');
    setShowModal(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus budget ini?')) return;
    const supabase = createClient();
    const { error } = await supabase.from('budgets').delete().eq('id', id);
    if (error) return alert(error.message);
    setBudgets(budgets.filter((b) => b.id !== id));
    router.refresh();
  }

  return (
    <div className="fadeIn">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <h1 className="page-title"><em>Budget</em> Bulanan</h1>
        <button className="btn-primary" onClick={() => { setError(''); setShowModal(true); }}>+ Set Budget</button>
      </div>

      {budgetsWithSpent.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--bg-card)', border: '1px dashed var(--border-strong)', borderRadius: 24 }}>
          <h3 style={{ fontFamily: 'Instrument Serif', fontSize: 32, letterSpacing: -1, marginBottom: 8 }}>Belum ada budget</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>Set limit bulanan per kategori biar pengeluaran terkontrol</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {budgetsWithSpent.map((b) => {
            const lim = Number(b.monthly_limit);
            const pct = Math.min((b.spent / lim) * 100, 100);
            const cls = pct >= 100 ? 'danger' : pct >= 80 ? 'warning' : '';
            const fillColor = pct >= 100 ? 'var(--red)' : pct >= 80 ? 'var(--orange)' : 'var(--green)';
            const glow = pct >= 100 ? 'rgba(255, 85, 119, 0.4)' : pct >= 80 ? 'rgba(255, 169, 77, 0.4)' : 'rgba(74, 222, 128, 0.4)';

            return (
              <div key={b.id} className="card" style={{ padding: 24, transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontFamily: 'Instrument Serif', fontSize: 22, letterSpacing: -0.5 }}>{b.category}</div>
                  <button className="btn-icon" onClick={() => handleDelete(b.id)}>✕</button>
                </div>
                <div style={{ fontFamily: 'Instrument Serif', fontSize: 24, letterSpacing: -0.5, marginTop: 8 }}>
                  Rp {fmt(b.spent)} <span style={{ fontSize: 14, color: 'var(--ink-soft)' }}>/ {fmt(lim)}</span>
                </div>
                <div style={{
                  height: 8, background: 'var(--bg-soft)', borderRadius: 999, overflow: 'hidden', margin: '14px 0 10px',
                }}>
                  <div style={{
                    height: '100%', width: `${pct}%`, borderRadius: 999,
                    background: fillColor, transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: `0 0 12px ${glow}`,
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--ink-soft)' }}>
                  <span>{pct.toFixed(0)}% terpakai</span>
                  <span>{b.spent > lim ? `Over Rp ${fmt(b.spent - lim)}` : `Sisa Rp ${fmt(lim - b.spent)}`}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Set Budget Bulanan">
        <form onSubmit={handleAdd}>
          {error && <div className="error-box">{error}</div>}
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Kategori</label>
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Limit Bulanan (Rp)</label>
            <input type="number" className="form-input" value={limit} onChange={(e) => setLimit(e.target.value)} placeholder="0" required />
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
