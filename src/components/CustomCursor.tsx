import { useEffect, useRef, useState, useCallback } from "react";

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const circlePos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [visible, setVisible] = useState(false);

  const animate = useCallback(() => {
    const dx = mouse.current.x - circlePos.current.x;
    const dy = mouse.current.y - circlePos.current.y;
    circlePos.current.x += dx * 0.12;
    circlePos.current.y += dy * 0.12;

    if (dotRef.current) {
      dotRef.current.style.transform = `translate(${mouse.current.x}px, ${mouse.current.y}px) translate(-50%, -50%)`;
    }
    if (circleRef.current) {
      circleRef.current.style.transform = `translate(${circlePos.current.x}px, ${circlePos.current.y}px) translate(-50%, -50%) scale(${hovering ? 1.4 : clicking ? 0.85 : 1})`;
    }
    rafRef.current = requestAnimationFrame(animate);
  }, [hovering, clicking]);

  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || prefersReduced) return;

    setVisible(true);
    document.documentElement.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    const onHoverIn = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], .card-product, input, textarea, select")) {
        setHovering(true);
      }
    };
    const onHoverOut = () => setHovering(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onHoverIn, { passive: true });
    document.addEventListener("mouseout", onHoverOut, { passive: true });

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.documentElement.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onHoverIn);
      document.removeEventListener("mouseout", onHoverOut);
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  if (!visible) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: hovering
            ? "hsl(var(--primary))"
            : "hsl(var(--foreground) / 0.7)",
          transition: "background 0.3s ease",
        }}
      />
      <div
        ref={circleRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: `1.5px solid ${hovering ? "hsl(var(--primary) / 0.5)" : "hsl(var(--foreground) / 0.15)"}`,
          background: hovering ? "hsl(var(--primary) / 0.04)" : "transparent",
          transition: "border-color 0.3s ease, background 0.3s ease, transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      />
    </>
  );
};

export default CustomCursor;
