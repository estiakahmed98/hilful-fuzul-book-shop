"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { products } from "@/public/BookData";
import {
  Heart,
  ShoppingCart,
  Star,
  BookOpen,
  CuboidIcon as Cube,
  X,
} from "lucide-react";
import BookModel from "@/components/ecommarce/book-model";
import PdfViewer from "@/components/ecommarce/pdf-viewer";
import RelatedBooks from "@/components/ecommarce/related-books";
import BookReviews from "@/components/ecommarce/book-reviews";
import { useCart } from "@/components/ecommarce/CartContext";
import { useWishlist } from "@/components/ecommarce/WishlistContext";
import { toast } from "sonner";

interface Product {
  id: string | number;
  name: string;
  category: {
    id: string | number;
    name: string;
  };
  price: number;
  original_price: number;
  discount: number;
  writer: {
    id: string | number;
    name: string;
  };
  publisher: {
    id: string | number;
    name: string;
  };
  image: string;
  description: string;
  stock: number;
  modelUrl?: string;
  pdf?: string;
}

export default function BookDetail() {
  const params = useParams();
  const bookId = params.id as string;
  const book = products.find((product) => product.id.toString() === bookId);
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [showModel, setShowModel] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!book) {
    return <div className="container mx-auto py-12 px-4">বই পাওয়া যায়নি</div>;
  }

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= book.stock) {
      setQuantity(value);
    }
  };

  const toggleWishlist = () => {
    if (isInWishlist(book.id)) {
      removeFromWishlist(book.id);
      toast.success("উইশলিস্ট থেকে সরানো হয়েছে");
    } else {
      addToWishlist(book.id);
      toast.success("উইশলিস্টে যোগ করা হয়েছে");
    }
  };

  const handleAddToCart = () => {
    addToCart(book.id, quantity);
    toast.success(`${quantity} টি "${book.name}" কার্টে যোগ করা হয়েছে`);
  };

  const relatedBooks = products
    .filter(
      (product) =>
        product.category.id === book.category.id && product.id !== book.id
    )
    .slice(0, 4);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="relative">
          <div className="relative h-[500px] w-full rounded-lg overflow-hidden">
            <Image
              src={book.image}
              alt={book.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="mt-4 flex space-x-4">
            <Button
              onClick={() => setShowModel(true)}
              className="flex-1"
              variant="outline"
            >
              <Cube className="mr-2 h-4 w-4" />
              3D মডেল দেখুন
            </Button>
            <Button
              onClick={() => setShowPdf(true)}
              className="flex-1"
              variant="outline"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              PDF দেখুন
            </Button>
          </div>
        </div>

        <div>
          <div className="mb-6">
            <Link
              href={`/categories/${book.category.id}`}
              className="text-sm text-primary hover:underline"
            >
              {book.category.name}
            </Link>
            <h1 className="text-3xl font-bold mt-2 mb-3">{book.name}</h1>

            <div className="flex items-center mb-3">
              <div className="flex mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(12 রিভিউ)</span>
            </div>

            <div className="mb-3">
              <span className="text-2xl font-bold">৳{book.price}</span>
              {book.discount > 0 && (
                <>
                  <span className="text-lg text-muted-foreground line-through ml-2">
                    ৳{book.original_price}
                  </span>
                  <span className="ml-2 bg-red-100 text-red-700 px-2 py-0.5 rounded text-sm">
                    {book.discount}% ছাড়
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center mb-3">
              <span className="text-sm mr-2">লেখক:</span>
              <Link
                href={`/authors/${book.writer.id}`}
                className="text-sm font-medium hover:text-primary"
              >
                {book.writer.name}
              </Link>
            </div>

            <div className="flex items-center mb-6">
              <span className="text-sm mr-2">প্রকাশক:</span>
              <Link
                href={`/publishers/${book.publisher.id}`}
                className="text-sm font-medium hover:text-primary"
              >
                {book.publisher.name}
              </Link>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">বিবরণ:</h3>
              <p className="text-muted-foreground">{book.description}</p>
            </div>

            <div className="flex items-center mb-6">
              <span className="mr-3">পরিমাণ:</span>
              <div className="flex items-center border rounded-md">
                <button
                  className="px-3 py-1 border-r"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    handleQuantityChange(Number.parseInt(e.target.value))
                  }
                  className="w-12 text-center py-1 border-none focus:outline-none"
                  min="1"
                  max={book.stock}
                />
                <button
                  className="px-3 py-1 border-l"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= book.stock}
                >
                  +
                </button>
              </div>
              <span className="ml-3 text-sm text-muted-foreground">
                {book.stock} পিস উপলব্ধ
              </span>
            </div>

            <div className="flex space-x-4">
              <Button className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                কার্টে যোগ করুন
              </Button>
              <Button
                variant="outline"
                onClick={toggleWishlist}
                className={isInWishlist(book.id) ? "text-red-500" : ""}
              >
                <Heart
                  className={`h-4 w-4 ${isInWishlist(book.id) ? "fill-red-500" : ""}`}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">বিস্তারিত বিবরণ</TabsTrigger>
          <TabsTrigger value="reviews">রিভিউ</TabsTrigger>
          <TabsTrigger value="related">সম্পর্কিত বই</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-6">
          <div className="prose max-w-none">
            <p>{book.description}</p>
            <p>
              এই বইটি {book.writer.name} দ্বারা লিখিত এবং {book.publisher.name}{" "}
              দ্বারা প্রকাশিত। এটি {book.category.name} বিভাগের অন্তর্গত।
            </p>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          <BookReviews bookId={bookId} />
        </TabsContent>
        <TabsContent value="related" className="mt-6">
          <RelatedBooks books={relatedBooks} />
        </TabsContent>
      </Tabs>

      {showModel && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold">3D মডেল - {book.name}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowModel(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="h-[calc(80vh-60px)]">
              <BookModel modelUrl={book.modelUrl} />
            </div>
          </div>
        </div>
      )}

      {showPdf && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold">PDF - {book.name}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPdf(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="h-[calc(80vh-60px)]">
              <PdfViewer pdfUrl={book.pdf} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
