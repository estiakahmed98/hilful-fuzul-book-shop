// app/kitabghor/user/orders/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

interface CartItem {
  id: number | string;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Customer {
  name: string;
  mobile: string;
  email: string;
  location?: string;
  address?: string;
  deliveryAddress?: string;
}

interface Order {
  invoiceId: string; // API থেকে order.id string করে রাখছি
  customer: Customer;
  cartItems?: CartItem[] | null;
  paymentMethod: string;
  transactionId: string | null;
  total: number;
  createdAt: string;
  status: string;         // 🔹 OrderStatus (PENDING, CONFIRMED, SHIPPED, DELIVERED, ...)
  paymentStatus: string;  // 🔹 PaymentStatus (UNPAID, PAID)
}

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
};

// 🔹 Order status badge helper
const getOrderStatusConfig = (status: string) => {
  const s = status?.toUpperCase();
  if (s === "DELIVERED") {
    return {
      label: "Delivered",
      className:
        "bg-emerald-100 text-emerald-800 border border-emerald-200",
    };
  }
  if (s === "SHIPPED" || s === "PROCESSING" || s === "CONFIRMED") {
    return {
      label:
        s === "SHIPPED"
          ? "Shipped"
          : s === "PROCESSING"
          ? "Processing"
          : "Confirmed",
      className: "bg-blue-100 text-blue-800 border border-blue-200",
    };
  }
  if (s === "CANCELLED") {
    return {
      label: "Cancelled",
      className: "bg-red-100 text-red-800 border border-red-200",
    };
  }
  // default PENDING / unknown
  return {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 border border-amber-200",
  };
};

