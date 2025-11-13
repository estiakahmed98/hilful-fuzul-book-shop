import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import BlogForm from '@/components/admin/blog/BlogForm';

interface EditBlogPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface BlogData {
  id: number;
  title: string;
  summary: string;
  content: string;
  date: Date;
  author: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const awaited = await params;
  const blog = await prisma.blog.findUnique({
    where: { id: parseInt(awaited.id) }
  }) as unknown as BlogData | null;

  if (!blog) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-xl">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1>
            <p className="text-gray-600 mt-1">Update your blog post content and details</p>
          </div>
        </div>
        
        {/* Breadcrumb */}
        <nav className="flex space-x-2 text-sm text-gray-500 mt-4">
          <Link href="/admin" className="hover:text-gray-700">Dashboard</Link>
          <span>/</span>
          <Link href="/admin/blogs" className="hover:text-gray-700">Blogs</Link>
          <span>/</span>
          <span className="text-blue-600">Edit</span>
        </nav>
      </div>

      {/* Blog Form */}
      <BlogForm blog={blog} />
    </div>
  );
}