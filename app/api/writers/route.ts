// app/api/writers/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all writers (only count of products)
export async function GET() {
  try {
    const writers = await prisma.writer.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { products: true }, // only product count
        },
      },
    });

    return NextResponse.json(writers);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load writers" },
      { status: 500 }
    );
  }
}

// CREATE writer (connect existing products)
export async function POST(req: Request) {
  try {
    const data = await req.json();

    const writer = await prisma.writer.create({
      data: {
        name: data.name,
        image: data.image ?? null,

        // Connect existing products by id
        products: {
          connect: Array.isArray(data.products)
            ? data.products.map((p: any) => ({ id: Number(p.id) }))
            : [],
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json(writer, { status: 201 });
  } catch (err: any) {
    console.error("Writer Create Error:", err);

    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Writer name already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create writer" },
      { status: 500 }
    );
  }
}
