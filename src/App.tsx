import { useState, useEffect, useCallback } from 'react'
import { guessIcon } from './lib/expenses'
import Landing from './components/Landing'
import HomeScreen from './components/HomeScreen'
import MeseScreen from './components/MeseScreen'
import AnnoScreen from './components/AnnoScreen'
import BottomNav from './components/BottomNav'
import SuccessModal from './components/SuccessModal'

// ── Types ────────────────────────────────────────────────────────────────────

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

type Screen = 'home' | 'mese' | 'anno'
type SuccessData = { icon: string; name: string; amount: number; isIncome: boolean }
type AddPayload = { name: string; amount: number; isIncome: boolean; icon: string }

// ── Demo mode (localStorage) ─────────────────────────────────────────────────

const IS_DEMO = !import.meta.env.VITE_SUPABASE_URL

function loadDemo(): Transaction[] {
  try {
    const stored = localStorage.getItem('muevo_demo_txs')
    return stored ? (JSON.parse(stored) as Transaction[]) : []
  } catch {
    return []
  }
}

function saveDemo(txs: Transaction[]) {
  localStorage.setItem('muevo_demo_txs', JSON.stringify(txs))
}

// ── Supabase (lazy import so demo builds without .env) ───────────────────────

async function getSupabaseModule() {
  return import('./lib/supabase')
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function currentMonthTxs(txs: Transaction[]): Transaction[] {
  const now = new Date()
  return txs.filter((t) => {
    const d = new Date(t.created_at)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  })
}

// ── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [loggedIn, setLoggedIn]   = useState(IS_DEMO)
  const [loading, setLoading]     = useState(!IS_DEMO)
  const [screen, setScreen]       = useState<Screen>('home')
  // Full-year transactions — MeseScreen/AnnoScreen filter client-side
  const [transactions, setTransactions] = useState<Transaction[]>(IS_DEMO ? loadDemo() : [])
  const [success, setSuccess]     = useState<SuccessData | null>(null)
  const [userInitials, setUserInitials] = useState(IS_DEMO ? 'DM' : 'U')

  // ── Supabase auth ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (IS_DEMO) return
    ;(async () => {
      const { supabase, fetchTransactions } = await getSupabaseModule()
      const { data } = await supabase.auth.getSession()
      const u = data.session?.user ?? null
      if (u) {
        setLoggedIn(true)
        const initials = (u.user_metadata?.full_name as string | undefined)
          ?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() ?? 'U'
        setUserInitials(initials)
        const txs = await fetchTransactions(u.id).catch(() => [] as Transaction[])
        setTransactions(txs)
      }
      setLoading(false)

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_e, session) => {
        const u2 = session?.user ?? null
        setLoggedIn(!!u2)
        if (u2) {
          const txs = await fetchTransactions(u2.id).catch(() => [] as Transaction[])
          setTransactions(txs)
        } else {
          setTransactions([])
        }
      })
      return () => subscription.unsubscribe()
    })()
  }, [])

  // ── Add ───────────────────────────────────────────────────────────────────
  const handleAdd = useCallback(async (parsed: AddPayload) => {
    const icon = parsed.icon || guessIcon(parsed.name, 'Altro')

    if (IS_DEMO) {
      const tx: Transaction = {
        id: crypto.randomUUID(),
        user_id: 'demo',
        name: parsed.name,
        amount: parsed.amount,
        kind: parsed.isIncome ? 'income' : 'expense',
        category: parsed.isIncome ? 'Altro' : 'Cibo & Delivery',
        icon,
        created_at: new Date().toISOString(),
      }
      setTransactions((prev) => { const next = [tx, ...prev]; saveDemo(next); return next })
      setSuccess({ icon, name: tx.name, amount: tx.amount, isIncome: tx.kind === 'income' })
      return
    }

    const { addTransaction, supabase } = await getSupabaseModule()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const tx = await addTransaction({
      user_id: session.user.id,
      name: parsed.name,
      amount: parsed.amount,
      kind: parsed.isIncome ? 'income' : 'expense',
      category: parsed.isIncome ? 'Altro' : 'Cibo & Delivery',
      icon,
    })
    setTransactions((prev) => [tx, ...prev])
    setSuccess({ icon: tx.icon, name: tx.name, amount: tx.amount, isIncome: tx.kind === 'income' })
  }, [])

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = useCallback(async (id: string) => {
    if (IS_DEMO) {
      setTransactions((prev) => { const next = prev.filter((t) => t.id !== id); saveDemo(next); return next })
      return
    }
    const { deleteTransaction } = await getSupabaseModule()
    await deleteTransaction(id)
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // ── Sign out ──────────────────────────────────────────────────────────────
  const handleSignOut = useCallback(async () => {
    if (IS_DEMO) return
    const { supabase } = await getSupabaseModule()
    await supabase.auth.signOut()
    setLoggedIn(false)
    setTransactions([])
  }, [])

  // ── Landing CTA ───────────────────────────────────────────────────────────
  const handleLaunch = useCallback(async () => {
    if (IS_DEMO) { setLoggedIn(true); return }
    const { signInWithGoogle } = await getSupabaseModule()
    await signInWithGoogle()
  }, [])

  // ── Derived ───────────────────────────────────────────────────────────────
  const monthTxs      = currentMonthTxs(transactions)
  const totalIncome   = monthTxs.filter((t) => t.kind === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpenses = monthTxs.filter((t) => t.kind === 'expense').reduce((s, t) => s + t.amount, 0)
  const remaining     = totalIncome - totalExpenses

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <div style={{ width: 32, height: 32, border: '2px solid #3b6cff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  )

  if (!loggedIn) return <Landing onLaunch={handleLaunch} />

  return (
    <div style={{ position: 'relative', maxWidth: 576, margin: '0 auto', minHeight: '100dvh', background: 'var(--gradient-bg)' }}>
      {IS_DEMO && (
        <div style={{
          position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 576, zIndex: 200,
          background: 'rgba(59,108,255,0.10)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(59,108,255,0.15)',
          textAlign: 'center', padding: '6px 16px',
          fontSize: 11, fontWeight: 500, color: '#3b6cff', letterSpacing: '0.04em',
        }}>
          Modalità demo · i dati sono salvati localmente
        </div>
      )}

      <div style={{ paddingTop: IS_DEMO ? 30 : 0, minHeight: '100dvh' }}>
        {screen === 'home' && (
          <HomeScreen
            remaining={remaining}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            userInitials={userInitials}
            onAdd={handleAdd}
            onSignOut={handleSignOut}
          />
        )}
        {screen === 'mese' && (
          <MeseScreen transactions={transactions} onDelete={handleDelete} />
        )}
        {screen === 'anno' && (
          <AnnoScreen transactions={transactions} onDelete={handleDelete} />
        )}
      </div>

      {success && <SuccessModal data={success} onClose={() => setSuccess(null)} />}

      <div style={{
        position: 'fixed', bottom: 0,
        left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 576,
        padding: '0 4px env(safe-area-inset-bottom) 4px',
        zIndex: 100,
      }}>
        <BottomNav active={screen} onChange={setScreen} />
      </div>
    </div>
  )
}
