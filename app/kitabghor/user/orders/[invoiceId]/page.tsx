// app/kitabghor/user/orders/[invoiceId]/page.tsx
"use client";

import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { 
  CheckCircle, 
  Truck, 
  Package, 
  FileCheck,
  Clock,
  MapPin,
  Calendar,
  Receipt,
  ShieldCheck,
  BadgeCheck
} from "lucide-react";
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

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function OrderDetailsPage() {
  const params = useParams();
  const invoiceId = params?.invoiceId as string | undefined;

  if (!invoiceId) return notFound();

  const order = orders.find((o) => o.invoiceId === invoiceId);
  if (!order) return notFound();

  const items = Array.isArray(order.cartItems) ? order.cartItems : [];
  const subTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryCharge = Math.max(order.total - subTotal, 0);

  // Enhanced timeline data with verification steps
  const timelineSteps = [
    {
      id: 1,
      title: "Order Verified & Processed",
      description: "Initial order verification completed successfully",
      date: "2024.12.04",
      status: "completed",
      icon: ShieldCheck,
      amount: null,
      verification: "Verify the first request",
      color: "emerald"
    },
    {
      id: 2,
      title: "Quality Inspection Passed",
      description: "Product quality check and validation",
      date: "2024.12.07",
      status: "completed",
      icon: BadgeCheck,
      verification: "Verify the first request for delivery",
      color: "blue"
    },
    {
      id: 3,
      title: "Packaging Completed",
      description: "Items professionally packed and labeled",
      date: "2024.12.08",
      status: "completed",
      icon: Package,
      verification: "Verify packaging requirements",
      color: "purple"
    },
    {
      id: 4,
      title: "Dispatched to Courier",
      description: "Order handed over to delivery partner",
      date: "2024.12.09",
      status: "completed",
      icon: Truck,
      verification: "Verify dispatch details",
      color: "orange"
    },
    {
      id: 5,
      title: "Out for Delivery",
      description: "Order is out for final delivery",
      date: "2024.12.10",
      status: "completed",
      icon: Clock,
      verification: "Verify delivery route",
      color: "amber"
    },
    {
      id: 6,
      title: "Successfully Delivered",
      description: "Order delivered to customer",
      date: "2024.12.11",
      status: "completed",
      icon: CheckCircle,
      verification: "Delivery confirmation received",
      color: "green"
    }
  ];

  const addressData = [
    { type: "Shipping Address", details: "123 Main Street, Suite 45\nDowntown District\nCity, State 12345", code: "SH-5X6X8X7" },
    { type: "Billing Address", details: "123 Main Street, Suite 45\nDowntown District\nCity, State 12345", code: "BL-5X6X8X7" },
    { type: "Return Address", details: "KitabGhor Returns Center\n456 Industrial Zone\nCity, State 12345", code: "RT-5X6X8X7" }
  ];

  const getStatusColor = (color: string) => {
    const colors = {
      emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
      blue: "bg-blue-50 border-blue-200 text-blue-700",
      purple: "bg-purple-50 border-purple-200 text-purple-700",
      orange: "bg-orange-50 border-orange-200 text-orange-700",
      amber: "bg-amber-50 border-amber-200 text-amber-700",
      green: "bg-green-50 border-green-200 text-green-700"
    };
    return colors[color as keyof typeof colors] || colors.emerald;
  };

  const getIconColor = (color: string) => {
    const colors = {
      emerald: "text-emerald-600",
      blue: "text-blue-600",
      purple: "text-purple-600",
      orange: "text-orange-600",
      amber: "text-amber-600",
      green: "text-green-600"
    };
    return colors[color as keyof typeof colors] || colors.emerald;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/kitabghor/user/orders"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Orders
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
              <p className="text-gray-600 mt-2">Track your order progress and details</p>
            </div>
            <div className="bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-semibold text-gray-900">{formatDate(order.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Status Header */}
            <Card className="bg-gradient-to-r from-emerald-500 to-green-600 text-white overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">This order has been delivered</h2>
                    <p className="text-emerald-100 opacity-90">All items successfully delivered to your address</p>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-emerald-100 text-sm font-medium">Order Number</p>
                      <p className="font-mono text-lg font-bold tracking-wide">{order.invoiceId}</p>
                    </div>
                    <div className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-semibold">
                      Completed
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Enhanced Timeline */}
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <Receipt className="w-6 h-6 text-gray-700" />
                <h3 className="text-xl font-bold text-gray-900">Order Journey</h3>
              </div>

              <div className="space-y-6">
                {timelineSteps.map((step, index) => {
                  const IconComponent = step.icon;
                  return (
                    <div key={step.id} className="flex gap-6 group">
                      {/* Timeline Line & Icon */}
                      <div className="flex flex-col items-center">
                        <div className={`
                          w-12 h-12 rounded-2xl border-2 flex items-center justify-center
                          transition-all duration-300 group-hover:scale-110
                          ${getStatusColor(step.color)}
                        `}>
                          <IconComponent className={`w-5 h-5 ${getIconColor(step.color)}`} />
                        </div>
                        {index !== timelineSteps.length - 1 && (
                          <div className="flex-1 w-0.5 bg-gray-200 mt-2 mb-1" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-6">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <p className="text-gray-600 mb-2">{step.description}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{step.date}</span>
                              <span>•</span>
                              <span className="text-gray-400">{step.verification}</span>
                            </div>
                          </div>
                          
                          <div className={`
                            px-3 py-1 rounded-full text-xs font-medium border
                            ${step.status === 'completed' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-gray-50 text-gray-600 border-gray-200'
                            }
                          `}>
                            {step.status === 'completed' ? 'Verified' : 'Pending'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Order Summary */}
            <Card className="p-0 shadow-sm border border-gray-200">
            <div className="px-6 py-3 border-b border-gray-200">
              <h2 className="text-sm md:text-base font-semibold text-gray-800">
                Order Summary
              </h2>
            </div>

            <div className="px-4 md:px-6 py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-4 border-b last:border-b-0 border-dashed border-gray-200"
                >
                  <div className="w-20 h-28 flex-shrink-0 bg-gray-100 border border-gray-200 rounded-sm overflow-hidden flex items-center justify-center">
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

                  <div className="flex-1 flex flex-col justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-800 mb-1 line-clamp-2">
                        {item.name}
                      </p>
                      <div className="flex flex-wrap gap-3 text-[13px] text-gray-700">
                        <span>
                          Price:{" "}
                          <span className="font-semibold">
                            TK. {item.price.toFixed(2)}
                          </span>
                        </span>
                        <span>
                          Qty:{" "}
                          <span className="font-semibold">
                            {item.quantity}
                          </span>
                        </span>
                      </div>
                    </div>
                    <p className="text-[12px] text-gray-600 mt-2">
                      Line Total:{" "}
                      <span className="font-semibold text-gray-900">
                        TK. {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <div className="text-sm space-y-1 text-right">
                <div className="flex justify-between gap-8 text-[13px] text-gray-700">
                  <span>Subtotal</span>
                  <span>TK. {subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between gap-8 text-[13px] text-gray-700">
                  <span>Delivery Charge</span>
                  <span>TK. {deliveryCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between gap-8 text-[13px] text-gray-700">
                  <span>Payable Amount</span>
                  <span className="font-semibold text-gray-900">
                    TK. {order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-8">
            {/* Customer Information */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Delivery Information</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Customer Name</p>
                  <p className="font-semibold text-gray-900">{order.customer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Contact Number</p>
                  <p className="font-semibold text-gray-900">{order.customer.mobile}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email Address</p>
                  <p className="font-semibold text-gray-900 break-all">{order.customer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Delivery Address</p>
                  <p className="font-semibold text-gray-900 leading-relaxed">
                    {order.customer.deliveryAddress || order.customer.address || "N/A"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Order Verification Stamp */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Order Verified</h4>
                <p className="text-sm text-gray-600 mb-4">
                  This order has been verified and processed through our secure system.
                </p>
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-gray-500 font-mono">TRACKING ID: {order.invoiceId}</p>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}