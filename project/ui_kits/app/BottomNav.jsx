/* BottomNav — three glass tabs fixed near the bottom of every app screen. */

function BottomNav({ active, onChange }) {
  const tabs = [
    { id: "home", label: "Home", Icon: OgHome },
    { id: "mese", label: "Mese", Icon: OgWallet },
    { id: "anno", label: "Anno", Icon: OgCalendarRange },
  ];

  return (
    <nav style={{ width: "100%", padding: "0 20px 12px" }}>
      <div
        style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          padding: 6,
          borderRadius: 28,
          background: "linear-gradient(180deg, color-mix(in oklab, var(--background) 55%, transparent) 0%, color-mix(in oklab, var(--background) 40%, transparent) 100%)",
          backdropFilter: "blur(28px) saturate(180%)",
          border: "1px solid color-mix(in oklab, var(--border) 35%, transparent)",
          boxShadow: "0 1px 0 oklch(1 0 0 / 0.35) inset, 0 8px 24px -16px oklch(.20 .015 265 / .18)",
        }}
      >
        {tabs.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange?.(id)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                padding: "10px 4px",
                border: "none", borderRadius: 22,
                background: isActive
                  ? "linear-gradient(180deg, color-mix(in oklab, var(--card) 55%, transparent), color-mix(in oklab, var(--card) 35%, transparent))"
                  : "transparent",
                boxShadow: isActive ? "0 1px 0 oklch(1 0 0 / .5) inset, 0 1px 1px oklch(.20 .015 265 / .04)" : "none",
                color: isActive ? "var(--foreground)" : "color-mix(in oklab, var(--foreground) 50%, transparent)",
                fontSize: 11, fontWeight: isActive ? 600 : 500,
                cursor: "pointer",
                transition: "all .3s cubic-bezier(.22,1,.36,1)",
              }}
            >
              <Icon size={20} weight={isActive ? 2.2 : 1.8} style={{ transform: isActive ? "scale(1.06)" : "scale(1)", transition: "transform .3s cubic-bezier(.22,1,.36,1)" }} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

Object.assign(window, { BottomNav });
