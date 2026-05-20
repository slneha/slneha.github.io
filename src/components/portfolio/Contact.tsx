import { Reveal } from "./Reveal";

export function Contact() {
  return (
    <section
      id="contact"
      className="contact-section"
      style={{
        padding: "15vh 8vw",
        background: "var(--bg-primary)",
        position: "relative",
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
        }}
      >
        05
      </div>
      <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div className="section-label" style={{ marginBottom: 36, justifyContent: "center" }}>
          /contact
        </div>
        <Reveal>
          <h2
            className="font-display"
            style={{
              fontWeight: 800,
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              lineHeight: 1.05,
              letterSpacing: "var(--tracking-tight)",
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            Let's build something
            <br />
            worth <span style={{ color: "var(--accent-primary)" }}>benchmarking.</span>
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="font-mono" style={{ marginTop: 28, color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Open to full-time ML Engineering, Cloud AI, and Applied Research roles.
          </p>
        </Reveal>
        <Reveal delay={300}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginTop: 40 }}>
            <a href="mailto:Neha.Senthil@duke.edu" className="chip" style={{ color: "var(--text-primary)" }}>✉ Neha.Senthil@duke.edu</a>
            <a href="#" className="chip" style={{ color: "var(--text-primary)" }}>↗ LinkedIn</a>
            <a href="#" className="chip" style={{ color: "var(--text-primary)" }}>↗ GitHub</a>
          </div>
        </Reveal>
      </div>

      <footer
        className="contact-footer"
        style={{
          marginTop: 100,
          paddingTop: 24,
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          color: "var(--text-dim)",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span>© Neha L Senthil · Duke MSCS '25 · US Citizen</span>
        <span>Built with intention.</span>
      </footer>
    </section>
  );
}