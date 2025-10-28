"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Building, BookOpen, ArrowRight,Globe } from "lucide-react";
import { products } from "@/public/BookData";

// Extract unique publishers
const uniquePublishers = Array.from(
  new Map(products.map((book) => [book.publisher.id, book.publisher])).values()
);

export default function PublisherCategoriesPage() {
  return (
    <div className="min-h-screen  bg-gradient-to-b from-[#EEEFE0]/20 to-white py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-2 h-12 bg-gradient-to-b from-[#819A91] to-[#A7C1A8] rounded-full"></div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
              প্রকাশকবৃন্দ
            </h1>
            <Building className="h-8 w-8 md:h-10 md:w-10 text-[#819A91]" />
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            আমাদের বিশ্বস্ত প্রকাশক প্রতিষ্ঠানসমূহ এবং তাদের প্রকাশিত বইয়ের সংগ্রহ
          </p>
        </div>

        {/* Publishers Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {uniquePublishers.map((publisher, index) => {
            const booksByPublisher = products.filter(
              (book) => book.publisher.id === publisher.id
            );

            // Generate different background colors for variety
            const colorVariants = [
              "from-[#819A91] to-[#A7C1A8]",
              "from-[#A7C1A8] to-[#819A91]",
              "from-[#819A91] to-[#D1D8BE]",
              "from-[#A7C1A8] to-[#D1D8BE]"
            ];
            const colorVariant = colorVariants[index % colorVariants.length];

            return (
              <Card
                key={publisher.id}
                className="group h-full border-0 bg-gradient-to-br from-white to-[#EEEFE0] shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden relative"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-3 right-3 w-6 h-6 border border-[#819A91] rounded-full"></div>
                  <div className="absolute bottom-3 left-3 w-4 h-4 bg-[#A7C1A8] rotate-45"></div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#819A91]/20 transition-all duration-500 pointer-events-none"></div>

                <CardContent className="p-6 md:p-8 text-center flex flex-col items-center justify-center h-full relative z-10">
                  {/* Publisher Logo Container */}
                  <div className="relative mb-4 md:mb-6">
                    {/* Background Gradient Ring */}
                    <div className={`absolute -inset-2 bg-gradient-to-br ${colorVariant} rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                    
                    {/* Main Logo */}
                    <div className="relative bg-white p-2 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 border-2 border-[#D1D8BE]">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden relative bg-gradient-to-br from-[#EEEFE0] to-[#D1D8BE] flex items-center justify-center">
                        <Image
                          src="/assets/publication/logo.jpg"
                          alt={publisher.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        {/* Fallback Icon */}
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Building className="h-8 w-8 text-white/80" />
                        </div>
                      </div>
                    </div>

                    {/* Book Count Badge */}
                    <div className={`absolute -bottom-2 -right-2 bg-gradient-to-r ${colorVariant} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1`}>
                      <BookOpen className="h-3 w-3" />
                      <span>{booksByPublisher.length}</span>
                    </div>

                    {/* Globe Icon Decoration */}
                    <div className="absolute -top-2 -left-2 bg-white p-1.5 rounded-full shadow-md">
                      <Globe className="h-3 w-3 text-[#819A91]" />
                    </div>
                  </div>

                  {/* Publisher Name */}
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 group-hover:text-[#819A91] transition-colors duration-300 line-clamp-2 leading-tight">
                    {publisher.name}
                  </h3>

                  {/* Location */}
                  <p className="text-sm text-gray-600 mb-3 flex items-center justify-center gap-2">
                    <MapPin className="h-4 w-4 text-[#819A91]" />
                    <span>অজানা স্থান</span>
                  </p>

                  {/* Description */}
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                    এই প্রকাশকের সম্পর্কে আরও তথ্য প্রাপ্ত হয়নি।
                  </p>

                  {/* Action Buttons */}
                  <div className="w-full space-y-3">
                    <Link
                      href={`/kitabghor/publishers/${publisher.id}`}
                      className="block w-full"
                    >
                      <Button 
                        className="w-full rounded-xl bg-gradient-to-r from-[#819A91] to-[#A7C1A8] hover:from-[#A7C1A8] hover:to-[#819A91] text-white font-semibold py-3 border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group/btn"
                      >
                        <BookOpen className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                        সকল বই দেখুন
                      </Button>
                    </Link>

                    <Button 
                      variant="outline" 
                      className="w-full rounded-xl border-[#D1D8BE] text-gray-600 hover:bg-[#819A91] hover:text-white hover:border-[#819A91] transition-all duration-300 flex items-center justify-center gap-2 group/learn"
                      disabled
                    >
                      <span>আরো জানুন</span>
                      <ArrowRight className="h-4 w-4 transform group-hover/learn:translate-x-1 transition-transform" />
                    </Button>
                  </div>

                  {/* Hover Effect Line */}
                  <div className="w-0 group-hover:w-12 h-0.5 bg-gradient-to-r from-[#819A91] to-[#A7C1A8] rounded-full transition-all duration-500 mt-3"></div>
                </CardContent>

                {/* Established Publisher Badge */}
                {booksByPublisher.length >= 10 && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-20">
                    প্রতিষ্ঠিত
                  </div>
                )}

                {/* New Publisher Badge */}
                {booksByPublisher.length <= 3 && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-20">
                    নতুন
                  </div>
                )}

                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#819A91]/5 to-[#A7C1A8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}