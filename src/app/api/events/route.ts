import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // or "../../../lib/prisma" if no alias

// GET /api/events – public list of upcoming, published events
export async function GET() {
  const events = await prisma.event.findMany({
    where: { isPublished: true, startAt: { gte: new Date(Date.now() - 86_400_000) } },
    orderBy: { startAt: "asc" },
  });
  return NextResponse.json(events);
}

// POST /api/events – create (admin only)
export async function POST(req: Request) {
  if (req.headers.get("x-admin-key") !== process.env.ADMIN_PASSWORD) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const body = await req.json();
  const e = await prisma.event.create({
    data: {
      title: body.title,
      venue: body.venue || null,
      city: body.city || null,
      country: body.country || null,
      startAt: new Date(body.startAt),
      ticketUrl: body.ticketUrl || null,
      isPublished: body.isPublished ?? true,
    },
  });
  return NextResponse.json(e, { status: 201 });
}
