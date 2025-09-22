"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/public/BookData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/ecommarce/CartContext";
import { useWishlist } from "@/components/ecommarce/WishlistContext";
import { toast } from "sonner";

export default function AuthorBooksPage() {
  const rawId = useParams().id;
  const authorId = parseInt(Array.isArray(rawId) ? rawId[0] : (rawId ?? "0"));
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const authorBooks = products.filter((book) => book.writer.id === authorId);

  const authorName = authorBooks[0]?.writer.name;

  const toggleWishlist = (bookId: number) => {
    if (isInWishlist(bookId)) {
      removeFromWishlist(bookId);
      toast.success("উইশলিস্ট থেকে সরানো হয়েছে");
    } else {
      addToWishlist(bookId);
      toast.success("উইশলিস্টে যোগ করা হয়েছে");
    }
  };

  if (authorBooks.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4">কোন বই পাওয়া যায়নি</div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">
        লেখক: {authorName} — {authorBooks.length} টি বই
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {authorBooks.map((book) => (
          <Card key={book.id} className="overflow-hidden">
            <Link href={`/kitabghor/books/${book.id}`}>
              <div className="relative h-64 w-full">
                <Image
                  src={book.image || "/placeholder.svg"}
                  alt={book.name}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
              </div>
            </Link>
            <CardContent className="p-4">
              <Link href={`/kitabghor/books/${book.id}`}>
                <h4 className="font-semibold text-lg mb-1 hover:text-primary transition-colors line-clamp-2">
                  {book.name}
                </h4>
              </Link>
              <p className="text-sm text-muted-foreground mb-2">
                {book.writer.name}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-lg">৳{book.price}</span>
                  {book.discount > 0 && (
                    <span className="text-sm text-muted-foreground line-through ml-2">
                      ৳{book.original_price}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => toggleWishlist(book.id)}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                  aria-label="Toggle wishlist"
                >
                  <Heart
                    className={`h-5 w-5 ${isInWishlist(book.id) ? "fill-red-500 text-red-500" : ""}`}
                  />
                </button>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full" onClick={() => addToCart(book.id)}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                কার্টে যোগ করুন
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
