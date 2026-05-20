const items = [
  { label: "/home", href: "#home" },
  { label: "/about", href: "#experience" },
  { label: "/projects", href: "#projects" },
  { label: "/research", href: "#research" },
  { label: "/contact", href: "#contact" },
];

export function Nav() {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        background: "rgba(8,12,16,0.7)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "16px 8vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <a href="#home" className="font-mono" style={{ fontWeight: 500, letterSpacing: "0.02em", color: "var(--text-primary)", fontSize: "0.9rem" }}>
          <span style={{ color: "var(--accent-primary)" }}>&lt;</span>slneha<span style={{ color: "var(--accent-primary)" }}> /&gt;</span>
        </a>
        <div className="nav-items" style={{ display: "flex", gap: 28 }}>
          {items.map((it) => (
            <a key={it.href} href={it.href} className="nav-link">
              {it.label}
            </a>
          ))}
        </div>
        <div className="nav-status" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            className="pulse-dot"
            style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "var(--accent-primary)",
              boxShadow: "var(--glow-strong)",
            }}
          />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--accent-primary)" }}>
            OPEN TO NETWORK
          </span>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .nav-items { gap: 14px !important; font-size: 0.7rem; }
          .nav-link { font-size: 0.7rem !important; }
        }
      `}</style>
    </nav>
  );
}