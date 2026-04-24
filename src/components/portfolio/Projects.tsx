import { useMemo, useState } from "react";
import { Section } from "./Section";
import CircularGallery from "@/components/CircularGallery";

/* Tile dimensions (logical px in the baked SVG). */
const TILE_W = 1400;
const TILE_H = 1800;

/* Shape area inside the tile (must match the <rect> below). */
const SHAPE_X = 80;
const SHAPE_Y = 100;
const SHAPE_W = TILE_W - 160;    // 1240
const SHAPE_H = 640;

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

/* ---------- Static SVG shape generators ----------
 * Each generator renders into a 200×100 coordinate system, embedded in a
 * nested <svg viewBox="0 0 200 100"> so it scales uniformly. Colors come
 * from the design tokens: teal #00e5c3 + amber #f5a623.
 */
const TEAL = "#00e5c3";
const TEAL_SOFT = "#6af0c8";
const AMBER = "#f5a623";

function scatterSVG() {
  let out = "";
  for (let i = 0; i < 36; i++) {
    const x = ((i * 37) % 200) + ((i * 13) % 7) - 3;
    const y = ((i * 53) % 80) + 10;
    const r = 1.5 + (i % 3) * 0.8;
    const fill = i % 5 === 0 ? AMBER : i % 2 === 0 ? TEAL : TEAL_SOFT;
    out += `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" opacity="${0.55 + (i % 4) * 0.12}"/>`;
  }
  return out;
}

function barSVG() {
  const heights = [38, 62, 28, 54, 70, 44, 60, 34, 76, 50, 66, 40];
  const w = 12;
  const gap = 4;
  const total = heights.length * (w + gap) - gap;
  const offsetX = (200 - total) / 2;
  return heights
    .map((h, i) => {
      const fill = i % 3 === 0 ? AMBER : TEAL;
      const opacity = i % 3 === 0 ? 0.95 : 0.85;
      return `<rect x="${offsetX + i * (w + gap)}" y="${95 - h}" width="${w}" height="${h}" rx="1.5" fill="${fill}" opacity="${opacity}"/>`;
    })
    .join("");
}

