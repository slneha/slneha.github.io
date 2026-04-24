import type { ReactNode } from "react";

export function Section({
  id,
  label,
  number,
  alt = false,
  children,
}: {
  id: string;
  label: string;
  number: string;
  alt?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      style={{
        position: "relative",
        padding: "120px 8vw",
        background: alt ? "var(--bg-secondary)" : "var(--bg-primary)",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        className="font-display"
        style={{
          position: "absolute",
          top: 40,
          right: "4vw",
          fontSize: "clamp(5rem, 10vw, 9rem)",
          fontWeight: 800,
          color: "var(--text-dim)",
          opacity: 0.18,
          letterSpacing: "-0.05em",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        {number}
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="section-label" style={{ marginBottom: 32 }}>
          {label}
        </div>
        {children}
      </div>
      <style>{`
        @media (max-width: 768px) {
          section { padding: 80px 6vw !important; }
        }
      `}</style>
    </section>
  );
}