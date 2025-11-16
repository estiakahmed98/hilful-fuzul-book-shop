//api/publishers

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const publishers = await prisma.publisher.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(publishers);
  } catch (err) {
    return NextResponse.json({ error: "Failed to load publishers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const publisher = await prisma.publisher.create({
      data: {
        name: body.name,
        image: body.image ?? null,
      },
    });

    return NextResponse.json(publisher);
  } catch (err) {
    return NextResponse.json({ error: "Failed to create publisher" }, { status: 500 });
  }
}
