import { Section } from "./Section";
import { Reveal } from "./Reveal";

const papers = [
  {
    journal: "IJARESM · Vol. 12 · Mar 2024",
    title: "Adversarial Robustness in Continual Learning Systems",
    abstract: "Investigates how trigger-based backdoors persist across replay strategies, with mitigation through elastic weight consolidation.",
    tags: ["PyTorch", "Security", "ML"],
  },
  {
    journal: "IJARESM · Vol. 11 · Sep 2023",
    title: "Hybrid Recommender Systems on Serverless Infrastructure",
    abstract: "Compares latency, cost, and recall of collaborative + content models deployed via AWS Lambda + Streamlit.",
    tags: ["AWS", "Recommender", "Cloud"],
  },
];

export function Research() {
  return (
    <Section id="research" label="/research" number="03">
      <div className="research-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
        {papers.map((p, i) => (
          <Reveal key={p.title} delay={i * 100}>
            <article
              style={{
                position: "relative",
                background: "var(--bg-secondary)",
                borderLeft: "4px solid var(--accent-primary)",
                padding: "32px 36px",
                overflow: "hidden",
              }}
            >
              <div className="font-data" style={{ fontSize: "0.7rem", color: "var(--text-dim)", marginBottom: 14, letterSpacing: "0.05em" }}>
                {p.journal}
              </div>
              <h3 className="font-display" style={{ fontWeight: 700, fontSize: "1.15rem", color: "var(--text-primary)", marginTop: 0 }}>
                {p.title}
              </h3>
              <p className="font-mono" style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {p.abstract}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 18 }}>
                {p.tags.map((t) => (
                  <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", padding: "3px 9px", border: "1px solid var(--border-subtle)", borderRadius: 999, color: "var(--text-secondary)", letterSpacing: "0.08em" }}>
                    {t}
                  </span>
                ))}
              </div>
              <a href="#" className="arrow-link" style={{ marginTop: 22, display: "inline-flex" }}>
                Read Paper
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                  <path d="M1 5h12M9 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <span
                aria-hidden
                className="font-mono"
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%) rotate(90deg)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.3em",
                  color: "var(--text-dim)",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                Peer Reviewed
              </span>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}