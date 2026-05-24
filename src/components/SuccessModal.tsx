import { useEffect, useState, useCallback } from 'react'
import { formatEUR } from '../lib/expenses'

interface SuccessData {
  icon: string
  name: string
  amount: number
  isIncome: boolean
}

interface SuccessModalProps {
  data: SuccessData | null
  onClose: () => void
}

const EXIT_DURATION = 220

export default function SuccessModal({ data, onClose }: SuccessModalProps) {
  const [exiting, setExiting] = useState(false)

  const handleClose = useCallback(() => {
    if (exiting) return
    setExiting(true)
    setTimeout(() => {
      setExiting(false)
      onClose()
    }, EXIT_DURATION)
  }, [exiting, onClose])

  useEffect(() => {
    if (!data) return
    setExiting(false)
    const timer = setTimeout(() => handleClose(), 1800)
    return () => clearTimeout(timer)
  }, [data, handleClose])

  if (!data) return null

  return (
    <div
      onClick={handleClose}
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(5,7,13,0.3)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        animation: exiting
          ? `successFadeOut ${EXIT_DURATION}ms cubic-bezier(0.4,0,1,1) forwards`
          : 'fadeIn 180ms cubic-bezier(0.22,1,0.36,1)',
        padding: '0 24px',
      }}
    >
      <style>{`
        @keyframes successFadeOut { from { opacity: 1 } to { opacity: 0 } }
        @keyframes successScaleOut {
          from { opacity: 1; transform: scale(1) }
          to   { opacity: 0; transform: scale(0.94) }
        }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'oklch(1 0 0 / 0.55)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.7)',
          borderRadius: 28,
          padding: '40px 36px',
          textAlign: 'center',
          maxWidth: 320,
          width: '100%',
          animation: exiting
            ? `successScaleOut ${EXIT_DURATION}ms cubic-bezier(0.4,0,1,1) forwards`
            : 'scaleIn 220ms cubic-bezier(0.22,1,0.36,1)',
          boxShadow: '0 24px 60px -16px rgba(0,0,0,0.18)',
        }}
      >
        {/* Emoji circle */}
        <div style={{
          width: 80, height: 80,
          background: 'linear-gradient(135deg, oklch(0.97 0.005 250) 0%, oklch(0.95 0.008 250) 100%)',
          border: '2px solid rgba(255,255,255,0.8)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 40,
          margin: '0 auto 20px',
          boxShadow: '0 4px 16px -4px rgba(0,0,0,0.1)',
        }}>
          {data.icon}
        </div>

        {/* Name */}
        <div style={{
          fontSize: 18, fontWeight: 700,
          color: 'oklch(0.20 0.015 265)',
          marginBottom: 8,
          letterSpacing: '-0.02em',
          wordBreak: 'break-word',
        }}>
          {data.name}
        </div>

        {/* Amount */}
        <div style={{
          fontSize: 'clamp(26px, 8vw, 32px)',
          fontWeight: 800,
          color: 'oklch(0.20 0.015 265)',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.03em',
          marginBottom: 12,
        }}>
          {data.isIncome ? '+' : '−'}{formatEUR(data.amount)}
        </div>

        {/* Label */}
        <div style={{
          fontSize: 13, fontWeight: 600,
          color: 'oklch(0.52 0.025 260)',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}>
          {data.isIncome ? 'Entrata aggiunta' : 'Spesa aggiunta'}
        </div>
      </div>
    </div>
  )
}
