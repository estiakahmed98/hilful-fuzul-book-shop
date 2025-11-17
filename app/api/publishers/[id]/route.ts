import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ParamsType = {
  params: Promise<{ id: string }>;
};

export async function GET(req: Request, context: ParamsType) {
  const { id } = await context.params;

  try {
    const publisher = await prisma.publisher.findUnique({
      where: { id: Number(id) },
    });

    if (!publisher)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(publisher);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load publisher" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, context: ParamsType) {
  const { id } = await context.params;

  try {
    const body = await req.json();

    const publisher = await prisma.publisher.update({
      where: { id: Number(id) },
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

export async function DELETE(req: Request, context: ParamsType) {
  const { id } = await context.params;

  try {
    await prisma.publisher.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
