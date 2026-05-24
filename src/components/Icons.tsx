import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number
  weight?: number
}

function Icon({ size = 24, weight = 2, children, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={weight}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  )
}

export function IconWallet({ size, weight, ...rest }: IconProps) {
  return (
    <Icon size={size} weight={weight} {...rest}>
      <path d="M20 12V8H6a2 2 0 0 1 0-4h12v4" />
      <path d="M20 12v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6" />
      <path d="M16 14h.01" />
    </Icon>
  )
}

export function IconHome({ size, weight, ...rest }: IconProps) {
  return (
    <Icon size={size} weight={weight} {...rest}>
      <path d="M3 10.5 12 3l9 7.5V20a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2v-9.5Z" />
    </Icon>
  )
}

export function IconCalendarRange({ size, weight, ...rest }: IconProps) {
  return (
    <Icon size={size} weight={weight} {...rest}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </Icon>
  )
}

export function IconPlus({ size, weight, ...rest }: IconProps) {
  return (
    <Icon size={size} weight={weight} {...rest}>
      <path d="M12 5v14M5 12h14" />
    </Icon>
  )
}

export function IconArrowUp({ size, weight, ...rest }: IconProps) {
  return (
    <Icon size={size} weight={weight} {...rest}>
      <path d="M12 19V5M5 12l7-7 7 7" />
    </Icon>
  )
}

export function IconArrowRight({ size, weight, ...rest }: IconProps) {
  return (
    <Icon size={size} weight={weight} {...rest}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </Icon>
  )
}

export function IconMic({ size, weight, ...rest }: IconProps) {
  return (
    <Icon size={size} weight={weight} {...rest}>
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3" />
    </Icon>
  )
}

export function IconTrash2({ size, weight, ...rest }: IconProps) {
  return (
    <Icon size={size} weight={weight} {...rest}>
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    </Icon>
  )
}

export function IconX({ size, weight, ...rest }: IconProps) {
  return (
    <Icon size={size} weight={weight} {...rest}>
      <path d="M18 6 6 18M6 6l12 12" />
    </Icon>
  )
}

export function IconSparkles({ size, weight, ...rest }: IconProps) {
  return (
    <Icon size={size} weight={weight} {...rest}>
      <path d="m12 3-2.4 6L3 9l4.8 4.4L6 21l6-3 6 3-1.8-7.6L21 9l-6.6 0L12 3Z" />
    </Icon>
  )
}

export function IconShieldCheck({ size, weight, ...rest }: IconProps) {
  return (
    <Icon size={size} weight={weight} {...rest}>
      <path d="M12 22s8-7.58 8-13a8 8 0 0 0-16 0c0 5.42 8 13 8 13Z" />
      <path d="m9 12 2 2 4-5" />
    </Icon>
  )
}

export function IconLogOut({ size, weight, ...rest }: IconProps) {
  return (
    <Icon size={size} weight={weight} {...rest}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </Icon>
  )
}

export function IconChevronLeft({ size, weight, ...rest }: IconProps) {
  return (
    <Icon size={size} weight={weight} {...rest}>
      <path d="M15 18l-6-6 6-6" />
    </Icon>
  )
}

export function IconChevronRight({ size, weight, ...rest }: IconProps) {
  return (
    <Icon size={size} weight={weight} {...rest}>
      <path d="M9 18l6-6-6-6" />
    </Icon>
  )
}
