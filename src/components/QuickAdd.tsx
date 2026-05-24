import { useState, useEffect, useRef } from 'react'
import { parseInput, guessIcon, CATEGORIES } from '../lib/expenses'
import { formatEUR } from '../lib/expenses'
import { IconMic, IconArrowUp, IconArrowRight } from './Icons'

const PLACEHOLDERS = [
  'pizza 12',
  'stipendio 1200',
  'benzina 50',
  'amazon 34',
  'caffè 1,50',
]

interface QuickAddItem {
  name: string
  amount: number
  isIncome: boolean
  icon: string
}

interface QuickAddProps {
  onAdd: (item: QuickAddItem) => void
}

export default function QuickAdd({ onAdd }: QuickAddProps) {
  const [value, setValue] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [category, setCategory] = useState('Altro')
  const inputRef = useRef<HTMLInputElement>(null)

  const parsed = parseInput(value)
  const icon = parsed ? guessIcon(parsed.name, category) : '✨'

  useEffect(() => {
    if (value) return
    const timer = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length)
    }, 2200)
    return () => clearInterval(timer)
  }, [value])

  const handleSubmit = () => {
    if (!parsed) return
    const finalIcon = guessIcon(parsed.name, category)
    onAdd({ ...parsed, icon: finalIcon })
    setValue('')
    setCategory('Altro')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit()
  }

  const borderColor = parsed
    ? parsed.isIncome
      ? 'oklch(0.68 0.18 152 / 0.5)'
      : 'oklch(0.58 0.18 255 / 0.4)'
    : 'var(--border)'

  const submitBg = parsed
    ? parsed.isIncome
      ? 'linear-gradient(135deg, oklch(0.68 0.18 152), oklch(0.74 0.18 175))'
      : 'linear-gradient(135deg, #3b6cff 0%, #5b8bff 100%)'
    : 'var(--muted)'

  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      {/* Main pill input */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: 'rgba(255,255,255,0.95)',
        border: `1.5px solid ${borderColor}`,
        borderRadius: 9999,
        padding: '8px 8px 8px 14px',
        boxShadow: '0 2px 16px -4px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.6) inset',
        transition: 'border-color 220ms cubic-bezier(0.22,1,0.36,1), box-shadow 220ms',
        backdropFilter: 'blur(12px)',
      }}>
        {/* Emoji chip */}
        <div style={{
          width: 36, height: 36,
          background: 'var(--muted)',
          borderRadius: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0,
          transition: 'transform 200ms',
        }}>
          {icon}
        </div>

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDERS[placeholderIndex]}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: 16,
            fontFamily: 'var(--font-sans)',
            color: 'var(--foreground)',
            minWidth: 0,
            caretColor: '#3b6cff',
          }}
        />

        {/* Right button */}
        {!value ? (
          <button
            type="button"
            style={{
              width: 40, height: 40,
              background: 'var(--muted)',
              border: 'none',
              borderRadius: 9999,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--muted-foreground)',
              flexShrink: 0,
              transition: 'background 150ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--secondary)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--muted)' }}
          >
            <IconMic size={18} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!parsed}
            style={{
              width: 40, height: 40,
              background: parsed ? submitBg : 'var(--muted)',
              border: 'none',
              borderRadius: 9999,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: parsed ? 'pointer' : 'default',
              color: parsed ? '#fff' : 'var(--muted-foreground)',
              flexShrink: 0,
              transition: 'background 220ms, transform 150ms',
              boxShadow: parsed ? '0 4px 12px -4px rgba(59,108,255,0.4)' : 'none',
            }}
            onMouseEnter={(e) => { if (parsed) e.currentTarget.style.transform = 'scale(1.08)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
          >
            {parsed?.isIncome ? <IconArrowUp size={18} /> : <IconArrowRight size={18} />}
          </button>
        )}
      </div>

      {/* Parsed preview */}
      {parsed && (
        <div style={{
          marginTop: 10,
          padding: '8px 16px',
          background: 'rgba(255,255,255,0.7)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          animation: 'slideUp 200ms cubic-bezier(0.22,1,0.36,1)',
        }}>
          <div style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
            <span style={{ marginRight: 6 }}>{icon}</span>
            <span style={{ color: 'var(--foreground)', fontWeight: 500 }}>{parsed.name}</span>
          </div>
          <div style={{
            fontSize: 15, fontWeight: 700,
            color: parsed.isIncome ? 'oklch(0.55 0.18 152)' : 'var(--foreground)',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {parsed.isIncome ? '+' : '−'}{formatEUR(parsed.amount)}
          </div>
        </div>
      )}

      {/* Category selector (shown when parsed) */}
      {parsed && (
        <div style={{
          marginTop: 8,
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          paddingBottom: 4,
          animation: 'slideUp 220ms cubic-bezier(0.22,1,0.36,1)',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '5px 12px',
                background: category === cat.value ? 'var(--foreground)' : 'rgba(255,255,255,0.7)',
                color: category === cat.value ? 'var(--background)' : 'var(--muted-foreground)',
                border: '1px solid var(--border)',
                borderRadius: 9999, fontSize: 12, fontFamily: 'var(--font-sans)',
                fontWeight: 500, cursor: 'pointer',
                transition: 'background 150ms, color 150ms',
                backdropFilter: 'blur(8px)',
                flexShrink: 0,
              }}
            >
              {cat.emoji} {cat.value}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
