"use client";
import { useEffect, useState } from "react";

type Event = {
  id: string;
  title: string;
  venue?: string | null;
  city?: string | null;
  country?: string | null;
  startAt: string;            // ISO string from API
  ticketUrl?: string | null;
};

export default function EventsList() {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/events", { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load events (${res.status})`);
        const data: Event[] = await res.json();
        setEvents(data);
      } catch (e: any) {
        setError(e?.message || "Failed to load events");
        setEvents([]);
      }
    })();
  }, []);

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-200">
        {error}
      </div>
    );
  }

  if (!events) return <p>Loading dates…</p>;
  if (events.length === 0) return <p>No scheduled dates yet. Stay tuned!</p>;

  return (
    <ul className="grid gap-4">
      {events.map((e) => {
        const date = new Date(e.startAt);
        const dateStr = date.toLocaleString("en-GB", {
          // User is in Europe/Lisbon — ensure consistent display:
          timeZone: "Europe/Lisbon",
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        const place = [e.venue, e.city, e.country].filter(Boolean).join(" · ");

        return (
          <li
            key={e.id}
            className="rounded-xl border border-white/15 p-4 transition hover:border-white/30"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <h3 className="text-lg font-semibold">{e.title}</h3>
              <time className="opacity-90">{dateStr}</time>
            </div>
            {place && <div className="opacity-75 mt-1">{place}</div>}
            {e.ticketUrl && (
              <a
                className="mt-2 inline-block underline underline-offset-2"
                href={e.ticketUrl}
                target="_blank"
                rel="noreferrer"
              >
                Tickets / Info
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
