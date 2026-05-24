/* ListRow — used in /expenses for both income (+) and expense (−) rows. */

function ListRow({ icon, name, meta, amount, kind, onDelete }) {
  const isIncome = kind === "income";
  return (
    <li
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 14px",
        borderRadius: 18,
        background: "color-mix(in oklab, var(--secondary) 40%, transparent)",
        transition: "background .15s ease",
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = "color-mix(in oklab, var(--secondary) 60%, transparent)"}
      onMouseLeave={(e) => e.currentTarget.style.background = "color-mix(in oklab, var(--secondary) 40%, transparent)"}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 9999,
        background: "var(--background)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.2, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {name}
        </div>
        <div style={{ fontSize: 11, color: "color-mix(in oklab, var(--muted-foreground) 70%, transparent)", marginTop: 2 }}>
          {meta}
        </div>
      </div>
      <div
        style={{
          fontSize: 15, fontWeight: 600,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.01em",
          color: isIncome ? "oklch(0.62 0.17 152)" : "var(--foreground)",
          flexShrink: 0,
        }}
      >
        {isIncome ? "+" : "−"}{window.formatEUR(amount)}
      </div>
      {onDelete && (
        <button
          onClick={onDelete}
          aria-label={`Elimina ${name}`}
          style={{
            width: 28, height: 28, marginRight: -4,
            borderRadius: 9999, border: "none",
            background: "transparent",
            color: "color-mix(in oklab, var(--muted-foreground) 60%, transparent)",
            cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
            transition: "all .15s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--destructive)"; e.currentTarget.style.background = "color-mix(in oklab, var(--destructive) 10%, transparent)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "color-mix(in oklab, var(--muted-foreground) 60%, transparent)"; e.currentTarget.style.background = "transparent"; }}
        >
          <OgTrash2 size={14} weight={1.8} />
        </button>
      )}
    </li>
  );
}

Object.assign(window, { ListRow });
