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

const INCOME_KEYWORDS = ['stipendio', 'salary', 'paga', 'bonus', 'rimborso', 'freelance', 'vinted', 'vendita', 'regalo', 'entrata', 'guadagno', 'incasso', 'commissione', 'dividendo', 'interessi', 'pensione', 'cashback']

export type ParsedInput = {
  name: string
  amount: number
  isIncome: boolean
}

// Italian written numbers → digits (basic, for voice input)
const ITALIAN_NUMBERS: Record<string, number> = {
  zero: 0, uno: 1, una: 1, due: 2, tre: 3, quattro: 4, cinque: 5,
  sei: 6, sette: 7, otto: 8, nove: 9, dieci: 10,
  undici: 11, dodici: 12, tredici: 13, quattordici: 14, quindici: 15,
  sedici: 16, diciassette: 17, diciotto: 18, diciannove: 19,
  venti: 20, trenta: 30, quaranta: 40, cinquanta: 50,
  sessanta: 60, settanta: 70, ottanta: 80, novanta: 90,
  cento: 100, mille: 1000, mila: 1000,
}

// Converts "mille e duecento" → "1200"; leaves digits untouched
function normalizeItalianNumbers(text: string): string {
  const lower = ' ' + text.toLowerCase() + ' '
  // Replace each word with digits (best-effort, additive)
  let normalized = lower
  // Compound: "duecento" "trecento" etc
  const hundreds: Record<string, number> = {
    duecento: 200, trecento: 300, quattrocento: 400, cinquecento: 500,
    seicento: 600, settecento: 700, ottocento: 800, novecento: 900,
  }
  for (const [w, n] of Object.entries(hundreds)) {
    normalized = normalized.replace(new RegExp(`\\b${w}\\b`, 'g'), ` ${n} `)
  }
  // Singles
  for (const [w, n] of Object.entries(ITALIAN_NUMBERS)) {
    normalized = normalized.replace(new RegExp(`\\b${w}\\b`, 'g'), ` ${n} `)
  }
  // Sum adjacent digit-tokens that came from words: "1000 200" → "1200" (only if both >= 100 or similar)
  normalized = normalized.replace(/(\d+)\s+e\s+(\d+)/g, (_, a, b) => String(Number(a) + Number(b)))
  normalized = normalized.replace(/(\d{3,})\s+(\d{1,3})\b/g, (_, a, b) => {
    const na = Number(a), nb = Number(b)
    return na >= nb * 10 ? String(na + nb) : `${a} ${b}`
  })
  return normalized.trim()
}

export function parseInput(raw: string): ParsedInput | null {
  const text = normalizeItalianNumbers(raw.trim())
  if (!text) return null

  // Detect explicit signs (override everything)
  const hasMinus = /(?:^|\s)[-−]\s*\d|\b(meno|negativo)\b/i.test(text)
  const hasPlus  = /(?:^|\s)\+\s*\d|\b(più|piu)\b/i.test(text)

  // Extract the first number
  const m = text.match(/(\d+(?:[.,]\d{1,2})?)/)
  if (!m) return null
  const amount = parseFloat(m[1].replace(',', '.'))
  if (!isFinite(amount) || amount <= 0) return null

  // Clean text for the transaction name
  const cleaned = text
    .replace(m[0], ' ')
    .replace(/€|euro|euri/gi, ' ')
    .replace(/(?:^|\s)[-−+]\s*/g, ' ')
    .replace(/\b(meno|più|piu|negativo|di|per|spesi|spesa|euro|euri)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const low = cleaned.toLowerCase()

  // Sign logic: explicit sign wins over keywords
  let isIncome: boolean
  if (hasMinus) isIncome = false
  else if (hasPlus) isIncome = true
  else isIncome = INCOME_KEYWORDS.some((k) => low.includes(k))

  const name = cleaned
    ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
    : (isIncome ? 'Entrata' : 'Spesa')

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
