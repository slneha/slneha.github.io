import { Suspense, lazy } from "react";

const TerminalCube = lazy(() => import("@/components/portfolio/TerminalCube"));

const headline = [
  { word: "Neha", accent: false },
  { word: "Senthil", accent: false, br: true },
  { word: "builds", accent: false },
  { word: "ML", accent: true },
  { word: "systems", accent: true, br: true },
  { word: "that", accent: false },
  { word: "think", accent: false },
  { word: "faster", accent: false, br: true },
  { word: "than", accent: false },
  { word: "the", accent: false },
  { word: "cloud", accent: false, br: true },
  { word: "can", accent: false },
  { word: "catch", accent: false },
  { word: "up.", accent: false },
];

export function Hero() {
  return (
    <section
      id="home"
      className="hero-section"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "0 8vw",
        overflow: "hidden",
      }}
    >
      <div className="mesh-bg" style={{ position: "absolute", inset: 0, zIndex: 0 }} />

      {/* Interactive 3D terminal cube — drag to rotate */}
      <div
        className="hero-cube"
        style={{
          position: "absolute",
          right: "-4vw",
          top: 0,
          bottom: 0,
          width: "min(60vw, 760px)",
          zIndex: 1,
          pointerEvents: "auto",
        }}
      >
        <Suspense fallback={null}>
          <TerminalCube />
        </Suspense>
      </div>

      {/* Faint SVG neural net overlay */}
      <svg
        viewBox="0 0 600 600"
        className="hero-net"
        style={{
          position: "absolute",
          right: "-5vw",
          top: "50%",
          transform: "translateY(-50%)",
          width: "45vw",
          maxWidth: 700,
          opacity: 0.18,
          zIndex: 0,
          pointerEvents: "none",
        }}
        aria-hidden
      >
        <g stroke="var(--text-dim)" strokeWidth="0.5" fill="none">
          {/* edges */}
          {[100, 220, 340, 460].map((x1) =>
            [80, 200, 320, 440, 560].flatMap((y1) =>
              [80, 200, 320, 440, 560].map((y2) => (
                <line key={`${x1}-${y1}-${y2}`} x1={x1} y1={y1} x2={x1 + 120} y2={y2} />
              )),
            ),
          )}
        </g>
        <g fill="var(--accent-primary)">
          {[100, 220, 340, 460, 580].flatMap((x) =>
            [80, 200, 320, 440, 560].map((y) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="3" opacity="0.6" />
            )),
          )}
        </g>
      </svg>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100 }}>
        {/* section number */}
        <div
          aria-hidden
          className="font-display"
          style={{
            position: "absolute",
            top: "-6vh",
            right: "-2vw",
            fontSize: "clamp(5rem, 12vw, 11rem)",
            fontWeight: 800,
            color: "var(--text-dim)",
            opacity: 0.25,
            letterSpacing: "-0.05em",
            zIndex: -1,
          }}
        >
          00
        </div>

        <div className="font-mono" style={{ color: "var(--accent-primary)", fontSize: "0.7rem", letterSpacing: "0.2em", marginBottom: 32 }}>
          ── INTELLIGENCE, MADE VISIBLE
        </div>

        <h1
          className="font-display"
          style={{
            fontSize: "var(--type-hero)",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "var(--tracking-tight)",
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          {headline.map((w, i) => (
            <span key={i}>
              <span
                className="word-reveal"
                style={{
                  animationDelay: `${500 + i * 80}ms`,
                  color: w.accent ? "var(--accent-primary)" : undefined,
                  marginRight: "0.25em",
                }}
              >
                {w.word}
              </span>
              {w.br && <br />}
            </span>
          ))}
        </h1>

        <p
          className="font-mono word-reveal hero-tagline"
          style={{
            animationDelay: "1500ms",
            marginTop: 36,
            fontSize: "0.85rem",
            letterSpacing: "0.08em",
            color: "var(--text-secondary)",
          }}
        >
          Duke MSCS · AWS ML Specialist · Amazon SDE · Published Researcher
        </p>

        <div className="hero-chips" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 36 }}>
          {[
            ["01", "15-20% compute cost reduction @ Amazon"],
            ["02", "72% prediction accuracy · UFC ML model"],
            ["03", "2x peer-reviewed publications"],
          ].map(([num, text], i) => (
            <span
              key={num}
              className="chip word-reveal"
              style={{ animationDelay: `${1700 + i * 120}ms` }}
            >
              <span className="chip-num">[{num}]</span>
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="scroll-indicator"
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1,
          height: 60,
          background: "rgba(0,229,195,0.2)",
          overflow: "hidden",
        }}
        aria-hidden
      >
        <div
          className="scroll-dot"
          style={{
            width: 1,
            height: 12,
            background: "var(--accent-primary)",
            boxShadow: "var(--glow-strong)",
          }}
        />
      </div>
    </section>
  );
}