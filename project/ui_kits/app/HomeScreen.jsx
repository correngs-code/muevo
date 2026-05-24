/* HomeScreen — recreation of src/routes/index.tsx.
   - Brand wordmark + user avatar at top
   - Greeting + huge "ti rimangono" amount (tabular nums)
   - Centered QuickAdd input
   - Soft background tint that flips green (positive) / red (negative) */

function HomeScreen({ remaining, onAdd, onNavMese }) {
  const positive = remaining >= 0;
  const tint = positive
    ? "radial-gradient(60% 45% at 50% 0%, oklch(0.85 0.14 152 / 0.32), transparent 70%), radial-gradient(40% 30% at 80% 20%, oklch(0.85 0.12 200 / 0.18), transparent 70%)"
    : "radial-gradient(60% 45% at 50% 0%, oklch(0.85 0.12 25 / 0.28), transparent 70%), radial-gradient(40% 30% at 20% 20%, oklch(0.85 0.10 30 / 0.18), transparent 70%)";
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 6) return "Buonanotte";
    if (h < 13) return "Buongiorno";
    if (h < 19) return "Buon pomeriggio";
    return "Buonasera";
  })();

  return (
    <main style={{
      position: "relative", minHeight: "100%",
      padding: "20px 20px 120px",
      display: "flex", flexDirection: "column",
    }}>
      <div aria-hidden style={{
        position: "absolute", inset: "0 0 auto 0", height: "70%",
        background: tint, zIndex: -1, pointerEvents: "none",
        transition: "background .7s ease",
      }} />

      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <span style={{
          fontWeight: 600, fontSize: 18, letterSpacing: "-0.01em",
          color: "color-mix(in oklab, var(--foreground) 90%, transparent)",
        }}>
          Ognicent
        </span>
        <button
          aria-label="Profilo"
          style={{
            width: 40, height: 40, borderRadius: 9999, border: "none",
            background: "#000", color: "#fff",
            fontWeight: 600, fontSize: 13,
            cursor: "pointer", boxShadow: "var(--shadow-card)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}
        >
          MR
        </button>
      </header>

      <section style={{ textAlign: "center", marginBottom: 40 }}>
        <p style={{
          fontSize: 11, fontWeight: 500,
          textTransform: "uppercase", letterSpacing: "0.16em",
          color: "color-mix(in oklab, var(--muted-foreground) 80%, transparent)",
        }}>
          {greeting} · ti rimangono
        </p>
        <p style={{
          marginTop: 12,
          fontSize: 44, fontWeight: 500,
          fontVariantNumeric: "tabular-nums",
          fontFeatureSettings: '"tnum","ss01"',
          letterSpacing: "-0.03em", lineHeight: 1,
          color: "var(--foreground)",
          textShadow: "0 1px 0 oklch(1 0 0 / 0.6)",
        }}>
          {window.formatEUR(remaining)}
        </p>
        <p style={{ marginTop: 12, fontSize: 12, color: "color-mix(in oklab, var(--muted-foreground) 80%, transparent)" }}>
          questo mese
        </p>
      </section>

      <div style={{ flex: 1 }} />

      <section style={{ position: "absolute", left: 0, right: 0, top: "55%", transform: "translateY(-50%)", padding: "0 20px", pointerEvents: "none" }}>
        <div style={{ maxWidth: 520, margin: "0 auto", pointerEvents: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 10 }}>
            <OgSparkles size={12} style={{ color: "color-mix(in oklab, var(--foreground) 40%, transparent)" }} />
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", fontWeight: 300, textAlign: "center" }}>
              Aggiungi un movimento e guarda la magia
            </p>
          </div>
          <QuickAdd onAdd={onAdd} />
        </div>
      </section>
    </main>
  );
}

Object.assign(window, { HomeScreen });
