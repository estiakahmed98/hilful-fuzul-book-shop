//api/publishers/[id]

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: any) {
  try {
    const publisher = await prisma.publisher.findUnique({
      where: { id: Number(params.id) },
    });

    if (!publisher)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(publisher);
  } catch (err) {
    return NextResponse.json({ error: "Failed to load publisher" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: any) {
  try {
    const body = await req.json();

    const publisher = await prisma.publisher.update({
      where: { id: Number(params.id) },
      data: {
        name: body.name,
        image: body.image ?? null,
      },
    });

    return NextResponse.json(publisher);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: any) {
  try {
    await prisma.publisher.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
