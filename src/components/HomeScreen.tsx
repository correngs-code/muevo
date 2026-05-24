import QuickAdd from './QuickAdd'
import { IconLogOut } from './Icons'
import { formatEUR } from '../lib/expenses'

function MuevoMark() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="home-logo-grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#050a44" />
            <stop offset="30%" stopColor="#1638ff" />
            <stop offset="70%" stopColor="#00a3ff" />
            <stop offset="100%" stopColor="#4eecff" />
          </linearGradient>
        </defs>
        <path
          d="M4 22V8L14 16L24 8V22"
          stroke="url(#home-logo-grad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <span style={{
        fontSize: 20,
        fontWeight: 800,
        letterSpacing: '-0.03em',
        color: 'var(--foreground)',
      }}>
        Muevo
      </span>
    </div>
  )
}

interface QuickAddItem {
  name: string
  amount: number
  isIncome: boolean
  icon: string
}

interface HomeScreenProps {
  remaining: number
  userInitials: string
  onAdd: (item: QuickAddItem) => void
  onSignOut: () => void
}

export default function HomeScreen({ remaining, userInitials, onAdd, onSignOut }: HomeScreenProps) {
  const isPositive = remaining >= 0
  const glowColor = isPositive
    ? 'radial-gradient(ellipse 60% 30% at 50% 0%, oklch(0.88 0.12 152 / 0.22) 0%, transparent 70%)'
    : 'radial-gradient(ellipse 60% 30% at 50% 0%, oklch(0.72 0.18 25 / 0.18) 0%, transparent 70%)'

  return (
    <div style={{
      minHeight: '100dvh',
      paddingBottom: 120,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background tint glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: glowColor,
        transition: 'background 600ms cubic-bezier(0.22,1,0.36,1)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Header */}
      <header style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
      }}>
        <MuevoMark />
        <button
          type="button"
          onClick={onSignOut}
          title="Esci"
          style={{
            width: 36, height: 36,
            background: 'var(--foreground)',
            color: 'var(--background)',
            border: 'none', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 13, fontWeight: 700, letterSpacing: '-0.02em',
            fontFamily: 'var(--font-sans)',
            transition: 'opacity 150ms',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.75' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
        >
          {userInitials}
        </button>
      </header>

      {/* Balance section */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        padding: '32px 20px 48px',
        textAlign: 'center',
      }}>
        {/* Greeting */}
        <div style={{
          fontSize: 13, fontWeight: 600,
          color: 'var(--muted-foreground)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}>
          ti rimangono
        </div>

        {/* Balance amount */}
        <div style={{
          fontSize: 'clamp(48px, 12vw, 72px)',
          fontWeight: 800,
          color: 'var(--foreground)',
          letterSpacing: '-0.04em',
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
          fontFeatureSettings: '"tnum", "ss01"',
          marginBottom: 8,
          transition: 'color 400ms',
        }}>
          {formatEUR(Math.abs(remaining))}
        </div>

        {/* Sign indicator */}
        {remaining < 0 && (
          <div style={{
            fontSize: 13, fontWeight: 600,
            color: 'oklch(0.55 0.22 25)',
            marginBottom: 4,
          }}>
            In rosso di {formatEUR(Math.abs(remaining))}
          </div>
        )}

        <div style={{
          fontSize: 14, color: 'var(--muted-foreground)',
          fontWeight: 500,
        }}>
          questo mese
        </div>
      </div>

      {/* QuickAdd section */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        padding: '0 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
      }}>
        <QuickAdd onAdd={onAdd} />
        <p style={{
          margin: 0,
          fontSize: 13,
          color: 'var(--muted-foreground)',
          textAlign: 'center',
          maxWidth: 300,
          lineHeight: 1.5,
        }}>
          Aggiungi un movimento e guarda la magia
        </p>
      </div>

      {/* Sign out small link */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        marginTop: 40,
      }}>
        <button
          type="button"
          onClick={onSignOut}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'transparent',
            border: 'none',
            color: 'var(--muted-foreground)',
            fontSize: 12, fontFamily: 'var(--font-sans)',
            cursor: 'pointer', opacity: 0.6,
            transition: 'opacity 150ms',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6' }}
        >
          <IconLogOut size={13} />
          Esci dall'account
        </button>
      </div>
    </div>
  )
}
