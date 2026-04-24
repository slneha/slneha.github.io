import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ----------------------------- Face content ----------------------------- */

type FaceContent = {
  prompt: string;
  // Lines that get typed out one char at a time. Each line has a class for color.
  lines: { text: string; kind: "cmd" | "out" | "ok" | "warn" | "dim" }[];
};

const FACES: FaceContent[] = [
  {
    prompt: "neha@duke ~ %",
    lines: [
      { text: "$ python train.py --model resnet50 --epochs 20", kind: "cmd" },
      { text: "Loading dataset… 60,000 samples", kind: "out" },
      { text: "Epoch 01/20  loss=2.301  acc=0.114", kind: "out" },
      { text: "Epoch 05/20  loss=1.842  acc=0.467", kind: "out" },
      { text: "Epoch 10/20  loss=0.913  acc=0.732", kind: "out" },
      { text: "Epoch 15/20  loss=0.421  acc=0.881", kind: "out" },
      { text: "Epoch 20/20  loss=0.184  acc=0.946", kind: "ok" },
      { text: "✓ checkpoint saved → s3://nls/models/v3", kind: "ok" },
    ],
  },
  {
    prompt: "neha@aws ~ %",
    lines: [
      { text: "$ sam deploy --stack tts-pipeline", kind: "cmd" },
      { text: "Uploading lambda artifacts…", kind: "out" },
      { text: "  ✓ AudioSynth          (128MB)", kind: "ok" },
      { text: "  ✓ TextNormalizer      (64MB)", kind: "ok" },
      { text: "  ✓ S3PostProcess       (96MB)", kind: "ok" },
      { text: "Cold start budget: 387ms / 400ms", kind: "ok" },
      { text: "Cost reduction: -18% MoM", kind: "ok" },
      { text: "Stack tts-pipeline ▶ DEPLOYED", kind: "ok" },
    ],
  },
  {
    prompt: "neha@research ~ %",
    lines: [
      { text: "$ jupyter run backdoor_eval.ipynb", kind: "cmd" },
      { text: "Loading EWC continual learner…", kind: "out" },
      { text: "Trigger persistence  → 0.34", kind: "out" },
      { text: "Forgetting Δ         → -18%", kind: "ok" },
      { text: "Backdoor success rate ↓ 18%", kind: "ok" },
      { text: "Confidence interval: ±0.02", kind: "dim" },
      { text: "✓ figures exported → /paper/fig", kind: "ok" },
    ],
  },
  {
    prompt: "neha@infer ~ %",
    lines: [
      { text: "$ ./serve --model lipread.pt --device cuda", kind: "cmd" },
      { text: "[INFO] CUDA device 0: A100-40GB", kind: "out" },
      { text: "[INFO] Loading multimodal weights…", kind: "out" },
      { text: "[OK]   Visual encoder ready", kind: "ok" },
      { text: "[OK]   Audio encoder  ready", kind: "ok" },
      { text: "[OK]   Fusion head    ready", kind: "ok" },
      { text: "Listening on :8080  ▶ accuracy +20%", kind: "ok" },
    ],
  },
  {
    prompt: "neha@duke ~ %",
    lines: [
      { text: "$ git log --oneline -n 8", kind: "cmd" },
      { text: "a3f9c1 feat: serverless TTS cold-start", kind: "out" },
      { text: "8d12e7 perf: 18% inference speedup", kind: "out" },
      { text: "1f0a3b paper: backdoor + EWC results", kind: "out" },
      { text: "ce4471 chore: bump pytorch 2.3", kind: "dim" },
      { text: "9b88aa fix: tokenizer edge cases", kind: "dim" },
      { text: "2e5c10 init: lip-reading multimodal", kind: "dim" },
    ],
  },
  {
    prompt: "neha@duke ~ %",
    lines: [
      { text: "$ curl https://api.neha.ml/status", kind: "cmd" },
      { text: "{", kind: "out" },
      { text: "  \"status\":  \"online\",", kind: "out" },
      { text: "  \"models\":  4,", kind: "out" },
      { text: "  \"latency\": \"42ms\",", kind: "ok" },
      { text: "  \"open_to_work\": true", kind: "ok" },
      { text: "}", kind: "out" },
    ],
  },
];

const COLORS = {
  bg: "#0d1117",
  border: "#00e5c3",
  prompt: "#00e5c3",
  cmd: "#e8f0f5",
  out: "#7a8fa6",
  ok: "#00e5c3",
  warn: "#f5a623",
  dim: "#3d5066",
  cursor: "#00e5c3",
};

/* ----------------------------- Face renderer ---------------------------- */

const FACE_PX = 512;

/**
 * Draws a face directly into a provided 2d context. Reusing the canvas (instead
 * of allocating a new one each frame) avoids GC pressure and lets Three.js skip
 * the texture re-upload setup work.
 */
