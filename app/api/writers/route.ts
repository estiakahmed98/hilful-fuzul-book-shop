import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const writers = await prisma.writer.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(writers);
}

export async function POST(req: Request) {
  const data = await req.json();

  const writer = await prisma.writer.create({
    data: {
      name: data.name,
      image: data.image ?? null,
    },
  });

  return NextResponse.json(writer, { status: 201 });
}
