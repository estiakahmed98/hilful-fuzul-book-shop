"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { products } from "@/public/BookData";
import { BookOpen, ArrowRight, Library } from "lucide-react";

export default function CategoryCardsPage() {
  const categories = [
    { id: 1, name: "আত্মজীবনী", slug: "bio", icon: "📖" },
    { id: 2, name: "রীতিনীতি", slug: "ritiniti", icon: "🏛️" },
    { id: 3, name: "হযরত মাওলানা কালিম সিদ্দিকী", slug: "kalim", icon: "👳" },
    { id: 4, name: "ইসলাম ও হেদায়েত", slug: "Hedayet", icon: "🕌" },
    { id: 5, name: "দাওয়াত ও দায়ী", slug: "daye", icon: "📢" },
    { id: 6, name: "হিন্দু ভাইদের জন্য", slug: "hindu", icon: "🕉️" },
    { id: 7, name: "খ্রিষ্টান ভাইদের জন্য", slug: "christran", icon: "✝️" },
  ];

  return (
    <div className="min-h-screen  bg-gradient-to-b from-[#EEEFE0]/20 to-white py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-2 h-12 bg-gradient-to-b from-[#819A91] to-[#A7C1A8] rounded-full"></div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
              বিষয়সমূহ
            </h1>
            <Library className="h-8 w-8 md:h-10 md:w-10 text-[#819A91]" />
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            বিভিন্ন বিষয়ের উপর লেখা আমাদের বইগুলির সংগ্রহ ব্রাউজ করুন
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category) => {
            const categoryBooks = products.filter(
              (book) => book.category.id === category.id
            );

            const imagePath = `/assets/others/payments/${category.slug}.png`;

            return (
              <Link
                href={`/kitabghor/categories/${category.id}`}
                key={category.id}
                className="group hover:no-underline block"
              >
                <Card className="h-full border-0 bg-gradient-to-br from-white to-[#EEEFE0] shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden relative">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-2 right-2 w-8 h-8 border border-[#819A91] rounded-full"></div>
                    <div className="absolute bottom-2 left-2 w-6 h-6 bg-[#A7C1A8] rotate-45"></div>
                  </div>

                  {/* Hover Border Effect */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#819A91]/20 transition-all duration-500 pointer-events-none"></div>

                  <CardContent className="p-6 md:p-8 text-center flex flex-col items-center justify-center h-full relative z-10">
                    {/* Icon Container */}
                    <div className="relative mb-4 md:mb-6">
                      {/* Background Circle */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#819A91] to-[#A7C1A8] rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                      
                      {/* Main Icon */}
                      <div className="relative bg-white p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 border border-[#D1D8BE]">
                        <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center text-2xl md:text-3xl">
                          {category.icon}
                        </div>
                      </div>

                      {/* Book Count Badge */}
                      <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#819A91] to-[#A7C1A8] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        {categoryBooks.length}
                      </div>
                    </div>

                    {/* Category Name */}
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 group-hover:text-[#819A91] transition-colors duration-300 line-clamp-2 leading-tight">
                      {category.name}
                    </h3>

                    {/* Book Count Text */}
                    <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-[#819A91]" />
                      <span>মোট {categoryBooks.length} টি বই</span>
                    </p>

                    {/* CTA Button */}
                    <div className="flex items-center justify-center gap-2 text-[#819A91] group-hover:text-[#A7C1A8] transition-colors duration-300 font-semibold text-sm">
                      <span>ব্রাউজ করুন</span>
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>

                    {/* Hover Effect Line */}
                    <div className="w-0 group-hover:w-12 h-0.5 bg-gradient-to-r from-[#819A91] to-[#A7C1A8] rounded-full transition-all duration-500 mt-2"></div>
                  </CardContent>

                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#819A91]/5 to-[#A7C1A8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-12 md:mt-16">
          <div className="bg-gradient-to-r from-[#819A91] to-[#A7C1A8] p-0.5 rounded-full inline-block">
            <div className="bg-white rounded-full px-8 py-4">
              <p className="text-gray-700 font-semibold text-lg">
                আরও বিষয়সমূহ শীঘ্রই আসছে...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}