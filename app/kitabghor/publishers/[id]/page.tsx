"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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

interface BookFromApi {
  id: number;
  name: string;
  image: string | null;
  price: number;
  original_price?: number | null;
  discount: number;
  writer: {
    id: number;
    name: string;
  };
  publisher: {
    id: number;
    name: string;
  };
}

export default function PublisherBooksPage() {
  const params = useParams();
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const publisherId = parseInt(rawId ?? "0", 10);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [publisher, setPublisher] = useState<PublisherFromApi | null>(null);
  const [booksByPublisher, setBooksByPublisher] = useState<BookFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 API থেকে publisher + তার সব বই লোড
  useEffect(() => {
    if (!publisherId || Number.isNaN(publisherId)) {
      setError("ভুল প্রকাশক আইডি প্রদান করা হয়েছে।");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) প্রকাশক ডেটা
        const resPublisher = await fetch(`/api/publishers/${publisherId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        const publisherData = await resPublisher.json().catch(() => null);

        if (!resPublisher.ok) {
          console.error(
            "Failed to fetch publisher:",
            publisherData || resPublisher.statusText
          );

          if (resPublisher.status === 404) {
            setError("প্রকাশক পাওয়া যায়নি।");
          } else {
            setError("প্রকাশকের তথ্য লোড করতে সমস্যা হয়েছে।");
          }

          setPublisher(null);
          setBooksByPublisher([]);
          return;
        }

        setPublisher(publisherData as PublisherFromApi);

        // 2) সব প্রোডাক্ট নিয়ে আসি, তারপর publisherId দিয়ে filter করি
        const resProducts = await fetch("/api/products", { cache: "no-store" });

        if (!resProducts.ok) {
          console.error("Failed to fetch products:", resProducts.statusText);
          // পণ্য না পেলেও পেজ দেখাবো, শুধু বই শূন্য হবে
          setBooksByPublisher([]);
          return;
        }

        const allProducts: BookFromApi[] = await resProducts.json().catch(() => []);

        if (!Array.isArray(allProducts)) {
          console.error("Invalid products response:", allProducts);
          setBooksByPublisher([]);
          return;
        }

        const filtered = allProducts.filter(
          (book) => Number(book.publisher?.id) === Number(publisherId)
        );

        setBooksByPublisher(filtered);
      } catch (err) {
        console.error("Error fetching publisher/books:", err);
        setError("ডাটা লোড করতে সমস্যা হয়েছে।");
        setPublisher(null);
        setBooksByPublisher([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const handleAddToCart = (book: BookFromApi) => {
    // শুধু context এ যোগ হচ্ছে (guest + logged-in দুই কেসেই কাজ করবে)
    addToCart(book.id);
    toast.success(`"${book.name}" কার্টে যোগ করা হয়েছে`);
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
      </div>
    );
  }

  // 🔹 publisher না পেলে
  if (!publisher) {
    return (
      <div className="container mx-auto py-12 px-4">
        প্রকাশক পাওয়া যায়নি।
      </div>
    );
  }

  // 🔹 কোনো বই নাই
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
                {book.writer?.name}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-lg">৳{book.price}</span>
                  {book.discount > 0 && book.original_price && (
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
              <Button className="w-full" onClick={() => handleAddToCart(book)}>
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
