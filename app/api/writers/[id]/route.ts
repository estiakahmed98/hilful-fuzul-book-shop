// app/api/writers/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const writer = await prisma.writer.findUnique({
    where: { id: Number(params.id) },
  });

  if (!writer)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(writer);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await req.json();

  const writer = await prisma.writer.update({
    where: { id: Number(params.id) },
    data: {
      name: data.name,
      image: data.image ?? null,
    },
  });

  return NextResponse.json(writer);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.writer.delete({
    where: { id: Number(params.id) },
  });

  return NextResponse.json({ message: "Deleted" });
}
