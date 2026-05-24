/* SuccessModal — auto-dismissing confirmation after Quick Add submits.
   Tinted by kind (blue for expense, green for income). */

function SuccessModal({ data, onClose }) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 1800);
    return () => clearTimeout(t);
  }, [onClose]);

  if (!data) return null;
  const { icon, name, amount, isIncome } = data;
  const sign = isIncome ? "+" : "−";

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
        background: "oklch(0.15 0.02 265 / 0.32)",
        backdropFilter: "blur(8px) saturate(1.1)",
        animation: "ogFadeIn .2s cubic-bezier(.22,1,.36,1)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 320,
          padding: "28px 32px 28px",
          textAlign: "center",
          borderRadius: 30,
          // Translucent white — no accent tint
          background: "oklch(1 0 0 / 0.55)",
          border: "1px solid oklch(1 0 0 / 0.7)",
          backdropFilter: "blur(28px) saturate(1.4)",
          WebkitBackdropFilter: "blur(28px) saturate(1.4)",
          boxShadow:
            "0 1px 0 oklch(1 0 0 / .9) inset, 0 40px 90px -30px oklch(0 0 0 / 0.28), 0 18px 50px -20px oklch(0 0 0 / 0.18)",
          animation: "ogScaleIn .28s cubic-bezier(.22,1,.36,1)",
        }}
      >
        <div style={{
          width: 80, height: 80,
          margin: "0 auto 16px",
          borderRadius: 9999,
          background: "oklch(1 0 0 / 0.95)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 40,
          boxShadow: "inset 0 0 0 1px oklch(0 0 0 / 0.04), 0 10px 28px -10px oklch(0 0 0 / 0.22)",
        }}>
          {icon}
        </div>
        <div style={{
          fontSize: 18, fontWeight: 600,
          color: "oklch(0.18 0 0)",
          marginBottom: 10,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {name}
        </div>
        <div style={{
          fontSize: 36, fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.025em",
          color: "oklch(0.18 0 0)",
          lineHeight: 1,
        }}>
          {sign}€{amount.toFixed(2)}
        </div>
        <div style={{
          marginTop: 14,
          fontSize: 10, fontWeight: 600,
          textTransform: "uppercase", letterSpacing: "0.14em",
          color: "oklch(0.52 0 0)",
        }}>
          {isIncome ? "Entrata aggiunta" : "Spesa aggiunta"}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SuccessModal });
