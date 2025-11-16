"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit3, Trash2, Search, Zap, Grid2X2 } from "lucide-react";
import { toast } from "sonner";

export default function CategoryManager({
  categories,
  loading,
  onCreate,
  onUpdate,
  onDelete,
}: any) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    name: "",
    image: "",
  });

  const filtered = categories?.filter((cat: any) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditing(null);
    setForm({ name: "", image: "" });
    setModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      image: cat.image || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("দয়া করে ক্যাটাগরির নাম লিখুন");
      return;
    }

    setSubmitting(true);

    try {
      if (editing) {
        await onUpdate(editing.id, {
          name: form.name,
          image: form.image,
        });
        toast.success("Category updated");
      } else {
        await onCreate({
          name: form.name,
          image: form.image,
        });
        toast.success("Category created");
      }

      setModalOpen(false);
      setForm({ name: "", image: "" });
    } catch {
      toast.error("Error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLocal = (id: number) => {
    if (confirm("Are you sure?")) {
      onDelete(id);
      toast.success("Category deleted");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">ক্যাটাগরি ব্যবস্থাপনা</h1>
        <p className="text-gray-600 mt-2">আপনার লাইব্রেরির ক্যাটাগরি পরিচালনা করুন</p>
      </div>

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="ক্যাটাগরি খুঁজুন..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button onClick={openAddModal} className="bg-emerald-600 text-white">
          <Plus className="h-4 w-4 mr-1" />
          নতুন ক্যাটাগরি
        </Button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-20">লোড হচ্ছে...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cat: any) => (
            <Card key={cat.id} className="shadow">
              <div className="h-40 bg-gray-100 flex justify-center items-center">
                {cat.image ? (
                  <img
                    src={cat.image}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Grid2X2 className="h-16 w-16 text-gray-400" />
                )}
              </div>

              <CardContent className="p-5">
                <h3 className="text-xl font-semibold">{cat.name}</h3>
                <p className="text-gray-500 text-sm mb-4">ID: {cat.id}</p>

                <div className="flex gap-2">
                  <Button
                    onClick={() => openEditModal(cat)}
                    className="w-full bg-teal-600 text-white"
                  >
                    <Edit3 className="h-4 w-4 mr-1" /> এডিট
                  </Button>
                  <Button
                    onClick={() => handleDeleteLocal(cat.id)}
                    variant="outline"
                    className="border-red-500 text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-5 border-b">
              <h3 className="text-2xl font-bold">
                {editing ? "ক্যাটাগরি এডিট" : "নতুন ক্যাটাগরি"}
              </h3>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <Label>ক্যাটাগরি নাম</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <Label>ছবি আপলোড করুন</Label>

                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (e: any) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const formData = new FormData();
                    formData.append("file", file);

                    toast.loading("Uploading...", { id: "upload" });

                    const res = await fetch("/api/upload", {
                      method: "POST",
                      body: formData,
                    });

                    const data = await res.json();
                    setForm({ ...form, image: data.url });

                    toast.success("Upload Complete!", { id: "upload" });
                  }}
                />

                {form.image && (
                  <img
                    src={form.image}
                    className="mt-3 w-24 h-24 object-cover rounded-md border"
                  />
                )}
              </div>
            </div>

            <div className="p-5 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                বাতিল
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-gradient-to-r from-teal-600 to-emerald-500 text-white"
              >
                <Zap className="h-4 w-4 mr-1" />
                {editing ? "আপডেট" : "তৈরি করুন"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
