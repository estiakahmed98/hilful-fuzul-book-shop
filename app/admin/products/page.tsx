"use client";

import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  writerId?: number;
  publisherId?: number;
  categoryId?: number;
  writer?: any; // You might want to create proper types for these as well
  publisher?: any;
  category?: any;
}
import ProductManager from "@/components/management/ProductManager";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [writers, setWriters] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // INITIAL LOAD
  const loadAll = async () => {
    setLoading(true);

    const [p, w, pub, c] = await Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/writers").then((r) => r.json()),
      fetch("/api/publishers").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]);

    setProducts(p);
    setWriters(w);
    setPublishers(pub);
    setCategories(c);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  // CREATE
  const createProduct = async (data: any) => {
    const res = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const newProd = await res.json();
    setProducts([newProd, ...products]);
  };

  // UPDATE
  const updateProduct = async (id: number, data: any) => {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    const updated = await res.json();

    setProducts(products.map((p: any) => (p.id === id ? updated : p)));
  };

  // DELETE
  const deleteProduct = async (id: number) => {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts(products.filter((p: any) => p.id !== id));
  };

  return (
    <ProductManager
      products={products}
      writers={writers}
      publishers={publishers}
      categories={categories}
      loading={loading}
      onCreate={createProduct}
      onUpdate={updateProduct}
      onDelete={deleteProduct}
    />
  );
}
