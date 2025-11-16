import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Convert file to buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // File name
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(process.cwd(), "public/upload", fileName);

  // Save file
  await writeFile(filePath, buffer);

  // Public URL
  const fileUrl = `/upload/${fileName}`;

  return NextResponse.json({ url: fileUrl });
}
