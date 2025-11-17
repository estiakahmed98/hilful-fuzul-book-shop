"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { products } from "@/public/BookData";
import { Filter, Calendar,  BookOpen, ArrowRight, Zap} from "lucide-react";

export default function BookFairPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredBooks = selectedCategory
    ? products.filter((book) => book.category.name === selectedCategory)
    : products;

  const fairCategories = Array.from(
    new Set(products.map((book) => book.category.name))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEEFE0]/30 to-white py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-2 h-12 bg-gradient-to-b from-[#819A91] to-[#A7C1A8] rounded-full"></div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
              বইমেলা ২০২৪
            </h1>
            <Calendar className="h-8 w-8 md:h-10 md:w-10 text-[#819A91]" />
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            বিশেষ বইমেলা অফার! সীমিত সময়ের জন্য বিশেষ মূল্যে বই কিনুন
          </p>
          
          {/* Fair Countdown/Tag */}
          <div className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-[#819A91] to-[#A7C1A8] text-white px-6 py-3 rounded-full shadow-lg">
            <Zap className="h-5 w-5" />
            <span className="font-semibold">স্পেশাল অফার - সীমিত সময়ের জন্য</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar Filter */}
          <div className="lg:col-span-1">
            <Card className="border-0 bg-gradient-to-b from-[#EEEFE0] to-white shadow-lg rounded-2xl sticky top-8">
              <CardContent className="p-6">
                {/* Filter Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#D1D8BE]">
                  <Filter className="h-5 w-5 text-[#819A91]" />
                  <h2 className="text-xl font-bold text-gray-800">কওমী পাঠ্য কিতাব</h2>
                </div>

                {/* Category List */}
                <div className="space-y-3">
                  {/* All Categories Button */}
                  <button
                    className={`w-full text-left p-3 rounded-xl transition-all duration-300 flex items-center justify-between group ${
                      selectedCategory === null
                        ? "bg-gradient-to-r from-[#819A91] to-[#A7C1A8] text-white shadow-lg"
                        : "bg-white hover:bg-[#D1D8BE] text-gray-700 border border-[#D1D8BE]"
                    }`}
                    onClick={() => setSelectedCategory(null)}
                  >
                    <span className="font-semibold">সকল বই</span>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      selectedCategory === null ? "bg-white/20" : "bg-[#819A91] text-white"
                    }`}>
                      {products.length}
                    </div>
                  </button>

                  {fairCategories.map((category) => {
                    const categoryCount = products.filter(book => book.category.name === category).length;
                    return (
                      <button
                        key={category}
                        className={`w-full text-left p-3 rounded-xl transition-all duration-300 flex items-center justify-between group ${
                          selectedCategory === category
                            ? "bg-gradient-to-r from-[#819A91] to-[#A7C1A8] text-white shadow-lg"
                            : "bg-white hover:bg-[#D1D8BE] text-gray-700 border border-[#D1D8BE]"
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        <span className="font-medium text-sm group-hover:translate-x-1 transition-transform">
                          {category}
                        </span>
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          selectedCategory === category ? "bg-white/20" : "bg-[#819A91]/10 text-[#819A91]"
                        }`}>
                          {categoryCount}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Fair Info */}
                <div className="mt-8 p-4 bg-gradient-to-r from-[#819A91]/10 to-[#A7C1A8]/10 rounded-xl border border-[#D1D8BE]">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-[#819A91]" />
                    বইমেলা তথ্য
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• বিশেষ মূল্যে সকল বই</li>
                    <li>• বিনামূল্যে হোম ডেলিভারি</li>
                    <li>• এক্সক্লুসিভ অফার</li>
                    <li>• সীমিত সময়ের জন্য</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Book Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="text-gray-600">
                <span className="font-semibold text-[#819A91]">{filteredBooks.length}</span>টি বই পাওয়া গেছে
                {selectedCategory && (
                  <span className="ml-2">- <span className="font-semibold">{selectedCategory}</span></span>
                )}
              </div>
              
              {selectedCategory && (
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedCategory(null)}
                  className="rounded-full border-[#819A91] text-[#819A91] hover:bg-[#819A91] hover:text-white"
                >
                  ফিল্টার সরান
                </Button>
              )}
            </div>

            {/* Books Grid */}
            {filteredBooks.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">কোন বই পাওয়া যায়নি</h3>
                <p className="text-gray-500 mb-6">এই বিভাগে এখনও কোন বই যোগ করা হয়নি</p>
                <Button 
                  onClick={() => setSelectedCategory(null)}
                  className="rounded-full bg-gradient-to-r from-[#819A91] to-[#A7C1A8] text-white px-8"
                >
                  সব বই দেখুন
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <Card
                    key={book.id}
                    className="group overflow-hidden border-0 bg-gradient-to-br from-white to-[#EEEFE0] shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl relative"
                  >
                    {/* Fair Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        বইমেলা বিশেষ
                      </div>
                    </div>

                    {/* Book Image */}
                    <Link href={`/kitabghor/books/${book.id}`}>
                      <div className="relative h-48 sm:h-56 w-full overflow-hidden">
                        <Image
                          src={book.image}
                          alt={book.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </Link>

                    <CardContent className="p-4 sm:p-5">
                      {/* Book Title */}
                      <Link href={`/kitabghor/books/${book.id}`}>
                        <h3 className="font-bold text-base sm:text-lg mb-2 text-gray-800 hover:text-[#819A91] duration-300 line-clamp-2 leading-tight group-hover:translate-x-1 transition-transform">
                          {book.name}
                        </h3>
                      </Link>

                      {/* Author */}
                      <p className="text-sm text-gray-600 mb-3 flex items-center">
                        <span className="w-1 h-1 bg-[#819A91] rounded-full mr-2"></span>
                        {book.writer.name}
                      </p>

                      {/* Price */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-lg sm:text-xl text-[#819A91]">
                            ৳{book.price}
                          </span>
                          {book.original_price > book.price && (
                            <span className="text-sm text-gray-500 line-through">
                              ৳{book.original_price}
                            </span>
                          )}
                        </div>
                        {book.original_price > book.price && (
                          <div className="text-xs font-semibold bg-[#D1D8BE] text-gray-700 px-2 py-1 rounded-full">
                            সাশ্রয় করুন
                          </div>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 sm:p-5 pt-0">
                      <Link href={`/kitabghor/books/${book.id}`} className="w-full">
                        <Button
                          className="w-full rounded-xl py-3 sm:py-4 bg-gradient-to-r from-[#819A91] to-[#A7C1A8] hover:from-[#A7C1A8] hover:to-[#819A91] text-white font-semibold border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group/btn"
                        >
                          <BookOpen className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                          বিস্তারিত দেখুন
                        </Button>
                      </Link>
                    </CardFooter>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#819A91]/20 transition-all duration-500 pointer-events-none"></div>
                  </Card>
                ))}
              </div>
            )}

            {/* Load More Section */}
            {filteredBooks.length > 0 && (
              <div className="text-center mt-12">
                <div className="bg-gradient-to-r from-[#819A91] to-[#A7C1A8] p-0.5 rounded-full inline-block">
                  <Button 
                    variant="ghost" 
                    className="rounded-full bg-white hover:bg-gray-50 text-gray-800 font-semibold px-8 py-6 group text-sm sm:text-base"
                  >
                    <span className="mr-2">আরও বই লোড করুন</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}