import { useMemo } from "react";
import { Section } from "./Section";
import CircularGallery from "@/components/CircularGallery";

type Project = {
  title: string;
  desc: string;
  tags: string[];
  badge: string;
  shape: "scatter" | "bar" | "wave" | "hex" | "nodes";
};

const projects: Project[] = [
  {
    title: "Backdoor Attacks · CL",
    desc: "Studied trigger persistence and forgetting under EWC.",
    tags: ["PyTorch", "EWC", "Security"],
    badge: "18% forgetting ↓",
    shape: "scatter",
  },
  {
    title: "UFC Fight Outcome",
    desc: "Engineered fighter-form features over 20 years of bout data.",
    tags: ["Scikit-learn", "Feature Eng."],
    badge: "72% accuracy",
    shape: "bar",
  },
  {
    title: "Lip Reading Multi-Modal",
    desc: "Visual-audio fusion for silent speech transcription.",
    tags: ["ResNet", "NLP", "CV"],
    badge: "20% accuracy ↑",
    shape: "wave",
  },
  {
    title: "AWS Serverless TTS",
    desc: "Event-driven text-to-speech pipeline. Cold-start <400ms.",
    tags: ["AWS SAM", "Lambda", "DynamoDB"],
    badge: "40% overhead ↓",
    shape: "hex",
  },
  {
    title: "Spotify Recommendation",
    desc: "Hybrid collaborative + content recommender on Streamlit + AWS.",
    tags: ["AWS", "Streamlit", "Hybrid"],
    badge: "15% engagement ↑",
    shape: "nodes",
  },
];

const C = "#00e5c3";
const CS = "#6af0c8";
const WARM = "#f5a623";
const BG = "#0d1117";
const TEXT = "#e8f0f5";
const MUTED = "#7a8fa6";

function shapeSVG(kind: Project["shape"]): string {
  if (kind === "scatter") {
    return Array.from({ length: 28 })
      .map((_, i) => {
        const x = (i * 37) % 200;
        const y = ((i * 53) % 70) + 5;
        const r = 1.5 + (i % 3);
        const fill = i % 4 === 0 ? C : CS;
        const op = 0.4 + (i % 4) * 0.15;
        return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" opacity="${op}"/>`;
      })
      .join("");
  }
  if (kind === "bar") {
    return [40, 65, 30, 55, 70, 45, 60, 35, 75, 50]
      .map((h, i) => `<rect x="${i * 20 + 4}" y="${80 - h}" width="12" height="${h}" fill="${i % 2 === 0 ? C : CS}" opacity="0.7"/>`)
      .join("");
  }
  if (kind === "wave") {
    const d = Array.from({ length: 60 })
      .map((_, i) => {
        const x = (i / 59) * 200;
        const y = 40 + Math.sin(i / 3) * (15 + Math.sin(i / 7) * 10);
        return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");
    return `<path d="${d}" stroke="${C}" stroke-width="1.5" fill="none"/>`;
  }
  if (kind === "hex") {
    return [20, 60, 100, 140, 180]
      .map((cx, i) => {
        const pts = Array.from({ length: 6 })
          .map((_, j) => {
            const a = (Math.PI / 3) * j;
            return `${(cx + Math.cos(a) * 18).toFixed(2)},${(40 + Math.sin(a) * 18).toFixed(2)}`;
          })
          .join(" ");
        return `<polygon points="${pts}" fill="none" stroke="${i % 2 ? C : CS}" stroke-width="1.2" opacity="0.7"/>`;
      })
      .join("");
  }
  // nodes
  const nodes = [[20, 20], [60, 60], [100, 25], [140, 55], [180, 30]];
  const lines = nodes
    .flatMap(([x, y], i) => nodes.slice(i + 1).map(([x2, y2]) => `<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="${C}" stroke-width="0.5" opacity="0.4"/>`))
    .join("");
  const dots = nodes.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${C}" opacity="0.8"/>`).join("");
  return lines + dots;
}

function escapeXML(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildCardSVG(p: Project, index: number): string {
  // Render at 2x for a sharper texture once OGL builds mipmaps.
  const W = 1400;
  const H = 1800;
  const shapeMarkup = shapeSVG(p.shape);
  const tagsMarkup = p.tags
    .map((t, i) => {
      const x = 120 + i * 320;
      return `
        <g transform="translate(${x}, 1440)">
          <rect x="0" y="0" rx="999" ry="999" width="300" height="76" fill="none" stroke="rgba(0,229,195,0.25)" stroke-width="2"/>
          <text x="150" y="50" font-family="'DM Mono', monospace" font-size="28" fill="${MUTED}" text-anchor="middle" letter-spacing="2.4">${escapeXML(t)}</text>
        </g>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    <defs>
      <linearGradient id="g${index}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0f1820"/>
        <stop offset="100%" stop-color="#080c10"/>
      </linearGradient>
      <radialGradient id="glow${index}" cx="0.5" cy="0.3" r="0.6">
        <stop offset="0%" stop-color="rgba(0,229,195,0.12)"/>
        <stop offset="100%" stop-color="rgba(0,229,195,0)"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" rx="48" fill="url(#g${index})"/>
    <rect width="${W}" height="${H}" rx="48" fill="url(#glow${index})"/>
    <rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="46" fill="none" stroke="rgba(0,229,195,0.25)" stroke-width="2"/>

    <g transform="translate(120, 200) scale(5.8, 6.8)">
      ${shapeMarkup}
    </g>

    <text x="120" y="1080" font-family="'Syne', sans-serif" font-weight="800" font-size="96" fill="${TEXT}" letter-spacing="-2">
      ${escapeXML(p.title)}
    </text>

    <foreignObject x="120" y="1140" width="${W - 240}" height="260">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:'DM Mono',monospace;font-size:40px;color:${MUTED};line-height:1.55;letter-spacing:0.02em">
        ${escapeXML(p.desc)}
      </div>
    </foreignObject>

    ${tagsMarkup}

    <g transform="translate(${W - 560}, 1640)">
      <rect x="0" y="0" rx="12" ry="12" width="440" height="84" fill="${WARM}"/>
      <text x="220" y="56" font-family="'Syne Mono', monospace" font-size="36" fill="#1a0d00" text-anchor="middle" font-weight="600">${escapeXML(p.badge)}</text>
    </g>
  </svg>`;
}

function svgToDataURI(svg: string): string {
  // Use base64 to safely embed any chars
  const b64 = typeof window === "undefined"
    ? Buffer.from(svg).toString("base64")
    : window.btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${b64}`;
}

export function Projects() {
  const items = useMemo(
    () =>
      projects.map((p, i) => ({
        image: svgToDataURI(buildCardSVG(p, i)),
        text: "",
      })),
    [],
  );

  return (
    <Section id="projects" label="/projects" number="02" alt>
      <p
        className="font-mono"
        style={{
          fontSize: "0.8rem",
          color: "var(--text-secondary)",
          maxWidth: 560,
          marginBottom: 32,
          letterSpacing: "0.04em",
          lineHeight: 1.6,
        }}
      >
        Drag, scroll, or swipe to traverse the orbit. Each tile is a deployed system, a paper, or an experiment that shipped.
      </p>

      <div
        style={{
          height: "min(640px, 75vh)",
          position: "relative",
          marginInline: "calc(50% - 50vw)",
          width: "100vw",
        }}
      >
        <CircularGallery
          items={items}
          bend={3}
          textColor="#e8f0f5"
          borderRadius={0.06}
          scrollSpeed={2}
          scrollEase={0.05}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 24,
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
    </Section>
  );
}
