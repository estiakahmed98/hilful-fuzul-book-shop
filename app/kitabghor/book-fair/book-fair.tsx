"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { products } from "@/public/BookData";

export default function BookFairPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredBooks = selectedCategory
    ? products.filter((book) => book.category.name === selectedCategory)
    : products;

  const fairCategories = Array.from(
    new Set(products.map((book) => book.category.name))
  );

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">📚 বইমেলা ২০২৪</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Sidebar filter */}
        <div className="bg-green-100 p-4 h-72 rounded-md">
          <h2 className="font-semibold mb-2">কওমী পাঠ্য কিতাব</h2>
          <ul className="space-y-2">
            {fairCategories.map((category) => (
              <li key={category}>
                <button
                  className={`text-sm hover:underline text-left w-full ${
                    selectedCategory === category
                      ? "font-semibold text-primary"
                      : "text-gray-700"
                  }`}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === category ? null : category
                    )
                  }
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Book grid */}
        <div className="md:col-span-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <Link
              key={book.id}
              href={`/kitabghor/books/${book.id}`}
              className="hover:no-underline"
            >
              <Card className="h-full hover:shadow-xl transition-shadow">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="relative w-full h-40 mb-4">
                    <Image
                      src={book.image}
                      alt={book.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded"
                    />
                  </div>
                  <h3 className="text-md font-semibold mb-1 line-clamp-2 text-primary">
                    {book.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {book.writer.name}
                  </p>
                  <div className="text-green-700 text-sm font-semibold mt-1">
                    ৳{book.price}
                  </div>
                  <Button size="sm" className="w-full mt-2">
                    বিস্তারিত দেখুন
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
