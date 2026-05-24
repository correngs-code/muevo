import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(url, key)

export type Transaction = {
  id: string
  user_id: string
  name: string
  amount: number
  kind: 'income' | 'expense'
  category: string
  icon: string
  created_at: string
}

export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  })
}

export async function signOut() {
  return supabase.auth.signOut()
}

// Fetches all transactions for the current calendar year
export async function fetchTransactions(userId: string): Promise<Transaction[]> {
  const startOfYear = new Date(new Date().getFullYear(), 0, 1)
  startOfYear.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', startOfYear.toISOString())
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function addTransaction(tx: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction> {
  const { data, error } = await supabase
    .from('transactions')
    .insert(tx)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await supabase.from('transactions').delete().eq('id', id)
  if (error) throw error
}
