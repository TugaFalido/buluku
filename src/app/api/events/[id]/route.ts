import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const authed = (req: Request) => req.headers.get("x-admin-key") === process.env.ADMIN_PASSWORD;

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!authed(req)) return new NextResponse("Unauthorized", { status: 401 });
  const data = await req.json();
  if (data.startAt) data.startAt = new Date(data.startAt);
  const e = await prisma.event.update({ where: { id: params.id }, data });
  return NextResponse.json(e);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!authed(req)) return new NextResponse("Unauthorized", { status: 401 });
  await prisma.event.delete({ where: { id: params.id } });
  return new NextResponse(null, { status: 204 });
}
