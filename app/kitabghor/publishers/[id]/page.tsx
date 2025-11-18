"use client";

import { useEffect, useState } from "react";
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

interface PublisherFromApi {
  id: number;
  name: string;
  image?: string | null;
}

export default function PublisherBooksPage() {
  const params = useParams();
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const publisherId = parseInt(rawId ?? "0", 10);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [publisher, setPublisher] = useState<PublisherFromApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 ওই publisher-এর বইগুলো (লোকাল BookData থেকে)
  const booksByPublisher = products.filter(
    (book) => book.publisher.id === publisherId
  );

  // 🔹 API থেকে publisher ডেটা লোড
  useEffect(() => {
    if (!publisherId || Number.isNaN(publisherId)) {
      setError("ভুল প্রকাশক আইডি প্রদান করা হয়েছে।");
      setLoading(false);
      return;
    }

    const fetchPublisher = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/publishers/${publisherId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          console.error("Failed to fetch publisher:", data || res.statusText);

          if (res.status === 404) {
            setError("প্রকাশক পাওয়া যায়নি।");
          } else {
            setError("প্রকাশকের তথ্য লোড করতে সমস্যা হয়েছে।");
          }

          setPublisher(null);
          return;
        }

        setPublisher(data as PublisherFromApi);
      } catch (err) {
        console.error("Error fetching publisher:", err);
        setError("প্রকাশকের তথ্য লোড করতে সমস্যা হয়েছে।");
        setPublisher(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPublisher();
  }, [publisherId]);

  const toggleWishlist = (bookId: number) => {
    if (isInWishlist(bookId)) {
      removeFromWishlist(bookId);
      toast.success("উইশলিস্ট থেকে সরানো হয়েছে");
    } else {
      addToWishlist(bookId);
      toast.success("উইশলিস্টে যোগ করা হয়েছে");
    }
  };

  // 🔹 লোডিং স্টেট
  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        প্রকাশকের তথ্য লোড হচ্ছে...
      </div>
    );
  }

  // 🔹 error স্টেট
  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <p className="text-red-500 mb-4">{error}</p>
        {booksByPublisher.length > 0 && (
          <p className="text-sm text-muted-foreground">
            লোকাল ডেটা অনুযায়ী এই প্রকাশকের অধীনে {booksByPublisher.length} টি
            বই পাওয়া গেছে।
          </p>
        )}
      </div>
    );
  }

  // 🔹 publisher না পেলে (সেফগার্ড)
  if (!publisher) {
    return (
      <div className="container mx-auto py-12 px-4">
        প্রকাশক পাওয়া যায়নি।
      </div>
    );
  }

  // 🔹 কোনো বই নাই (publisher আছে কিন্তু BookData তে নেই)
  if (booksByPublisher.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-4">
          প্রকাশক: {publisher.name}
        </h1>
        <p>এই প্রকাশকের অধীনে কোনো বই পাওয়া যায়নি।</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">
        প্রকাশক: {publisher.name} — {booksByPublisher.length} টি বই
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {booksByPublisher.map((book) => (
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
                    className={`h-5 w-5 ${
                      isInWishlist(book.id)
                        ? "fill-red-500 text-red-500"
                        : ""
                    }`}
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
