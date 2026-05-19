'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { type Account, type Transaction, fmt, fmtDate, getAccountBalance, getTotalWealth, getInitials } from '@/lib/utils';

type Props = {
  accounts: Account[];
  transactions: Transaction[];
};

export default function DashboardContent({ accounts, transactions }: Props) {
  const [chartPeriod, setChartPeriod] = useState(30);

  const totalWealth = getTotalWealth(accounts, transactions);

  const { monthIncome, monthExpense } = useMemo(() => {
    const now = new Date();
    const m = now.getMonth(), y = now.getFullYear();
    let income = 0, expense = 0;
    transactions.forEach((t) => {
      const d = new Date(t.date);
      if (d.getMonth() === m && d.getFullYear() === y) {
        if (t.type === 'income') income += Number(t.amount);
        if (t.type === 'expense') expense += Number(t.amount);
      }
    });
    return { monthIncome: income, monthExpense: expense };
  }, [transactions]);

  const cashflowData = useMemo(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const result = [];
    for (let i = chartPeriod - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      let income = 0, expense = 0;
      transactions.forEach((t) => {
        if (t.date === dateStr) {
          if (t.type === 'income') income += Number(t.amount);
          if (t.type === 'expense') expense += Number(t.amount);
        }
      });
      result.push({ date: d, income, expense });
    }
    return result;
  }, [transactions, chartPeriod]);

  const recentTxns = useMemo(() => transactions.slice(0, 5), [transactions]);

  return (
    <div className="fadeIn">
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, marginBottom: 20 }} className="dashboard-hero">
        <div style={{
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-elevated) 100%)',
          border: '1px solid var(--border)', borderRadius: 24, padding: 36,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '-50%', right: '-20%', width: 500, height: 500,
            background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 60%)',
            opacity: 0.5, pointerEvents: 'none',
          }} />
          <div className="section-label"><span className="label-bar"></span>Total Kekayaan Bersih</div>
          <div style={{
            fontFamily: 'Instrument Serif', fontSize: 84, letterSpacing: '-3px',
            lineHeight: 0.95, position: 'relative', zIndex: 1,
          }}>
            <span style={{ fontSize: 32, color: 'var(--ink-soft)', fontStyle: 'italic', marginRight: 8 }}>Rp</span>
            {fmt(totalWealth)}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <SummaryCard label="Pemasukan Bulan Ini" amount={monthIncome} variant="income" />
          <SummaryCard label="Pengeluaran Bulan Ini" amount={monthExpense} variant="expense" />
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontFamily: 'Instrument Serif', fontSize: 28, letterSpacing: '-0.5px' }}>
              Arus <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Kas</em>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--ink-soft)', marginTop: 4, letterSpacing: 1, textTransform: 'uppercase' }}>
              Traffic uang masuk vs keluar
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <Legend color="var(--green)" label="Masuk" />
              <Legend color="var(--red)" label="Keluar" />
            </div>
            <div style={{ display: 'flex', gap: 4, background: 'var(--bg-soft)', padding: 3, borderRadius: 999 }}>
              {[7, 30, 90].map((p) => (
                <button key={p} onClick={() => setChartPeriod(p)} style={{
                  fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 500,
                  padding: '6px 12px', border: 'none', background: chartPeriod === p ? 'var(--ink)' : 'transparent',
                  color: chartPeriod === p ? 'var(--bg)' : 'var(--ink-soft)', cursor: 'pointer',
                  borderRadius: 999, textTransform: 'uppercase', letterSpacing: 1,
                }}>
                  {p}H
                </button>
              ))}
            </div>
          </div>
        </div>
        <CashflowChart data={cashflowData} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="dashboard-stats">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontFamily: 'Instrument Serif', fontSize: 26, letterSpacing: '-0.5px' }}>Rekening</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--ink-soft)', background: 'var(--bg-soft)', padding: '4px 10px', borderRadius: 999, letterSpacing: 1 }}>
              {accounts.length} akun
            </div>
          </div>
          {accounts.length === 0 ? (
            <div style={{ padding: '20px 0', color: 'var(--ink-soft)', fontSize: 14 }}>
              Belum ada rekening. <Link href="/accounts" style={{ color: 'var(--accent)' }}>Tambah sekarang</Link>
            </div>
          ) : (
            accounts.map((a) => (
              <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, background: 'var(--bg-soft)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'JetBrains Mono', fontWeight: 600, marginRight: 12, color: 'var(--accent)', fontSize: 14,
                  }}>{getInitials(a.name)}</div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 15 }}>{a.name}</div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, textTransform: 'uppercase', color: 'var(--ink-soft)', letterSpacing: 1.5, marginTop: 3 }}>{a.type}</div>
                  </div>
                </div>
                <div style={{ fontFamily: 'Instrument Serif', fontSize: 20, letterSpacing: '-0.5px' }}>
                  Rp {fmt(getAccountBalance(a.id, accounts, transactions))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontFamily: 'Instrument Serif', fontSize: 26, letterSpacing: '-0.5px' }}>Aktivitas Terakhir</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--ink-soft)', background: 'var(--bg-soft)', padding: '4px 10px', borderRadius: 999, letterSpacing: 1 }}>
              {transactions.length} transaksi
            </div>
          </div>
          {recentTxns.length === 0 ? (
            <div style={{ padding: '20px 0', color: 'var(--ink-soft)', fontSize: 14 }}>
              Belum ada transaksi. <Link href="/transactions" style={{ color: 'var(--accent)' }}>Tambah sekarang</Link>
            </div>
          ) : (
            recentTxns.map((t) => {
              const sign = t.type === 'income' ? '+' : t.type === 'expense' ? '-' : '⇄';
              const color = t.type === 'income' ? 'var(--green)' : t.type === 'expense' ? 'var(--red)' : 'var(--ink-soft)';
              return (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, color, fontFamily: 'JetBrains Mono', fontWeight: 600 }}>{sign}</div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 15 }}>{t.description || (t.type === 'transfer' ? 'Transfer' : t.category)}</div>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, textTransform: 'uppercase', color: 'var(--ink-soft)', letterSpacing: 1.5, marginTop: 3 }}>{fmtDate(t.date)} · {t.type === 'transfer' ? 'Transfer' : t.category}</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: 'Instrument Serif', fontSize: 20, letterSpacing: '-0.5px', color }}>
                    {sign === '⇄' ? '' : sign}Rp {fmt(Number(t.amount))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .dashboard-hero { grid-template-columns: 1fr !important; }
          .dashboard-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function SummaryCard({ label, amount, variant }: { label: string; amount: number; variant: 'income' | 'expense' }) {
  const isIncome = variant === 'income';
  const color = isIncome ? 'var(--green)' : 'var(--red)';
  const softColor = isIncome ? 'var(--green-soft)' : 'var(--red-soft)';
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 24,
      position: 'relative', borderLeft: `3px solid ${color}`,
    }}>
      <div style={{
        position: 'absolute', top: 20, right: 20, width: 36, height: 36, borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
        background: softColor, color,
      }}>{isIncome ? '↗' : '↘'}</div>
      <div className="section-label" style={{ marginBottom: 6 }}>
        <span className="label-bar" style={{ background: color }}></span>{label}
      </div>
      <div style={{ fontFamily: 'Instrument Serif', fontSize: 34, letterSpacing: '-1px', marginTop: 8, color }}>
        Rp {fmt(amount)}
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink-soft)' }}>
      <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
      {label}
    </div>
  );
}

