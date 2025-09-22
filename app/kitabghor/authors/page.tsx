"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { products } from "@/public/BookData";

// Get unique authors by ID
const uniqueAuthors = Array.from(
  new Map(products.map((book) => [book.writer.id, book.writer])).values()
);

export default function AuthorCategoriesPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        ✍ লেখক অনুযায়ী বই
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {uniqueAuthors.map((author) => {
          const authoredBooks = products.filter(
            (book) => book.writer.id === author.id
          );

          return (
            <Link
              href={`/kitabghor/authors/${author.id}`}
              key={author.id}
              className="hover:no-underline"
            >
              <Card className="hover:shadow-xl transition-shadow h-full">
                <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                  <div className="relative w-20 h-20 mb-4 rounded-full overflow-hidden shadow-xl">
                    <Image
                      src="/assets/authors/profile.png"
                      alt={author.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-primary">
                    {author.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    মোট {authoredBooks.length} টি বই
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
