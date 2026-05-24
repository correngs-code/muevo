/* Button variants used in the Ognicent product.
   - CtaButton:    pill, vivid blue gradient, white text, glow shadow.
   - PillButton:   solid foreground/background flip, used for "Accedi", profile avatar.
   - GhostButton:  text-only, muted color.
   - SaveButton:   square-ish, black bg, used as the dialog confirm.
   - SuccessChip:  green gradient pill, used as the income CTA in the hero mock. */

function CtaButton({ children, onClick, size = "lg", style, ...rest }) {
  const heights = { sm: 44, md: 52, lg: 56 };
  const padding = { sm: "0 18px", md: "0 22px", lg: "0 28px" };
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        gap: 8,
        height: heights[size], padding: padding[size],
        borderRadius: 9999,
        background: "linear-gradient(135deg, #3b6cff 0%, #5b8bff 100%)",
        color: "#fff",
        fontWeight: 700, fontSize: size === "lg" ? 16 : 14,
        letterSpacing: "-0.01em",
        border: "1px solid rgba(59,108,255,0.35)",
        boxShadow: "0 10px 30px -10px rgba(59,108,255,0.65), inset 0 1px 0 rgba(255,255,255,0.22)",
        cursor: "pointer", transition: "transform .15s ease, filter .15s ease",
        ...style,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.filter = "brightness(1.06)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.filter = "none"; }}
      onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(0) scale(.99)"; }}
      {...rest}
    >
      {children}
    </button>
  );
}

function PillButton({ children, onClick, style, ...rest }) {
  return (
    <button
      onClick={onClick}
      style={{
        height: 40, padding: "0 16px",
        borderRadius: 9999, border: "none",
        background: "var(--foreground)", color: "var(--background)",
        fontWeight: 600, fontSize: 13,
        boxShadow: "var(--shadow-card)",
        cursor: "pointer", transition: "transform .15s ease",
        ...style,
      }}
      onMouseDown={(e) => { e.currentTarget.style.transform = "scale(.95)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      {...rest}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, style, ...rest }) {
  return (
    <button
      onClick={onClick}
      style={{
        height: 40, padding: "0 14px",
        borderRadius: 9999, border: "none",
        background: "transparent",
        color: "var(--muted-foreground)",
        fontWeight: 500, fontSize: 13,
        cursor: "pointer",
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

function SaveButton({ children, onClick, style, ...rest }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", height: 52,
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.1)",
        background: "#000", color: "#fff",
        fontWeight: 600, fontSize: 16,
        cursor: "pointer", transition: "transform .15s ease",
        ...style,
      }}
      onMouseDown={(e) => { e.currentTarget.style.transform = "scale(.99)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      {...rest}
    >
      {children}
    </button>
  );
}

function IconButton({ children, label, onClick, style, ...rest }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      style={{
        width: 36, height: 36, borderRadius: 9999, border: "none",
        background: "transparent", color: "var(--muted-foreground)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "background .15s ease",
        ...style,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in oklab, var(--foreground) 6%, transparent)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
      {...rest}
    >
      {children}
    </button>
  );
}

Object.assign(window, { CtaButton, PillButton, GhostButton, SaveButton, IconButton });
