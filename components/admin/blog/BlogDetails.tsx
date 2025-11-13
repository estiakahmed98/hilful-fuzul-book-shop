// components/blog/BlogDetails.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import RecentBlogs from "./RecentBlogs"; // Assuming this is the correct path

interface Blog {
  id: number;
  title: string;
  content: string;
  summary: string;
  author: string;
  date: string | Date;
  image?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// ----------------------------------------------------------------
// 💡 Add Placeholder for Google AdSense
// Replace the content inside this component with your actual AdSense code (e.g., <ins class="adsbygoogle" ... />)
// ----------------------------------------------------------------
const AdPlaceholder = ({
  title,
  widthClass,
}: {
  title: string;
  widthClass: string;
}) => (
  <div className={`${widthClass} h-full hidden lg:block`}>
    <div className="sticky top-6 p-4 border border-dashed border-gray-300 rounded-xl bg-gray-50 h-[600px] flex items-center justify-center text-center text-sm text-gray-600">
      <p>{title}</p>
    </div>
  </div>
);
// ----------------------------------------------------------------

export default function BlogDetails() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const blogId = params?.id;

  // State Hooks
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blog details
  useEffect(() => {
    if (!blogId) {
      setLoading(false);
      setError("Invalid blog ID");
      return;
    }

    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/blog/${blogId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch blog");
        }

        const data = await response.json();
        setBlog(data);
      } catch (err) {
        console.error("Error fetching blog details:", err);
        setError("Failed to load blog. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [blogId]);

  // Loading and Error States (Simplified)
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
        <p className="text-gray-700">
          {error || "ব্লগটি খুঁজে পাওয়া যায়নি।"}
        </p>
        <button
          onClick={() => router.push("/kitabghor/blogs")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          সব ব্লগ দেখুন
        </button>
      </div>
    );
  }

  // Main Layout
  return (
    <div className="w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Three-Column Grid for Ad Layout on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_200px] xl:grid-cols-[250px_1fr_250px] gap-6 lg:gap-8">
        {/* 1. Left Ad Column (Hidden on mobile) */}
        <AdPlaceholder
          title="Google Ad (Left Banner)"
          widthClass="lg:w-[200px] xl:w-[250px]"
        />

        {/* 2. Center Content Column */}
        <div className="lg:col-span-1">
          {/* Back Button */}
          <div className="mb-4">
            <Link
              href="/kitabghor/blogs"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>সব ব্লগ দেখুন</span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 p-4 pb-0">
              {blog.title}
            </h1>

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
                  <span className="text-gray-500 text-xl">
                    No Image Available
                  </span>
                </div>
              )}
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-10 lg:p-12">
              {/* Meta Info */}
              <div className="flex items-center text-sm text-gray-500 mb-8 border-b pb-4">
                <span className="font-semibold text-gray-700">
                  {blog.author} :
                </span>
                <span className="flex items-center space-x-1 ml-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{new Date(blog.date).toLocaleDateString("bn-BD")}</span>
                </span>
              </div>

              {/* Main Content - Assuming 'content' holds the full HTML/Markdown body */}
              <div
                className="prose max-w-none text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: blog.content || "<p>সম্পূর্ণ লেখাটি এখানে নেই।</p>",
                }}
              ></div>
            </div>
          </div>

          {/* Recent Blogs below the main content on mobile/tablet */}
          <div className="lg:hidden mt-8">
            <RecentBlogs />
          </div>
        </div>

        {/* 3. Right Ad/Sidebar Column (Hidden on mobile) */}
        <div className="lg:col-span-1">
          <div className="space-y-8">
            {/* Ad Placeholder (Right) */}
            <AdPlaceholder
              title="Google Ad (Right Skyscraper)"
              widthClass="lg:w-[200px] xl:w-[250px]"
            />
          </div>
        </div>
      </div>
      {/* Recent Blogs on the right sidebar for large screens */}
      <div className="hidden lg:block">
        <RecentBlogs />
      </div>
    </div>
  );
}
