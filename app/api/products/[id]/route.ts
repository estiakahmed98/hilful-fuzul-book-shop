//api/products/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: idStr } = await params;
    const id = Number(idStr);
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        writer: true,
        publisher: true,
        category: true,
      },
    });
    
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (err) {
    console.error("GET ERROR:", err);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// UPDATE
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: idStr } = await params;
    const id = Number(idStr);
    
    // Check if ID is valid
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const text = await req.text();
    if (!text) {
      return NextResponse.json(
        { error: "Empty Request Body" },
        { status: 400 }
      );
    }

    const body = JSON.parse(text);
    
    // Check if product exists before updating
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });
    
    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: Number(body.price),
        original_price: body.original_price ? Number(body.original_price) : null,
        discount: body.discount ? Number(body.discount) : 0,
        stock: Number(body.stock),
        available: body.available,
        writerId: body.writerId ? Number(body.writerId) : null,
        publisherId: body.publisherId ? Number(body.publisherId) : null,
        categoryId: Number(body.categoryId),
        image: body.image,
        gallery: body.gallery || [],
        pdf: body.pdf || null,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// Soft-DELETE
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: idStr } = params;
    const id = Number(idStr);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // ❗ আসল ডিলিট না করে শুধু inactive/soft-delete করলাম
    const updated = await prisma.product.update({
      where: { id },
      data: {
        available: false,  // 🔴 এই ফ্ল্যাগ দিয়েই আমরা hide করব
        stock: 0,          // optional: স্টক ০ করে দিচ্ছি যেন আর buy না হয়
      },
    });

    return NextResponse.json({
      message: "Product marked as inactive successfully",
      product: updated,
    });
  } catch (err) {
    console.error("SOFT DELETE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to deactivate product" },
      { status: 500 }
    );
  }
}