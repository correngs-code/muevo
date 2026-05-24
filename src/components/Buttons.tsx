import type { CSSProperties, ReactNode } from 'react'

type ButtonSize = 'sm' | 'md' | 'lg'

interface CtaButtonProps {
  children: ReactNode
  onClick?: () => void
  size?: ButtonSize
  style?: CSSProperties
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const SIZE_STYLES: Record<ButtonSize, CSSProperties> = {
  sm: { padding: '8px 20px', fontSize: 14, height: 36 },
  md: { padding: '12px 28px', fontSize: 15, height: 46 },
  lg: { padding: '15px 36px', fontSize: 16, height: 54 },
}

export function CtaButton({ children, onClick, size = 'md', style, className, disabled, type = 'button' }: CtaButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        background: 'linear-gradient(135deg, #3b6cff 0%, #5b8bff 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: 9999,
        fontFamily: 'var(--font-sans)',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        boxShadow: '0 10px 30px -10px rgba(59,108,255,0.65), inset 0 1px 0 rgba(255,255,255,0.22)',
        transition: 'transform 150ms cubic-bezier(0.22,1,0.36,1), box-shadow 150ms cubic-bezier(0.22,1,0.36,1)',
        whiteSpace: 'nowrap',
        ...SIZE_STYLES[size],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 16px 36px -10px rgba(59,108,255,0.72), inset 0 1px 0 rgba(255,255,255,0.22)'
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(59,108,255,0.65), inset 0 1px 0 rgba(255,255,255,0.22)'
      }}
      onMouseDown={(e) => {
        if (!disabled) e.currentTarget.style.transform = 'scale(0.97)'
      }}
      onMouseUp={(e) => {
        if (!disabled) e.currentTarget.style.transform = 'translateY(-2px)'
      }}
    >
      {children}
    </button>
  )
}

interface PillButtonProps {
  children: ReactNode
  onClick?: () => void
  style?: CSSProperties
}

export function PillButton({ children, onClick, style }: PillButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        background: 'var(--foreground)',
        color: 'var(--background)',
        border: 'none',
        borderRadius: 9999,
        padding: '10px 22px',
        fontSize: 14,
        fontFamily: 'var(--font-sans)',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'opacity 150ms',
        ...style,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85' }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
    >
      {children}
    </button>
  )
}

interface GhostButtonProps {
  children: ReactNode
  onClick?: () => void
  style?: CSSProperties
}

export function GhostButton({ children, onClick, style }: GhostButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        background: 'transparent',
        color: 'var(--foreground)',
        border: 'none',
        borderRadius: 9999,
        padding: '8px 16px',
        fontSize: 14,
        fontFamily: 'var(--font-sans)',
        fontWeight: 500,
        cursor: 'pointer',
        opacity: 0.72,
        transition: 'opacity 150ms',
        ...style,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.72' }}
    >
      {children}
    </button>
  )
}

interface SaveButtonProps {
  children: ReactNode
  onClick?: () => void
  style?: CSSProperties
  disabled?: boolean
}

export function SaveButton({ children, onClick, style, disabled }: SaveButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 52,
        background: '#05070d',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius)',
        fontSize: 16,
        fontFamily: 'var(--font-sans)',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'opacity 150ms, transform 150ms',
        letterSpacing: '-0.01em',
        ...style,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.opacity = '0.88' }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.opacity = '1' }}
    >
      {children}
    </button>
  )
}