function drawFace(
  ctx: CanvasRenderingContext2D,
  face: FaceContent,
  charsTyped: number,
  blink: boolean,
) {
  // Background
  ctx.fillStyle = "#0b0f14";
  ctx.fillRect(0, 0, FACE_PX, FACE_PX);

  // Border (no expensive shadowBlur)
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 3;
  ctx.strokeRect(4, 4, FACE_PX - 8, FACE_PX - 8);

  // Title bar
  ctx.fillStyle = "rgba(0,229,195,0.08)";
  ctx.fillRect(4, 4, FACE_PX - 8, 40);
  ctx.fillStyle = COLORS.prompt;
  ctx.font = "600 16px ui-monospace, 'JetBrains Mono', monospace";
  ctx.fillText("● ● ●", 20, 30);
  ctx.fillStyle = COLORS.dim;
  ctx.font = "500 14px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.fillText(face.prompt, FACE_PX / 2, 30);
  ctx.textAlign = "left";

  // Body text
  const padX = 28;
  let y = 80;
  const lineH = 28;
  ctx.font = "500 16px ui-monospace, 'JetBrains Mono', monospace";
  let used = 0;
  let cursorPos: { x: number; y: number } | null = null;

  for (const line of face.lines) {
    const remaining = charsTyped - used;
    if (remaining <= 0) {
      cursorPos = { x: padX, y };
      break;
    }
    const visible = line.text.slice(0, remaining);
    used += line.text.length + 4; // gap between lines

    ctx.fillStyle =
      line.kind === "cmd"
        ? COLORS.cmd
        : line.kind === "ok"
          ? COLORS.ok
          : line.kind === "warn"
            ? COLORS.warn
            : line.kind === "dim"
              ? COLORS.dim
              : COLORS.out;
    ctx.fillText(visible, padX, y);

    if (visible.length < line.text.length) {
      const w = ctx.measureText(visible).width;
      cursorPos = { x: padX + w + 2, y };
      break;
    }
    y += lineH;
    if (y > FACE_PX - 40) break;
  }

  // Cursor block
  if (cursorPos && blink) {
    ctx.fillStyle = COLORS.cursor;
    ctx.fillRect(cursorPos.x, cursorPos.y - 14, 8, 18);
  }
}

/* ------------------------------ Component ------------------------------ */

export function TerminalCube() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    renderer.domElement.style.cursor = "grab";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    // Build textures + materials. Each face owns ONE persistent canvas + 2D ctx
    // that we redraw into; no per-frame allocations.
    const canvases: HTMLCanvasElement[] = [];
    const ctxs: CanvasRenderingContext2D[] = [];
    const textures: THREE.CanvasTexture[] = [];
    const materials: THREE.MeshBasicMaterial[] = [];
    for (let i = 0; i < 6; i++) {
      const canvas = document.createElement("canvas");
      canvas.width = FACE_PX;
      canvas.height = FACE_PX;
      const ctx = canvas.getContext("2d")!;
      drawFace(ctx, FACES[i], 0, true);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      canvases.push(canvas);
      ctxs.push(ctx);
      textures.push(tex);
      materials.push(new THREE.MeshBasicMaterial({ map: tex }));
    }

    const geo = new THREE.BoxGeometry(2.4, 2.4, 2.4);
    const cube = new THREE.Mesh(geo, materials);
    scene.add(cube);

    // Edge wireframe glow
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({
        color: 0x00e5c3,
        transparent: true,
        opacity: 0.5,
      }),
    );
    cube.add(edges);

    // Manual rotation state
    let rotX = -0.35;
    let rotY = 0.6;
    let velX = 0;
    let velY = 0.004; // gentle idle spin
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      renderer.domElement.setPointerCapture(e.pointerId);
      renderer.domElement.style.cursor = "grabbing";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      velY = dx * 0.005;
      velX = dy * 0.005;
      rotY += velY;
      rotX += velX;
    };
    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      renderer.domElement.releasePointerCapture(e.pointerId);
      renderer.domElement.style.cursor = "grab";
    };
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerUp);

    // Per-face typing state
    const totalChars = FACES.map((f) =>
      f.lines.reduce((s, l) => s + l.text.length + 4, 0),
    );
    const typedAt: number[] = FACES.map(() => -1);
    const phaseStart = performance.now();
    let lastFaceUpdate = 0;
    let lastBlink = false;

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    // Throttle face redraws to ~10 fps. The cube itself still spins at full 60.
    const FACE_REDRAW_INTERVAL_MS = 100;
    let raf = 0;
    const tick = () => {
      const now = performance.now();
      const elapsed = (now - phaseStart) / 1000;

      // Idle inertia
      if (!isDragging) {
        velY = velY * 0.96 + 0.0015 * 0.04;
        velX *= 0.92;
        if (Math.abs(velY) < 0.001) velY = 0.0015;
        rotY += velY;
        rotX += velX;
        rotX += (-0.2 - rotX) * 0.005;
      }
      cube.rotation.x = rotX;
      cube.rotation.y = rotY;

      // Throttle face updates: only redraw when typing progresses or blink flips.
      if (now - lastFaceUpdate >= FACE_REDRAW_INTERVAL_MS) {
        lastFaceUpdate = now;
        const blink = Math.floor(elapsed * 2) % 2 === 0;
        const blinkChanged = blink !== lastBlink;
        lastBlink = blink;
        const speed = 28;
        for (let i = 0; i < 6; i++) {
          const target =
            Math.floor(elapsed * speed) % (totalChars[i] + 80);
          const clamped = Math.min(target, totalChars[i]);
          if (clamped !== typedAt[i] || blinkChanged) {
            typedAt[i] = clamped;
            drawFace(ctxs[i], FACES[i], clamped, blink);
            textures[i].needsUpdate = true;
          }
        }
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointercancel", onPointerUp);
      textures.forEach((t) => t.dispose());
      materials.forEach((m) => m.dispose());
      geo.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", touchAction: "none" }}
    />
  );
}

export default TerminalCube;
