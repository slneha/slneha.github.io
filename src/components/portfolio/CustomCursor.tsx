import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      const el = e.target as HTMLElement;
      if (el && el.closest("a, button, .card-base, .pill-tab, .nav-link, .arrow-link")) {
        setHover(true);
      } else {
        setHover(false);
      }
    };
    let raf = 0;
    const tick = () => {
      ring.current.x += (target.current.x - ring.current.x) * 0.18;
      ring.current.y += (target.current.y - ring.current.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          left: 0, top: 0,
          width: 12, height: 12,
          marginLeft: -6, marginTop: -6,
          pointerEvents: "none",
          zIndex: 10000,
          color: "var(--accent-primary)",
          mixBlendMode: "difference",
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12">
          <line x1="6" y1="0" x2="6" y2="12" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="6" x2="12" y2="6" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          left: 0, top: 0,
          width: hover ? 32 : 6,
          height: hover ? 32 : 6,
          marginLeft: hover ? -16 : -3,
          marginTop: hover ? -16 : -3,
          borderRadius: "50%",
          border: `1px solid var(--accent-primary)`,
          pointerEvents: "none",
          zIndex: 10000,
          transition: "width 0.25s ease, height 0.25s ease, margin 0.25s ease",
          opacity: hover ? 1 : 0.4,
        }}
      />
    </>
  );
}