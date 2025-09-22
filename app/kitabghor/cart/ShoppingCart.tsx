"use client";

import { useCart } from "@/components/ecommarce/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const handleCheckout = () => {
    // If user is not authenticated, redirect to login with return URL
    if (!isAuthenticated) {
      // Store cart items in session storage temporarily
      sessionStorage.setItem('pendingCheckout', JSON.stringify(cartItems));
      // Store the intended checkout path
      sessionStorage.setItem('redirectAfterLogin', '/kitabghor/checkout');
      // Redirect to signin with return URL
      router.push(`/signin?returnUrl=${encodeURIComponent('/kitabghor/cart')}`);
      toast.info("চেকআউট করতে লগইন করুন");
      return;
    }
    
    // If authenticated, proceed to checkout
    router.push("/kitabghor/checkout");
  };

  const applyCoupon = () => {
    // Demo coupon code "DISCOUNT20" for 20% off
    if (couponCode.toUpperCase() === "DISCOUNT20") {
      setDiscount(20);
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
  const shippingCost = 60;
  const total = subtotal - discountAmount + shippingCost;

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <img
          src="/assets/others/cart.png"
          alt="Cart Icon"
          className="h-10 w-10 rounded-full"
        />
        আপনার কার্ট
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">আপনার কার্ট খালি</h2>
          <p className="text-muted-foreground mb-6">
            আপনার কার্টে কোন পণ্য নেই। কিছু পণ্য যোগ করতে শপিং চালিয়ে যান।
          </p>
          <Link href="/">
            <Button>শপিং চালিয়ে যান</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">কার্ট আইটেম</h2>
                  <Button
                    variant="ghost"
                    className="text-white hover:text-gray-200"
                    onClick={clearCart}
                  >
                    কার্ট খালি করুন
                  </Button>
                </div>
                <div className="divide-y">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="py-4 flex flex-col sm:flex-row"
                    >
                      <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                        <div className="relative h-24 w-20 sm:h-32 sm:w-24">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <div>
                            <Link href={`/kitabghor/books/${item.productId}`}>
                              <h3 className="font-medium hover:text-primary transition-colors">
                                {item.name}
                              </h3>
                            </Link>
                            <p className="text-muted-foreground text-sm mt-1">
                              ৳{item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="mt-3 sm:mt-0">
                            <p className="font-medium">
                              ৳{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center border rounded-md">
                            <button
                              className="p-2"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4">{item.quantity}</span>
                            <button
                              className="p-2"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">অর্ডার সারাংশ</h2>

              <div className="mb-6">
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">সাবটোটাল</span>
                  <span>৳{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between py-2 text-green-600">
                    <span>ডিসকাউন্ট ({discount}%)</span>
                    <span>-৳{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">শিপিং</span>
                  <span>৳{shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-lg border-t mt-2 pt-2">
                  <span>মোট</span>
                  <span>৳{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex space-x-2">
                  <Input
                    placeholder="কুপন কোড"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button 
                    className="w-full" 
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                  >
                    চেকআউট করুন {cartItems.length === 0 && '(কার্ট খালি)'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}