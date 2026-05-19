import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import AccountsContent from './AccountsContent';
import type { Account, Transaction } from '@/lib/utils';

export default async function AccountsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [accRes, txnRes] = await Promise.all([
    supabase.from('accounts').select('*').order('created_at', { ascending: true }),
    supabase.from('transactions').select('*'),
  ]);

  const accounts: Account[] = accRes.data || [];
  const transactions: Transaction[] = txnRes.data || [];
  const userName = (user.user_metadata?.full_name as string) || user.email?.split('@')[0] || 'User';

  return (
    <div style={{ maxWidth: 1320, margin: '0 auto', padding: '32px 24px' }}>
      <Header userName={userName} userEmail={user.email || ''} />
      <AccountsContent initialAccounts={accounts} transactions={transactions} />
    </div>
  );
}