// 🔹 Payment status badge helper
const getPaymentStatusConfig = (paymentStatus: string) => {
  const s = paymentStatus?.toUpperCase();
  if (s === "PAID") {
    return {
      label: "Paid",
      className:
        "bg-emerald-50 text-emerald-700 border border-emerald-200",
    };
  }
  // default UNPAID / unknown
  return {
    label: "Unpaid",
    className: "bg-rose-50 text-rose-700 border border-rose-200",
  };
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 API থেকে অর্ডার লোড
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/orders?limit=50", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (res.status === 401) {
          setError("অর্ডার দেখতে আপনাকে আগে লগইন করতে হবে।");
          setOrders([]);
          return;
        }

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          console.error("Failed to fetch orders:", data || res.statusText);
          setError("অর্ডার লোড করতে সমস্যা হয়েছে।");
          setOrders([]);
          return;
        }

        const data = await res.json();

        // data.orders → আমাদের UI-র ফরম্যাটে ম্যাপ করে নিচ্ছি
        const mapped: Order[] = Array.isArray(data.orders)
          ? data.orders.map((o: any) => {
              const items: CartItem[] = Array.isArray(o.orderItems)
                ? o.orderItems.map((oi: any) => ({
                    id: oi.id,
                    productId: oi.productId,
                    name: oi.product?.name ?? "Unknown product",
                    price: Number(oi.price ?? 0),
                    quantity: oi.quantity ?? 1,
                    image: oi.product?.image ?? "",
                  }))
                : [];

              return {
                invoiceId: String(o.id),
                customer: {
                  name: o.name,
                  mobile: o.phone_number,
                  email: o.email ?? "",
                  address: o.address_details ?? "",
                  location: `${o.area || ""}, ${o.district || ""}, ${
                    o.country || ""
                  }`
                    .replace(/^[,\s]+|[,\s]+$/g, "")
                    .replace(/,\s*,/g, ","),
                  deliveryAddress: o.address_details ?? "",
                },
                cartItems: items,
                paymentMethod: o.payment_method,
                transactionId: o.transactionId ?? null,
                total: Number(o.grand_total ?? o.total ?? 0),
                createdAt: o.createdAt ?? o.order_date,
                status: o.status ?? "PENDING",               // 🔹 নতুন
                paymentStatus: o.paymentStatus ?? "UNPAID",  // 🔹 নতুন
              };
            })
          : [];

        setOrders(mapped);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("অর্ডার লোড করতে সমস্যা হয়েছে।");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const totalOrders = orders.length;
  const orderedList = useMemo(() => orders, [orders]);

  return (
    <>
      {/* Top bar */}
      <Card className="px-4 md:px-6 py-4 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-lg md:text-xl font-semibold text-gray-800">
              My Orders{" "}
              <span className="text-xs md:text-sm font-normal text-gray-500">
                (Your Total Order: {totalOrders})
              </span>
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              নিচে আপনার সকল অর্ডারের বিস্তারিত দেখানো হয়েছে।
            </p>
          </div>
        </div>
      </Card>

      {/* Loading / Error / Empty / List */}
      {loading ? (
        <Card className="mt-4 p-6 text-center text-sm text-gray-600">
          অর্ডার লোড হচ্ছে...
        </Card>
      ) : error ? (
        <Card className="mt-4 p-6 text-center text-sm text-red-600">
          {error}
        </Card>
      ) : orderedList.length === 0 ? (
        <Card className="mt-4 p-6 text-center text-sm text-gray-600">
          You don&apos;t have any orders yet.
        </Card>
      ) : (
        <div className="mt-4 space-y-4">
          {orderedList.map((order) => {
            const items = Array.isArray(order.cartItems)
              ? order.cartItems
              : [];

            const statusCfg = getOrderStatusConfig(order.status);
            const paymentCfg = getPaymentStatusConfig(order.paymentStatus);

            return (
              <Card
                key={order.invoiceId}
                className="p-4 md:p-6 shadow-sm border border-gray-200"
              >
                {/* Order header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  <div className="text-sm text-gray-700">
                    <p>
                      <span className="font-medium">Your Order ID: </span>
                      <Link
                        href={`/kitabghor/user/orders/${order.invoiceId}`}
                        className="text-[#0C7CD5] hover:underline break-all"
                      >
                        {order.invoiceId}
                      </Link>
                    </p>
                    <p className="text-[12px] text-gray-500 mt-0.5">
                      Placed on: {formatDateTime(order.createdAt)}
                    </p>
                    <p className="text-[12px] text-gray-500 mt-0.5">
                      Customer:{" "}
                      <span className="font-medium text-gray-700">
                        {order.customer.name}
                      </span>{" "}
                      | Mobile: {order.customer.mobile}
                    </p>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-2 text-sm">
                    {/* 🔹 Dynamic order status badge */}
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusCfg.className}`}
                    >
                      {statusCfg.label}
                    </span>

                    {/* 🔹 Payment status badge */}
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium ${paymentCfg.className}`}
                    >
                      Payment: {paymentCfg.label}
                    </span>

                    <Link
                      href={`/kitabghor/user/orders/${order.invoiceId}`}
                      className="mt-1 bg-[#0C7CD5] hover:bg-[#0662AA] text-white text-xs font-semibold rounded-sm px-3 py-1 transition-colors inline-flex items-center"
                    >
                      Track My Order →
                    </Link>
                  </div>
                </div>

                {/* Items ( ছোট summary ) */}
                <div className="border-t border-gray-200 pt-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 mb-4 last:mb-0 pb-4 last:pb-0 border-b last:border-b-0 border-dashed border-gray-200"
                    >
                      <div className="w-16 h-20 flex-shrink-0 bg-gray-100 border border-gray-200 rounded-sm overflow-hidden flex items-center justify-center">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] text-gray-400 px-2 text-center">
                            No Image
                          </span>
                        )}
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="font-medium text-gray-800 line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-[12px] text-gray-600 mt-1">
                          TK. {item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order total */}
                <div className="pt-3 border-t border-gray-100 mt-2 flex justify-end">
                  <div className="text-right text-sm">
                    <p className="text-gray-500 text-xs">Order Total</p>
                    <p className="text-base font-semibold text-gray-900">
                      TK. {order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
