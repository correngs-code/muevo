export type Category = {
  value: string
  emoji: string
}

export const CATEGORIES: Category[] = [
  { value: 'Spesa quotidiana', emoji: '🛒' },
  { value: 'Cibo & Delivery', emoji: '🍔' },
  { value: 'Trasporti', emoji: '⛽' },
  { value: 'Casa & Bollette', emoji: '🏠' },
  { value: 'Abbonamenti', emoji: '📺' },
  { value: 'Salute & Fitness', emoji: '💪' },
  { value: 'Shopping', emoji: '🛍️' },
  { value: 'Tempo libero', emoji: '🎉' },
  { value: 'Viaggi', emoji: '✈️' },
  { value: 'AI & Tech', emoji: '🤖' },
  { value: 'Tasse & Assicurazioni', emoji: '📄' },
  { value: 'Altro', emoji: '✨' },
]

const ICON_MAP: Record<string, string> = {
  pizza: '🍕', caffè: '☕', caffe: '☕',
  netflix: '🍿', spotify: '🎧', prime: '📦', amazon: '📦', chatgpt: '🤖',
  benzina: '⛽', diesel: '⛽', parcheggio: '🅿️',
  affitto: '🏠', luce: '💡', gas: '🔥', internet: '🌐',
  spesa: '🛒', esselunga: '🛒', coop: '🛒',
  palestra: '💪', farmacia: '💊', dentista: '🦷',
  treno: '🚆', taxi: '🚕', uber: '🚕',
  ryanair: '✈️', booking: '🏨', airbnb: '🏨',
  stipendio: '💰', freelance: '💼', vinted: '🛍️',
  burger: '🍔', hamburger: '🍔', sushi: '🍣',
  deliveroo: '🛵', glovo: '🛵',
  film: '🎬', musica: '🎵', delivery: '🛵',
  treno2: '🚆', aereo: '✈️', hotel: '🏨',
}

export function guessIcon(name: string, category: string): string {
  const n = name.toLowerCase()
  const keys = Object.keys(ICON_MAP).sort((a, b) => b.length - a.length)
  for (const k of keys) if (n.includes(k)) return ICON_MAP[k]
  return CATEGORIES.find((c) => c.value === category)?.emoji ?? '✨'
}

export function formatEUR(n: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

export function formatDate(ts: string | number): string {
  const s = new Intl.DateTimeFormat('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(ts))
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const INCOME_KEYWORDS = ['stipendio', 'salary', 'paga', 'bonus', 'rimborso', 'freelance', 'vinted', 'vendita', 'regalo']

export type ParsedInput = {
  name: string
  amount: number
  isIncome: boolean
}

export function parseInput(raw: string): ParsedInput | null {
  const text = raw.trim()
  if (!text) return null
  const m = text.match(/(\d+(?:[.,]\d{1,2})?)/)
  if (!m) return null
  const amount = parseFloat(m[1].replace(',', '.'))
  if (!isFinite(amount) || amount <= 0) return null
  const cleaned = text.replace(m[0], ' ').replace(/€|euro/gi, ' ').trim()
  const low = cleaned.toLowerCase()
  const isIncome = INCOME_KEYWORDS.some((k) => low.includes(k)) || /\+/.test(text)
  const name = (cleaned.charAt(0).toUpperCase() + cleaned.slice(1)) || 'Spesa'
  return { name, amount, isIncome }
}

export const PIE_COLORS = [
  'oklch(0.86 0.08 25)',
  'oklch(0.88 0.08 60)',
  'oklch(0.92 0.09 95)',
  'oklch(0.88 0.07 145)',
  'oklch(0.87 0.07 190)',
  'oklch(0.88 0.07 230)',
  'oklch(0.85 0.08 290)',
  'oklch(0.87 0.08 340)',
]
