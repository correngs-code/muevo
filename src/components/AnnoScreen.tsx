import { useState, useMemo, useEffect } from 'react'
import type { Transaction } from '../lib/supabase'
import { formatEUR, formatDate, PIE_COLORS, CATEGORIES } from '../lib/expenses'
import ListRow from './ListRow'
import { IconX } from './Icons'

interface AnnoScreenProps {
  transactions: Transaction[]
  onDelete: (id: string) => void
}

const MONTHS_FULL  = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre']
const MONTHS_SHORT = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic']

export default function AnnoScreen({ transactions, onDelete }: AnnoScreenProps) {
  const now = new Date()
  const [year, setYear]             = useState(now.getFullYear())
  const [openMonth, setOpenMonth]   = useState<number | null>(null)
  const [sheetVisible, setSheetVisible] = useState(false)

  // Animate sheet in/out
  useEffect(() => {
    if (openMonth !== null) {
      requestAnimationFrame(() => setSheetVisible(true))
    }
  }, [openMonth])

  const closeSheet = () => {
    setSheetVisible(false)
    setTimeout(() => setOpenMonth(null), 300)
  }

  // Year options derived from data
  const yearOptions = useMemo(() => {
    const years = new Set([now.getFullYear()])
    for (const t of transactions) years.add(new Date(t.created_at).getFullYear())
    return [...years].sort((a, b) => b - a)
  }, [transactions, now])

  // Per-month breakdown
  const monthsData = useMemo(() => MONTHS_FULL.map((name, idx) => {
    const mTxs = transactions.filter((t) => {
      const d = new Date(t.created_at)
      return d.getFullYear() === year && d.getMonth() === idx
    })
    const inc = mTxs.filter((t) => t.kind === 'income').reduce((s, t) => s + t.amount, 0)
    const exp = mTxs.filter((t) => t.kind === 'expense').reduce((s, t) => s + t.amount, 0)
    const expCount = mTxs.filter((t) => t.kind === 'expense').length
    return { idx, name, short: MONTHS_SHORT[idx], inc, exp, net: inc - exp, expCount, txs: mTxs }
  }), [transactions, year])

  const yearTotals = useMemo(() => monthsData.reduce(
    (acc, m) => ({ exp: acc.exp + m.exp, inc: acc.inc + m.inc }),
    { exp: 0, inc: 0 }
  ), [monthsData])

  const selected = openMonth !== null ? monthsData[openMonth] : null

  const catEmoji = (cat: string) => CATEGORIES.find((c) => c.value === cat)?.emoji ?? '✨'

  // Category slices for selected month
  const pieSlices = useMemo(() => {
    if (!selected) return []
    const map = new Map<string, number>()
    for (const t of selected.txs.filter((t) => t.kind === 'expense')) {
      map.set(t.category, (map.get(t.category) ?? 0) + t.amount)
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([label, value], i) => ({ label, value, color: PIE_COLORS[i % PIE_COLORS.length] }))
  }, [selected])

  const todayMonth = now.getMonth()
  const todayYear  = now.getFullYear()

  return (
    <div style={{ padding: '20px 20px 120px', minHeight: '100dvh' }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', margin: 0 }}>Calendario</h1>
          <p style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 4 }}>
            Tocca un mese per vedere i dettagli
          </p>
        </div>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          style={{
            height: 32, padding: '0 12px',
            borderRadius: 9999,
            border: '1px solid var(--border)',
            background: 'var(--card)',
            color: 'var(--foreground)',
            fontSize: 12, fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </header>

      {/* ── Annual totals ───────────────────────────────────────────────── */}
      <div style={{
        borderRadius: 24, background: 'var(--card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-card)',
        padding: '16px 20px', marginBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--muted-foreground)' }}>
            Bilancio {year}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: (yearTotals.inc - yearTotals.exp) < 0 ? 'var(--destructive)' : 'var(--foreground)' }}>
            {formatEUR(yearTotals.inc - yearTotals.exp)}
          </div>
        </div>
        <div style={{ marginTop: 8, display: 'flex', gap: 16, fontSize: 11, color: 'var(--muted-foreground)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'oklch(0.68 0.18 152)', flexShrink: 0 }} />
            {formatEUR(yearTotals.inc)} entrate
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'oklch(0.62 0.22 25)', flexShrink: 0 }} />
            {formatEUR(yearTotals.exp)} spese
          </span>
        </div>
      </div>

      {/* ── 3×4 calendar grid ──────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {monthsData.map((m) => {
          const isCurrent = year === todayYear && m.idx === todayMonth
          const hasData   = m.exp > 0 || m.inc > 0
          const dots      = Math.min(m.expCount, 8)

          return (
            <button
              key={m.idx}
              onClick={() => setOpenMonth(m.idx)}
              style={{
                textAlign: 'left',
                borderRadius: 18,
                padding: '12px 12px 10px',
                minHeight: 96,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                border: isCurrent
                  ? '2px solid oklch(0.58 0.18 255 / 0.6)'
                  : hasData
                    ? '1px solid var(--border)'
                    : '1px dashed var(--border)',
                background: isCurrent
                  ? 'var(--card)'
                  : hasData
                    ? 'var(--card)'
                    : 'color-mix(in oklab, var(--secondary) 40%, transparent)',
                boxShadow: isCurrent
                  ? '0 0 0 3px oklch(0.58 0.18 255 / 0.12), var(--shadow-elevated)'
                  : hasData
                    ? 'var(--shadow-card)'
                    : 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
              onMouseDown={(e)  => { e.currentTarget.style.transform = 'scale(0.97)' }}
              onMouseUp={(e)    => { e.currentTarget.style.transform = 'translateY(-1px)' }}
            >
              {/* Month label row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
                  color: isCurrent ? 'var(--primary)' : 'var(--foreground)',
                }}>
                  {m.short}
                </span>
                {isCurrent && (
                  <span style={{
                    fontSize: 7, fontWeight: 700, textTransform: 'uppercase',
                    padding: '2px 5px', borderRadius: 9999,
                    background: 'var(--primary)', color: '#fff',
                    letterSpacing: '0.04em',
                  }}>
                    Ora
                  </span>
                )}
              </div>

              {/* Bottom content */}
              {hasData ? (
                <div>
                  {/* Expense dots */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 6, minHeight: 10 }}>
                    {Array.from({ length: dots }).map((_, i) => (
                      <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--primary)', opacity: 0.7 }} />
                    ))}
                    {m.expCount > 8 && (
                      <span style={{ fontSize: 7, fontWeight: 700, color: 'var(--muted-foreground)', lineHeight: '5px', marginLeft: 2 }}>
                        +{m.expCount - 8}
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontSize: 13, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '-0.02em', lineHeight: 1,
                    color: m.net < 0 ? 'var(--destructive)' : 'var(--foreground)',
                  }}>
                    {formatEUR(m.net)}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--muted-foreground)', fontVariantNumeric: 'tabular-nums', marginTop: 3 }}>
                    ↓ {formatEUR(m.exp)}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 500, color: 'var(--muted-foreground)' }}>
                  <span style={{ fontSize: 12, lineHeight: 1 }}>+</span>
                  Tocca per aggiungere
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Bottom sheet overlay ────────────────────────────────────────── */}
      {openMonth !== null && (
        <>
          {/* Scrim */}
          <div
            onClick={closeSheet}
            style={{
              position: 'fixed', inset: 0, zIndex: 300,
              background: 'oklch(0.10 0.02 265 / 0.55)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              opacity: sheetVisible ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          />

          {/* Sheet */}
          <div style={{
            position: 'fixed', left: 0, right: 0, bottom: 0,
            zIndex: 301,
            maxWidth: 576, margin: '0 auto',
            maxHeight: '88dvh',
            display: 'flex', flexDirection: 'column',
            borderRadius: '28px 28px 0 0',
            background: 'var(--card)',
            transform: sheetVisible ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)',
            boxShadow: '0 -8px 40px oklch(0.20 0.015 265 / 0.16)',
            overflow: 'hidden',
          }}>
            {selected && (
              <>
                {/* Sheet handle */}
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 2, flexShrink: 0 }}>
                  <div style={{ width: 40, height: 5, borderRadius: 9999, background: 'oklch(0.78 0.01 250)' }} />
                </div>

                {/* Sheet header */}
                <div style={{ position: 'relative', padding: '20px 24px 20px', flexShrink: 0 }}>
                  <div style={{
                    fontSize: 12, fontWeight: 600, textTransform: 'uppercase',
                    letterSpacing: '0.14em', color: 'var(--muted-foreground)', marginBottom: 6,
                  }}>
                    {selected.name} {year}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{
                      fontSize: 38, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
                      letterSpacing: '-0.03em', lineHeight: 1,
                      color: selected.net < 0 ? 'var(--destructive)' : 'var(--foreground)',
                    }}>
                      {formatEUR(selected.net)}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted-foreground)' }}>saldo</span>
                  </div>
                  <div style={{ marginTop: 12, display: 'flex', gap: 20, fontSize: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted-foreground)' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'oklch(0.68 0.18 152)' }} />
                      Entrate <strong style={{ marginLeft: 4, color: 'var(--foreground)', fontVariantNumeric: 'tabular-nums' }}>{formatEUR(selected.inc)}</strong>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted-foreground)' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'oklch(0.62 0.22 25)' }} />
                      Spese <strong style={{ marginLeft: 4, color: 'var(--foreground)', fontVariantNumeric: 'tabular-nums' }}>{formatEUR(selected.exp)}</strong>
                    </span>
                  </div>
                  <button
                    onClick={closeSheet}
                    aria-label="Chiudi"
                    style={{
                      position: 'absolute', top: 16, right: 16,
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'var(--secondary)', border: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--muted-foreground)', cursor: 'pointer',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--muted)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--secondary)' }}
                  >
                    <IconX size={16} />
                  </button>
                </div>

                {/* Sheet scrollable body */}
                <div style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', padding: '0 20px calc(env(safe-area-inset-bottom, 0) + 40px)', display: 'flex', flexDirection: 'column', gap: 24 }}>

                  {/* Categories */}
                  {pieSlices.length > 0 && (
                    <section>
                      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--muted-foreground)', marginBottom: 12, padding: '0 4px' }}>
                        Categorie
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {pieSlices.slice(0, 6).map((s) => {
                          const pct = selected.exp > 0 ? (s.value / selected.exp) * 100 : 0
                          return (
                            <div key={s.label} style={{ padding: '0 4px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <span style={{ fontSize: 16 }}>{catEmoji(s.label)}</span>
                                  {s.label}
                                </span>
                                <span style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{formatEUR(s.value)}</span>
                              </div>
                              <div style={{ height: 5, background: 'var(--secondary)', borderRadius: 9999, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${pct}%`, background: s.color, borderRadius: 9999, transition: 'width 500ms cubic-bezier(0.22,1,0.36,1)' }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </section>
                  )}

                  {/* Entrate */}
                  <section>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'oklch(0.55 0.18 152)', marginBottom: 8, padding: '0 4px' }}>
                      Entrate
                    </div>
                    {selected.txs.filter((t) => t.kind === 'income').length === 0 ? (
                      <div style={{ fontSize: 13, color: 'var(--muted-foreground)', padding: '4px 4px' }}>Nessuna entrata in questo mese.</div>
                    ) : (
                      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 18, padding: '0 16px', boxShadow: 'var(--shadow-card)' }}>
                        {selected.txs.filter((t) => t.kind === 'income').map((t) => (
                          <ListRow key={t.id} icon={t.icon} name={t.name} meta={formatDate(t.created_at)} amount={t.amount} kind={t.kind} onDelete={() => onDelete(t.id)} />
                        ))}
                      </div>
                    )}
                  </section>

                  {/* Spese */}
                  <section>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--muted-foreground)', marginBottom: 8, padding: '0 4px' }}>
                      Spese
                    </div>
                    {selected.txs.filter((t) => t.kind === 'expense').length === 0 ? (
                      <div style={{ fontSize: 13, color: 'var(--muted-foreground)', padding: '4px 4px' }}>Nessuna spesa in questo mese.</div>
                    ) : (
                      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 18, padding: '0 16px', boxShadow: 'var(--shadow-card)' }}>
                        {selected.txs.filter((t) => t.kind === 'expense').map((t) => (
                          <ListRow key={t.id} icon={t.icon} name={t.name} meta={`${formatDate(t.created_at)} · ${t.category}`} amount={t.amount} kind={t.kind} onDelete={() => onDelete(t.id)} />
                        ))}
                      </div>
                    )}
                  </section>

                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
