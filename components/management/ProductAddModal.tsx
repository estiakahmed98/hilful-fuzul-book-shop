"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Zap } from "lucide-react";

interface ProductForm {
  name: string;
  slug: string;
  description: string;
  price: string;
  original_price: string;
  discount: string;
  stock: string;
  available: boolean;
  writerId: string;
  publisherId: string;
  categoryId: string;
  image: string;
  gallery: string[];
  pdf: string;
}

interface Entity {
  id: number | string;
  name: string;
}

interface ProductAddModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  editing?: ProductForm | null;
  writers: Entity[];
  publishers: Entity[];
  categories: Entity[];
}

export default function ProductAddModal({
  open,
  onClose,
  onSubmit,
  editing,
  writers,
  publishers,
  categories,
}: ProductAddModalProps) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<ProductForm>({
    name: "",
    slug: "",
    description: "",
    price: "",
    original_price: "",
    discount: "0",
    stock: "0",
    available: true,
    writerId: "",
    publisherId: "",
    categoryId: "",
    image: "",
    gallery: [],
    pdf: "",
  });

  useEffect(() => {
    if (editing) setForm(editing);
  }, [editing]);

  if (!open) return null;

  // In your component
  const handleUpload = async (file: File, folder: string) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`/api/upload/${folder}`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        ...form,
        price: Number(form.price),
        original_price: Number(form.original_price) || null,
        discount: Number(form.discount) || 0,
        stock: Number(form.stock) || 0,
        writerId: form.writerId || null,
        publisherId: form.publisherId || null,
        categoryId: Number(form.categoryId),
        // Include the file uploads
        image: form.image,
        gallery: form.gallery,
        pdf: form.pdf,
      });

      toast.success(editing ? "Product Updated!" : "Product Added!");
      onClose();
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-6 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
        <h2 className="text-2xl font-bold">
          {editing ? "Update Product" : "Add New Product"}
        </h2>
        {/* NAME */}
        <div>
          <Label>Name *</Label>
          <Input
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
                slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
              })
            }
          />
        </div>
        {/* SLUG */}
        <div>
          <Label>Slug *</Label>
          <Input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
        </div>
        {/* DROPDOWNS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Writer</Label>
            <select
              className="border p-2 rounded w-full"
              value={form.writerId || ""}
              onChange={(e) => setForm({ ...form, writerId: e.target.value })}
            >
              <option value="">Select</option>
              {writers.map((w: any) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Publisher</Label>
            <select
              className="border p-2 rounded w-full"
              value={form.publisherId || ""}
              onChange={(e) =>
                setForm({ ...form, publisherId: e.target.value })
              }
            >
              <option value="">Select</option>
              {publishers.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Category *</Label>
            <select
              className="border p-2 rounded w-full"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              <option value="">Select</option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* PRICE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Price *</Label>
            <Input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <div>
            <Label>Original Price</Label>
            <Input
              type="number"
              value={form.original_price}
              onChange={(e) =>
                setForm({ ...form, original_price: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Discount (%)</Label>
            <Input
              type="number"
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
            />
          </div>
        </div>
        {/* STOCK */}
        <div>
          <Label>Stock</Label>
          <Input
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
        </div>
        {/* For main image */}
        <Input
          type="file"
          accept="image/*"
          onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            try {
              const url = await handleUpload(file, "products");
              setForm((prev) => ({ ...prev, image: url }));
            } catch (error) {
              console.error("Error uploading image:", error);
            }
          }}
        />
        {/* For gallery images */}
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(e.target.files || []);
            const uploaded: string[] = [];

            for (const file of files) {
              try {
                const url = await handleUpload(
                  file as File,
                  "products/gallery"
                );
                uploaded.push(url);
              } catch (error) {
                console.error("Error uploading gallery image:", error);
              }
            }

            setForm((prev) => ({
              ...prev,
              gallery: [...prev.gallery, ...uploaded],
            }));
          }}
        />
        {/* For PDF */}
        <Input
          type="file"
          accept="application/pdf"
          onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            try {
              const url = await handleUpload(file, "products/pdf");
              setForm((prev) => ({ ...prev, pdf: url }));
            } catch (error) {
              console.error("Error uploading PDF:", error);
            }
          }}
        />
        <div className="flex justify-end gap-3 pb-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-[#2C4A3B] text-white"
          >
            <Zap className="h-4 w-4 mr-1" />
            {editing ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </div>
    </div>
  );
}
