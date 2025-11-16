"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/components/ecommarce/CartContext";
import { Button } from "@/components/ui/button";
import { LabeledInput } from "@/components/ui/labeled-input";
import { toast } from "sonner";
import {
  Check,
  ArrowLeft,
  Truck,
  Shield,
  CreditCard,
  BookOpen,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState<"details" | "payment" | "confirm">(
    "details"
  );
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { data: session } = useSession();
  const [prefilled, setPrefilled] = useState(false);

  // 🔹 payment screenshot
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [paymentScreenshotPreview, setPaymentScreenshotPreview] = useState<
    string | null
  >(null);
  // 🔹 uploaded URL (from /api/upload)
  const [paymentScreenshotUrl, setPaymentScreenshotUrl] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prefill from logged-in user
  useEffect(() => {
    if (!session || prefilled) return;
    const loadUser = async () => {
      try {
        const res = await fetch("/api/users", { cache: "no-store" });
        if (!res.ok) return;
        const users = await res.json();
        const current = users?.find(
          (u: any) =>
            u?.id === (session.user as any).id || u?.email === session.user?.email
        );
        if (current) {
          setName(current.name || "");
          setMobile(current.phone || "");
          setEmail(current.email || "");
          const addr = [
            current.division,
            current.district,
            current.upazila,
            current.union,
          ]
            .filter(Boolean)
            .join(", ");
          setLocation(addr);
          setDeliveryAddress(addr);
          setPrefilled(true);
        }
      } catch {
        /* silent */
      }
    };
    loadUser();
  }, [session, prefilled]);

  // 🔹 screenshot handler (now uploads to /api/upload)
  const handleScreenshotChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPaymentScreenshot(file);

    // Local preview (for instant UI feedback)
    const url = URL.createObjectURL(file);
    setPaymentScreenshotPreview(url);

    // Upload to /api/upload
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        console.error("Screenshot upload failed:", data || res.statusText);
        toast.error("স্ক্রিনশট আপলোড করতে সমস্যা হয়েছে");
        return;
      }

      const data = await res.json();
      // /upload/filename.ext
      setPaymentScreenshotUrl(data.url);
      // চাইলে এখানে toast দিতে পারো
      // toast.success("স্ক্রিনশট আপলোড সম্পন্ন");
    } catch (err) {
      console.error("Screenshot upload error:", err);
      toast.error("স্ক্রিনশট আপলোড করতে সমস্যা হয়েছে");
    }
  };

  // 🔹 paymentMethod থেকে payment status label বের করার helper
  const getPaymentStatusFromMethod = (method: string) => {
    if (!method) return "Unknown";
    return method === "CashOnDelivery" ? "Unpaid" : "Paid";
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = 60;
  const total = subtotal + shipping;

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-8 mb-12">
      {["details", "payment", "confirm"].map((s, i) => (
        <div key={s} className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
              step === s
                ? "bg-[#819A91] border-[#819A91] text-white shadow-lg shadow-[#819A91]/30"
                : i < ["details", "payment", "confirm"].indexOf(step) ||
                  (s === "confirm" && orderConfirmed)
                ? "bg-[#A7C1A8] border-[#A7C1A8] text-white"
                : "border-[#D1D8BE] text-[#2D4A3C]"
            }`}
          >
            {step === s ? (
              <div className="w-2 h-2 bg-white rounded-full" />
            ) : i < ["details", "payment", "confirm"].indexOf(step) ||
              (s === "confirm" && orderConfirmed) ? (
              <Check className="w-5 h-5" />
            ) : (
              <span className="text-sm font-medium">{i + 1}</span>
            )}
          </div>
          <span
            className={`text-sm font-medium capitalize transition-colors duration-300 ${
              step === s
                ? "text-[#2D4A3C]"
                : i < ["details", "payment", "confirm"].indexOf(step) ||
                  (s === "confirm" && orderConfirmed)
                ? "text-[#3D5A4C]"
                : "text-[#2D4A3C]"
            }`}
          >
            {s === "details"
              ? "ব্যক্তিগত তথ্য"
              : s === "payment"
              ? "পেমেন্ট"
              : "নিশ্চিতকরণ"}
          </span>
          {i < 2 && (
            <div
              className={`w-12 h-0.5 ml-3 transition-colors duration-300 ${
                i < ["details", "payment", "confirm"].indexOf(step)
                  ? "bg-[#A7C1A8]"
                  : "bg-[#D1D8BE]"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  // ✅ এখানেই Orders API call করছি
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("আপনার কার্ট খালি");
      return;
    }

    if (
      !name ||
      !mobile ||
      !location ||
      (paymentMethod !== "CashOnDelivery" && !transactionId)
    ) {
      toast.error("সব প্রয়োজনীয় তথ্য পূরণ করুন");
      return;
    }

    // paymentMethod থেকে paymentStatus নির্ধারণ
    // bkash / nagad / rocket => PAID
    // CashOnDelivery => UNPAID
    const computedPaymentStatus =
      paymentMethod === "CashOnDelivery" ? "UNPAID" : "PAID";

    // frontend UI এর জন্য order data (আগের মতই + paymentStatus)
    const localInvoiceId = uuidv4();

    const uiOrderData = {
      invoiceId: localInvoiceId,
      customer: {
        name,
        mobile,
        email,
        address: location,
        deliveryAddress: deliveryAddress || location,
      },
      cartItems,
      paymentMethod,
      transactionId:
        paymentMethod !== "CashOnDelivery" ? transactionId : null,
      total,
      createdAt: new Date().toISOString(),
      paymentStatus: computedPaymentStatus, // 🔹 UI তে লাগবে
    };

    // API payload -> /api/orders
    const items = cartItems.map((item) => ({
      productId: item.productId ?? item.id, // cart item e jeta available
      quantity: item.quantity,
    }));

    const payload = {
      name,
      email: email || null,
      phone_number: mobile,
      alt_phone_number: null,
      country: "Bangladesh",
      district: location || "N/A",
      area: deliveryAddress || location || "N/A",
      address_details: deliveryAddress || location || "N/A",
      payment_method: paymentMethod,
      items,
      transactionId:
        paymentMethod !== "CashOnDelivery" ? transactionId : null,
      paymentStatus: computedPaymentStatus, 
      image: paymentScreenshotUrl || null, 
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        console.error("Order create failed:", data || res.statusText);
        toast.error(
          data?.error || "অর্ডার করতে সমস্যা হয়েছে, পরে আবার চেষ্টা করুন"
        );
        return;
      }

      const createdOrder = await res.json();

      const uiWithOrderId = {
        ...uiOrderData,
        orderId: createdOrder.id,
      };

      setPlacedOrder(uiWithOrderId);
      setInvoiceId(localInvoiceId);
      setStep("confirm");
      toast.success("অর্ডার তৈরি হয়েছে, এখন নিশ্চিত করুন");
    } catch (err) {
      console.error("Error placing order:", err);
      toast.error("অর্ডার করতে সমস্যা হয়েছে");
    }
  };

  const handleConfirmOrder = () => {
    clearCart();
    setOrderConfirmed(true);
    setShowModal(true);
    toast.success("অর্ডার সফলভাবে সম্পন্ন হয়েছে!");
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEEFE0] to-[#D1D8BE] py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#819A91] rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-[#2D4A3C] mb-4">চেকআউট</h1>
          </div>
          <p className="text-lg text-[#2D4A3C] max-w-2xl mx-auto">
            আপনার বইয়ের অর্ডার সম্পূর্ণ করতে নিচের ধাপগুলো অনুসরণ করুন
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Left Column - Checkout Steps */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-[#D1D8BE] p-8">
              {renderStepIndicator()}

              {/* Step 1: Personal Details */}
              {step === "details" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-8 bg-[#819A91] rounded-full"></div>
                    <h2 className="text-2xl font-bold text-[#2D4A3C]">
                      ব্যক্তিগত তথ্য
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <LabeledInput
                      id="name"
                      label="আপনার নাম *"
                      placeholder="আপনার সম্পূর্ণ নাম"
                      value={name}
                      onChange={(
                        e: React.ChangeEvent<HTMLInputElement>
                      ) => setName(e.target.value)}
                      className="bg-[#EEEFE0] border-[#D1D8BE] focus:border-[#819A91] text-[#2D4A3C] placeholder-[#2D4A3C]/50 transition-colors duration-300"
                    />
                    <LabeledInput
                      id="mobile"
                      label="মোবাইল নম্বর *"
                      placeholder="০১XXXXXXXXX"
                      value={mobile}
                      onChange={(
                        e: React.ChangeEvent<HTMLInputElement>
                      ) => setMobile(e.target.value)}
                      className="bg-[#EEEFE0] border-[#D1D8BE] focus:border-[#819A91] text-[#2D4A3C] placeholder-[#2D4A3C]/50 transition-colors duration-300"
                    />
                    <LabeledInput
                      id="email"
                      label="ইমেইল (ঐচ্ছিক)"
                      placeholder="আপনার ইমেইল ঠিকানা"
                      value={email}
                      onChange={(
                        e: React.ChangeEvent<HTMLInputElement>
                      ) => setEmail(e.target.value)}
                      className="bg-[#EEEFE0] border-[#D1D8BE] focus:border-[#819A91] text-[#2D4A3C] placeholder-[#2D4A3C]/50 transition-colors duration-300 md:col-span-2"
                    />
                    <LabeledInput
                      id="location"
                      label="প্রাথমিক ঠিকানা *"
                      placeholder="বাড়ি নং, রোড নং, এলাকা"
                      value={location}
                      onChange={(
                        e: React.ChangeEvent<HTMLInputElement>
                      ) => setLocation(e.target.value)}
                      className="bg-[#EEEFE0] border-[#D1D8BE] focus:border-[#819A91] text-[#2D4A3C] placeholder-[#2D4A3C]/50 transition-colors duration-300 md:col-span-2"
                    />
                    <div className="space-y-2 md:col-span-2">
                      <label
                        htmlFor="deliveryAddress"
                        className="text-sm font-medium text-[#2D4A3C]"
                      >
                        ডেলিভারি ঠিকানা (ঐচ্ছিক)
                      </label>
                      <textarea
                        id="deliveryAddress"
                        className="w-full h-32 p-4 border border-[#D1D8BE] rounded-xl bg-[#EEEFE0] focus:border-[#819A91] focus:ring-2 focus:ring-[#819A91]/20 text-[#2D4A3C] placeholder-[#2D4A3C]/50 transition-all duration-300 resize-none"
                        placeholder="যদি প্রাথমিক ঠিকানা থেকে ভিন্ন হয়"
                        value={deliveryAddress}
                        onChange={(
                          e: React.ChangeEvent<HTMLTextAreaElement>
                        ) => setDeliveryAddress(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    className="w-full bg-[#819A91] hover:bg-[#819A91]/90 text-white py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 mt-6"
                    onClick={() => setStep("payment")}
                  >
                    পরবর্তী ধাপ
                  </Button>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {step === "payment" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 bg-[#819A91] rounded-full"></div>
                      <h2 className="text-2xl font-bold text-[#2D4A3C]">
                        পেমেন্ট পদ্ধতি
                      </h2>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setStep("details")}
                      className="text-[#EEEFE0] hover:text-[#2D4A3C]/80 hover:bg-[#EEEFE0]"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      পূর্ববর্তী
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {[
                      {
                        id: "bkash",
                        name: "বিকাশ",
                        color: "bg-gradient-to-r from-pink-500 to-red-500",
                      },
                      {
                        id: "nagad",
                        name: "নগদ",
                        color:
                          "bg-gradient-to-r from-emerald-500 to-green-500",
                      },
                      {
                        id: "rocket",
                        name: "রকেট",
                        color:
                          "bg-gradient-to-r from-purple-500 to-indigo-500",
                      },
                      {
                        id: "CashOnDelivery",
                        name: "ক্যাশ অন ডেলিভারি",
                        color:
                          "bg-gradient-to-r from-[#A7C1A8] to-[#819A91]",
                      },
                    ].map((method) => (
                      <div
                        key={method.id}
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                          paymentMethod === method.id
                            ? "border-[#819A91] bg-[#819A91]/5 shadow-md"
                            : "border-[#D1D8BE] hover:border-[#A7C1A8] hover:bg-[#EEEFE0]"
                        }`}
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-lg ${method.color} flex items-center justify-center shadow-md`}
                            >
                              <Image
                                src={`/assets/others/payments/${method.id}.png`}
                                alt={method.name}
                                width={24}
                                height={24}
                                className="filter brightness-0 invert"
                              />
                            </div>
                            <div>
                              <span className="font-semibold text-[#2D4A3C]">
                                {method.name}
                              </span>
                              {method.id === "CashOnDelivery" && (
                                <p className="text-sm text-[#2D4A3C]/70 mt-1">
                                  ডেলিভারির সময় পেমেন্ট করুন
                                </p>
                              )}
                            </div>
                          </div>
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                              paymentMethod === method.id
                                ? "border-[#819A91] bg-[#819A91]"
                                : "border-[#D1D8BE]"
                            }`}
                          >
                            {paymentMethod === method.id && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {paymentMethod &&
                    paymentMethod !== "CashOnDelivery" && (
                      <div className="bg-[#EEEFE0] rounded-xl p-6 mt-6 border border-[#D1D8BE]">
                        <div className="flex items-center gap-3 mb-4">
                          <CreditCard className="w-5 h-5 text-[#819A91]" />
                          <h3 className="font-semibold text-[#2D4A3C]">
                            পেমেন্ট নির্দেশনা
                          </h3>
                        </div>
                        <p className="text-sm text-[#2D4A3C] mb-4">
                          পেমেন্ট করুন এই নাম্বারে:{" "}
                          <strong className="text-[#2D4A3C]">
                            ০১৭XXXXXXXX
                          </strong>
                        </p>
                        <LabeledInput
                          id="transactionId"
                          label="ট্রান্স্যাকশন আইডি *"
                          placeholder="আপনার ট্রান্স্যাকশন আইডি লিখুন"
                          value={transactionId}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => setTransactionId(e.target.value)}
                          className="bg-white border-[#D1D8BE] focus:border-[#819A91] text-[#2D4A3C] placeholder-[#2D4A3C]/50"
                        />

                        {/* Screenshot upload */}
                        <div className="mt-4 space-y-2">
                          <label className="text-sm font-medium text-[#2D4A3C]">
                            পেমেন্ট স্ক্রিনশট
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleScreenshotChange}
                            className="w-full text-sm text-[#2D4A3C] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#819A91] file:text-white hover:file:bg-[#819A91]/90 cursor-pointer"
                          />
                          {(paymentScreenshotUrl || paymentScreenshotPreview) && (
                            <div className="mt-3">
                              <p className="text-xs text-[#2D4A3C]/70 mb-2">
                                প্রিভিউ:
                              </p>
                              <div className="relative w-40 h-40 border border-[#D1D8BE] rounded-xl overflow-hidden bg-white">
                                <Image
                                  src={paymentScreenshotUrl || paymentScreenshotPreview!}
                                  alt="Payment screenshot preview"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  {paymentMethod && (
                    <Button
                      className="w-full bg-[#819A91] hover:bg-[#819A91]/90 text-white py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 mt-6"
                      onClick={handlePlaceOrder}
                    >
                      অর্ডার প্লেস করুন
                    </Button>
                  )}
                </div>
              )}

              {/* Step 3: Order Confirmation */}
              {step === "confirm" && placedOrder && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 bg-[#819A91] rounded-full"></div>
                      <h2 className="text-2xl font-bold text-[#2D4A3C]">
                        অর্ডার নিশ্চিতকরণ
                      </h2>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setStep("payment")}
                      className="text-[#EEEFE0] hover:text-[#2D4A3C]/80 hover:bg-[#EEEFE0]"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      পূর্ববর্তী
                    </Button>
                  </div>

                  <div className="bg-[#A7C1A8]/20 border border-[#A7C1A8] rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-[#A7C1A8] rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-[#2D4A3C]">
                        অর্ডার সফলভাবে তৈরি হয়েছে!
                      </h3>
                    </div>
                    <p className="text-[#2D4A3C]">
                      Invoice ID:{" "}
                      <strong className="text-[#2D4A3C]">
                        {invoiceId}
                      </strong>
                    </p>
                    {placedOrder?.orderId && (
                      <p className="text-[#2D4A3C] mt-1 text-sm">
                        Order ID (DB):{" "}
                        <strong>{placedOrder.orderId}</strong>
                      </p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-[#2D4A3C]">
                        গ্রাহক তথ্য
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="text-[#2D4A3C]/80">নাম:</span>{" "}
                          <span className="text-[#2D4A3C]">
                            {placedOrder.customer.name}
                          </span>
                        </p>
                        <p>
                          <span className="text-[#2D4A3C]/80">মোবাইল:</span>{" "}
                          <span className="text-[#2D4A3C]">
                            {placedOrder.customer.mobile}
                          </span>
                        </p>
                        <p>
                          <span className="text-[#2D4A3C]/80">ইমেইল:</span>{" "}
                          <span className="text-[#2D4A3C]">
                            {placedOrder.customer.email || "N/A"}
                          </span>
                        </p>
                        <p>
                          <span className="text-[#2D4A3C]/80">ঠিকানা:</span>{" "}
                          <span className="text-[#2D4A3C]">
                            {placedOrder.customer.address}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-[#2D4A3C]">
                        অর্ডার বিবরণ
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="text-[#2D4A3C]/80">তারিখ:</span>{" "}
                          <span className="text-[#2D4A3C]">
                            {new Date(
                              placedOrder.createdAt
                            ).toLocaleDateString("bn-BD")}
                          </span>
                        </p>
                        <p>
                          <span className="text-[#2D4A3C]/80">সময়:</span>{" "}
                          <span className="text-[#2D4A3C]">
                            {new Date(
                              placedOrder.createdAt
                            ).toLocaleTimeString("bn-BD")}
                          </span>
                        </p>
                        <p>
                          <span className="text-[#2D4A3C]/80">
                            পেমেন্ট পদ্ধতি:
                          </span>{" "}
                          <span className="text-[#2D4A3C]">
                            {placedOrder.paymentMethod}
                          </span>
                        </p>
                        {/* 🔹 এখানে Payment: Paid/Unpaid দেখাচ্ছি */}
                        <p>
                          <span className="text-[#2D4A3C]/80">
                            পেমেন্ট স্ট্যাটাস:
                          </span>{" "}
                          <span className="text-[#2D4A3C] font-semibold">
                            {getPaymentStatusFromMethod(
                              placedOrder.paymentMethod
                            )}
                          </span>
                        </p>
                        {placedOrder.transactionId && (
                          <p>
                            <span className="text-[#2D4A3C]/80">
                              ট্রান্স্যাকশন:
                            </span>{" "}
                            <span className="text-[#2D4A3C]">
                              {placedOrder.transactionId}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {(paymentScreenshotUrl || paymentScreenshotPreview) && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-[#2D4A3C] mb-2">
                        পেমেন্ট স্ক্রিনশট
                      </h4>
                      <div className="relative w-40 h-40 border border-[#D1D8BE] rounded-xl overflow-hidden bg-white">
                        <Image
                          src={paymentScreenshotUrl || paymentScreenshotPreview!}
                          alt="Payment screenshot preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full bg-[#A7C1A8] hover:bg-[#A7C1A8]/90 text-white py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 mt-6"
                    onClick={handleConfirmOrder}
                    disabled={orderConfirmed}
                  >
                    {orderConfirmed
                      ? "অর্ডার সম্পন্ন হয়েছে"
                      : "অর্ডার সম্পন্ন করুন"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-[#D1D8BE] p-6 sticky top-6">
              <h2 className="text-xl font-bold text-[#2D4A3C] mb-6 pb-4 border-b border-[#D1D8BE]">
                অর্ডার সারাংশ
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-[#EEEFE0] border border-[#D1D8BE]"
                  >
                    <div className="relative w-16 h-20 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="rounded-lg object-cover shadow-sm"
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#819A91] text-white rounded-full text-xs flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#2D4A3C] line-clamp-2 text-sm leading-tight">
                        {item.name}
                      </p>
                      <p className="text-[#2D4A3C] font-semibold text-sm mt-1">
                        ৳{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-[#D1D8BE] pt-4">
                <div className="flex justify-between text-[#2D4A3C]">
                  <span>সাবটোটাল</span>
                  <span>৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#2D4A3C]">
                  <span>ডেলিভারি চার্জ</span>
                  <span>৳{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-[#2D4A3C] border-t border-[#D1D8BE] pt-3">
                  <span>মোট</span>
                  <span className="text-[#2D4A3C] font-bold">
                    ৳{total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-[#D1D8BE] space-y-4">
                <div className="flex items-center gap-3 text-sm text-[#2D4A3C]">
                  <Shield className="w-4 h-4 text-[#A7C1A8]" />
                  <span>সুরক্ষিত পেমেন্ট</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#2D4A3C]">
                  <Truck className="w-4 h-4 text-[#819A91]" />
                  <span>২-৪ কর্মদিবসে ডেলিভারি</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl border border-[#D1D8BE]">
            <div className="w-16 h-16 bg-[#A7C1A8] rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#2D4A3C]">
              🎉 অর্ডার সফল!
            </h2>
            <p className="text-[#2D4A3C] leading-relaxed">
              আপনার অর্ডার সফলভাবে গৃহীত হয়েছে। অর্ডার ট্র্যাক করতে নিচের
              বাটনে ক্লিক করুন।
            </p>
            <div className="space-y-3">
              <Link href="/kitabghor/user/orders" className="block">
                <Button className="w-full bg-[#819A91] hover:bg-[#819A91]/90 text-white py-3 rounded-xl">
                  অর্ডার ট্র্যাক করুন
                </Button>
              </Link>
              <Link href="/books">
                <Button
                  variant="outline"
                  className="w-full border-[#D1D8BE] text-[#2D4A3C] hover:bg-[#EEEFE0] rounded-xl"
                >
                  আরও বই দেখুন
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
