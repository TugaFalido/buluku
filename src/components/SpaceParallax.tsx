"use client";
import { useEffect, useRef } from "react";
import EventsList from "@/components/EventsList";

export default function SpaceParallax({
  bg = "/starfield.webp",
  astronaut = "/astronaut.webp",
  title = "Buluku",
  subtitle = "o afronauta doidão · Un spectacle de Djam Neguin",
}: {
  bg?: string;
  astronaut?: string;
  title?: string;
  subtitle?: string;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const astroRef = useRef<HTMLImageElement | null>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const mouseLerp = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const root = rootRef.current!;
    const bgEl = bgRef.current!;
    const astro = astroRef.current!;

    let raf: number | null = null;
    let t0 = performance.now();

    const onMouse = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouse.current.x = nx;
      mouse.current.y = ny;
    };

    const loop = (now: number) => {
      const dt = (now - t0) / 1000;
      t0 = now;

      // smooth mouse
      mouseLerp.current.x += (mouse.current.x - mouseLerp.current.x) * 0.06;
      mouseLerp.current.y += (mouse.current.y - mouseLerp.current.y) * 0.06;

      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const progress = scrolled / total;

      // Background slow drift (keep z-index >= 0 so it's above body)
      const bgY = progress * 200;
      bgEl.style.backgroundPosition = `center ${bgY}px`;

      // Astronaut roaming
      const time = now * 0.001;
      const fall = progress * 700;
      const sineX = Math.sin(time * 0.6 + progress * 8) * 120;
      const mouseX = mouseLerp.current.x * 40;
      const mouseY = mouseLerp.current.y * 30;

      const x = -50 + sineX + mouseX; // px from center
      const y = -40 + fall + mouseY;  // px from center
      const tilt = Math.sin(time * 0.7 + progress * 6) * 6;

      astro.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${tilt}deg)`;

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMouse, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative min-h-[220vh]">
      {/* STARFIELD — fixed, visible (z-0) */}
      <div
        ref={bgRef}
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center 0px",
        }}
        aria-hidden
      />

      {/* HEADER — always on top */}
      <header className="sticky top-0 z-30 w-full text-center py-6">
        <h1 className="text-yellow-300 text-[clamp(32px,8vw,96px)] font-black leading-none">
          {title}
        </h1>
        <p className="text-white/80 text-[clamp(14px,2.5vw,20px)] mt-1">
          {subtitle}
        </p>
      </header>

      {/* ASTRONAUT — behind content, above stars */}
      <img
        ref={astroRef}
        src={astronaut}
        alt="Astronaut roaming"
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{
          width: "min(38vw, 360px)",
          zIndex: 10, // stars: z-0, astronaut: 10, content: 20+, header: 30
          willChange: "transform",
          filter: "drop-shadow(0 10px 50px rgba(255,255,200,.28))",
        }}
        draggable={false}
      />

      {/* CONTENT — above astronaut */}
      <section className="relative z-20 px-6 pt-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1fr_minmax(60px,120px)_1fr]">
          <article className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 p-6 lg:sticky lg:top-[120px] self-start">
            <h2 className="text-[clamp(24px,4vw,44px)] text-[#ffff00] mb-3">O que é Buluku?</h2>
            <p className="text-[18px] leading-relaxed">
              Buluku é um espetáculo do afronauta doidão — uma viagem intergaláctica
              onde dança, poesia e humor aterram no mesmo palco. O astronauta cai
              pelo espaço (e dentro de nós) enquanto partilhamos histórias, música e
              gravidade emocional.
            </p>
            <p className="text-[18px] leading-relaxed mt-4">
              A encenação mistura momentos íntimos com explosões de cor e ritmo,
              convidando o público a participar na órbita do afronauta.
            </p>
          </article>

          <div className="hidden lg:block" />

          <aside className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h2 className="text-[clamp(24px,4vw,44px)] text-[#ffff00] mb-3">Próximas Datas</h2>
            <EventsList />
          </aside>
        </div>
        <div className="h-[40vh]" />
      </section>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          img[alt="Astronaut roaming"] { transform: translate(-50%, -50%) !important; }
        }
      `}</style>
    </div>
  );
}
