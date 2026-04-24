import { useState } from "react";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

type Cat = "ALL" | "ML" | "CLOUD" | "NLP" | "SECURITY";

type Project = {
  title: string;
  desc: string;
  cats: Exclude<Cat, "ALL">[];
  tags: string[];
  badge: string;
  shape: "scatter" | "bar" | "wave" | "hex" | "nodes";
  wide?: boolean;
};

const projects: Project[] = [
  {
    title: "Backdoor Attacks in Continual Learning",
    desc: "Studied trigger persistence and forgetting under EWC; reduced backdoor success rate by 18%.",
    cats: ["SECURITY", "ML"],
    tags: ["PyTorch", "EWC", "Security"],
    badge: "18% forgetting ↓",
    shape: "scatter",
  },
  {
    title: "UFC Fight Outcome Prediction",
    desc: "Engineered fighter-form, reach, and stance features over 20 years of bout data.",
    cats: ["ML"],
    tags: ["Scikit-learn", "Feature Eng."],
    badge: "72% accuracy",
    shape: "bar",
  },
  {
    title: "Lip Reading Multi-Modal",
    desc: "Visual-audio fusion model for silent speech transcription on noisy clips.",
    cats: ["NLP", "ML"],
    tags: ["ResNet", "NLP", "CV"],
    badge: "20% accuracy ↑",
    shape: "wave",
  },
  {
    title: "AWS Serverless TTS",
    desc: "Event-driven text-to-speech pipeline with cold-start budget under 400ms.",
    cats: ["CLOUD"],
    tags: ["AWS SAM", "Lambda", "DynamoDB"],
    badge: "40% overhead ↓",
    shape: "hex",
    wide: true,
  },
  {
    title: "Spotify Recommendation",
    desc: "Hybrid collaborative + content recommender deployed on Streamlit + AWS.",
    cats: ["ML", "CLOUD"],
    tags: ["AWS", "Streamlit", "Hybrid Filter"],
    badge: "15% engagement ↑",
    shape: "nodes",
  },
];

function Shape({ kind }: { kind: Project["shape"] }) {
  const c = "var(--accent-primary)";
  const cs = "var(--accent-secondary)";
  if (kind === "scatter") {
    return (
      <svg viewBox="0 0 200 80" width="100%" height="80" aria-hidden>
        {Array.from({ length: 28 }).map((_, i) => {
          const x = (i * 37) % 200;
          const y = ((i * 53) % 70) + 5;
          return <circle key={i} cx={x} cy={y} r={1.5 + (i % 3)} fill={i % 4 === 0 ? c : cs} opacity={0.4 + (i % 4) * 0.15} />;
        })}
      </svg>
    );
  }
  if (kind === "bar") {
    return (
      <svg viewBox="0 0 200 80" width="100%" height="80" aria-hidden>
        {[40, 65, 30, 55, 70, 45, 60, 35, 75, 50].map((h, i) => (
          <rect key={i} x={i * 20 + 4} y={80 - h} width="12" height={h} fill={i % 2 === 0 ? c : cs} opacity="0.7" />
        ))}
      </svg>
    );
  }
  if (kind === "wave") {
    return (
      <svg viewBox="0 0 200 80" width="100%" height="80" aria-hidden>
        <path
          d={Array.from({ length: 60 }).map((_, i) => {
            const x = (i / 59) * 200;
            const y = 40 + Math.sin(i / 3) * (15 + Math.sin(i / 7) * 10);
            return `${i === 0 ? "M" : "L"}${x},${y}`;
          }).join(" ")}
          stroke={c}
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    );
  }
  if (kind === "hex") {
    return (
      <svg viewBox="0 0 200 80" width="100%" height="80" aria-hidden>
        {[20, 60, 100, 140, 180].map((cx, i) => {
          const pts = Array.from({ length: 6 }).map((_, j) => {
            const a = (Math.PI / 3) * j;
            return `${cx + Math.cos(a) * 18},${40 + Math.sin(a) * 18}`;
          }).join(" ");
          return <polygon key={cx} points={pts} fill="none" stroke={i % 2 ? c : cs} strokeWidth="1.2" opacity="0.7" />;
        })}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 80" width="100%" height="80" aria-hidden>
      {[[20, 20], [60, 60], [100, 25], [140, 55], [180, 30]].map(([x, y], i) =>
        [[20, 20], [60, 60], [100, 25], [140, 55], [180, 30]].slice(i + 1).map(([x2, y2], j) => (
          <line key={`${i}-${j}`} x1={x} y1={y} x2={x2} y2={y2} stroke={c} strokeWidth="0.5" opacity="0.4" />
        )),
      )}
      {[[20, 20], [60, 60], [100, 25], [140, 55], [180, 30]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill={c} opacity="0.8" />
      ))}
    </svg>
  );
}

const filters: Cat[] = ["ALL", "ML", "CLOUD", "NLP", "SECURITY"];

export function Projects() {
  const [active, setActive] = useState<Cat>("ALL");
  const visible = (p: Project) => active === "ALL" || p.cats.includes(active as Exclude<Cat, "ALL">);

  return (
    <Section id="projects" label="/projects" number="02" alt>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36 }}>
        {filters.map((f) => (
          <button
            key={f}
            className={`pill-tab ${active === f ? "active" : ""}`}
            onClick={() => setActive(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 24,
        }}
      >
        {projects.map((p, i) => {
          const show = visible(p);
          return (
            <Reveal
              key={p.title}
              delay={i * 60}
              className="card-base proj-card"
            >
              <div
                style={{
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  height: "100%",
                  opacity: show ? 1 : 0.15,
                  transform: show ? "scale(1)" : "scale(0.97)",
                  transition: "opacity 0.3s ease, transform 0.3s ease",
                  pointerEvents: show ? "auto" : "none",
                }}
                data-wide={p.wide ? "true" : undefined}
              >
                <div className="proj-shape" style={{ transition: "transform 0.4s ease" }}>
                  <Shape kind={p.shape} />
                </div>
                <h3 className="font-display" style={{ fontSize: "var(--type-card-title)", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                  {p.title}
                </h3>
                <p className="font-mono" style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                  {p.desc}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {p.tags.map((t) => (
                    <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", padding: "3px 9px", border: "1px solid var(--border-subtle)", borderRadius: 999, color: "var(--text-secondary)", letterSpacing: "0.08em" }}>
                      {t}
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "auto" }}>
                  <span style={{ background: "var(--accent-warm)", color: "#1a0d00", fontFamily: "var(--font-data)", fontSize: "0.7rem", padding: "4px 10px", borderRadius: 3, fontWeight: 500 }}>
                    {p.badge}
                  </span>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <style>{`
        .proj-card:hover .proj-shape { transform: rotate(15deg) scale(1.05); }
        @media (min-width: 900px) {
          .proj-card:nth-child(5n) { grid-column: span 2; }
        }
      `}</style>
    </Section>
  );
}