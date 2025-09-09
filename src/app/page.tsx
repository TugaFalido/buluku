import SpaceParallax from "@/components/SpaceParallax";
import EventsList from "@/components/EventsList";

export default function Home() {
  return (
    <main className="bg-[#0b0e17] text-white min-h-screen">
      <SpaceParallax
        bg="/starfield.webp"
        astronaut="/astronaut.webp"
        title="Buluku"
        subtitle="o afronauta doidão · Un spectacle de Djam Neguin"
      />
      {/* Inject EventsList inside the right column — see component comment.
         If you prefer, you can pass it as a child prop; keeping it simple here. */}
    </main>
  );
}
