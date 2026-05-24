import { IconHome, IconWallet, IconCalendarRange } from './Icons'

type Tab = 'home' | 'mese' | 'anno'

interface BottomNavProps {
  active: Tab
  onChange: (tab: Tab) => void
}

const TABS: { id: Tab; label: string; Icon: typeof IconHome }[] = [
  { id: 'home', label: 'Home', Icon: IconHome },
  { id: 'mese', label: 'Mese', Icon: IconWallet },
  { id: 'anno', label: 'Anno', Icon: IconCalendarRange },
]

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <div
      role="tablist"
      aria-label="Navigazione principale"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        background: 'linear-gradient(180deg, color-mix(in oklab, var(--background) 55%, transparent) 0%, color-mix(in oklab, var(--background) 40%, transparent) 100%)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        border: '1px solid color-mix(in oklab, var(--border) 35%, transparent)',
        boxShadow: '0 1px 0 oklch(1 0 0 / 0.35) inset, 0 8px 24px -16px oklch(0.20 0.015 265 / 0.18)',
        borderRadius: 28,
        padding: '6px 6px',
        margin: '8px 4px',
      }}
    >
      {TABS.map(({ id, label, Icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={label}
            onClick={() => onChange(id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              flex: 1,
              padding: '8px 0',
              background: isActive
                ? 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.75) 100%)'
                : 'transparent',
              border: 'none',
              borderRadius: 22,
              cursor: 'pointer',
              color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)',
              transform: isActive ? 'scale(1)' : 'scale(0.94)',
              transition: 'background 220ms cubic-bezier(0.22,1,0.36,1), color 220ms, transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: isActive
                ? '0 1px 3px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.6) inset'
                : 'none',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <Icon size={20} weight={isActive ? 2.25 : 1.75} />
            <span style={{
              fontSize: 11,
              fontWeight: isActive ? 700 : 500,
              letterSpacing: '-0.01em',
            }}>
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
