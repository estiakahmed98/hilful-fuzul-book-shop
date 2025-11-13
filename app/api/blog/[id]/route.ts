import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET single blog - Public access
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {

    const blog = await prisma.blog.findUnique({
      where: { id: parseInt(params.id) }
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// UPDATE blog - Admin only
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, summary, content, date, author, image } = body;

    const existingBlog = await prisma.blog.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingBlog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    const plainTextFromHtml = (html: string) =>
      html?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    const computedSummary = summary && summary.trim().length > 0
      ? summary
      : (content ? plainTextFromHtml(content).slice(0, 300) : existingBlog.summary);

    const blog = await prisma.blog.update({
      where: { id: parseInt(id) },
      data: {
        title: title || existingBlog.title,
        summary: computedSummary,
        content: content ?? existingBlog.content,
        date: date ? new Date(date) : existingBlog.date,
        author: author || existingBlog.author,
        image: image || existingBlog.image
      }
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE blog - Admin only
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingBlog = await prisma.blog.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingBlog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    await prisma.blog.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}