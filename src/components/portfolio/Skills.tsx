import { useEffect, useRef, useState } from "react";
import { Section } from "./Section";

const lines: { label: string; items: string; tag: string; tagColor: string }[] = [
  { label: "ML/DL", items: "TensorFlow · PyTorch · Keras · CUDA", tag: "[LOADED]", tagColor: "var(--accent-primary)" },
  { label: "NLP/CV", items: "BERT · GPT · ResNet · OpenCV", tag: "[LOADED]", tagColor: "var(--accent-primary)" },
  { label: "Cloud", items: "AWS · GCP · Azure · SageMaker · Lambda", tag: "[LOADED]", tagColor: "var(--accent-primary)" },
  { label: "Languages", items: "Python · Java · SQL · C++ · R · Bash", tag: "[LOADED]", tagColor: "var(--accent-primary)" },
  { label: "Tools", items: "Git · Streamlit · Tableau · Power BI", tag: "[LOADED]", tagColor: "var(--accent-primary)" },
  { label: "Certs", items: "AWS ML Specialty · Solutions Architect", tag: "[VERIFIED ✓]", tagColor: "var(--accent-warm)" },
];

function pad(s: string, n: number) {
  if (s.length >= n) return s;
  return s + " " + ".".repeat(Math.max(0, n - s.length - 2)) + " ";
}

export function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          let i = 0;
          const tick = () => {
            i++;
            setShown(i);
            if (i < lines.length + 2) setTimeout(tick, 150);
          };
          setTimeout(tick, 200);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Section id="stack" label="/stack" number="04" alt>
      <div
        ref={ref}
        className="grid-bg"
        style={{
          padding: "40px clamp(20px, 4vw, 48px)",
          background: "var(--bg-primary)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 4,
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(0.7rem, 1.1vw, 0.85rem)",
          color: "var(--text-secondary)",
          lineHeight: 2,
          minHeight: 360,
          overflowX: "auto",
        }}
      >
        {shown >= 1 && (
          <div style={{ color: "var(--text-secondary)" }}>
            <span style={{ color: "var(--accent-primary)" }}>&gt;</span> initializing stack inventory...
          </div>
        )}
        {lines.map((ln, i) => (
          shown >= i + 2 && (
            <div key={ln.label} style={{ whiteSpace: "pre", display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <span>
                <span style={{ color: "var(--accent-primary)" }}>&gt;</span> {pad(ln.label, 18)}
                <span style={{ color: "var(--text-primary)" }}>{ln.items}</span>
              </span>
              <span style={{ color: ln.tagColor }}>{ln.tag}</span>
            </div>
          )
        ))}
        {shown >= lines.length + 2 && (
          <div style={{ marginTop: 16 }}>
            <span style={{ color: "var(--accent-primary)" }}>&gt;</span> status: <span style={{ color: "var(--accent-primary)" }}>FULLY OPERATIONAL</span>
          </div>
        )}
      </div>
    </Section>
  );
}