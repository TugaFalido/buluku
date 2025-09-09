"use client";
import { useEffect, useRef } from "react";

export default function ParallaxAstronaut({
  height = "140vh",
  bg = "/starfield.webp",        // background image in /public
  astronaut = "/astronaut.webp", // astronaut PNG in /public
}: {
  height?: string | number;
  bg?: string;
  astronaut?: string;
}) {
  const container = useRef<HTMLDivElement | null>(null);
  const astro = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const el = container.current!;
    const a = astro.current!;
    let raf: number | null = null;

    const tick = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      const y = progress * 300;              // fall distance
      const rot = (progress - 0.5) * 10;     // gentle sway
      a.style.transform = `translate3d(-50%, ${y}px, 0) rotate(${rot}deg)`;
      raf = null;
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={container}
      className="relative overflow-hidden"
      style={{
        height: typeof height === "number" ? `${height}px` : height,
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-label="Buluku hero parallax"
    >
      <div className="absolute inset-0 grid place-items-center text-center pt-[10vh]">
        <h1 className="text-[clamp(40px,8vw,96px)] font-bold">Buluku</h1>
        <p className="text-[clamp(16px,2.6vw,24px)] opacity-90 mt-2">
          o afronauta doidão · Un spectacle de Djam Neguin
        </p>
      </div>

      <img
        ref={astro}
        src={astronaut}
        alt="Astronaut falling"
        className="absolute left-1/2 top-[10vh] pointer-events-none select-none"
        style={{ width: "min(40vw, 420px)", transform: "translateX(-50%)" }}
        draggable={false}
      />
    </section>
  );
}
