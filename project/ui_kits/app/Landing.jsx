/* Landing — compressed recreation of src/components/Landing.tsx.
   Dark cinematic surface with blue glow, hero headline w/ gradient,
   floating phone mockup, three-step explanation. */

function Landing({ onLaunch }) {
  return (
    <div
      className="landing-root"
      style={{
        background: "#05070d",
        color: "rgba(255,255,255,0.96)",
        minHeight: "100%",
        fontFamily: "var(--font-sans)",
        WebkitFontSmoothing: "antialiased",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Nav */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(5,7,13,0.72)",
        backdropFilter: "blur(20px) saturate(160%)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto", padding: "0 20px",
          height: 56,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: "linear-gradient(135deg, #3b6cff 0%, #5b8bff 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff",
              boxShadow: "0 10px 30px -10px rgba(59,108,255,0.65), inset 0 1px 0 rgba(255,255,255,0.22)",
            }}>
              <OgWallet size={16} />
            </div>
            <span style={{ fontWeight: 600, letterSpacing: "-0.01em", fontSize: 15 }}>Ognicent</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button onClick={onLaunch} style={{
              fontSize: 13, fontWeight: 500, padding: "6px 14px", borderRadius: 9999,
              color: "rgba(255,255,255,0.62)", background: "transparent", border: "none", cursor: "pointer",
            }}>
              Accedi
            </button>
            <CtaButton size="sm" onClick={onLaunch}>Inizia Gratis</CtaButton>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ position: "relative", padding: "56px 20px 64px" }}>
        {/* Glow */}
        <div aria-hidden style={{
          position: "absolute", inset: "0 0 auto 0", height: 720, zIndex: -1, pointerEvents: "none",
          background: "radial-gradient(60% 60% at 50% 0%, rgba(59,108,255,0.32) 0%, rgba(59,108,255,0.08) 40%, transparent 70%)",
        }} />
        <div aria-hidden style={{
          position: "absolute", inset: "0 0 auto 0", height: 720, zIndex: -1, pointerEvents: "none",
          background: "radial-gradient(40% 30% at 80% 10%, rgba(122,162,255,0.25), transparent 70%)",
          opacity: 0.35,
        }} />

        <div style={{ maxWidth: 740, margin: "0 auto", textAlign: "center" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 12px", borderRadius: 9999,
            fontSize: 11, fontWeight: 500,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.04)",
            color: "rgba(255,255,255,0.62)",
          }}>
            <OgSparkles size={12} style={{ color: "#7aa2ff" }} />
            Il tuo budget, finalmente semplice
          </span>

          <h1 style={{
            marginTop: 24, fontWeight: 700,
            fontSize: "clamp(2.25rem, 7.5vw, 4.25rem)",
            lineHeight: 1.04, letterSpacing: "-0.03em",
          }}>
            Sai davvero dove<br/>
            <span style={{
              background: "linear-gradient(135deg, #ffffff 0%, #7aa2ff 60%, #3b6cff 100%)",
              WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
            }}>finiscono i tuoi soldi?</span>
          </h1>

          <p style={{
            marginTop: 20, maxWidth: "34rem", marginInline: "auto",
            color: "rgba(255,255,255,0.62)",
            fontSize: "clamp(0.95rem, 2.4vw, 1.075rem)", lineHeight: 1.55,
          }}>
            Aggiungi spese ed entrate in pochi tap. Capisci subito quanto ti rimane davvero ogni mese.
          </p>

          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <CtaButton onClick={onLaunch} style={{ minWidth: 280 }}>
              Inizia Gratis <OgArrowRight size={20} />
            </CtaButton>
            <button onClick={onLaunch} style={{
              fontSize: 13, fontWeight: 500, background: "transparent", border: "none",
              color: "rgba(255,255,255,0.62)", cursor: "pointer",
            }}>
              Hai già un account? <span style={{ color: "#7aa2ff" }}>Accedi</span>
            </button>
          </div>

          <div style={{
            marginTop: 24,
            display: "flex", flexWrap: "wrap", justifyContent: "center",
            alignItems: "center", gap: "6px 20px",
            fontSize: 11, color: "rgba(255,255,255,0.42)",
          }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <OgShieldCheck size={14} /> Dati cifrati
            </span>
            <span>·</span>
            <span>Accesso con Google in un tap</span>
            <span>·</span>
            <span>Nessuna carta richiesta</span>
          </div>
        </div>

        {/* Floating mockup */}
        <div style={{ marginTop: 64, maxWidth: 352, marginInline: "auto", position: "relative" }}>
          <div aria-hidden style={{
            position: "absolute", inset: "auto 24px -40px 24px", height: 96, zIndex: -1,
            borderRadius: "50%", filter: "blur(48px)",
            background: "rgba(59,108,255,0.55)", opacity: 0.7,
          }} />
          <div style={{
            position: "relative", padding: 12, borderRadius: 36,
            background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
            border: "1px solid rgba(255,255,255,0.14)",
            boxShadow: "0 40px 80px -24px rgba(0,0,0,0.7), 0 0 0 1px rgba(122,162,255,0.08)",
          }}>
            <div style={{
              padding: 20, borderRadius: 30,
              background: "linear-gradient(180deg, #10162a, #0b0f1a)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <div style={{
                    fontSize: 10, fontWeight: 500,
                    textTransform: "uppercase", letterSpacing: "0.14em",
                    color: "rgba(255,255,255,0.42)",
                  }}>Ti rimangono</div>
                  <div style={{
                    fontSize: 28, fontWeight: 600, marginTop: 2,
                    fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em",
                  }}>€ 1.247,80</div>
                </div>
                <div style={{
                  width: 36, height: 36, borderRadius: 16,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "linear-gradient(135deg, #3b6cff 0%, #5b8bff 100%)", color: "#fff",
                  boxShadow: "0 10px 30px -10px rgba(59,108,255,0.65), inset 0 1px 0 rgba(255,255,255,0.22)",
                }}>
                  <OgWallet size={16} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                <div style={{
                  padding: "12px 0", borderRadius: 16,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  fontSize: 12, fontWeight: 600,
                  background: "linear-gradient(135deg, #3b6cff 0%, #5b8bff 100%)", color: "#fff",
                  boxShadow: "0 10px 30px -10px rgba(59,108,255,0.65), inset 0 1px 0 rgba(255,255,255,0.22)",
                }}>
                  <OgPlus size={14} weight={3} /> Spesa
                </div>
                <div style={{
                  padding: "12px 0", borderRadius: 16,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  fontSize: 12, fontWeight: 600,
                  background: "linear-gradient(135deg, #1f6f4f 0%, #2aa67a 100%)", color: "#fff",
                }}>
                  <OgPlus size={14} weight={3} /> Entrata
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {["🏠", "🚗", "🍔", "🛒", "💪", "🛍️", "📺", "✈️"].map((e, i) => (
                  <div key={i} style={{
                    aspectRatio: "1 / 1", borderRadius: 16,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}>{e}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three steps */}
      <section style={{
        padding: "64px 20px",
        background: "linear-gradient(180deg, rgba(255,255,255,0.015), rgba(255,255,255,0))",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{
              fontSize: 11, fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "0.20em",
              color: "#7aa2ff",
            }}>Come funziona</div>
            <h2 style={{
              marginTop: 12,
              fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
              fontWeight: 700, letterSpacing: "-0.025em",
            }}>Tre passi. Zero complicazioni.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {[
              { n: "01", t: "Accedi",     d: "Login con Google in un tap. Nessuna registrazione lunga." },
              { n: "02", t: "Aggiungi",   d: "Tocca una categoria, inserisci l'importo, salva." },
              { n: "03", t: "Vedi chiaro", d: "Totali, abitudini e cosa ti rimane davvero." },
            ].map((s) => (
              <div key={s.n} style={{
                padding: 28, borderRadius: 28,
                background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))",
                border: "1px solid rgba(255,255,255,0.08)",
              }}>
                <div style={{
                  fontSize: 36, fontWeight: 700,
                  marginBottom: 12,
                  fontVariantNumeric: "tabular-nums",
                  background: "linear-gradient(135deg, #7aa2ff, #3b6cff)",
                  WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
                  letterSpacing: "-0.03em",
                }}>{s.n}</div>
                <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 6, letterSpacing: "-0.01em" }}>{s.t}</h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "rgba(255,255,255,0.62)" }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { Landing });
