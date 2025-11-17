// app/api/categories/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ParamType = { params: Promise<{ id: string }> };

export async function PUT(req: Request, context: ParamType) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const category = await prisma.category.update({
      where: { id: Number(id) },
      data: { name: body.name },
    });

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: ParamType) {
  try {
    const { id } = await context.params;

    await prisma.category.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
