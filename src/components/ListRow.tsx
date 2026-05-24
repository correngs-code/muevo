import { useState } from 'react'
import { formatEUR } from '../lib/expenses'
import { IconTrash2 } from './Icons'

interface ListRowProps {
  icon: string
  name: string
  meta: string
  amount: number
  kind: 'income' | 'expense'
  onDelete?: () => void
}

export default function ListRow({ icon, name, meta, amount, kind, onDelete }: ListRowProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 0',
        borderBottom: '1px solid var(--border)',
        transition: 'background 150ms',
        position: 'relative',
      }}
    >
      {/* Icon circle */}
      <div style={{
        width: 40, height: 40, flexShrink: 0,
        background: 'var(--muted)',
        borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20,
      }}>
        {icon}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 600,
          color: 'var(--foreground)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {name}
        </div>
        <div style={{
          fontSize: 12, color: 'var(--muted-foreground)',
          marginTop: 1,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {meta}
        </div>
      </div>

      {/* Amount */}
      <div style={{
        fontSize: 15, fontWeight: 700,
        color: kind === 'income' ? 'oklch(0.55 0.18 152)' : 'var(--foreground)',
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-0.01em',
        flexShrink: 0,
        transition: 'opacity 150ms',
        opacity: hovered && onDelete ? 0.4 : 1,
      }}>
        {kind === 'income' ? '+' : '−'}{formatEUR(amount)}
      </div>

      {/* Delete button (revealed on hover) */}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          style={{
            position: 'absolute',
            right: 0,
            width: 36, height: 36,
            background: 'oklch(0.62 0.22 25 / 0.1)',
            border: '1px solid oklch(0.62 0.22 25 / 0.2)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--destructive)',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'scale(1)' : 'scale(0.8)',
            transition: 'opacity 150ms, transform 150ms cubic-bezier(0.22,1,0.36,1)',
            pointerEvents: hovered ? 'auto' : 'none',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'oklch(0.62 0.22 25 / 0.18)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'oklch(0.62 0.22 25 / 0.1)' }}
        >
          <IconTrash2 size={15} />
        </button>
      )}
    </div>
  )
}
