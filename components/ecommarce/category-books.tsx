"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { products } from "@/public/BookData";
import { Heart, ShoppingCart, Star, Zap, BookOpen } from "lucide-react";
import { useCart } from "@/components/ecommarce/CartContext";
import { useWishlist } from "@/components/ecommarce/WishlistContext";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface Category {
  id: string | number;
  name: string;
}

interface Product {
  id: string | number;
  name: string;
  category: { id: string | number };
  price: number;
  original_price: number;
  discount: number;
  writer: { name: string };
  image: string;
  rating?: number;
  isBestseller?: boolean;
  isNew?: boolean;
}

export default function CategoryBooks({ category }: { category: Category }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { data: session } = useSession();

  // Show ALL products if category.id === "all"
  const categoryBooks =
    category.id === "all"
      ? products
      : products.filter(
          (product: Product) => product.category.id === category.id
        );

  const displayBooks = categoryBooks.slice(0, 8);

  const toggleWishlist = (productId: string | number) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
      toast.success("উইশলিস্ট থেকে সরানো হয়েছে");
    } else {
      addToWishlist(productId);
      toast.success("উইশলিস্টে যোগ করা হয়েছে");
    }
  };

  const handleAddToCart = async (book: Product) => {
    try {
      if (!session?.user) {
        toast.error("কার্টে যোগ করতে আগে লগইন করুন");
        return;
      }

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: Number(book.id),
          quantity: 1,
        }),
      });

      if (res.status === 401) {
        toast.error("কার্টে যোগ করতে আগে লগইন করুন");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        console.error("Add to cart failed:", data || res.statusText);
        toast.error("কার্টে যোগ করা যায়নি, আবার চেষ্টা করুন");
        return;
      }

      // API theke chaile response use korte paro
      // const cartItem = await res.json();

      // local context update (jodi useCart local state rakhe)
      addToCart(book.id);

      toast.success(`"${book.name}" কার্টে যোগ করা হয়েছে`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("কার্টে যোগ করতে সমস্যা হয়েছে");
    }
  };

  // Generate random ratings and badges for demo
  const getBookWithEnhancements = (book: Product, index: number): Product => ({
    ...book,
    rating: Math.random() * 2 + 3, // 3-5 stars
    isBestseller: index % 3 === 0,
    isNew: index % 4 === 0,
  });

  return (
    <div className="mb-16">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-1 h-8 bg-gradient-to-b from-[#819A91] to-[#A7C1A8] rounded-full"></div>
          <div>
            <h3 className="text-3xl font-bold text-gray-800">
              {category.name}
            </h3>
            <p className="text-gray-600 mt-1">
              {categoryBooks.length}টি বই পাওয়া যাচ্ছে
            </p>
          </div>
        </div>
        {categoryBooks.length > 8 && (
          <Link href={`/kitabghor/categories/${category.id}`}>
            <Button
              variant="outline"
              className="rounded-full border-[#819A91] text-[#819A91] hover:bg-[#819A91] hover:text-white transition-all duration-300 px-6 group"
            >
              সব দেখুন
              <Zap className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
            </Button>
          </Link>
        )}
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {displayBooks.map((book: Product, index) => {
          const enhancedBook = getBookWithEnhancements(book, index);
          const isWishlisted = isInWishlist(book.id);

          return (
            <Card
              key={book.id}
              className="group overflow-hidden border-0 shadow-sm hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-[#EEEFE0] rounded-2xl relative"
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
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(book.id);
                }}
                className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                  isWishlisted
                    ? "bg-red-500/20 text-red-500"
                    : "bg-white/80 text-gray-500 hover:bg-red-500/20 hover:text-red-500"
                }`}
                aria-label={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <Heart
                  className={`h-5 w-5 transition-all ${
                    isWishlisted
                      ? "scale-110 fill-current"
                      : "group-hover:scale-110"
                  }`}
                />
              </button>

              {/* Book Image */}
              <Link href={`kitabghor/books/${book.id}`}>
                <div className="relative h-72 w-full overflow-hidden">
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

              <CardContent className="p-5">
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
                <Link href={`kitabghor/books/${book.id}`}>
                  <h4 className="font-bold text-lg mb-2 text-gray-800 hover:text-[#819A91] duration-300 line-clamp-2 leading-tight group-hover:translate-x-1 transition-transform">
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

              <CardFooter className="p-5 pt-0">
                <Button
                  className="w-full rounded-xl py-6 bg-gradient-to-r from-[#2C4A3B] to-[#2C4A3B] hover:from-[#819A91] hover:to-[#819A91] text-white font-semibold border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group/btn"
                  onClick={(e) => {
                    e.preventDefault();
                    void handleAddToCart(book);
                  }}
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

      {/* View All Bottom CTA */}
      {categoryBooks.length > 8 && (
        <div className="text-center mt-10">
          <Link href={`/kitabghor/categories/${category.id}`}>
            <Button
              variant="ghost"
              className="rounded-full bg-[#D1D8BE] hover:bg-[#819A91] text-gray-700 hover:text-white transition-all duration-300 px-8 py-6 group"
            >
              <span className="mr-2">
                {categoryBooks.length - 8}+ আরও বই দেখুন
              </span>
              <Zap className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
