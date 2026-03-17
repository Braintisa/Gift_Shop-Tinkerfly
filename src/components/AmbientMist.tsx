import { useEffect, useRef, useCallback } from "react";

/**
 * AmbientMist – unified premium ambient background system.
 * Full-page canvas with soft drifting gradient blobs in brand palette.
 * Subtle cursor parallax on desktop, disabled on mobile/touch.
 * Respects prefers-reduced-motion.
 */

interface MistBlob {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  r: number;
  color: string;
  phase: number;
  speed: number;
  driftX: number;
  driftY: number;
  pulseSpeed: number;
  pulseAmount: number;
}

// Brand palette at very low opacities
const COLORS = [
  "rgba(168, 219, 111, 0.07)",   // #A8DB6F primary mint
  "rgba(198, 237, 151, 0.06)",   // #C6ED97 soft green
  "rgba(47, 125, 91, 0.04)",     // #2F7D5B deep green
  "rgba(200, 164, 71, 0.03)",    // #C8A447 champagne
  "rgba(168, 219, 111, 0.05)",   // mint again
  "rgba(198, 237, 151, 0.05)",   // soft green
  "rgba(248, 246, 241, 0.06)",   // #F8F6F1 ivory glow
  "rgba(168, 219, 111, 0.04)",   // mint light
  "rgba(47, 125, 91, 0.035)",    // deep green soft
  "rgba(200, 164, 71, 0.025)",   // champagne whisper
  "rgba(198, 237, 151, 0.045)",  // soft green
  "rgba(248, 246, 241, 0.05)",   // ivory
];

const AmbientMist = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1, y: -1 });
  const smoothMouse = useRef({ x: -1, y: -1 });
  const rafRef = useRef<number>(0);
  const blobsRef = useRef<MistBlob[]>([]);
  const isTouch = useRef(false);
  const lastResize = useRef(0);

  const initBlobs = useCallback((w: number, h: number) => {
    const blobs: MistBlob[] = [];
    // More blobs for larger pages, capped for performance
    const count = Math.min(14, Math.floor((w * h) / 80000) + 6);

    for (let i = 0; i < count; i++) {
      const bx = Math.random() * w;
      const by = Math.random() * h;
      blobs.push({
        x: bx,
        y: by,
        baseX: bx,
        baseY: by,
        r: 200 + Math.random() * 350,
        color: COLORS[i % COLORS.length],
        phase: Math.random() * Math.PI * 2,
        speed: 0.00015 + Math.random() * 0.00025,
        driftX: (Math.random() - 0.5) * 80,
        driftY: (Math.random() - 0.5) * 50,
        pulseSpeed: 0.0003 + Math.random() * 0.0004,
        pulseAmount: 0.08 + Math.random() * 0.12,
      });
    }
    blobsRef.current = blobs;
  }, []);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      ctx.clearRect(0, 0, w, h);

      // Smooth mouse interpolation
      if (smoothMouse.current.x < 0 && mouse.current.x >= 0) {
        smoothMouse.current = { ...mouse.current };
      } else if (mouse.current.x >= 0) {
        smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * 0.03;
        smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * 0.03;
      }

      const scrollY = window.scrollY;

      for (const blob of blobsRef.current) {
        const phase = t * blob.speed + blob.phase;
        let tx = blob.baseX + Math.sin(phase) * blob.driftX;
        let ty = blob.baseY + Math.cos(phase * 0.7) * blob.driftY;

        // Subtle pulse in radius
        const pulse = 1 + Math.sin(t * blob.pulseSpeed + blob.phase) * blob.pulseAmount;
        const currentR = blob.r * pulse;

        // Cursor influence (desktop only, very gentle)
        if (!isTouch.current && smoothMouse.current.x >= 0) {
          const mx = smoothMouse.current.x;
          const my = smoothMouse.current.y + scrollY;
          const dx = mx - tx;
          const dy = my - ty;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influence = Math.max(0, 1 - dist / 700) * 14;
          tx += (dx / (dist || 1)) * influence;
          ty += (dy / (dist || 1)) * influence;
        }

        // Very smooth easing toward target
        blob.x += (tx - blob.x) * 0.006;
        blob.y += (ty - blob.y) * 0.006;

        const grad = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, currentR
        );
        grad.addColorStop(0, blob.color);
        grad.addColorStop(0.6, blob.color.replace(/[\d.]+\)$/, (m) => {
          const v = parseFloat(m) * 0.5;
          return v.toFixed(4) + ")";
        }));
        grad.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, currentR, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    isTouch.current = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      // Throttle resize
      const now = Date.now();
      if (now - lastResize.current < 200) return;
      lastResize.current = now;

      const dpr = Math.min(window.devicePixelRatio, 1.5);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initBlobs(w, h);
    };

    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    if (!isTouch.current) {
      window.addEventListener("mousemove", onMove, { passive: true });
    }

    const loop = (t: number) => {
      const w = parseFloat(canvas.style.width);
      const h = parseFloat(canvas.style.height);
      if (w && h) draw(ctx, w, h, t);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [initBlobs, draw]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
};

export default AmbientMist;
