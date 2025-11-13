// components/blog/BlogDetails.tsx
'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// Define the Blog interface, adding a 'content' field for the main body
interface Blog extends BlogPostData {
  id: number;
  content: string; // Assuming the API returns a full content field
}

interface BlogPostData {
  title: string;
  summary: string;
  author: string;
  date: string | Date;
  image?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}


export default function BlogDetails() {
  const params = useParams<{ id: string }>();
  const blogId = params?.id;
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!blogId) return;

    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // API call to fetch a single blog by ID
        const response = await fetch(`/api/blog/${blogId}`);
        const data = await response.json();

        if (response.ok) {
          setBlog(data);
        } else {
          setError(data.message || 'ব্লগটি খুঁজে পাওয়া যায়নি।');
        }
      } catch (err) {
        console.error('Error fetching blog details:', err);
        setError('ডেটা লোড করতে সমস্যা হয়েছে।');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [blogId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="text-center p-12 bg-white rounded-lg shadow-md max-w-2xl mx-auto mt-10">
        <h3 className="text-2xl font-bold text-red-600 mb-2">Error!</h3>
        <p className="text-gray-700">{error || 'ব্লগটি খুঁজে পাওয়া যায়নি।'}</p>
        <Link href="/" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
            হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Blog Image (Header) */}
        <div className="h-96 w-full overflow-hidden">
          {blog.image ? (
            <img 
              src={blog.image} 
              alt={blog.title} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-xl">No Image Available</span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-10 lg:p-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            {blog.title}
          </h1>
          
          {/* Meta Info */}
          <div className="flex items-center text-sm text-gray-500 mb-8 border-b pb-4">
            <span className="mr-4">
              <span className="font-semibold text-gray-700">{blog.author}</span> দ্বারা 
            </span>
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span>{new Date(blog.date).toLocaleDateString('bn-BD')}</span>
            </span>
          </div>
          
          {/* Main Content - Assuming 'content' holds the full HTML/Markdown body */}
          <div className="prose max-w-none text-gray-800 leading-relaxed" 
            dangerouslySetInnerHTML={{ __html: blog.content || '<p>সম্পূর্ণ লেখাটি এখানে নেই।</p>' }}
          >
          </div>
        </div>
      </div>
      
      {/* Back Button */}
      <div className="mt-8 text-center">
        <Link 
          href="/blogs" 
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span>সব ব্লগ দেখুন</span>
        </Link>
      </div>
    </div>
  );
}