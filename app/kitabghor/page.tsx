// app/page.tsx or jekhanei Home ache

"use client";

import { useEffect, useState } from "react";
import CategoryBooks from "@/components/ecommarce/category-books";
import Hero from "@/components/ecommarce/hero";

type Category = {
  id: number;
  name: string;
  productCount: number;
  // baki field thakle ichha moto add korte paro
};

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");

        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data: Category[] = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
        setError("Categories load korte problem hocche");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="w-full">
      <Hero />
      <div className="container mx-auto py-12 px-4">
        {loading && <p>Loading categories...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading &&
          !error &&
          categories.map((category) => (
            <CategoryBooks key={category.id} category={category} />
          ))}
      </div>
    </div>
  );
}
