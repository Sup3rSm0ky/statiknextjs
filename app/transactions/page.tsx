import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import TransactionsContent from './TransactionsContent';
import type { Account, Transaction, Category } from '@/lib/utils';

export default async function TransactionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [accRes, txnRes, catRes] = await Promise.all([
    supabase.from('accounts').select('*').order('created_at', { ascending: true }),
    supabase.from('transactions').select('*').order('date', { ascending: false }),
    supabase.from('categories').select('*'),
  ]);

  const accounts: Account[] = accRes.data || [];
  const transactions: Transaction[] = txnRes.data || [];
  const categories: Category[] = catRes.data || [];
  const userName = (user.user_metadata?.full_name as string) || user.email?.split('@')[0] || 'User';

  return (
    <div style={{ maxWidth: 1320, margin: '0 auto', padding: '32px 24px' }}>
      <Header userName={userName} userEmail={user.email || ''} />
      <TransactionsContent
        initialTransactions={transactions}
        accounts={accounts}
        categories={categories}
      />
    </div>
  );
}
