import type { Transaction } from '../lib/supabase'
import { formatEUR, PIE_COLORS, CATEGORIES } from '../lib/expenses'

interface AnnoScreenProps {
  transactions: Transaction[]
}

const MONTHS_SHORT = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic']
const MONTHS_FULL  = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre']

interface MonthStat {
  label: string
  fullLabel: string
  inc: number
  exp: number
  net: number
  hasData: boolean
}

interface CatStat {
  category: string
  icon: string
  total: number
  color: string
}

export default function AnnoScreen({ transactions }: AnnoScreenProps) {
  const year = new Date().getFullYear()
  const currentMonth = new Date().getMonth()

  const yearTxs = transactions.filter(
    (t) => new Date(t.created_at).getFullYear() === year
  )

  const totalInc = yearTxs.filter((t) => t.kind === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExp = yearTxs.filter((t) => t.kind === 'expense').reduce((s, t) => s + t.amount, 0)
  const net = totalInc - totalExp
  const savingsRate = totalInc > 0 ? Math.round((net / totalInc) * 100) : 0

  // Month-by-month breakdown (only up to current month)
  const months: MonthStat[] = MONTHS_SHORT.map((label, i) => {
    const mTxs = yearTxs.filter((t) => new Date(t.created_at).getMonth() === i)
    const inc = mTxs.filter((t) => t.kind === 'income').reduce((s, t) => s + t.amount, 0)
    const exp = mTxs.filter((t) => t.kind === 'expense').reduce((s, t) => s + t.amount, 0)
    return { label, fullLabel: MONTHS_FULL[i], inc, exp, net: inc - exp, hasData: mTxs.length > 0 }
  }).slice(0, currentMonth + 1)

  const maxExp = Math.max(...months.map((m) => m.exp), 1)
  const maxInc = Math.max(...months.map((m) => m.inc), 1)
  const barMax  = Math.max(maxExp, maxInc)

  // Category breakdown
  const catMap = new Map<string, number>()
  for (const t of yearTxs.filter((t) => t.kind === 'expense')) {
    catMap.set(t.category, (catMap.get(t.category) ?? 0) + t.amount)
  }
  const cats: CatStat[] = Array.from(catMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([category, total], i) => ({
      category,
      total,
      icon: CATEGORIES.find((c) => c.value === category)?.emoji ?? '✨',
      color: PIE_COLORS[i % PIE_COLORS.length],
    }))

  const maxCat = cats[0]?.total ?? 1

  return (
    <div style={{ padding: '20px 20px 120px', minHeight: '100dvh' }}>

      {/* ── Annual header ───────────────────────────────────────────────── */}
      <div style={{ marginBottom: 24, paddingTop: 8 }}>
        <div style={{
          fontSize: 13, fontWeight: 600,
          color: 'var(--muted-foreground)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: 6,
        }}>
          {year}
        </div>
        <div style={{
          fontSize: 40, fontWeight: 800,
          color: net < 0 ? 'var(--destructive)' : 'var(--foreground)',
          letterSpacing: '-0.04em',
          fontVariantNumeric: 'tabular-nums',
          marginBottom: 12,
        }}>
          {net < 0 ? '−' : ''}{formatEUR(Math.abs(net))}
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'oklch(0.68 0.18 152)' }} />
            <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
              Entrate <strong style={{ color: 'var(--foreground)' }}>{formatEUR(totalInc)}</strong>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--destructive)' }} />
            <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
              Spese <strong style={{ color: 'var(--foreground)' }}>{formatEUR(totalExp)}</strong>
            </span>
          </div>
          {totalInc > 0 && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2px 10px',
              borderRadius: 9999,
              background: net >= 0 ? 'oklch(0.94 0.07 152)' : 'oklch(0.95 0.06 25)',
              fontSize: 12, fontWeight: 700,
              color: net >= 0 ? 'oklch(0.42 0.16 152)' : 'var(--destructive)',
            }}>
              {net >= 0 ? '↑' : '↓'} {Math.abs(savingsRate)}% risparmiato
            </div>
          )}
        </div>
      </div>

      {/* ── Monthly bar chart ───────────────────────────────────────────── */}
      {months.some((m) => m.hasData) && (
        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '16px 16px 12px',
          marginBottom: 20,
          boxShadow: 'var(--shadow-card)',
        }}>
          <div style={{
            fontSize: 12, fontWeight: 700,
            color: 'var(--muted-foreground)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>
            Mese per mese
          </div>

          {/* Bars */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${months.length}, 1fr)`,
            gap: 4,
            alignItems: 'flex-end',
            height: 90,
          }}>
            {months.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <div style={{ width: '100%', height: 72, display: 'flex', alignItems: 'flex-end', gap: 2, justifyContent: 'center' }}>
                  {/* Expense bar */}
                  <div
                    title={`${m.fullLabel}: Spese ${formatEUR(m.exp)}`}
                    style={{
                      width: '46%',
                      height: `${Math.max((m.exp / barMax) * 100, m.exp > 0 ? 4 : 0)}%`,
                      borderRadius: '3px 3px 0 0',
                      background: 'var(--destructive)',
                      opacity: i === currentMonth ? 1 : 0.5,
                      transition: 'height 500ms cubic-bezier(0.22,1,0.36,1)',
                    }}
                  />
                  {/* Income bar */}
                  <div
                    title={`${m.fullLabel}: Entrate ${formatEUR(m.inc)}`}
                    style={{
                      width: '46%',
                      height: `${Math.max((m.inc / barMax) * 100, m.inc > 0 ? 4 : 0)}%`,
                      borderRadius: '3px 3px 0 0',
                      background: 'oklch(0.68 0.18 152)',
                      opacity: i === currentMonth ? 1 : 0.55,
                      transition: 'height 500ms cubic-bezier(0.22,1,0.36,1)',
                    }}
                  />
                </div>
                <span style={{
                  fontSize: 9, letterSpacing: '0.04em',
                  color: i === currentMonth ? 'var(--foreground)' : 'var(--muted-foreground)',
                  fontWeight: i === currentMonth ? 700 : 400,
                  textTransform: 'uppercase',
                }}>
                  {m.label}
                </span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, marginTop: 12, justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--muted-foreground)' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: 'oklch(0.68 0.18 152)' }} />
              Entrate
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--muted-foreground)' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--destructive)' }} />
              Spese
            </div>
          </div>
        </div>
      )}

      {/* ── Month list ──────────────────────────────────────────────────── */}
      {months.some((m) => m.hasData) && (
        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '0 16px',
          marginBottom: 20,
          boxShadow: 'var(--shadow-card)',
        }}>
          {[...months].reverse().filter((m) => m.hasData).map((m, i, arr) => (
            <div
              key={m.label}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 0',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)', marginBottom: 2 }}>
                  {m.fullLabel}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>
                  +{formatEUR(m.inc)} · −{formatEUR(m.exp)}
                </div>
              </div>
              <div style={{
                fontSize: 15, fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                color: m.net >= 0 ? 'oklch(0.42 0.16 152)' : 'var(--destructive)',
              }}>
                {m.net >= 0 ? '+' : '−'}{formatEUR(Math.abs(m.net))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Category breakdown ──────────────────────────────────────────── */}
      {cats.length > 0 && (
        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '16px',
          marginBottom: 20,
          boxShadow: 'var(--shadow-card)',
        }}>
          <div style={{
            fontSize: 12, fontWeight: 700,
            color: 'var(--muted-foreground)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 14,
          }}>
            Spese per categoria
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            {cats.map((cat) => (
              <div key={cat.category}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <span style={{ fontSize: 16 }}>{cat.icon}</span>
                    <span style={{ fontWeight: 500, color: 'var(--foreground)' }}>{cat.category}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--foreground)' }}>
                    {formatEUR(cat.total)}
                  </span>
                </div>
                <div style={{ height: 4, background: 'var(--muted)', borderRadius: 9999, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${(cat.total / maxCat) * 100}%`,
                    background: cat.color,
                    borderRadius: 9999,
                    transition: 'width 600ms cubic-bezier(0.22,1,0.36,1)',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Empty state ─────────────────────────────────────────────────── */}
      {yearTxs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted-foreground)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Nessun movimento nel {year}</div>
          <div style={{ fontSize: 14 }}>Aggiungi le prime spese dalla schermata Home</div>
        </div>
      )}
    </div>
  )
}
