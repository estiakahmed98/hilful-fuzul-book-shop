"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { products } from "@/public/BookData";

// Extract unique publishers
const uniquePublishers = Array.from(
  new Map(products.map((book) => [book.publisher.id, book.publisher])).values()
);

export default function PublisherCategoriesPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        🏢 প্রকাশক অনুযায়ী বই
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {uniquePublishers.map((publisher) => {
          const booksByPublisher = products.filter(
            (book) => book.publisher.id === publisher.id
          );

          return (
            <Card
              key={publisher.id}
              className="hover:shadow-md transition-shadow border rounded-lg text-center p-6 flex flex-col items-center"
            >
              <div className="relative w-20 h-20 mb-4 rounded-full overflow-hidden">
                <Image
                  src="/assets/publication/logo.jpg"
                  alt={publisher.name}
                  fill
                  className="object-cover"
                />
              </div>

              <h3 className="text-xl font-semibold mb-1">{publisher.name}</h3>

              <p className="flex items-center justify-center text-sm text-muted-foreground mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                অজানা স্থান
              </p>

              <p className="text-sm text-muted-foreground mb-4">
                এই প্রকাশকের সম্পর্কে আরও তথ্য প্রাপ্ত হয়নি।
              </p>

              <Link
                href={`/kitabghor/publishers/${publisher.id}`}
                className="w-full mb-2"
              >
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  সকল বই
                </Button>
              </Link>

              <Button variant="link" className="text-sm text-blue-600" disabled>
                আরো জানুন (Pending)
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
