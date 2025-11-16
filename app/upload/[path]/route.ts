// app/api/upload/[path]/route.ts
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';
import { existsSync } from 'fs';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { path: string } }
) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const timestamp = Date.now();
    const ext = file.name.split('.').pop() || '';
    const filename = `${timestamp}.${ext}`;

    // Get the path from params
    const pathSegments = params.path ? [params.path] : [];
    
    // Determine the upload directory
    const uploadDir = join(process.cwd(), 'public', 'uploads', ...pathSegments);
    
    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    const filePath = join(uploadDir, filename);

    // Save the file
    await writeFile(filePath, buffer);
    
    // Return the URL where the file can be accessed
    const fileUrl = `/uploads/${pathSegments.join('/')}/${filename}`;
    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
}