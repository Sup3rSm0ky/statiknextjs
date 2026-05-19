import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import BudgetContent from './BudgetContent';
import type { Budget, Transaction, Category } from '@/lib/utils';

export default async function BudgetPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [budgetRes, txnRes, catRes] = await Promise.all([
    supabase.from('budgets').select('*'),
    supabase.from('transactions').select('*'),
    supabase.from('categories').select('*').eq('type', 'expense'),
  ]);

  const budgets: Budget[] = budgetRes.data || [];
  const transactions: Transaction[] = txnRes.data || [];
  const categories: Category[] = catRes.data || [];
  const userName = (user.user_metadata?.full_name as string) || user.email?.split('@')[0] || 'User';

  return (
    <div style={{ maxWidth: 1320, margin: '0 auto', padding: '32px 24px' }}>
      <Header userName={userName} userEmail={user.email || ''} />
      <BudgetContent initialBudgets={budgets} transactions={transactions} categories={categories} />
    </div>
  );
}
