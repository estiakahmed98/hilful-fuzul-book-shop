// app/kitabghor/user/page.tsx
"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";

interface ProfileData {
  id: string;
  email: string;
  name: string | null;
  role: string;
  phone: string | null;
  image: string | null;
  note: string | null;
  address: any | null;
}

interface AddressItem {
  label: string;
  line1: string;
  line2: string;
}

export default function UserProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [note, setNote] = useState("");
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/user/profile");
        if (!res.ok) {
          throw new Error("প্রোফাইল লোড করতে সমস্যা হয়েছে");
        }
        const data: ProfileData = await res.json();
        setProfile(data);
        setName(data.name ?? "");
        setPhone(data.phone ?? "");
        setImage(data.image ?? "");
        setNote(data.note ?? "");

        if (Array.isArray(data.address)) {
          setAddresses(
            data.address.map((a: any) => ({
              label: a.label ?? "",
              line1: a.line1 ?? "",
              line2: a.line2 ?? "",
            }))
          );
        } else if (data.address && typeof data.address === "object") {
          setAddresses([
            {
              label: (data.address as any).label ?? "",
              line1: (data.address as any).line1 ?? "",
              line2: (data.address as any).line2 ?? "",
            },
          ]);
        } else {
          setAddresses([]);
        }
      } catch (err: any) {
        setError(err.message || "কিছু ভুল হয়েছে");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const cleanedAddresses = addresses
      .map((addr) => ({
        label: addr.label.trim(),
        line1: addr.line1.trim(),
        line2: addr.line2.trim(),
      }))
      .filter((addr) => addr.label || addr.line1 || addr.line2);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          image,
          note,
          address: cleanedAddresses.length > 0 ? cleanedAddresses : null,
        }),
      });

      if (!res.ok) {
        throw new Error("প্রোফাইল আপডেট করতে সমস্যা হয়েছে");
      }

      const updated: ProfileData = await res.json();
      setProfile(updated);
      setSuccess("প্রোফাইল সফলভাবে আপডেট হয়েছে");
    } catch (err: any) {
      setError(err.message || "কিছু ভুল হয়েছে");
    } finally {
      setSaving(false);
    }
  };

  const userEmail = session?.user?.email || profile?.email || "";
  const userRole = (session?.user as any)?.role ?? profile?.role ?? "user";

  const handleAddressChange = (
    index: number,
    field: keyof AddressItem,
    value: string
  ) => {
    setAddresses((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddAddress = () => {
    setAddresses((prev) => [...prev, { label: "", line1: "", line2: "" }]);
  };

  const handleRemoveAddress = (index: number) => {
    setAddresses((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setError(null);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("ইমেজ আপলোড করতে সমস্যা হয়েছে");
      }

      const data = await res.json();
      if (data.fileUrl) {
        setImage(data.fileUrl);
        setSuccess("ইমেজ সফলভাবে আপলোড হয়েছে");
      }
    } catch (err: any) {
      setError(err.message || "ইমেজ আপলোডে ত্রুটি হয়েছে");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <>
      <Card className="px-6 py-4 shadow-sm border border-gray-100 mb-4">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          আমার প্রোফাইল
        </h1>
        <p className="text-xs md:text-sm text-gray-500 mt-1">
          আপনার একাউন্ট তথ্য দেখুন এবং আপডেট করুন।
        </p>
      </Card>

      <Card className="p-6 shadow-sm border border-gray-100">
        {loading ? (
          <p className="text-sm text-gray-600">প্রোফাইল লোড হচ্ছে...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Name
                </p>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Email
                </p>
                <p className="text-sm text-gray-800">{userEmail}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Phone
                </p>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Role
                </p>
                <p className="inline-flex items-center px-2 py-1 text-[11px] rounded-full bg-[#E8F5E9] text-[#1B5E20] font-semibold">
                  {userRole}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Image URL
                </p>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="/upload/.... বা যে কোন ইমেজ URL"
                  />
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="text-xs"
                    />
                    {uploadingImage && (
                      <span className="text-xs text-gray-500">
                        ইমেজ আপলোড হচ্ছে...
                      </span>
                    )}
                  </div>
                  {image && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">প্রিভিউ:</p>
                      <img
                        src={image}
                        alt="Profile preview"
                        className="h-20 w-20 rounded-full object-cover border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Note
                </p>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Addresses
              </p>

              {addresses.length === 0 && (
                <p className="text-xs text-gray-500">
                  এখনো কোন ঠিকানা যোগ করা হয়নি। নিচের বাটনে ক্লিক করে একটি
                  ঠিকানা যোগ করুন।
                </p>
              )}

              <div className="space-y-3">
                {addresses.map((addr, index) => (
                  <div
                    key={index}
                    className="rounded-md border border-gray-200 p-3 space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-semibold text-gray-700">
                        Address #{index + 1}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemoveAddress(index)}
                        className="text-[11px] text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      value={addr.label}
                      onChange={(e) =>
                        handleAddressChange(index, "label", e.target.value)
                      }
                      placeholder="Label (Home, Office, ইত্যাদি)"
                      className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      value={addr.line1}
                      onChange={(e) =>
                        handleAddressChange(index, "line1", e.target.value)
                      }
                      placeholder="Address line 1"
                      className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      value={addr.line2}
                      onChange={(e) =>
                        handleAddressChange(index, "line2", e.target.value)
                      }
                      placeholder="Address line 2 (optional)"
                      className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddAddress}
                className="mt-1 inline-flex items-center px-3 py-1.5 rounded-md border border-dashed border-emerald-400 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                + নতুন ঠিকানা যোগ করুন
              </button>
            </div>

            {success && <p className="text-sm text-emerald-600">{success}</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? "সেভ হচ্ছে..." : "প্রোফাইল আপডেট করুন"}
              </button>
            </div>
          </form>
        )}
      </Card>
    </>
  );
}
