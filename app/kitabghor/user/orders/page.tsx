// app/kitabghor/user/orders/page.tsx
"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import ordersData from "@/data/orders.json";

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
  invoiceId: string;
  customer: Customer;
  cartItems?: CartItem[] | null;
  paymentMethod: string;
  transactionId: string | null;
  total: number;
  createdAt: string;
}

const orders: Order[] = Array.isArray(ordersData)
  ? (ordersData as Order[])
  : [];

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
};

export default function OrdersPage() {
  const totalOrders = orders.length;
  const orderedList = useMemo(() => orders, []);

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

      {/* Orders list */}
      {orderedList.length === 0 ? (
        <Card className="mt-4 p-6 text-center text-sm text-gray-600">
          You don&apos;t have any orders yet.
        </Card>
      ) : (
        <div className="mt-4 space-y-4">
          {orderedList.map((order) => {
            const items = Array.isArray(order.cartItems) ? order.cartItems : [];

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

                  <div className="flex flex-col items-start md:items-end gap-1 text-sm">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                      Completed
                    </span>
                    <Link
                      href={`/kitabghor/user/orders/${order.invoiceId}`}
                      className="bg-[#0C7CD5] hover:bg-[#0662AA] text-white text-xs font-semibold rounded-sm px-3 py-1 transition-colors inline-flex items-center"
                    >
                      Track My Order →
                    </Link>
                  </div>
                </div>

                {/* Items ( ছোট summery ) */}
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
