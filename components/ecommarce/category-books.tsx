"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { products } from "@/public/BookData";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/ecommarce/CartContext";
import { useWishlist } from "@/components/ecommarce/WishlistContext";
import { toast } from "sonner";

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
}

export default function CategoryBooks({ category }: { category: Category }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const categoryBooks = products.filter(
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

  const handleAddToCart = (book: Product) => {
    addToCart(book.id);
    toast.success(`"${book.name}" কার্টে যোগ করা হয়েছে`);
  };

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">{category.name}</h3>
        {categoryBooks.length > 8 && (
          <Link href={`/kitabghor/categories/${category.id}`}>
            <Button variant="outline">সব দেখুন</Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayBooks.map((book: Product) => (
          <Card
            key={book.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <Link href={`kitabghor/books/${book.id}`}>
              <div className="relative h-64 w-full">
                <Image
                  src={book.image || "/placeholder.svg"}
                  alt={book.name}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
            </Link>
            <CardContent className="p-4">
              <Link href={`kitabghor/books/${book.id}`}>
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
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(book.id);
                  }}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                  aria-label={
                    isInWishlist(book.id)
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                >
                  <Heart
                    className={`h-5 w-5 ${isInWishlist(book.id) ? "fill-red-500 text-red-500" : ""}`}
                  />
                </button>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                className="w-full"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart(book);
                }}
              >
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
