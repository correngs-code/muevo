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
  const [listening, setListening] = useState(false)
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)

  const parsed = parseInput(value)
  const icon = parsed ? guessIcon(parsed.name, category) : '✨'

  useEffect(() => {
    if (value || focused) return
    const timer = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length)
    }, 2200)
    return () => clearInterval(timer)
  }, [value, focused])

  useEffect(() => {
    if (!voiceError) return
    const t = setTimeout(() => setVoiceError(null), 4500)
    return () => clearTimeout(t)
  }, [voiceError])

  const submitParsed = (text: string): boolean => {
    const p = parseInput(text)
    if (!p) return false
    const finalIcon = guessIcon(p.name, category)
    onAdd({ ...p, icon: finalIcon })
    setValue('')
    setCategory('Altro')
    return true
  }

  const handleSubmit = () => {
    if (!parsed) return
    submitParsed(value)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit()
  }

  const startVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      setVoiceError('Voce non supportata su questo browser. Prova con Chrome o Safari.')
      return
    }

    if (listening && recognitionRef.current) {
      recognitionRef.current.stop()
      return
    }

    const recognition = new SR()
    recognition.lang = 'it-IT'
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setListening(true)
      setVoiceError(null)
      setValue('')
    }
    recognition.onend = () => {
      setListening(false)
      recognitionRef.current = null
    }
    recognition.onerror = (e: any) => {
      setListening(false)
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setVoiceError('Microfono bloccato. Concedi il permesso nelle impostazioni del browser.')
      } else if (e.error === 'no-speech') {
        setVoiceError('Non ti ho sentito. Riprova.')
      } else if (e.error !== 'aborted') {
        setVoiceError('Errore vocale. Riprova.')
      }
    }
    recognition.onresult = (event: any) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      setValue(transcript)

      const lastResult = event.results[event.results.length - 1]
      if (lastResult.isFinal) {
        const ok = submitParsed(transcript)
        if (!ok) {
          setVoiceError(`Non ho capito un importo in "${transcript}". Aggiungi un numero.`)
        }
      }
    }

    recognitionRef.current = recognition
    try { recognition.start() } catch {
      setListening(false)
    }
  }

  const borderColor = listening
    ? 'oklch(0.62 0.22 25 / 0.7)'
    : parsed
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
      <style>{`
        @keyframes micPulse {
          0%, 100% { box-shadow: 0 0 0 0 oklch(0.62 0.22 25 / 0.45); }
          50%      { box-shadow: 0 0 0 10px oklch(0.62 0.22 25 / 0); }
        }
      `}</style>

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
        }}>
          {icon}
        </div>

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={listening ? 'Ti sto ascoltando…' : focused ? 'Es. pizza 12 oppure stipendio 1200' : PLACEHOLDERS[placeholderIndex]}
          aria-label="Aggiungi entrata o spesa"
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

        {/* Right button: mic or submit */}
        {!value && !listening ? (
          <button
            type="button"
            onClick={startVoice}
            aria-label="Parla per aggiungere"
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
        ) : listening ? (
          <button
            type="button"
            onClick={startVoice}
            aria-label="Ferma ascolto"
            style={{
              width: 40, height: 40,
              background: 'oklch(0.62 0.22 25)',
              border: 'none',
              borderRadius: 9999,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
              flexShrink: 0,
              animation: 'micPulse 1.4s ease-in-out infinite',
            }}
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

      {/* Voice error */}
      {voiceError && (
        <div
          role="alert"
          style={{
            marginTop: 8, padding: '8px 14px',
            background: 'oklch(0.62 0.22 25 / 0.12)',
            border: '1px solid oklch(0.62 0.22 25 / 0.28)',
            borderRadius: 10,
            fontSize: 12, fontWeight: 600,
            color: 'oklch(0.50 0.22 25)',
            textAlign: 'center',
            animation: 'slideUp 200ms cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {voiceError}
        </div>
      )}

      {/* Listening hint */}
      {listening && !value && (
        <div style={{
          marginTop: 8, padding: '6px 12px',
          fontSize: 12, color: 'var(--muted-foreground)',
          textAlign: 'center',
          fontStyle: 'italic',
        }}>
          Esempio: "Pizza dieci euro" oppure "Stipendio 1200"
        </div>
      )}

      {/* Parsed preview */}
      {parsed && !listening && (
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
      {parsed && !listening && (
        <div style={{
          marginTop: 8,
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          paddingBottom: 4,
          animation: 'slideUp 220ms cubic-bezier(0.22,1,0.36,1)',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorX: 'contain',
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
