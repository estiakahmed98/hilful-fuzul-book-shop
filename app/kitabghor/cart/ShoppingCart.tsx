"use client";

import { useCart } from "@/components/ecommarce/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Tag, Truck, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// ✅ NextAuth client hooks/helpers
import { useSession, signIn } from "@/lib/auth-client";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  // ✅ NextAuth session
  const { status } = useSession(); // status: "loading" | "authenticated" | "unauthenticated"
  const isAuthenticated = status === "authenticated";

  const router = useRouter();

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      // preserve cart & target route for after login
      sessionStorage.setItem("pendingCheckout", JSON.stringify(cartItems));
      sessionStorage.setItem("redirectAfterLogin", "/kitabghor/checkout");
      toast.info("চেকআউট করতে লগইন করুন");

      // ✅ Use NextAuth's signIn so it respects pages.signIn = "/auth/sign-in"
      // and returns back to checkout after successful auth
      await signIn(undefined, { callbackUrl: "/kitabghor/checkout" });
      return;
    }

    router.push("/kitabghor/checkout");
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "DISCOUNT20") {
      setDiscount(20);
      toast.success("কুপন প্রয়োগ করা হয়েছে!");
    } else if (couponCode.toUpperCase() === "WELCOME10") {
      setDiscount(10);
      toast.success("কুপন প্রয়োগ করা হয়েছে!");
    } else {
      setDiscount(0);
      toast.error("কুপন কোড অবৈধ!");
    }
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const discountAmount = (subtotal * discount) / 100;
  const shippingCost = subtotal > 500 ? 0 : 60;
  const total = subtotal - discountAmount + shippingCost;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEEFE0]/30 to-white py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-[#819A91] hover:text-[#A7C1A8] transition-colors duration-300 group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span>শপিং চালিয়ে যান</span>
            </Link>
            <div className="w-1 h-8 bg-gradient-to-b from-[#819A91] to-[#A7C1A8] rounded-full"></div>
          </div>

          <div className="bg-gradient-to-r from-[#819A91] to-[#A7C1A8] rounded-2xl p-6 md:p-8 text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <ShoppingCart className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                  আপনার কার্ট
                </h1>
                <p className="text-white/90 opacity-90">
                  আপনার নির্বাচিত বইসমূহ এবং অর্ডার বিবরণ
                </p>
              </div>
            </div>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">আপনার কার্ট খালি</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              আপনার কার্টে কোন পণ্য নেই। কিছু পণ্য যোগ করতে শপিং চালিয়ে যান।
            </p>
            <Link href="/">
              <Button className="rounded-full bg-gradient-to-r from-[#819A91] to-[#A7C1A8] text-white px-8 py-6 text-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                শপিং চালিয়ে যান
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border-0 p-6">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#D1D8BE]">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-[#819A91]" />
                    কার্ট আইটেম ({cartItems.length})
                  </h2>
                  <Button
                    variant="outline"
                    className="rounded-full border-red-200 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                    onClick={clearCart}
                  >
                    কার্ট খালি করুন
                  </Button>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="group bg-gradient-to-br from-white to-[#EEEFE0] rounded-2xl p-4 border border-[#D1D8BE] hover:border-[#819A91]/30 transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Book Image */}
                        <div className="flex-shrink-0">
                          <div className="relative h-32 w-24 rounded-xl overflow-hidden shadow-lg">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                        </div>

                        {/* Book Details */}
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                            <div className="flex-1">
                              <Link href={`/kitabghor/books/${item.productId}`}>
                                <h3 className="font-bold text-lg text-gray-800 hover:text-[#819A91] transition-colors duration-300 line-clamp-2">
                                  {item.name}
                                </h3>
                              </Link>
                              <p className="text-[#819A91] font-semibold text-lg mt-1">
                                ৳{item.price.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-xl text-[#819A91]">
                                ৳{(item.price * item.quantity).toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                {item.quantity} × ৳{item.price}
                              </p>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center border border-[#D1D8BE] rounded-xl overflow-hidden">
                              <button
                                className="p-2 hover:bg-[#819A91] hover:text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-4 font-semibold min-w-12 text-center bg-white">
                                {item.quantity}
                              </span>
                              <button
                                className="p-2 hover:bg-[#819A91] hover:text-white transition-all duration-300"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <button
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 group/delete"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-5 w-5 group-hover/delete:scale-110 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border-0 p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Tag className="h-5 w-5 text-[#819A91]" />
                  অর্ডার সারাংশ
                </h2>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">সাবটোটাল</span>
                    <span className="font-semibold">৳{subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between items-center py-2 text-green-600 bg-green-50 rounded-xl px-3">
                      <span className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        ডিসকাউন্ট ({discount}%)
                      </span>
                      <span className="font-semibold">-৳{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Truck className="h-4 w-4 text-[#819A91]" />
                      শিপিং
                    </span>
                    <span className={`${shippingCost === 0 ? "text-green-600" : ""} font-semibold`}>
                      {shippingCost === 0 ? "ফ্রি" : `৳${shippingCost.toFixed(2)}`}
                    </span>
                  </div>

                  {shippingCost === 0 && subtotal > 0 && (
                    <div className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2 text-center">
                      🎉 ৫০০৳+ অর্ডারে বিনামূল্যে ডেলিভারি
                    </div>
                  )}

                  <div className="border-t border-[#D1D8BE] pt-3 mt-2">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>মোট</span>
                      <span className="text-[#819A91]">৳{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Coupon Section */}
                <div className="mb-6">
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="কুপন কোড"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="rounded-xl border-[#D1D8BE] focus:border-[#819A91]"
                    />
                    <Button
                      onClick={applyCoupon}
                      className="rounded-xl bg-[#D1D8BE] text-gray-700 hover:bg-[#819A91] hover:text-white transition-all duration-300 whitespace-nowrap"
                    >
                      প্রয়োগ করুন
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    ট্রাই করুন: <strong>DISCOUNT20</strong> বা <strong>WELCOME10</strong>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  className="w-full rounded-xl py-6 bg-gradient-to-r from-[#819A91] to-[#A7C1A8] hover:from-[#A7C1A8] hover:to-[#819A91] text-white font-bold text-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group/checkout"
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                >
                  <Shield className="mr-2 h-5 w-5 group-hover/checkout:scale-110 transition-transform" />
                  সুরক্ষিত চেকআউট
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/checkout:translate-x-1 transition-transform" />
                </Button>

                {/* Trust Badges */}
                <div className="mt-6 pt-4 border-t border-[#D1D8BE]">
                  <div className="flex justify-center gap-4 text-xs text-gray-500">
                    <div className="text-center">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1">
                        <Shield className="h-3 w-3 text-green-600" />
                      </div>
                      সুরক্ষিত
                    </div>
                    <div className="text-center">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
                        <Truck className="h-3 w-3 text-blue-600" />
                      </div>
                      দ্রুত ডেলিভারি
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
