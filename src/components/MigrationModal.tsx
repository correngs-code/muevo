interface Props {
  count: number
  onImport: () => void
  onDiscard: () => void
  busy?: boolean
}

export default function MigrationModal({ count, onImport, onDiscard, busy }: Props) {
  return (
    <>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 400,
        background: 'oklch(0.15 0.02 265 / 0.55)',
        backdropFilter: 'blur(6px)',
        animation: 'fadeIn 220ms cubic-bezier(0.22,1,0.36,1)',
      }} />
      <div style={{
        position: 'fixed', inset: 0, zIndex: 401,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}>
        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 24,
          maxWidth: 420, width: '100%',
          padding: 28,
          boxShadow: '0 30px 80px -20px oklch(0.15 0.02 265 / 0.4)',
          animation: 'scaleIn 240ms cubic-bezier(0.22,1,0.36,1)',
        }}>
          <div style={{
            width: 56, height: 56,
            background: 'linear-gradient(135deg, oklch(0.62 0.22 260), oklch(0.68 0.18 255))',
            borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28,
            marginBottom: 18,
            boxShadow: '0 8px 24px -8px oklch(0.62 0.22 260 / 0.5)',
          }}>
            📦
          </div>
          <h2 style={{
            margin: '0 0 8px',
            fontSize: 22, fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--foreground)',
          }}>
            {count === 1 ? 'Hai 1 movimento locale' : `Hai ${count} movimenti locali`}
          </h2>
          <p style={{
            margin: '0 0 24px',
            fontSize: 14, lineHeight: 1.6,
            color: 'var(--muted-foreground)',
          }}>
            Erano salvati solo su questo dispositivo. Vuoi portarli nel tuo account Google, così li ritrovi ovunque?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              type="button"
              onClick={onImport}
              disabled={busy}
              style={{
                width: '100%', height: 48,
                background: busy
                  ? 'var(--muted)'
                  : 'linear-gradient(135deg, oklch(0.62 0.22 260), oklch(0.68 0.18 255))',
                color: '#fff',
                border: 'none', borderRadius: 12,
                fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-sans)',
                cursor: busy ? 'wait' : 'pointer',
                transition: 'opacity 150ms, transform 150ms',
                boxShadow: busy ? 'none' : '0 4px 16px -4px oklch(0.62 0.22 260 / 0.4)',
              }}
              onMouseDown={(e) => { if (!busy) e.currentTarget.style.transform = 'scale(0.98)' }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              {busy ? 'Importazione…' : 'Importa nel mio account'}
            </button>
            <button
              type="button"
              onClick={onDiscard}
              disabled={busy}
              style={{
                width: '100%', height: 44,
                background: 'transparent',
                color: 'var(--muted-foreground)',
                border: '1px solid var(--border)', borderRadius: 12,
                fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-sans)',
                cursor: busy ? 'wait' : 'pointer',
                transition: 'background 150ms, color 150ms',
              }}
              onMouseEnter={(e) => { if (!busy) { e.currentTarget.style.background = 'var(--secondary)'; e.currentTarget.style.color = 'var(--foreground)' } }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted-foreground)' }}
            >
              Scarta i dati locali
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
