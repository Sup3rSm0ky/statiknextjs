export function fmt(num: number): string {
  return new Intl.NumberFormat('id-ID').format(Math.round(num));
}

export function fmtDate(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
}

export function getInitials(name: string): string {
  if (!name) return '?';
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

export type Account = {
  id: string;
  user_id: string;
  name: string;
  type: 'bank' | 'ewallet' | 'cash' | 'credit';
  initial_balance: number;
  created_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  type: 'income' | 'expense' | 'transfer';
  date: string;
  amount: number;
  account_id: string;
  account_to_id?: string | null;
  category?: string | null;
  description?: string | null;
  created_at: string;
};

export type Budget = {
  id: string;
  user_id: string;
  category: string;
  monthly_limit: number;
  created_at: string;
};

export type Category = {
  id: string;
  user_id: string;
  name: string;
  type: 'income' | 'expense';
  created_at: string;
};

export function getAccountBalance(accountId: string, accounts: Account[], transactions: Transaction[]): number {
  const acc = accounts.find((a) => a.id === accountId);
  if (!acc) return 0;
  let bal = Number(acc.initial_balance);
  transactions.forEach((t) => {
    const amount = Number(t.amount);
    if (t.type === 'income' && t.account_id === accountId) bal += amount;
    if (t.type === 'expense' && t.account_id === accountId) bal -= amount;
    if (t.type === 'transfer') {
      if (t.account_id === accountId) bal -= amount;
      if (t.account_to_id === accountId) bal += amount;
    }
  });
  return bal;
}

export function getTotalWealth(accounts: Account[], transactions: Transaction[]): number {
  return accounts.reduce((sum, a) => sum + getAccountBalance(a.id, accounts, transactions), 0);
}