function waveSVG() {
  const wave = (phase: number, amp: number, yc: number) =>
    Array.from({ length: 100 })
      .map((_, i) => {
        const x = (i / 99) * 200;
        const y = yc + Math.sin(i / 5 + phase) * amp;
        return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");
  return `
    <path d="${wave(0, 22, 50)}" stroke="${TEAL}" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
    <path d="${wave(1.6, 14, 50)}" stroke="${TEAL_SOFT}" stroke-width="1.5" fill="none" opacity="0.7" stroke-linecap="round"/>
    <path d="${wave(3.1, 8, 50)}" stroke="${AMBER}" stroke-width="1.2" fill="none" opacity="0.55" stroke-linecap="round"/>
  `;
}

function hexSVG() {
  return [25, 65, 105, 145, 185]
    .map((cx, i) => {
      const pts = Array.from({ length: 6 })
        .map((_, j) => {
          const a = (Math.PI / 3) * j - Math.PI / 6;
          return `${cx + Math.cos(a) * 22},${50 + Math.sin(a) * 22}`;
        })
        .join(" ");
      const stroke = i === 2 ? AMBER : TEAL;
      const sw = i === 2 ? 2 : 1.4;
      return `<polygon points="${pts}" fill="none" stroke="${stroke}" stroke-width="${sw}" opacity="${0.6 + (i % 2) * 0.3}"/>`;
    })
    .join("");
}

function nodesSVG() {
  const nodes: [number, number][] = [
    [22, 28],
    [62, 70],
    [104, 32],
    [148, 64],
    [184, 24],
  ];
  let edges = "";
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const [x1, y1] = nodes[i];
      const [x2, y2] = nodes[j];
      edges += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${TEAL}" stroke-width="0.8" opacity="0.4"/>`;
    }
  }
  const pts = nodes
    .map(
      ([x, y], i) =>
        `<circle cx="${x}" cy="${y}" r="${5 + (i % 2) * 1.5}" fill="${i === 2 ? AMBER : TEAL}" opacity="0.95"/>` +
        `<circle cx="${x}" cy="${y}" r="${10 + (i % 2) * 2}" fill="none" stroke="${i === 2 ? AMBER : TEAL}" stroke-width="0.8" opacity="0.35"/>`,
    )
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
  const titleLines = wrapText(p.title, 20, 2);
  const descLines = wrapText(p.desc, 36, 4);

  // Tags
  const tagSpacing = 24;
  let tagsX = 90;
  const tags = p.tags
    .map((t) => {
      const w = t.length * 18 + 60;
      const rect = `<rect x="${tagsX}" y="1500" width="${w}" height="60" rx="30" fill="none" stroke="rgba(0,229,195,0.35)" stroke-width="2"/>
        <text x="${tagsX + w / 2}" y="1540" font-family="DM Mono, monospace" font-size="28" fill="${TEAL_SOFT}" text-anchor="middle" letter-spacing="3">${escapeXML(t).toUpperCase()}</text>`;
      tagsX += w + tagSpacing;
      return rect;
    })
    .join("");

  const badgeText = escapeXML(p.badge);
  const badgeWidth = badgeText.length * 22 + 80;

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${TILE_W} ${TILE_H}" width="${TILE_W}" height="${TILE_H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0d1117"/>
      <stop offset="1" stop-color="#080c10"/>
    </linearGradient>
    <linearGradient id="shapeBG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#00e5c3" stop-opacity="0.10"/>
      <stop offset="1" stop-color="#00e5c3" stop-opacity="0.0"/>
    </linearGradient>
    <linearGradient id="badgeBG" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#f5a623"/>
      <stop offset="1" stop-color="#ffc15a"/>
    </linearGradient>
  </defs>

  <!-- Card body -->
  <rect width="${TILE_W}" height="${TILE_H}" rx="48" fill="url(#bg)" stroke="rgba(0,229,195,0.18)" stroke-width="2"/>

  <!-- Shape area -->
  <rect x="${SHAPE_X}" y="${SHAPE_Y}" width="${SHAPE_W}" height="${SHAPE_H}" rx="24" fill="url(#shapeBG)" stroke="rgba(0,229,195,0.12)" stroke-width="1.5"/>
  <svg x="${SHAPE_X + 40}" y="${SHAPE_Y + 40}" width="${SHAPE_W - 80}" height="${SHAPE_H - 80}" viewBox="0 0 200 100" preserveAspectRatio="xMidYMid meet">
    ${shapeMarkup(p.shape)}
  </svg>

  <!-- Section label above title -->
  <line x1="80" y1="850" x2="160" y2="850" stroke="${TEAL}" stroke-width="3"/>
  <text x="180" y="858" font-family="DM Mono, monospace" font-size="26" fill="${TEAL}" letter-spacing="4">PROJECT</text>

  <!-- Title -->
  ${titleLines
    .map(
      (line, i) =>
        `<text x="80" y="${950 + i * 120}" font-family="Syne, sans-serif" font-weight="800" font-size="100" fill="#e8f0f5" letter-spacing="-2">${escapeXML(line)}</text>`,
    )
    .join("")}

  <!-- Description -->
  ${descLines
    .map(
      (line, i) =>
        `<text x="80" y="${1240 + i * 58}" font-family="DM Mono, monospace" font-size="42" fill="#7a8fa6">${escapeXML(line)}</text>`,
    )
    .join("")}

  <!-- Tags -->
  ${tags}

  <!-- Badge -->
  <g transform="translate(${TILE_W - 90 - badgeWidth}, 1640)">
    <rect width="${badgeWidth}" height="80" rx="8" fill="url(#badgeBG)"/>
    <text x="${badgeWidth / 2}" y="54" font-family="Syne Mono, monospace" font-size="40" font-weight="700" fill="#1a0d00" text-anchor="middle">${badgeText}</text>
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
