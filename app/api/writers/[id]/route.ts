import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const writer = await prisma.writer.findUnique({
      where: { id: Number(id) },
    });

    if (!writer) {
      return NextResponse.json({ error: "Writer not found" }, { status: 404 });
    }

    return NextResponse.json(writer);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch writer" }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const data = await req.json();

    const writer = await prisma.writer.update({
      where: { id: Number(id) },
      data: {
        name: data.name,
        image: data.image ?? null,
      },
    });

    return NextResponse.json(writer);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update writer" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    await prisma.writer.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Writer deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete writer" }, { status: 500 });
  }
}
