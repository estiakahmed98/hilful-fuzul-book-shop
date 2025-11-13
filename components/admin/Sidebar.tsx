"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, ShoppingBag, FileText, Settings, BookOpen } from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/admin/", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Products", href: "/admin/products", icon: ShoppingBag },
  { name: "Orders", href: "/admin/orders", icon: FileText },
  { name: "Categories", href: "/admin/categories", icon: FileText },
  { name: "Blog", href: "/admin/blog", icon: BookOpen },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-64 bg-white shadow h-screen fixed left-0 top-0">
      <div className="h-16 flex items-center justify-center border-b font-bold text-lg">
        Admin Panel
      </div>

      <nav className="mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-100 transition",
                active && "bg-gray-200 font-semibold"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
