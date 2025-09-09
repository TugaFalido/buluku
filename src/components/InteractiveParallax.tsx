"use client";
import { useEffect, useRef } from "react";
import EventsList from "@/components/EventsList";

type Props = {
  bg?: string;             // starfield image
  bulukuImg?: string;      // optional center image (e.g., a logo). If not provided, we render text.
};

export default function InteractiveParallax({
  bg = "/starfield.webp",
  bulukuImg,
}: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const bgRef   = useRef<HTMLDivElement | null>(null);
  const midRef  = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const bgEl = bgRef.current!;
    const mid  = midRef.current!;

    let raf: number | null = null;

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const rect = root.getBoundingClientRect();
        const vh   = window.innerHeight;

        // normalized progress of the whole page (0..1)
        const total = rect.height + vh;
        const scrolled = Math.min(Math.max(-rect.top, 0), total);
        const progress = scrolled / total;

        // Background stars move subtle and slow
        const bgY = progress * 180; // px; tune for more/less drag
        bgEl.style.backgroundPosition = `center ${bgY}px`;

        // Mid "Buluku" element drifts more
        const y = progress * 520;      // fall distance
        const r = (progress - 0.5) * 8; // gentle tilt
        mid.style.transform = `translate3d(-50%, calc(-50% + ${y}px), 0) rotate(${r}deg)`;

        raf = null;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      {/* Full-page parallax background (fixed) */}
      <div
        ref={bgRef}
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center 0px",
        }}
      />

      {/* Center “Buluku” that drifts down */}
      <div
        ref={midRef}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform pointer-events-none select-none"
        style={{ zIndex: 5 }}
      >
        {bulukuImg ? (
          <img
            src={bulukuImg}
            alt="Buluku"
            className="w-[min(70vw,720px)] drop-shadow-[0_8px_40px_rgba(255,255,150,.35)]"
            draggable={false}
          />
        ) : (
          <div className="text-center">
            <h1 className="text-[clamp(40px,10vw,120px)] font-black text-yellow-300 drop-shadow-[0_8px_30px_rgba(255,255,150,.35)]">
              Buluku
            </h1>
            <p className="text-white/90 text-[clamp(14px,2.5vw,22px)]">
              o afronauta doidão · Un spectacle de Djam Neguin
            </p>
          </div>
        )}
      </div>

      {/* Spacer hero height so we have room for the “fall” */}
      <section className="h-[160vh]" aria-hidden />

      {/* Two-column content with Buluku drifting between */}
      <section className="relative z-10 px-6 py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1fr_minmax(40px,120px)_1fr]">
          {/* Left column: Concept */}
          <article className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10 p-6 lg:sticky lg:top-6 self-start">
            <h2 className="text-[clamp(28px,4vw,48px)] mb-3">What is Buluku?</h2>
            <p className="text-[18px] leading-relaxed">
              Buluku é um espetáculo do afronauta doidão — uma viagem
              intergaláctica onde dança, poesia e humor aterram no mesmo palco.
              O astronauta cai pelo espaço (e dentro de nós) enquanto partilhamos
              histórias, música e… gravidade emocional.
            </p>
            <p className="text-[18px] leading-relaxed mt-4">
              A encenação mistura momentos íntimos com explosões de cor e ritmo,
              convidando o público a participar na órbita do afronauta.
            </p>
          </article>

          {/* Middle gutter: leave empty so Buluku floats “between columns” */}
          <div className="hidden lg:block" />

          {/* Right column: Dates */}
          <aside className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h2 className="text-[clamp(28px,4vw,48px)] mb-3">Upcoming Dates</h2>
            <EventsList />
          </aside>
        </div>
      </section>

      {/* Footer spacer so users can scroll past the mid element */}
      <section className="h-[40vh]" aria-hidden />
    </div>
  );
}
