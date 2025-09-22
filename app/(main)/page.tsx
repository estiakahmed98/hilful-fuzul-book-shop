//Estiak

import CategoryBooks from "@/components/ecommarce/category-books";
import Hero from "@/components/ecommarce/hero";
import { categories } from "@/public/BookData";

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <div className="container mx-auto py-12 px-4">
        {categories.map((category) => (
          <CategoryBooks key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
