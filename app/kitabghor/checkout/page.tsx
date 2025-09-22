"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/components/ecommarce/CartContext";
import { Button } from "@/components/ui/button";
import { LabeledInput } from "@/components/ui/labeled-input";
import { toast } from "sonner";
import { Check, Circle, CircleDot } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState("details");
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prefill from logged-in user
  useEffect(() => {
    if (!session || prefilled) return;
    const loadUser = async () => {
      try {
        const res = await fetch('/api/users', { cache: 'no-store' });
        if (!res.ok) return;
        const users = await res.json();
        const current = users?.find((u: any) => u?.id === session.user.id || u?.email === session.user.email);
        if (current) {
          setName(current.name || "");
          setMobile(current.phone || "");
          setEmail(current.email || "");
          const addr = [current.division, current.district, current.upazila, current.union]
            .filter(Boolean)
            .join(", ");
          setLocation(addr);
          setDeliveryAddress(addr);
          setPrefilled(true);
        }
      } catch (e) {
        // silent fail
      }
    };
    loadUser();
  }, [session, prefilled]);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = 60;
  const total = subtotal + shipping;

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-6 mb-8">
      {["details", "payment", "confirm"].map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          {step === s ? (
            <CircleDot className="text-blue-500" />
          ) : i < ["details", "payment", "confirm"].indexOf(step) ||
            (s === "confirm" && orderConfirmed) ? (
            <Check className="text-green-500" />
          ) : (
            <Circle className="text-gray-300" />
          )}
          <span
            className={`text-sm font-medium capitalize ${s === "confirm" && orderConfirmed ? "text-green-500" : ""}`}
          >
            {s === "details"
              ? "তথ্য"
              : s === "payment"
                ? "পেমেন্ট"
                : "নিশ্চিতকরণ"}
          </span>
        </div>
      ))}
    </div>
  );

  const handlePlaceOrder = async () => {
    if (
      !name ||
      !mobile ||
      !location ||
      (paymentMethod !== "CashOnDelivery" && !transactionId)
    ) {
      toast.error("সব ফিল্ড পূরণ করুন");
      return;
    }

    const orderData = {
      invoiceId: uuidv4(),
      customer: { 
        name, 
        mobile, 
        email, 
        address: location,
        deliveryAddress: deliveryAddress || location
      },
      cartItems,
      paymentMethod,
      transactionId: paymentMethod !== "CashOnDelivery" ? transactionId : null,
      total,
      createdAt: new Date().toISOString(),
    };

    setPlacedOrder(orderData);
    setInvoiceId(orderData.invoiceId);
    setStep("confirm");

    try {
      const res = await fetch("/api/save-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Failed to save order");
    } catch (err) {
      toast.error("অর্ডার সংরক্ষণে সমস্যা হয়েছে");
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
    <div className="container mx-auto py-12 px-4 grid md:grid-cols-2 gap-8">
      <div>
        {renderStepIndicator()}
        <h1 className="text-2xl font-bold mb-6">চেকআউট তথ্য</h1>

        {step === "details" && (
          <div className="space-y-4">
            <LabeledInput
              id="name"
              label="আপনার নাম"
              placeholder="আপনার নাম"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            />
            <LabeledInput
              id="mobile"
              label="মোবাইল নম্বর"
              placeholder="মোবাইল নম্বর"
              value={mobile}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMobile(e.target.value)}
            />
            <LabeledInput
              id="email"
              label="ইমেইল (ঐচ্ছিক)"
              placeholder="ইমেইল"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
            <LabeledInput
              id="location"
              label="ঠিকানা"
              placeholder="বাড়ি নং, রোড নং, এলাকা"
              value={location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
            />
            <div className="space-y-1">
              <label htmlFor="deliveryAddress" className="text-sm font-medium">
                ডেলিভারি ঠিকানা
              </label>
              <textarea
                id="deliveryAddress"
                className="w-full h-24 p-2 border rounded"
                placeholder="ডেলিভারি ঠিকানা"
                value={deliveryAddress}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDeliveryAddress(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={() => setStep("payment")}>
              পরবর্তী ধাপ
            </Button>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              পেমেন্ট পদ্ধতি নির্বাচন করুন
            </h2>
            {["bkash", "nagad", "rocket", "CashOnDelivery"].map((method) => (
              <div
                key={method}
                className="flex justify-between items-center border rounded px-4 py-2 cursor-pointer"
                onClick={() => setPaymentMethod(method)}
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={`/assets/others/payments/${method}.png`}
                    alt={method}
                    width={28}
                    height={28}
                  />
                  <span>
                    {method === "bkash"
                      ? "বিকাশ"
                      : method === "nagad"
                        ? "নগদ"
                        : method === "rocket"
                          ? "রকেট"
                          : "ক্যাশ অন ডেলিভারি"}
                  </span>
                </div>
                <input
                  type="radio"
                  checked={paymentMethod === method}
                  readOnly
                  className="accent-blue-500"
                />
              </div>
            ))}

            {paymentMethod && paymentMethod !== "CashOnDelivery" && (
              <>
                <p className="text-sm text-muted-foreground">
                  পেমেন্ট করুন এই নাম্বারে: <strong>017XXXXXXXX</strong>
                </p>
                <LabeledInput
                  id="transactionId"
                  label="ট্রান্স্যাকশন আইডি"
                  placeholder="ট্রান্স্যাকশন আইডি"
                  value={transactionId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTransactionId(e.target.value)}
                />
              </>
            )}

            {paymentMethod && (
              <Button className="w-full" onClick={handlePlaceOrder}>
                পরবর্তী ধাপ
              </Button>
            )}
          </div>
        )}

        {step === "confirm" && placedOrder && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">নিশ্চিতকরণ</h2>
            <p>
              Invoice ID: <strong>{invoiceId}</strong>
            </p>
            <p>তারিখ: {new Date(placedOrder.createdAt).toLocaleDateString()}</p>
            <p>সময়: {new Date(placedOrder.createdAt).toLocaleTimeString()}</p>
            <p>নাম: {placedOrder.customer.name}</p>
            <p>মোবাইল: {placedOrder.customer.mobile}</p>
            <p>ইমেইল: {placedOrder.customer.email}</p>
            <p>ঠিকানা: {placedOrder.customer.location}</p>
            <p>
              পেমেন্ট: {placedOrder.paymentMethod}{" "}
              {placedOrder.transactionId &&
                `(Txn: ${placedOrder.transactionId})`}
            </p>
            <Button
              className="w-full"
              onClick={handleConfirmOrder}
              disabled={orderConfirmed}
            >
              {orderConfirmed ? "অর্ডার সম্পন্ন হয়েছে" : "অর্ডার সম্পন্ন করুন"}
            </Button>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center space-y-4">
              <h2 className="text-xl font-bold text-green-600">
                🎉 অর্ডার সফলভাবে যুক্ত হয়েছে!
              </h2>
              <p>
                আপনার অর্ডার সফলভাবে গৃহীত হয়েছে। অর্ডার ট্র্যাক করতে নিচের
                বাটনে ক্লিক করুন।
              </p>
              <Link href="/signin">
                <Button className="w-full">ট্র্যাক করুন</Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded shadow-sm">
        <h2 className="text-xl font-bold mb-4">আপনার অর্ডার</h2>
        <div className="space-y-4 mb-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4">
              <div className="relative w-16 h-20">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="rounded object-cover"
                />
              </div>
              <div>
                <p className="font-medium line-clamp-1">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  ৳{item.price.toFixed(2)} x {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">সাবটোটাল</span>
            <span>৳{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">শিপিং</span>
            <span>৳{shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg border-t pt-2">
            <span>মোট</span>
            <span>৳{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
