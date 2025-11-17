"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { User, BookOpen, PenTool, ArrowRight, Users } from "lucide-react";

type Writer = {
  id: number | string;
  name: string;
  image?: string | null;
  bookCount?: number; // normalized count
  _count?: {
    products: number;
  }; // jodi API theke ase
  productCount?: number; // jodi ei name e ase
};

export default function AuthorCategoriesPage() {
  const [authors, setAuthors] = useState<Writer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWriters = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/writers");
        if (!res.ok) {
          throw new Error("Failed to fetch writers");
        }

        const data: Writer[] = await res.json();

        // 🔁 Normalize bookCount যাতে সব জায়গায় ঠিকমতো count পাই
        const normalized = data.map((w) => ({
          ...w,
          bookCount:
            w.bookCount ??
            w.productCount ??
            w._count?.products ??
            0,
        }));

        setAuthors(normalized);
      } catch (error) {
        console.error(error);
        setAuthors([]);
        setError("ডাটা লোড করতে সমস্যা হচ্ছে");
      } finally {
        setLoading(false);
      }
    };

    fetchWriters();
  }, []);

  // ⏳ Loader state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#EEEFE0]/20 to-white flex items-center justify-center">
        <div className="text-center">
          <Users className="h-10 w-10 text-[#819A91] mx-auto mb-3 animate-pulse" />
          <p className="text-gray-600 text-lg">লেখকদের ডাটা লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  // ❌ Error / empty state
  if (error || authors.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#EEEFE0]/20 to-white flex items-center justify-center">
        <div className="text-center">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            কোন লেখক পাওয়া যায়নি
          </h2>
          <p className="text-gray-600 mb-2">
            {error || "বর্তমানে কোন লেখকের তথ্য পাওয়া যায়নি"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEEFE0]/20 to-white py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-2 h-12 bg-gradient-to-b from-[#819A91] to-[#A7C1A8] rounded-full"></div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
              লেখকবৃন্দ
            </h1>
            <Users className="h-8 w-8 md:h-10 md:w-10 text-[#819A91]" />
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            আমাদের বিশিষ্ট লেখকদের পরিচিতি এবং তাদের রচিত বইসমূহ দেখুন
          </p>
        </div>

        {/* Authors Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {authors.map((author, index) => {
            const authoredBooksCount =
              author.bookCount ??
              author.productCount ??
              author._count?.products ??
              0;

            // Generate different background colors for variety
            const colorVariants = [
              "from-[#819A91] to-[#A7C1A8]",
              "from-[#A7C1A8] to-[#819A91]",
              "from-[#819A91] to-[#D1D8BE]",
              "from-[#A7C1A8] to-[#D1D8BE]",
            ];
            const colorVariant = colorVariants[index % colorVariants.length];

            return (
              <Link
                href={`/kitabghor/authors/${author.id}`}
                key={author.id}
                className="group hover:no-underline block"
              >
                <Card className="h-full border-0 bg-gradient-to-br from-white to-[#EEEFE0] shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden relative">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-3 right-3 w-6 h-6 border border-[#819A91] rounded-full"></div>
                    <div className="absolute bottom-3 left-3 w-4 h-4 bg-[#A7C1A8] rotate-45"></div>
                  </div>

                  {/* Hover Border Effect */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#819A91]/20 transition-all duration-500 pointer-events-none"></div>

                  <CardContent className="p-6 md:p-8 text-center flex flex-col items-center justify-center h-full relative z-10">
                    {/* Author Avatar Container */}
                    <div className="relative mb-4 md:mb-6">
                      {/* Background Gradient Ring */}
                      <div
                        className={`absolute -inset-2 bg-gradient-to-br ${colorVariant} rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
                      ></div>

                      {/* Main Avatar */}
                      <div className="relative bg-white p-1 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 border-2 border-[#D1D8BE]">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden relative bg-gradient-to-br from-[#EEEFE0] to-[#D1D8BE] flex items-center justify-center">
                          <Image
                            src="/assets/authors/profile.png"
                            alt={author.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          {/* Fallback Icon */}
                          <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <User className="h-8 w-8 text-white/80" />
                          </div>
                        </div>
                      </div>

                      {/* Book Count Badge */}
                      <div
                        className={`absolute -bottom-2 -right-2 bg-gradient-to-r ${colorVariant} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1`}
                      >
                        <BookOpen className="h-3 w-3" />
                        <span>{authoredBooksCount}</span>
                      </div>

                      {/* Pen Icon Decoration */}
                      <div className="absolute -top-2 -left-2 bg-white p-1.5 rounded-full shadow-md">
                        <PenTool className="h-3 w-3 text-[#819A91]" />
                      </div>
                    </div>

                    {/* Author Name */}
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 group-hover:text-[#819A91] transition-colors duration-300 line-clamp-2 leading-tight min-h-[3rem] flex items-center justify-center">
                      {author.name}
                    </h3>

                    {/* Book Count Text */}
                    <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-[#819A91]" />
                      <span>মোট {authoredBooksCount} টি বই</span>
                    </p>

                    {/* CTA Button */}
                    <div className="flex items-center justify-center gap-2 text-[#819A91] group-hover:text-[#A7C1A8] transition-colors duration-300 font-semibold text-sm">
                      <span>বই দেখুন</span>
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>

                    {/* Hover Effect Line */}
                    <div className="w-0 group-hover:w-12 h-0.5 bg-gradient-to-r from-[#819A91] to-[#A7C1A8] rounded-full transition-all duration-500 mt-2"></div>
                  </CardContent>

                  {/* Popular Author Badge */}
                  {authoredBooksCount >= 5 && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-20">
                      জনপ্রিয়
                    </div>
                  )}

                  {/* New Author Badge */}
                  {authoredBooksCount <= 2 && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-20">
                      নতুন
                    </div>
                  )}

                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#819A91]/5 to-[#A7C1A8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