function CashflowChart({ data }: { data: { date: Date; income: number; expense: number }[] }) {
  const hasData = data.some((d) => d.income > 0 || d.expense > 0);
  if (!hasData) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--ink-soft)', fontSize: 14 }}>
        Belum ada data transaksi. Tambah transaksi dulu biar grafik nya muncul.
      </div>
    );
  }

  const maxVal = Math.max(...data.flatMap((d) => [d.income, d.expense]), 1);
  const w = 1200, h = 280;
  const padL = 50, padR = 20, padT = 20, padB = 40;
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;
  const stepX = chartW / Math.max(data.length - 1, 1);

  const incomePoints = data.map((d, i) => [padL + i * stepX, padT + chartH - (d.income / maxVal) * chartH] as [number, number]);
  const expensePoints = data.map((d, i) => [padL + i * stepX, padT + chartH - (d.expense / maxVal) * chartH] as [number, number]);

  function smoothPath(points: [number, number][]) {
    if (points.length < 2) return '';
    let path = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      const [x0, y0] = points[i - 1];
      const [x1, y1] = points[i];
      const cx = (x0 + x1) / 2;
      path += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
    }
    return path;
  }

  function areaPath(points: [number, number][]) {
    const line = smoothPath(points);
    const last = points[points.length - 1];
    const first = points[0];
    return `${line} L ${last[0]} ${padT + chartH} L ${first[0]} ${padT + chartH} Z`;
  }

  const labelInterval = Math.max(1, Math.floor(data.length / 6));

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height: 280 }}>
      <defs>
        <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff5577" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ff5577" stopOpacity="0" />
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const val = maxVal * t;
        const y = padT + chartH - t * chartH;
        return (
          <g key={t}>
            <text x={padL - 8} y={y + 4} textAnchor="end" fontFamily="JetBrains Mono" fontSize="10" fill="#8a8a96">
              {val >= 1000000 ? (val / 1000000).toFixed(1) + 'M' : val >= 1000 ? (val / 1000).toFixed(0) + 'K' : Math.round(val)}
            </text>
            <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          </g>
        );
      })}
      <path d={areaPath(incomePoints)} fill="url(#incGrad)" />
      <path d={areaPath(expensePoints)} fill="url(#expGrad)" />
      <path d={smoothPath(incomePoints)} fill="none" stroke="#4ade80" strokeWidth="2.5" filter="url(#glow)" strokeLinecap="round" />
      <path d={smoothPath(expensePoints)} fill="none" stroke="#ff5577" strokeWidth="2.5" filter="url(#glow)" strokeLinecap="round" />
      {incomePoints.map(([x, y], i) => data[i].income > 0 ? <circle key={i} cx={x} cy={y} r="3" fill="#4ade80" /> : null)}
      {expensePoints.map(([x, y], i) => data[i].expense > 0 ? <circle key={i} cx={x} cy={y} r="3" fill="#ff5577" /> : null)}
      {data.map((d, i) => {
        if (i % labelInterval !== 0 && i !== data.length - 1) return null;
        const x = padL + i * stepX;
        const label = d.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        return <text key={i} x={x} y={h - 15} textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#8a8a96">{label}</text>;
      })}
    </svg>
  );
}
