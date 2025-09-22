"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { products } from "@/public/BookData";

export default function CategoryCardsPage() {
  const categories = [
    { id: 1, name: "আত্মজীবনী", slug: "bio" },
    { id: 2, name: "রাজনীতি", slug: "rajniti" },
    { id: 3, name: "হযরত মাওলানা কালিম সিদ্দিকী", slug: "kalim" },
    { id: 4, name: "ইসলাম ও হেদায়েত", slug: "Hedayet" },
    { id: 5, name: "দাওয়াত ও দায়ী", slug: "daye" },
    { id: 6, name: "হিন্দু ভাইদের জন্য", slug: "hindu" },
    { id: 7, name: "খ্রিষ্টান ভাইদের জন্য", slug: "christran" },
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">📚 বিষয়সমূহ</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          const categoryBooks = products.filter(
            (book) => book.category.id === category.id
          );

          const imagePath = `/assets/others/payments/${category.slug}.png`;

          return (
            <Link
              href={`/kitabghor/categories/${category.id}`}
              key={category.id}
              className="hover:no-underline"
            >
              <Card className="h-full hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                  <Image
                    src={imagePath}
                    alt={category.name}
                    width={80}
                    height={80}
                    className="mb-4 rounded-full shadow-xl"
                  />
                  <h3 className="text-xl font-semibold mb-2 text-primary">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    মোট {categoryBooks.length} টি বই
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
