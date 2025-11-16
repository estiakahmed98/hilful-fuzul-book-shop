//api/products/[id]

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: any) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(params.id) },
      include: {
        writer: true,
        publisher: true,
        category: true,
      },
    });

    if (!product)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(product);
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: any) {
  try {
    const body = await req.json();

    const updated = await prisma.product.update({
      where: { id: Number(params.id) },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price,
        original_price: body.original_price,
        discount: body.discount,
        stock: body.stock,
        available: body.available,

        writerId: body.writerId || null,
        publisherId: body.publisherId || null,
        categoryId: body.categoryId,

        image: body.image,
        gallery: body.gallery,
        pdf: body.pdf,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: any) {
  try {
    await prisma.product.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
