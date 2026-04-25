import { useEffect, useRef, useState } from "react";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

function ImpactBar({ percent, label }: { percent: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setTimeout(() => setW(percent), 200);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [percent]);
  return (
    <div ref={ref} style={{ marginTop: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span className="font-mono" style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", textTransform: "uppercase" }}>{label}</span>
        <span className="font-data" style={{ fontSize: "0.8rem", color: "var(--accent-primary)" }}>{percent}%</span>
      </div>
      <div style={{ height: 4, background: "var(--bg-tertiary)", borderRadius: 2, overflow: "hidden" }}>
        <div
          style={{
            width: `${w}%`,
            height: "100%",
            background: "var(--accent-primary)",
            boxShadow: "var(--glow-strong)",
            transition: "width 1.4s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </div>
    </div>
  );
}

function Card({
  company, role, date, bullets, impact, glow,
}: {
  company: string; role: string; date: string;
  bullets: string[]; impact: { percent: number; label: string };
  glow?: boolean;
}) {
  return (
    <Reveal className={`card-base ${glow ? "glow-card" : ""}`}>
      <div style={{ padding: glow ? 36 : 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div className="font-mono" style={{ fontSize: "0.65rem", letterSpacing: "0.18em", color: "var(--accent-primary)", textTransform: "uppercase" }}>
              {company}
            </div>
            <h3 className="font-display" style={{ fontWeight: 700, fontSize: glow ? "1.4rem" : "1.2rem", marginTop: 8, color: "var(--text-primary)" }}>
              {role}
            </h3>
          </div>
          <span className="font-mono" style={{ fontSize: "0.7rem", color: "var(--text-secondary)", border: "1px solid var(--border-subtle)", padding: "4px 10px", borderRadius: 4 }}>
            {date}
          </span>
        </div>
        <ul style={{ marginTop: 20, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
          {bullets.map((b, i) => (
            <li key={i} className="font-mono" style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6, display: "flex", gap: 12 }}>
              <span style={{ color: "var(--accent-primary)" }}>→</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <ImpactBar percent={impact.percent} label={impact.label} />
      </div>
    </Reveal>
  );
}

export function Experience() {
  return (
    <Section id="experience" label="/experience" number="01">
      <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 32 }}>
        <div style={{ position: "relative" }}>
          <div style={{ position: "sticky", top: 120, height: 400 }}>
            <div style={{ width: 1, height: "100%", background: "var(--border-active)", marginLeft: 8 }} />
            <div style={{ position: "absolute", top: 0, left: 4, width: 9, height: 9, borderRadius: "50%", background: "var(--accent-primary)", boxShadow: "var(--glow-strong)" }} />
            <div style={{ position: "absolute", top: 280, left: 4, width: 9, height: 9, borderRadius: "50%", background: "var(--accent-primary)", boxShadow: "var(--glow-strong)" }} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <Card
            glow
            company="AWS Bedrock"
            role="Software Developer — Data Plane"
            date="Present"
            bullets={[
              "Developer on the Bedrock Data Plane team working across AWS Textract and BDA Rekognition.",
              "Build and operate document and vision inference services running production traffic at AWS scale.",
              "Previously interned on the neighboring Bedrock Control Plane team before joining Data Plane full-time.",
            ]}
            impact={{ percent: 18, label: "Compute cost reduction" }}
          />
          <Card
            company="Spectrax Corp"
            role="ML Engineering Intern"
            date="Summer 2023"
            bullets={[
              "Built feature pipelines and forecasting models for time-series operational data.",
              "Improved short-horizon forecast accuracy by 12% over the existing baseline.",
              "Owned the eval harness and weekly model review cadence with stakeholders.",
            ]}
            impact={{ percent: 12, label: "Forecast accuracy lift" }}
          />
          <Card
            company="University Teaching"
            role="Data Science Teaching Assistant"
            date="2 semesters"
            bullets={[
              "TA for the undergraduate Data Science course, leading 2 sections end-to-end.",
              "Taught probability, statistical inference, regression, and the full ML modeling workflow.",
              "Held weekly office hours and built supplemental material — earned strong student reviews for depth and clarity.",
            ]}
            impact={{ percent: 100, label: "Course mastery" }}
          />
        </div>
      </div>
    </Section>
  );
}