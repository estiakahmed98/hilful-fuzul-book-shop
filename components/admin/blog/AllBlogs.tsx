// components/blog/BlogList.tsx
'use client';

import { useState, useEffect } from "react";
import Link from "next/link";

interface Blog {
  id: number;
  title: string;
  summary: string;
  author: string;
  date: string | Date;
  image?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Helper function to format the time since creation in Bengali (e.g., "১৫ মিনিট আগে")
const formatTimeSince = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);
  const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));

  if (diffInMinutes < 60) {
    return `${diffInMinutes === 0 ? 1 : diffInMinutes} মিনিট আগে`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ঘন্টা আগে`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} দিন আগে`;
  }

  // Fallback to simple date
  return past.toLocaleDateString('bn-BD', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export default function AllBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // Note: Public blogs might not need search or pagination initially,
  // but I'm keeping the logic for robustness.

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10', // Showing 10 blogs per page
      });

      // API call to fetch all blogs
      const response = await fetch(`/api/blog?${params}`);
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : null;

      if (response.ok && data?.blogs) {
        setBlogs(data.blogs);
        setTotalPages(data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      // Optionally show a user-friendly error message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center p-12 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-medium text-gray-700">কোনো ব্লগ পোস্ট পাওয়া যায়নি।</h3>
        <p className="text-gray-500 mt-2">নতুন পোস্টের জন্য অপেক্ষা করুন।</p>
      </div>
    );
  }

  return (
    <div className="p-2">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-2">সাম্প্রতিক ব্লগ পোস্ট</h1>

      {/* Blog List Layout - Stacked, responsive, similar to the image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((blog) => (
          // Blog Card
          <Link key={blog.id} href={`/kitabghor/blogs/${blog.id}`} className="block">
            <div className="flex flex-col sm:flex-row bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
              
              {/* Image Section - Takes 1/3 or full width on small screens */}
              <div className="sm:w-1/3 w-full h-48 sm:h-auto flex-shrink-0">
                {blog.image ? (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>

              {/* Content Section - Takes 2/3 or full width on small screens */}
              <div className="p-4 sm:p-6 sm:w-2/3 flex flex-col justify-center">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                  {blog.title}
                </h2>
                <p className="text-gray-600 line-clamp-3 mb-3">
                  {blog.summary}
                </p>
                
                {/* Meta Info: Time Since/Author/Date */}
                <div className="mt-auto text-sm text-gray-500 pt-2 border-t border-gray-50">
                  <p className="font-medium">
                    {/* Assuming createdAt represents the post time */}
                    {formatTimeSince(blog.createdAt)} 
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Simple Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 space-x-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            পূর্ববর্তী
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            পরবর্তী
          </button>
        </div>
      )}
    </div>
  );
}