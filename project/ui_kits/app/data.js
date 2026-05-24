/* Sample data + small helpers for the Ognicent UI kit demo.
   Mirrors src/lib/expenses.ts in the live app — values trimmed for demo use. */

window.OG_CATEGORIES = [
  { value: "Spesa quotidiana", emoji: "🛒" },
  { value: "Cibo & Delivery",  emoji: "🍔" },
  { value: "Trasporti",        emoji: "⛽" },
  { value: "Casa & Bollette",  emoji: "🏠" },
  { value: "Abbonamenti",      emoji: "📺" },
  { value: "Salute & Fitness", emoji: "💪" },
  { value: "Shopping",         emoji: "🛍️" },
  { value: "Tempo libero",     emoji: "🎉" },
  { value: "Viaggi",           emoji: "✈️" },
  { value: "AI & Tech",        emoji: "🤖" },
  { value: "Tasse & Assicurazioni", emoji: "📄" },
  { value: "Altro",            emoji: "✨" },
];

// Subset of the live guessIcon() map. The product ships ~250 entries —
// this is enough for the demo to feel real.
window.OG_ICON_MAP = {
  pizza: "🍕", caffè: "☕", caffe: "☕",
  netflix: "🍿", spotify: "🎧", prime: "📦", amazon: "📦", chatgpt: "🤖",
  benzina: "⛽", diesel: "⛽", parcheggio: "🅿️",
  affitto: "🏠", luce: "💡", gas: "🔥", internet: "🌐",
  spesa: "🛒", esselunga: "🛒", coop: "🛒",
  palestra: "💪", farmacia: "💊", dentista: "🦷",
  treno: "🚆", taxi: "🚕", uber: "🚕",
  ryanair: "✈️", booking: "🏨", airbnb: "🏨",
  stipendio: "💰", freelance: "💼", vinted: "🛍️",
  burger: "🍔", hamburger: "🍔", sushi: "🍣",
  deliveroo: "🛵", glovo: "🛵",
};

window.guessIcon = function(name, category) {
  const n = (name || "").toLowerCase();
  const keys = Object.keys(window.OG_ICON_MAP).sort((a, b) => b.length - a.length);
  for (const k of keys) if (n.includes(k)) return window.OG_ICON_MAP[k];
  const cat = window.OG_CATEGORIES.find((c) => c.value === category);
  return cat?.emoji ?? "✨";
};

window.formatEUR = function(n) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency", currency: "EUR",
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(n);
};

window.formatDate = function(ts) {
  const s = new Intl.DateTimeFormat("it-IT", {
    weekday: "long", day: "numeric", month: "long",
  }).format(new Date(ts));
  return s.charAt(0).toUpperCase() + s.slice(1);
};

// Income heuristic — same intent as the live parser, simplified.
window.OG_INCOME_KEYWORDS = ["stipendio", "salary", "paga", "bonus", "rimborso", "freelance", "vinted", "vendita", "regalo"];

// Italian-friendly Quick Add parser. Handles "pizza 12" / "caffè 1,50" / "stipendio 1200".
window.parseInput = function(raw) {
  const text = (raw || "").trim();
  if (!text) return null;
  const m = text.match(/(\d+(?:[.,]\d{1,2})?)/);
  if (!m) return null;
  const amount = parseFloat(m[1].replace(",", "."));
  if (!isFinite(amount) || amount <= 0) return null;
  const cleaned = text.replace(m[0], " ").replace(/€|euro/gi, " ").trim();
  const low = cleaned.toLowerCase();
  const isIncome = window.OG_INCOME_KEYWORDS.some((k) => low.includes(k))
    || /\+/.test(text);
  const name = (cleaned.charAt(0).toUpperCase() + cleaned.slice(1)) || "Spesa";
  return { name, amount, isIncome };
};

// ── Seeded sample state for the demo ──────────────────────────────
const now = Date.now();
const day = 86400000;

window.OG_SAMPLE_EXPENSES = [
  { id: "e1", name: "Stipendio Acme",  amount: 2400, frequency: "monthly", category: "Altro",            icon: "💰", createdAt: now - 4 * day, kind: "income" },
  { id: "e2", name: "Affitto",         amount: 780,  frequency: "monthly", category: "Casa & Bollette",   icon: "🏠", createdAt: now - 3 * day, kind: "expense" },
  { id: "e3", name: "Spotify",         amount: 9.99, frequency: "monthly", category: "Abbonamenti",       icon: "🎧", createdAt: now - 2 * day, kind: "expense" },
  { id: "e4", name: "Esselunga",       amount: 64.30, frequency: "one_time", category: "Spesa quotidiana", icon: "🛒", createdAt: now - 2 * day, kind: "expense" },
  { id: "e5", name: "Caffè al bar",    amount: 1.50,  frequency: "one_time", category: "Cibo & Delivery",  icon: "☕", createdAt: now - 1 * day, kind: "expense" },
  { id: "e6", name: "Netflix",         amount: 12.99, frequency: "monthly", category: "Abbonamenti",       icon: "🍿", createdAt: now - 1 * day, kind: "expense" },
  { id: "e7", name: "Benzina",         amount: 48.00, frequency: "one_time", category: "Trasporti",        icon: "⛽", createdAt: now - day / 2, kind: "expense" },
  { id: "e8", name: "Pizza con Sara",  amount: 24.50, frequency: "one_time", category: "Cibo & Delivery",  icon: "🍕", createdAt: now - 3600_000, kind: "expense" },
];
