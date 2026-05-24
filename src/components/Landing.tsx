import { CtaButton, GhostButton } from './Buttons'
import { IconShieldCheck, IconArrowRight } from './Icons'

const hasEnv = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)

function MuevoLogo({ size = 28 }: { size?: number }) {
  const id = 'muevo-grad'
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#050a44" />
          <stop offset="30%" stopColor="#1638ff" />
          <stop offset="70%" stopColor="#00a3ff" />
          <stop offset="100%" stopColor="#4eecff" />
        </linearGradient>
      </defs>
      <path
        d="M4 22V8L14 16L24 8V22"
        stroke={`url(#${id})`}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

function PhoneMockup() {
  const categories = ['🛒', '🍔', '⛽', '🏠', '📺', '💪', '🛍️', '🎉', '✈️', '🤖', '📄', '✨']
  return (
    <div style={{
      width: 280,
      background: 'linear-gradient(180deg, #0b0f1a 0%, #080c17 100%)',
      borderRadius: 32,
      padding: 20,
      boxShadow: '0 40px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      {/* Status bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, opacity: 0.5, fontSize: 12, color: '#fff' }}>
        <span>9:41</span>
        <span>●●●</span>
      </div>

      {/* Balance */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Ti rimangono
        </div>
        <div style={{ fontSize: 36, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
          €1.248,50
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>questo mese</div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <div style={{
          flex: 1, background: 'rgba(59,108,255,0.2)', border: '1px solid rgba(59,108,255,0.3)',
          borderRadius: 14, padding: '10px', textAlign: 'center', fontSize: 13, color: '#7aa2ff', fontWeight: 600
        }}>
          + Entrata
        </div>
        <div style={{
          flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14, padding: '10px', textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 600
        }}>
          − Spesa
        </div>
      </div>

      {/* Category grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
        {categories.map((emoji, i) => (
          <div key={i} style={{
            width: 36, height: 36, background: 'rgba(255,255,255,0.06)',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
          }}>
            {emoji}
          </div>
        ))}
      </div>

      {/* Recent transactions */}
      <div style={{ marginTop: 16 }}>
        {[
          { icon: '☕', name: 'Caffè', amount: '-€1,50', time: 'Oggi' },
          { icon: '🍕', name: 'Pizza', amount: '-€12,00', time: 'Ieri' },
          { icon: '💰', name: 'Stipendio', amount: '+€2.000', time: 'Lun' },
        ].map((tx, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
            <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.08)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
              {tx.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{tx.name}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{tx.time}</div>
            </div>
            <div style={{ fontSize: 13, color: tx.amount.startsWith('+') ? '#4ade80' : 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
              {tx.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface LandingProps {
  onLaunch: () => void
}

export default function Landing({ onLaunch }: LandingProps) {
  return (
    <div className="landing-root" style={{
      minHeight: '100dvh',
      background: '#05070d',
      color: 'rgba(255,255,255,0.96)',
      fontFamily: 'var(--font-sans)',
    }}>
      {/* Sticky Nav */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: 64,
        background: 'rgba(5,7,13,0.72)',
        backdropFilter: 'blur(20px) saturate(160%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <MuevoLogo size={26} />
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff' }}>
            Muevo
          </span>
        </div>

        {/* Nav actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <GhostButton
            onClick={onLaunch}
            style={{ color: 'rgba(255,255,255,0.7)', opacity: 1 }}
          >
            Accedi
          </GhostButton>
          <CtaButton onClick={onLaunch} size="sm">
            Inizia Gratis
          </CtaButton>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '80px 24px 60px',
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) auto',
        gap: 60,
        alignItems: 'center',
      }}>
        <div>
          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(59,108,255,0.12)', border: '1px solid rgba(59,108,255,0.25)',
            borderRadius: 9999, padding: '6px 14px', marginBottom: 28,
            fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: '#7aa2ff',
          }}>
            ✦ Il tracker spese che hai sempre voluto
          </div>

          {/* Headline */}
          <h1 style={{
            margin: '0 0 20px',
            fontSize: 'clamp(40px, 7vw, 72px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: '#fff',
          }}>
            Dove{' '}
            <span style={{
              background: 'linear-gradient(135deg, #3b6cff 0%, #5b8bff 45%, #7aa2ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              finiscono
            </span>
            <br />
            i tuoi soldi?
          </h1>

          {/* Subheadline */}
          <p style={{
            margin: '0 0 36px',
            fontSize: 18,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.62)',
            maxWidth: 460,
          }}>
            Muevo ti mostra in tempo reale quanto ti rimane questo mese. Aggiungi una spesa in tre secondi, nessun foglio Excel, nessuna complicazione.
          </p>

          {/* CTA group */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 36 }}>
            <CtaButton onClick={onLaunch} size="lg">
              Inizia Gratis con Google
              <IconArrowRight size={18} />
            </CtaButton>
            {!hasEnv && (
              <div style={{
                background: 'rgba(255,200,0,0.1)', border: '1px solid rgba(255,200,0,0.3)',
                borderRadius: 12, padding: '10px 16px', fontSize: 13,
                color: 'rgba(255,200,100,0.9)',
              }}>
                ⚠️ Configura VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nel file .env
              </div>
            )}
          </div>

          {/* Trust signals */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { icon: '🛡️', text: 'Dati cifrati' },
              { icon: '🔐', text: 'Google login' },
              { icon: '🎁', text: 'Nessuna carta' },
            ].map((item) => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Phone mockup */}
        <div style={{
          display: 'flex', justifyContent: 'center',
          filter: 'drop-shadow(0 40px 80px rgba(59,108,255,0.25))',
        }}>
          <PhoneMockup />
        </div>
      </section>

      {/* "Come funziona" */}
      <section style={{
        maxWidth: 900,
        margin: '0 auto',
        padding: '80px 24px',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.35)', marginBottom: 16,
        }}>
          Come funziona
        </div>
        <h2 style={{
          margin: '0 0 56px',
          fontSize: 'clamp(28px, 4vw, 44px)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: '#fff',
        }}>
          Semplice come 1, 2, 3
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {[
            {
              step: '01',
              emoji: '🔐',
              title: 'Accedi con Google',
              desc: 'Un click e sei dentro. Nessuna registrazione noiosa, nessuna password da ricordare.',
            },
            {
              step: '02',
              emoji: '⚡',
              title: 'Aggiungi spese',
              desc: 'Scrivi "caffè 1,50" e premi invio. L\'icona e la categoria vengono riconosciute in automatico.',
            },
            {
              step: '03',
              emoji: '📊',
              title: 'Vedi dove vanno',
              desc: 'Il saldo aggiornato, le categorie, le tendenze mensili — tutto chiaro, tutto al volo.',
            },
          ].map((item) => (
            <div key={item.step} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 20,
              padding: '32px 28px',
              textAlign: 'left',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 16, right: 20,
                fontSize: 48, fontWeight: 900, color: 'rgba(255,255,255,0.04)',
                fontVariantNumeric: 'tabular-nums', lineHeight: 1,
              }}>
                {item.step}
              </div>
              <div style={{ fontSize: 40, marginBottom: 20 }}>{item.emoji}</div>
              <h3 style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 700, color: '#fff' }}>{item.title}</h3>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,0.5)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ textAlign: 'center', padding: '60px 24px 100px' }}>
        <div style={{
          display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 20,
          background: 'linear-gradient(135deg, rgba(59,108,255,0.12) 0%, rgba(91,139,255,0.06) 100%)',
          border: '1px solid rgba(59,108,255,0.2)', borderRadius: 28, padding: '48px 56px',
        }}>
          <div style={{ fontSize: 48 }}>🚀</div>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.025em' }}>
            Inizia oggi, gratis
          </h2>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: 15, maxWidth: 340 }}>
            Nessuna carta di credito. Nessun abbonamento. Solo chiarezza sui tuoi soldi.
          </p>
          <CtaButton onClick={onLaunch} size="lg">
            Entra con Google
            <IconArrowRight size={18} />
          </CtaButton>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <IconShieldCheck size={14} style={{ color: 'rgba(255,255,255,0.35)' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>I tuoi dati rimangono tuoi, sempre.</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '24px',
        textAlign: 'center',
        fontSize: 13,
        color: 'rgba(255,255,255,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <MuevoLogo size={18} />
          <span>Muevo © {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  )
}
