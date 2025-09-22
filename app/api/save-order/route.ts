import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    const filePath = path.join(process.cwd(), "data", "orders.json");

    await fs.mkdir(path.dirname(filePath), { recursive: true });

    let existingData = [];
    try {
      const fileContent = await fs.readFile(filePath, "utf8");
      existingData = JSON.parse(fileContent || "[]");
    } catch {
      existingData = [];
    }

    existingData.push(orderData);
    await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));

    return NextResponse.json(
      { message: "Order saved successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { message: "Failed to save order" },
      { status: 500 }
    );
  }
}
