import { useEffect, useRef, useState } from "react";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { CometCard } from "@/components/ui/comet-card";

type Cat = "ALL" | "ML" | "CLOUD" | "NLP" | "SECURITY";
type ShapeKind = "scatter" | "bar" | "wave" | "hex" | "nodes";

type Project = {
  title: string;
  desc: string;
  cats: Exclude<Cat, "ALL">[];
  tags: string[];
  badge: string;
  shape: ShapeKind;
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
    shape: "wave",
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

/* ---------- Animated shapes ---------- */

function ScatterShape() {
  // 28 dots that twinkle on independent intervals via CSS vars
  return (
    <svg viewBox="0 0 200 80" width="100%" height="100" aria-hidden>
      {Array.from({ length: 28 }).map((_, i) => {
        const x = (i * 37) % 200;
        const y = ((i * 53) % 70) + 5;
        const r = 1.5 + (i % 3);
        const dur = 1.6 + (i % 5) * 0.4;
        const delay = (i % 7) * 0.15;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill={i % 4 === 0 ? "var(--accent-primary)" : "var(--accent-secondary)"}
            style={{
              animation: `twinkle ${dur}s ease-in-out ${delay}s infinite`,
              transformOrigin: `${x}px ${y}px`,
            }}
          />
        );
      })}
    </svg>
  );
}

function BarShape() {
  // Bars whose heights cycle; each bar has its own staggered keyframe
  const heights = [40, 65, 30, 55, 70, 45, 60, 35, 75, 50];
  return (
    <svg viewBox="0 0 200 80" width="100%" height="100" aria-hidden>
      {heights.map((h, i) => (
        <rect
          key={i}
          x={i * 20 + 4}
          width="12"
          fill={i % 2 === 0 ? "var(--accent-primary)" : "var(--accent-secondary)"}
          opacity="0.8"
          style={{
            animation: `barPulse 1.8s ease-in-out ${i * 0.12}s infinite`,
            transformOrigin: "center bottom",
            transformBox: "fill-box",
          }}
          y={80 - h}
          height={h}
        />
      ))}
    </svg>
  );
}

function WaveShape() {
  // Two overlapping sine waves drifting horizontally — works for audio + TTS vibe
  const wave = (phase: number, amp: number) =>
    Array.from({ length: 80 })
      .map((_, i) => {
        const x = (i / 79) * 200;
        const y = 40 + Math.sin(i / 4 + phase) * amp;
        return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");

  // Vertical voice-bars overlay for a recorder feel
  const bars = Array.from({ length: 24 });

  return (
    <svg viewBox="0 0 200 80" width="100%" height="100" aria-hidden>
      <path
        d={wave(0, 18)}
        stroke="var(--accent-primary)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.9"
        style={{ animation: "waveDrift 3.2s linear infinite" }}
      />
      <path
        d={wave(1.5, 12)}
        stroke="var(--accent-secondary)"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
        style={{ animation: "waveDrift 4.5s linear infinite reverse" }}
      />
      {bars.map((_, i) => (
        <rect
          key={i}
          x={i * 8 + 2}
          width="2"
          fill="var(--accent-primary)"
          opacity="0.35"
          style={{
            animation: `voiceBar 1.${(i % 9) + 1}s ease-in-out ${i * 0.07}s infinite`,
            transformOrigin: "center center",
            transformBox: "fill-box",
          }}
          y="32"
          height="16"
          rx="1"
        />
      ))}
    </svg>
  );
}

function HexShape() {
  // Slowly rotating hex chain
  return (
    <svg viewBox="0 0 200 80" width="100%" height="100" aria-hidden>
      {[20, 60, 100, 140, 180].map((cx, i) => {
        const pts = Array.from({ length: 6 })
          .map((_, j) => {
            const a = (Math.PI / 3) * j;
            return `${cx + Math.cos(a) * 18},${40 + Math.sin(a) * 18}`;
          })
          .join(" ");
        return (
          <polygon
            key={cx}
            points={pts}
            fill="none"
            stroke={i % 2 ? "var(--accent-primary)" : "var(--accent-secondary)"}
            strokeWidth="1.2"
            opacity="0.8"
            style={{
              animation: `hexSpin ${4 + i}s linear ${i % 2 ? "" : "reverse"} infinite`,
              transformOrigin: `${cx}px 40px`,
              transformBox: "fill-box",
            }}
          />
        );
      })}
    </svg>
  );
}

function NodesShape() {
  // Connected nodes pulsing + connection lines that brighten in sequence
  const nodes: [number, number][] = [
    [20, 20],
    [60, 60],
    [100, 25],
    [140, 55],
    [180, 30],
  ];
  const edges: [number, number][] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      edges.push([i, j]);
    }
  }
  return (
    <svg viewBox="0 0 200 80" width="100%" height="100" aria-hidden>
      {edges.map(([i, j], k) => {
        const [x1, y1] = nodes[i];
        const [x2, y2] = nodes[j];
        return (
          <line
            key={k}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--accent-primary)"
            strokeWidth="0.6"
            opacity="0.4"
            style={{
              animation: `edgeGlow 3s ease-in-out ${k * 0.2}s infinite`,
            }}
          />
        );
      })}
      {nodes.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="5"
          fill="var(--accent-primary)"
          style={{
            animation: `nodePulse 1.6s ease-in-out ${i * 0.18}s infinite`,
            transformOrigin: `${x}px ${y}px`,
            transformBox: "fill-box",
          }}
        />
      ))}
    </svg>
  );
}

