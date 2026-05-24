import { useState } from 'react'
import type { Transaction } from '../lib/supabase'
import { formatEUR, formatDate, PIE_COLORS } from '../lib/expenses'
import ListRow from './ListRow'
import { IconChevronLeft, IconChevronRight } from './Icons'

interface MeseScreenProps {
  transactions: Transaction[]
  onDelete: (id: string) => void
}

const MONTHS = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre']

interface CategoryStat {
  category: string
  icon: string
  total: number
}

export default function MeseScreen({ transactions, onDelete }: MeseScreenProps) {
  const now = new Date()
  const [selectedYear, setSelectedYear]   = useState(now.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth())

  const monthLabel = `${MONTHS[selectedMonth]} ${selectedYear}`
  const isCurrent  = selectedYear === now.getFullYear() && selectedMonth === now.getMonth()

  const filtered = transactions.filter((t) => {
    const d = new Date(t.created_at)
    return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth
  })

  const income   = filtered.filter((t) => t.kind === 'income')
  const expenses = filtered.filter((t) => t.kind === 'expense')

  const totalIncome   = income.reduce((s, t) => s + t.amount, 0)
  const totalExpenses = expenses.reduce((s, t) => s + t.amount, 0)
  const saldo         = totalIncome - totalExpenses

  const catMap = new Map<string, CategoryStat>()
  for (const t of expenses) {
    const existing = catMap.get(t.category)
    if (existing) existing.total += t.amount
    else catMap.set(t.category, { category: t.category, icon: t.icon, total: t.amount })
  }
  const cats = Array.from(catMap.values()).sort((a, b) => b.total - a.total).slice(0, 6)
  const maxCatTotal = cats[0]?.total ?? 1

  const goBack = () => {
    if (selectedMonth === 0) { setSelectedYear((y) => y - 1); setSelectedMonth(11) }
    else setSelectedMonth((m) => m - 1)
  }

  const goForward = () => {
    if (isCurrent) return
    if (selectedMonth === 11) { setSelectedYear((y) => y + 1); setSelectedMonth(0) }
    else setSelectedMonth((m) => m + 1)
  }

  return (
    <div style={{ padding: '20px 20px 120px', minHeight: '100dvh' }}>

      {/* Month nav header */}
      <div style={{ marginBottom: 24, paddingTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <button
            type="button"
            onClick={goBack}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--secondary)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--foreground)',
              transition: 'background 150ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--muted)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--secondary)' }}
          >
            <IconChevronLeft size={16} />
          </button>

          <div style={{
            flex: 1, textAlign: 'center',
            fontSize: 13, fontWeight: 600,
            color: 'var(--muted-foreground)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            {monthLabel}
          </div>

          <button
            type="button"
            onClick={goForward}
            disabled={isCurrent}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--secondary)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: isCurrent ? 'default' : 'pointer',
              color: isCurrent ? 'var(--muted-foreground)' : 'var(--foreground)',
              opacity: isCurrent ? 0.35 : 1,
              transition: 'background 150ms',
            }}
            onMouseEnter={(e) => { if (!isCurrent) e.currentTarget.style.background = 'var(--muted)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--secondary)' }}
          >
            <IconChevronRight size={16} />
          </button>
        </div>

        {/* Saldo */}
        <div style={{
          fontSize: 40, fontWeight: 800,
          color: 'var(--foreground)',
          letterSpacing: '-0.04em',
          fontVariantNumeric: 'tabular-nums',
          marginBottom: 12,
        }}>
          {saldo >= 0 ? '' : '−'}{formatEUR(Math.abs(saldo))}
        </div>

        {/* Income / expense summary */}
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'oklch(0.68 0.18 152)' }} />
            <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
              Entrate <strong style={{ color: 'var(--foreground)' }}>{formatEUR(totalIncome)}</strong>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'oklch(0.62 0.22 25)' }} />
            <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
              Spese <strong style={{ color: 'var(--foreground)' }}>{formatEUR(totalExpenses)}</strong>
            </span>
          </div>
        </div>

        {/* Spending percentage bar */}
        {totalIncome > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 11, color: 'var(--muted-foreground)' }}>
              <span>{Math.round((totalExpenses / totalIncome) * 100)}% delle entrate spese</span>
              <span style={{ color: saldo >= 0 ? 'oklch(0.55 0.18 152)' : 'var(--destructive)', fontWeight: 600 }}>
                {saldo >= 0 ? `+${formatEUR(saldo)} risparmiati` : `${formatEUR(Math.abs(saldo))} in rosso`}
              </span>
            </div>
            <div style={{ height: 5, background: 'var(--secondary)', borderRadius: 9999, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.min((totalExpenses / totalIncome) * 100, 100)}%`,
                background: totalExpenses > totalIncome
                  ? 'oklch(0.62 0.22 25)'
                  : 'linear-gradient(90deg, oklch(0.62 0.22 260), oklch(0.68 0.18 255))',
                borderRadius: 9999,
                transition: 'width 600ms cubic-bezier(0.22,1,0.36,1)',
              }} />
            </div>
          </div>
        )}
      </div>

      {/* Category breakdown */}
      {cats.length > 0 && (
        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '16px',
          marginBottom: 24,
          boxShadow: 'var(--shadow-card)',
        }}>
          <div style={{
            fontSize: 12, fontWeight: 700,
            color: 'var(--muted-foreground)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 14,
          }}>
            Per categoria
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {cats.map((cat, i) => (
              <div key={cat.category}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <span style={{ fontSize: 16 }}>{cat.icon}</span>
                    <span style={{ fontWeight: 500, color: 'var(--foreground)' }}>{cat.category}</span>
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: 700,
                    color: 'var(--foreground)',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {formatEUR(cat.total)}
                  </span>
                </div>
                <div style={{ height: 4, background: 'var(--muted)', borderRadius: 9999, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${(cat.total / maxCatTotal) * 100}%`,
                    background: PIE_COLORS[i % PIE_COLORS.length],
                    borderRadius: 9999,
                    transition: 'width 600ms cubic-bezier(0.22,1,0.36,1)',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Entrate section */}
      {income.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 12, fontWeight: 700,
            color: 'oklch(0.55 0.18 152)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 4,
            padding: '0 4px',
          }}>
            Entrate
          </div>
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '0 16px',
            boxShadow: 'var(--shadow-card)',
          }}>
            {income.map((t) => (
              <ListRow
                key={t.id}
                icon={t.icon}
                name={t.name}
                meta={formatDate(t.created_at)}
                amount={t.amount}
                kind={t.kind}
                onDelete={() => onDelete(t.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Spese section */}
      {expenses.length > 0 && (
        <div>
          <div style={{
            fontSize: 12, fontWeight: 700,
            color: 'var(--muted-foreground)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 4,
            padding: '0 4px',
          }}>
            Spese
          </div>
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '0 16px',
            boxShadow: 'var(--shadow-card)',
          }}>
            {expenses.map((t) => (
              <ListRow
                key={t.id}
                icon={t.icon}
                name={t.name}
                meta={formatDate(t.created_at)}
                amount={t.amount}
                kind={t.kind}
                onDelete={() => onDelete(t.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--muted-foreground)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Nessun movimento</div>
          <div style={{ fontSize: 14 }}>
            {isCurrent ? 'Aggiungi le tue spese dalla schermata Home' : 'Nessuna transazione in questo mese'}
          </div>
        </div>
      )}
    </div>
  )
}
