"use client";

import {useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, ShoppingCart, BookOpen, ArrowLeft, Star, Filter, BookText } from "lucide-react";
import { products, categories } from "@/public/BookData";
import { useCart } from "@/components/ecommarce/CartContext";
import { useWishlist } from "@/components/ecommarce/WishlistContext";
import { toast } from "sonner";

interface CategoryPageProps {
  params: {
    id: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const categoryId = Number.parseInt(params.id);
  const category = categories.find((cat) => cat.id === categoryId);

  const categoryBooks = products.filter(
    (product) => product.category.id === categoryId
  );

  // Fixed: Remove useEffect and use deterministic ratings
  const getBookWithEnhancements = useCallback((book: any, index: number) => ({
    ...book,
    rating: 4.2 + (index * 0.1) % 0.8, // Slightly varied but deterministic
    isBestseller: index % 3 === 0,
    isNew: index % 4 === 0,
  }), []);

  const toggleWishlist = useCallback((bookId: number) => {
    if (isInWishlist(bookId)) {
      removeFromWishlist(bookId);
      toast.success("উইশলিস্ট থেকে সরানো হয়েছে");
    } else {
      addToWishlist(bookId);
      toast.success("উইশলিস্টে যোগ করা হয়েছে");
    }
  }, [isInWishlist, removeFromWishlist, addToWishlist]);

  const handleAddToCart = useCallback((book: any) => {
    addToCart(book.id);
    toast.success(`"${book.name}" কার্টে যোগ করা হয়েছে`);
  }, [addToCart]);

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#EEEFE0]/30 to-white py-16 flex items-center justify-center">
        <div className="text-center">
          <BookText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">বিভাগ পাওয়া যায়নি</h2>
          <p className="text-gray-600 mb-6">আপনার অনুসন্ধানকৃত বিভাগটি খুঁজে পাওয়া যায়নি</p>
          <Link href="/kitabghor/categories">
            <Button className="rounded-full bg-gradient-to-r from-[#819A91] to-[#A7C1A8] text-white px-8">
              সকল বিভাগ দেখুন
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-gradient-to-b from-[#EEEFE0]/30 to-white py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Link 
                href="/kitabghor/categories" 
                className="flex items-center gap-2 text-[#819A91] hover:text-[#A7C1A8] transition-colors duration-300 group"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                <span>সকল বিভাগ</span>
              </Link>
              <div className="w-1 h-8 bg-gradient-to-b from-[#819A91] to-[#A7C1A8] rounded-full"></div>
            </div>
            
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg border border-[#D1D8BE]">
              <Filter className="h-4 w-4 text-[#819A91]" />
              <span className="text-sm text-gray-600">সাজান:</span>
              <select className="bg-transparent border-0 text-sm focus:outline-none focus:ring-0">
                <option>সর্বশেষ</option>
                <option>নাম অনুসারে</option>
                <option>দাম অনুসারে</option>
              </select>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#819A91] to-[#A7C1A8] rounded-2xl p-6 md:p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <BookOpen className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                  {category.name}
                </h1>
                <p className="text-white/90 opacity-90">
                  এই বিভাগের সকল বইয়ের সংগ্রহ
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>মোট {categoryBooks.length} টি বই</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>{categories.length}টি বিভাগ</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>১০০% গুণগত মান</span>
              </div>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {categoryBooks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">কোন বই পাওয়া যায়নি</h3>
            <p className="text-gray-500 mb-6">এই বিভাগে এখনও কোন বই যোগ করা হয়নি</p>
            <Link href="/kitabghor/categories">
              <Button className="rounded-full bg-gradient-to-r from-[#819A91] to-[#A7C1A8] text-white px-8">
                অন্যান্য বিভাগ দেখুন
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryBooks.map((book, index) => {
              const enhancedBook = getBookWithEnhancements(book, index);
              const isWishlisted = isInWishlist(book.id);
              
              return (
                <Card
                  key={book.id}
                  className="group overflow-hidden border-0 bg-gradient-to-br from-white to-[#EEEFE0] shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl relative"
                >
                  {/* Badges */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {enhancedBook.discount > 0 && (
                      <div className="bg-gradient-to-r from-[#819A91] to-[#A7C1A8] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        {enhancedBook.discount}% ছাড়
                      </div>
                    )}
                    {enhancedBook.isBestseller && (
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        বেস্টসেলার
                      </div>
                    )}
                    {enhancedBook.isNew && (
                      <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        নতুন
                      </div>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(book.id)}
                    className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                      isWishlisted 
                        ? "bg-red-500/20 text-red-500" 
                        : "bg-white/80 text-gray-500 hover:bg-red-500/20 hover:text-red-500"
                    }`}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart
                      className={`h-5 w-5 transition-all ${
                        isWishlisted ? "scale-110 fill-current" : "group-hover:scale-110"
                      }`}
                    />
                  </button>

                  {/* Book Image */}
                  <Link href={`/kitabghor/books/${book.id}`}>
                    <div className="relative h-48 sm:h-56 md:h-64 w-full overflow-hidden">
                      <Image
                        src={book.image || "/placeholder.svg"}
                        alt={book.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Quick View */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <BookOpen className="h-6 w-6 text-[#819A91]" />
                        </div>
                      </div>
                    </div>
                  </Link>

                  <CardContent className="p-4 sm:p-5">
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= Math.floor(enhancedBook.rating!)
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">
                        ({enhancedBook.rating!.toFixed(1)})
                      </span>
                    </div>

                    {/* Book Title */}
                    <Link href={`/kitabghor/books/${book.id}`}>
                      <h4 className="font-bold text-lg mb-2 text-gray-800 hover:text-[#819A91] transition-colors duration-300 line-clamp-2 leading-tight group-hover:translate-x-1 transition-transform">
                        {book.name}
                      </h4>
                    </Link>

                    {/* Author */}
                    <p className="text-sm text-gray-600 mb-3 flex items-center">
                      <span className="w-1 h-1 bg-[#819A91] rounded-full mr-2"></span>
                      {book.writer.name}
                    </p>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-xl text-[#819A91]">
                          ৳{book.price}
                        </span>
                        {book.discount > 0 && (
                          <span className="text-sm text-gray-500 line-through">
                            ৳{book.original_price}
                          </span>
                        )}
                      </div>
                      {book.discount > 0 && (
                        <div className="text-xs font-semibold bg-[#D1D8BE] text-gray-700 px-2 py-1 rounded-full">
                          সাশ্রয় করুন
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 sm:p-5 pt-0">
                    <Button
                      className="w-full rounded-xl py-3 sm:py-4 bg-gradient-to-r from-[#819A91] to-[#A7C1A8] hover:from-[#A7C1A8] hover:to-[#819A91] text-white font-semibold border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group/btn"
                      onClick={() => handleAddToCart(book)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                      কার্টে যোগ করুন
                    </Button>
                  </CardFooter>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#819A91]/20 transition-all duration-500 pointer-events-none"></div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-[#D1D8BE]">
          <Link 
            href="/kitabghor/categories" 
            className="flex items-center gap-2 text-[#819A91] hover:text-[#A7C1A8] transition-colors duration-300 group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>সকল বিভাগে ফিরে যান</span>
          </Link>
          
          <div className="text-sm text-gray-600">
            মোট <span className="font-semibold text-[#819A91]">{categoryBooks.length}</span> টি বই
          </div>
        </div>
      </div>
    </div>
  );
}