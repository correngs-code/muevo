/* QuickAdd — the iconic single-input that powers the entire product.
   Type a phrase like "pizza 12" or "stipendio 1200" and it parses into a
   transaction. The chip on the left tracks the inferred emoji as you type. */

function QuickAdd({ onAdd, listening = false }) {
  const [value, setValue] = React.useState("");
  const placeholders = ["pizza 12", "stipendio 1200", "benzina 50", "amazon 34", "caffè 1,50"];
  const [phIdx, setPhIdx] = React.useState(0);

  React.useEffect(() => {
    if (value) return;
    const t = setInterval(() => setPhIdx((i) => (i + 1) % placeholders.length), 2400);
    return () => clearInterval(t);
  }, [value]);

  const preview = React.useMemo(() => window.parseInput(value), [value]);
  const icon = preview ? window.guessIcon(preview.name, "Altro") : "✨";
  const isIncome = preview?.isIncome ?? false;
  const accent = isIncome ? "oklch(0.68 0.18 152)" : "oklch(0.62 0.20 258)";

  const submit = (e) => {
    e?.preventDefault();
    if (!preview) return;
    onAdd?.({ ...preview, icon, createdAt: Date.now(), id: crypto.randomUUID() });
    setValue("");
  };

  return (
    <form onSubmit={submit} style={{ position: "relative" }}>
      <div
        style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: 8,
          borderRadius: 26,
          background: "rgba(255,255,255,0.95)",
          border: `1px solid ${preview ? `color-mix(in oklab, ${accent} 50%, transparent)` : "color-mix(in oklab, var(--border) 50%, transparent)"}`,
          backdropFilter: "blur(20px)",
          boxShadow: preview
            ? `0 1px 0 oklch(1 0 0 / .7) inset, 0 10px 30px -14px oklch(.20 .015 265 / .18), 0 24px 60px -28px ${accent.replace(")", " / 0.35)")}`
            : "0 1px 0 oklch(1 0 0 / .7) inset, 0 1px 2px oklch(.20 .015 265 / .04), 0 10px 30px -14px oklch(.20 .015 265 / .18), 0 24px 60px -30px oklch(.55 .18 258 / .20)",
          transition: "all .2s cubic-bezier(.22,1,.36,1)",
        }}
      >
        <span
          className="emoji-chip"
          style={{
            width: 44, height: 44, borderRadius: 9999,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, flexShrink: 0, userSelect: "none",
          }}
        >
          {icon}
        </span>
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholders[phIdx]}
          aria-label="Quick add"
          style={{
            flex: 1, minWidth: 0,
            background: "transparent", outline: "none", border: "none",
            fontSize: 17, padding: "10px 0",
            color: "var(--foreground)",
            fontFamily: "var(--font-sans)",
          }}
        />
        {value.trim() ? (
          <button
            type="submit" disabled={!preview} aria-label="Invia"
            style={{
              width: 44, height: 44, borderRadius: 9999, border: "none",
              background: preview ? accent : "oklch(0.55 0 0)",
              color: "#fff", flexShrink: 0,
              boxShadow: preview ? `0 6px 18px -6px ${accent.replace(")", " / 0.55)")}, inset 0 1px 0 oklch(1 0 0 / 0.25)` : "none",
              opacity: preview ? 1 : 0.3,
              cursor: preview ? "pointer" : "not-allowed",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              transition: "transform .15s ease",
            }}
            onMouseDown={(e) => { if (preview) e.currentTarget.style.transform = "scale(.9)"; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            <OgArrowUp size={20} />
          </button>
        ) : (
          <button
            type="button" aria-label="Voice"
            style={{
              width: 44, height: 44, borderRadius: 9999, border: "none",
              background: listening ? "var(--primary)" : "color-mix(in oklab, var(--foreground) 5%, transparent)",
              color: listening ? "#fff" : "color-mix(in oklab, var(--foreground) 70%, transparent)",
              flexShrink: 0, cursor: "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              transition: "background .15s ease",
            }}
          >
            <OgMic size={18} weight={2.2} />
          </button>
        )}
      </div>

      {preview && (
        <div style={{
          marginTop: 10, padding: "0 8px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontSize: 11, color: "var(--muted-foreground)",
        }}>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {isIncome ? "Entrata" : "Spesa"} · {preview.name}
          </span>
          <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums", color: accent }}>
            {isIncome ? "+" : "−"} €{preview.amount.toFixed(2)}
          </span>
        </div>
      )}
    </form>
  );
}

Object.assign(window, { QuickAdd });
