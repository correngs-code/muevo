/* MeseScreen — recreation of src/routes/expenses.tsx.
   - Month label + big "saldo" amount
   - Income/expense dots
   - Category breakdown w/ thin gradient bars
   - Entrate list + Spese list */

function MeseScreen({ items, onDelete }) {
  const now = new Date();
  const MONTHS = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
  const monthLabel = `${MONTHS[now.getMonth()]} ${now.getFullYear()}`;

  const expenses = items.filter((x) => x.kind !== "income");
  const incomes  = items.filter((x) => x.kind === "income");
  const totalExp = expenses.reduce((s, x) => s + x.amount, 0);
  const totalInc = incomes.reduce((s, x) => s + x.amount, 0);
  const net = totalInc - totalExp;

  // category totals → bars (use the new categorical palette)
  const PIE = [
    "oklch(0.86 0.08 25)",  "oklch(0.88 0.08 60)",  "oklch(0.92 0.09 95)",  "oklch(0.88 0.07 145)",
    "oklch(0.87 0.07 190)", "oklch(0.88 0.07 230)", "oklch(0.85 0.08 290)", "oklch(0.87 0.08 340)",
  ];
  const byCat = new Map();
  for (const e of expenses) byCat.set(e.category, (byCat.get(e.category) ?? 0) + e.amount);
  const cats = [...byCat.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([label, value], i) => ({ label, value, color: PIE[i % PIE.length] }));

  return (
    <main style={{ minHeight: "100%", padding: "24px 20px 120px" }}>
      <div style={{
        borderRadius: 28, background: "var(--card)",
        boxShadow: "var(--shadow-card)", overflow: "hidden",
      }}>
        <div style={{ padding: "28px 20px 24px" }}>
          <div style={{
            fontSize: 13, fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.14em",
            color: "color-mix(in oklab, var(--muted-foreground) 80%, transparent)",
          }}>
            {monthLabel}
          </div>
          <div style={{ marginTop: 8, display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{
              fontSize: 40, fontWeight: 700,
              letterSpacing: "-0.025em",
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1,
              color: net < 0 ? "var(--destructive)" : "var(--foreground)",
            }}>
              {window.formatEUR(net)}
            </span>
            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--muted-foreground)" }}>saldo</span>
          </div>
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 20, fontSize: 12 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted-foreground)" }}>
              <span style={{ width: 6, height: 6, borderRadius: 9999, background: "oklch(0.68 0.18 152)" }}></span>
              Entrate
              <strong style={{ marginLeft: 4, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: "var(--foreground)" }}>
                {window.formatEUR(totalInc)}
              </strong>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted-foreground)" }}>
              <span style={{ width: 6, height: 6, borderRadius: 9999, background: "var(--destructive)" }}></span>
              Spese
              <strong style={{ marginLeft: 4, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: "var(--foreground)" }}>
                {window.formatEUR(totalExp)}
              </strong>
            </span>
          </div>
        </div>

        <div style={{ padding: "0 12px 24px", display: "flex", flexDirection: "column", gap: 24 }}>
          {cats.length > 0 && (
            <section>
              <h3 style={{
                fontSize: 11, fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.14em",
                color: "color-mix(in oklab, var(--muted-foreground) 70%, transparent)",
                margin: "0 0 12px 4px",
              }}>Categorie</h3>
              <ul style={{ display: "flex", flexDirection: "column", gap: 12, listStyle: "none", padding: 0, margin: 0 }}>
                {cats.slice(0, 5).map((c) => {
                  const pct = totalExp > 0 ? (c.value / totalExp) * 100 : 0;
                  const emoji = window.OG_CATEGORIES.find((x) => x.value === c.label)?.emoji ?? "•";
                  return (
                    <li key={c.label} style={{ padding: "0 4px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--foreground)", display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 16 }}>{emoji}</span>
                          {c.label}
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                          {window.formatEUR(c.value)}
                        </span>
                      </div>
                      <div style={{ height: 6, borderRadius: 9999, background: "color-mix(in oklab, var(--secondary) 60%, transparent)", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 9999, background: c.color, transition: "width .5s cubic-bezier(.22,1,.36,1)" }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          <Section title="Entrate">
            {incomes.length === 0 ? (
              <Empty>Nessuna entrata in questo mese.</Empty>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {incomes.map((i) => (
                  <ListRow
                    key={i.id} kind="income"
                    icon={i.icon ?? window.guessIcon(i.name, "Altro")}
                    name={i.name}
                    meta={window.formatDate(i.createdAt)}
                    amount={i.amount}
                    onDelete={() => onDelete?.(i.id)}
                  />
                ))}
              </ul>
            )}
          </Section>

          <Section title="Spese">
            {expenses.length === 0 ? (
              <Empty>Nessuna spesa in questo mese.</Empty>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {expenses.map((e) => (
                  <ListRow
                    key={e.id} kind="expense"
                    icon={e.icon ?? window.guessIcon(e.name, e.category)}
                    name={e.name}
                    meta={`${window.formatDate(e.createdAt)} · ${e.category}`}
                    amount={e.amount}
                    onDelete={() => onDelete?.(e.id)}
                  />
                ))}
              </ul>
            )}
          </Section>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 4px 12px" }}>
        <h3 style={{
          margin: 0, fontSize: 11, fontWeight: 600,
          textTransform: "uppercase", letterSpacing: "0.14em",
          color: "color-mix(in oklab, var(--muted-foreground) 70%, transparent)",
        }}>{title}</h3>
      </div>
      {children}
    </section>
  );
}

function Empty({ children }) {
  return (
    <div style={{
      fontSize: 13, padding: "8px 4px",
      color: "color-mix(in oklab, var(--muted-foreground) 70%, transparent)",
    }}>{children}</div>
  );
}

Object.assign(window, { MeseScreen });