function Shape({ kind }: { kind: ShapeKind }) {
  if (kind === "scatter") return <ScatterShape />;
  if (kind === "bar") return <BarShape />;
  if (kind === "wave") return <WaveShape />;
  if (kind === "hex") return <HexShape />;
  return <NodesShape />;
}

const filters: Cat[] = ["ALL", "ML", "CLOUD", "NLP", "SECURITY"];

export function Projects() {
  const [active, setActive] = useState<Cat>("ALL");
  const visible = (p: Project) =>
    active === "ALL" || p.cats.includes(active as Exclude<Cat, "ALL">);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const rafRef = useRef<number | null>(null);

  // Curve the cards along an arc based on their distance from viewport center.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const apply = () => {
      const sRect = scroller.getBoundingClientRect();
      const center = sRect.left + sRect.width / 2;
      const half = sRect.width / 2 || 1;
      cardRefs.current.forEach((card) => {
        if (!card) return;
        const cRect = card.getBoundingClientRect();
        const cCenter = cRect.left + cRect.width / 2;
        const t = Math.max(-1.2, Math.min(1.2, (cCenter - center) / half));
        // Arc: drop & fade outer cards, tilt them inward
        const lift = -Math.cos(t * (Math.PI / 2)) * 26 + 26; // 0 at center, ~26 at edges
        const tilt = t * 14; // rotateY in deg
        const dim = 1 - Math.min(0.5, Math.abs(t) * 0.45);
        card.style.setProperty("--curve-y", `${lift}px`);
        card.style.setProperty("--curve-rot", `${tilt}deg`);
        card.style.setProperty("--curve-opacity", `${dim}`);
      });
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        apply();
      });
    };

    apply();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", apply);

    // Horizontal wheel routing: only intercept when the user signals horizontal intent
    // (shift+wheel, trackpad horizontal). Vertical wheel passes through to page scroll.
    const onWheel = (e: WheelEvent) => {
      const horizontal = e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (!horizontal) return;
      e.preventDefault();
      scroller.scrollLeft += e.deltaX || e.deltaY;
    };
    scroller.addEventListener("wheel", onWheel, { passive: false });

    // Click-and-drag to scroll
    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      isDown = true;
      startX = e.clientX;
      startScroll = scroller.scrollLeft;
      scroller.setPointerCapture(e.pointerId);
      scroller.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!isDown) return;
      scroller.scrollLeft = startScroll - (e.clientX - startX);
    };
    const onUp = (e: PointerEvent) => {
      if (!isDown) return;
      isDown = false;
      scroller.releasePointerCapture(e.pointerId);
      scroller.style.cursor = "grab";
    };
    scroller.addEventListener("pointerdown", onDown);
    scroller.addEventListener("pointermove", onMove);
    scroller.addEventListener("pointerup", onUp);
    scroller.addEventListener("pointercancel", onUp);

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", apply);
      scroller.removeEventListener("wheel", onWheel);
      scroller.removeEventListener("pointerdown", onDown);
      scroller.removeEventListener("pointermove", onMove);
      scroller.removeEventListener("pointerup", onUp);
      scroller.removeEventListener("pointercancel", onUp);
    };
  }, [active]);

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
        ref={scrollerRef}
        className="curved-scroller"
        style={{
          marginInline: "calc(50% - 50vw)",
          paddingInline: "calc(50vw - 180px)",
          paddingBlock: "60px 40px",
          overflowX: "auto",
          overflowY: "hidden",
          display: "flex",
          gap: 32,
          scrollSnapType: "x mandatory",
          cursor: "grab",
          perspective: "1400px",
        }}
      >
        {projects.map((p, i) => {
          const show = visible(p);
          return (
            <div
              key={p.title}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="curved-card"
              style={{
                flex: "0 0 320px",
                scrollSnapAlign: "center",
                transformStyle: "preserve-3d",
                transform:
                  "translateY(var(--curve-y, 0px)) rotateY(var(--curve-rot, 0deg))",
                opacity: `var(--curve-opacity, 1)`,
                transition:
                  "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease",
                pointerEvents: show ? "auto" : "none",
                filter: show ? "none" : "grayscale(0.8)",
              }}
            >
              <Reveal delay={i * 60}>
                <div
                  style={{
                    opacity: show ? 1 : 0.15,
                    transition: "opacity 0.3s ease",
                    height: "100%",
                  }}
                >
                  <CometCard rotateDepth={14} translateDepth={14} className="h-full">
                  <div
                    style={{
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: 16,
                      padding: 24,
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                      height: "100%",
                      minHeight: 340,
                    }}
                  >
                    <div
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0,229,195,0.04), rgba(0,229,195,0.0))",
                        borderRadius: 10,
                        padding: "12px 8px",
                      }}
                    >
                      <Shape kind={p.shape} />
                    </div>
                    <h3
                      className="font-display"
                      style={{
                        fontSize: "var(--type-card-title)",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        margin: 0,
                      }}
                    >
                      {p.title}
                    </h3>
                    <p
                      className="font-mono"
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.5,
                        margin: 0,
                      }}
                    >
                      {p.desc}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.65rem",
                            padding: "3px 9px",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: 999,
                            color: "var(--text-secondary)",
                            letterSpacing: "0.08em",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: "auto",
                      }}
                    >
                      <span
                        style={{
                          background: "var(--accent-warm)",
                          color: "#1a0d00",
                          fontFamily: "var(--font-data)",
                          fontSize: "0.7rem",
                          padding: "4px 10px",
                          borderRadius: 3,
                          fontWeight: 500,
                        }}
                      >
                        {p.badge}
                      </span>
                    </div>
                  </div>
                  </CometCard>
                </div>
              </Reveal>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 8,
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          color: "var(--text-dim)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        <span>← drag</span>
        <span style={{ color: "var(--accent-primary)" }}>● {projects.length} systems</span>
        <span>scroll →</span>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        @keyframes barPulse {
          0%, 100% { transform: scaleY(0.55); }
          50% { transform: scaleY(1.1); }
        }
        @keyframes waveDrift {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25px); }
        }
        @keyframes voiceBar {
          0%, 100% { transform: scaleY(0.3); opacity: 0.25; }
          50% { transform: scaleY(2.2); opacity: 0.9; }
        }
        @keyframes hexSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes nodePulse {
          0%, 100% { transform: scale(0.85); opacity: 0.7; }
          50% { transform: scale(1.4); opacity: 1; }
        }
        @keyframes edgeGlow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.85; }
        }
      `}</style>
    </Section>
  );
}
