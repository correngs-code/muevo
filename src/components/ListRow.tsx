import { useState, useRef } from 'react'
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
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [swiped, setSwiped] = useState(false)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const isDragging = useRef(false)

  const SWIPE_THRESHOLD = 60

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    isDragging.current = false
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartX.current
    const dy = e.touches[0].clientY - touchStartY.current
    if (!isDragging.current && Math.abs(dy) > Math.abs(dx)) return
    isDragging.current = true
    if (dx < 0) {
      e.preventDefault()
      const offset = Math.max(dx, -SWIPE_THRESHOLD - 20)
      setSwipeOffset(offset)
    } else if (swiped && dx > 0) {
      e.preventDefault()
      setSwipeOffset(Math.min(0, -SWIPE_THRESHOLD + dx))
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging.current) return
    if (swipeOffset < -SWIPE_THRESHOLD / 2) {
      setSwipeOffset(-SWIPE_THRESHOLD)
      setSwiped(true)
    } else {
      setSwipeOffset(0)
      setSwiped(false)
    }
  }

  const resetSwipe = () => {
    setSwipeOffset(0)
    setSwiped(false)
  }

  return (
    <div
      style={{ position: 'relative', overflow: 'hidden' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Swipe delete background (mobile) */}
      {onDelete && (
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0,
          width: SWIPE_THRESHOLD,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'oklch(0.55 0.22 25)',
          borderRadius: 10,
        }}>
          <IconTrash2 size={18} color="#fff" />
        </div>
      )}

      {/* Row content */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={swiped ? resetSwipe : undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 0',
          borderBottom: '1px solid var(--border)',
          position: 'relative',
          transform: `translateX(${swipeOffset}px)`,
          transition: isDragging.current ? 'none' : 'transform 0.25s cubic-bezier(0.22,1,0.36,1)',
          background: 'var(--card)',
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

        {/* Delete button (hover — desktop) */}
        {onDelete && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDelete() }}
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

      {/* Swipe delete confirm (tapping exposed delete) */}
      {swiped && onDelete && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(); resetSwipe() }}
          style={{
            position: 'absolute', right: 0, top: 0, bottom: 0,
            width: SWIPE_THRESHOLD,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        />
      )}
    </div>
  )
}
