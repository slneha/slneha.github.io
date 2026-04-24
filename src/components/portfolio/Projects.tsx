import { useMemo, useState } from "react";
import { Section } from "./Section";
import CircularGallery from "@/components/CircularGallery";

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

/* ---------- SVG shape generators (static markup for the tile texture) ---------- */

function scatterSVG() {
  let out = "";
  for (let i = 0; i < 28; i++) {
    const x = (i * 37) % 200;
    const y = ((i * 53) % 70) + 5;
    const r = 1.5 + (i % 3);
    const fill = i % 4 === 0 ? "#00E5C3" : "#FF7A1A";
    out += `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" opacity="0.85"/>`;
  }
  return out;
}

function barSVG() {
  const heights = [40, 65, 30, 55, 70, 45, 60, 35, 75, 50];
  return heights
    .map((h, i) => {
      const fill = i % 2 === 0 ? "#00E5C3" : "#FF7A1A";
      return `<rect x="${i * 20 + 4}" y="${80 - h}" width="12" height="${h}" fill="${fill}" opacity="0.8"/>`;
    })
    .join("");
}

function waveSVG() {
  const wave = (phase: number, amp: number) =>
    Array.from({ length: 80 })
      .map((_, i) => {
        const x = (i / 79) * 200;
        const y = 40 + Math.sin(i / 4 + phase) * amp;
        return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");
  let bars = "";
  for (let i = 0; i < 24; i++) {
    bars += `<rect x="${i * 8 + 2}" y="32" width="2" height="16" rx="1" fill="#00E5C3" opacity="0.45"/>`;
  }
  return `
    <path d="${wave(0, 18)}" stroke="#00E5C3" stroke-width="1.5" fill="none" opacity="0.95"/>
    <path d="${wave(1.5, 12)}" stroke="#FF7A1A" stroke-width="1" fill="none" opacity="0.6"/>
    ${bars}
  `;
}

function hexSVG() {
  return [20, 60, 100, 140, 180]
    .map((cx, i) => {
      const pts = Array.from({ length: 6 })
        .map((_, j) => {
          const a = (Math.PI / 3) * j;
          return `${cx + Math.cos(a) * 18},${40 + Math.sin(a) * 18}`;
        })
        .join(" ");
      const stroke = i % 2 ? "#00E5C3" : "#FF7A1A";
      return `<polygon points="${pts}" fill="none" stroke="${stroke}" stroke-width="1.2" opacity="0.85"/>`;
    })
    .join("");
}

function nodesSVG() {
  const nodes: [number, number][] = [
    [20, 20],
    [60, 60],
    [100, 25],
    [140, 55],
    [180, 30],
  ];
  let edges = "";
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const [x1, y1] = nodes[i];
      const [x2, y2] = nodes[j];
      edges += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#00E5C3" stroke-width="0.6" opacity="0.45"/>`;
    }
  }
  const pts = nodes
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#00E5C3"/>`)
    .join("");
  return edges + pts;
}

function shapeMarkup(kind: ShapeKind) {
  if (kind === "scatter") return scatterSVG();
  if (kind === "bar") return barSVG();
  if (kind === "wave") return waveSVG();
  if (kind === "hex") return hexSVG();
  return nodesSVG();
}

/* ---------- Build tile SVG → data URL ---------- */

const TILE_W = 1400;
const TILE_H = 1800;

function escapeXML(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapText(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > maxChars) {
      lines.push(cur.trim());
      cur = w;
      if (lines.length === maxLines - 1) break;
    } else {
      cur = (cur + " " + w).trim();
    }
  }
  if (cur && lines.length < maxLines) lines.push(cur.trim());
  if (lines.length === maxLines) {
    const remaining = words.slice(lines.join(" ").split(/\s+/).length).join(" ");
    if (remaining) lines[maxLines - 1] = lines[maxLines - 1].replace(/\.+$/, "") + "…";
  }
  return lines;
}

function buildCardSVG(p: Project): string {
  const titleLines = wrapText(p.title, 22, 2);
  const descLines = wrapText(p.desc, 38, 4);
  const tagSpacing = 22;
  let tagsX = 80;
  const tags = p.tags
    .map((t) => {
      const w = t.length * 14 + 36;
      const rect = `<rect x="${tagsX}" y="1480" width="${w}" height="46" rx="23" fill="none" stroke="#3a3a3a" stroke-width="1.5"/>
        <text x="${tagsX + w / 2}" y="1510" font-family="JetBrains Mono, monospace" font-size="22" fill="#a0a0a0" text-anchor="middle" letter-spacing="2">${escapeXML(t)}</text>`;
      tagsX += w + tagSpacing;
      return rect;
    })
    .join("");

  const badgeText = escapeXML(p.badge);
  const badgeWidth = badgeText.length * 16 + 60;

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${TILE_W} ${TILE_H}" width="${TILE_W}" height="${TILE_H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#161616"/>
      <stop offset="1" stop-color="#0e0e0e"/>
    </linearGradient>
    <linearGradient id="shapeBG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#00E5C3" stop-opacity="0.06"/>
      <stop offset="1" stop-color="#00E5C3" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${TILE_W}" height="${TILE_H}" rx="40" fill="url(#bg)" stroke="#262626" stroke-width="2"/>

  <!-- Shape area -->
  <rect x="80" y="100" width="${TILE_W - 160}" height="600" rx="20" fill="url(#shapeBG)"/>
  <g transform="translate(80, 200) scale(6.2, 4.0)">
    ${shapeMarkup(p.shape)}
  </g>

  <!-- Title -->
  ${titleLines
    .map(
      (line, i) =>
        `<text x="80" y="${900 + i * 110}" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="92" fill="#f5f5f5">${escapeXML(line)}</text>`,
    )
    .join("")}

  <!-- Description -->
  ${descLines
    .map(
      (line, i) =>
        `<text x="80" y="${1180 + i * 56}" font-family="JetBrains Mono, monospace" font-size="38" fill="#a8a8a8">${escapeXML(line)}</text>`,
    )
    .join("")}

  <!-- Tags -->
  ${tags}

  <!-- Badge -->
  <g transform="translate(${TILE_W - 80 - badgeWidth}, 1620)">
    <rect width="${badgeWidth}" height="64" rx="6" fill="#FF7A1A"/>
    <text x="${badgeWidth / 2}" y="42" font-family="JetBrains Mono, monospace" font-size="32" font-weight="500" fill="#1a0d00" text-anchor="middle">${badgeText}</text>
  </g>
</svg>`.trim();
}

function svgToDataURL(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const filters: Cat[] = ["ALL", "ML", "CLOUD", "NLP", "SECURITY"];

export function Projects() {
  const [active, setActive] = useState<Cat>("ALL");

  const items = useMemo(() => {
    const filtered = projects.filter(
      (p) =>
        active === "ALL" || p.cats.includes(active as Exclude<Cat, "ALL">),
    );
    return filtered.map((p) => ({
      image: svgToDataURL(buildCardSVG(p)),
      text: "",
    }));
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
        style={{
          marginInline: "calc(50% - 50vw)",
          height: 640,
          position: "relative",
        }}
      >
        {items.length > 0 ? (
          <CircularGallery
            key={active}
            items={items}
            bend={2.5}
            textColor="#ffffff"
            borderRadius={0.04}
            scrollEase={0.05}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "var(--text-dim)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
            }}
          >
            No projects in this category.
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 16,
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          color: "var(--text-dim)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        <span>← drag</span>
        <span style={{ color: "var(--accent-primary)" }}>● {items.length} systems</span>
        <span>scroll →</span>
      </div>
    </Section>
  );
}
