"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ShoppingCart } from "lucide-react";
import { useWishlist } from "@/components/ecommarce/WishlistContext";
import { useCart } from "@/components/ecommarce/CartContext";
import { products } from "@/public/BookData";
import { toast } from "sonner";

interface Product {
  id: string | number;
  name: string;
  price: number;
  original_price: number;
  discount: number;
  image: string;
}

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Filter products that are in the wishlist
    const filteredProducts = products.filter((product) =>
      wishlistItems.includes(
        typeof product.id === "string"
          ? Number.parseInt(product.id as string, 10)
          : (product.id as number)
      )
    );
    setWishlistProducts(filteredProducts);
  }, [wishlistItems]);

  const handleRemoveItem = (productId: number | string) => {
    removeFromWishlist(productId);
    toast.success("উইশলিস্ট থেকে সরানো হয়েছে");
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product.id);
    toast.success(`"${product.name}" কার্টে যোগ করা হয়েছে`);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <img
          src="/assets/others/wishlist.png"
          alt="Wishlist Icon"
          className="h-8 w-8"
        />
        আপনার উইশলিস্ট
      </h1>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">আপনার উইশলিস্ট খালি</h2>
          <p className="text-muted-foreground mb-6">
            আপনার উইশলিস্টে কোন পণ্য নেই। পছন্দের বই যোগ করতে শপিং চালিয়ে যান।
          </p>
          <Link href="/">
            <Button>শপিং চালিয়ে যান</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative">
                <Link href={`/kitabghor/books/${item.id}`}>
                  <div className="relative h-64 w-full">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                  </div>
                </Link>
                <button
                  className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-red-50"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
              <CardContent className="p-4">
                <Link href={`/kitabghor/books/${item.id}`}>
                  <h4 className="font-semibold text-lg mb-1 hover:text-primary transition-colors line-clamp-2">
                    {item.name}
                  </h4>
                </Link>
                <div className="flex items-center justify-between mt-2 mb-4">
                  <div>
                    <span className="font-bold text-lg">৳{item.price}</span>
                    {item.discount > 0 && (
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        ৳{item.original_price}
                      </span>
                    )}
                  </div>
                  {item.discount > 0 && (
                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs">
                      {item.discount}% ছাড়
                    </span>
                  )}
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleAddToCart(item)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  কার্টে যোগ করুন
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
