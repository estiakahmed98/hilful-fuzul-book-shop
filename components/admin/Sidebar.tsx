"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, ShoppingBag, FileText, Settings, BookOpen, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

const menuItems = [
  { name: "Dashboard", href: "/admin/", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Products", href: "/admin/products", icon: ShoppingBag },
  { name: "Orders", href: "/admin/orders", icon: FileText },
  { 
    name: "Management", 
    icon: FileText,
    subItems: [
      { name: "Writers", href: "/admin/management/writers" },
      { name: "Categories", href: "/admin/management/categories" },
      { name: "Publishers", href: "/admin/management/publishers" }
    ]
  },
  { name: "Blog", href: "/admin/blogs", icon: BookOpen },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface MenuItemProps {
  item: {
    name: string;
    href?: string;
    icon: any;
    subItems?: { name: string; href: string }[];
  };
  pathname: string;
}

const MenuItem = ({ item, pathname }: MenuItemProps) => {
  const [isOpen, setIsOpen] = useState(pathname.startsWith('/admin/management'));
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isActive = item.href ? pathname.startsWith(item.href) : false;

  return (
    <div>
      {hasSubItems ? (
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "w-full flex items-center justify-between gap-3 px-6 py-3 text-gray-700 hover:bg-gray-100 transition text-left",
              (isActive || isOpen) && "bg-gray-200 font-semibold"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5" />
              {item.name}
            </div>
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {isOpen && (
            <div className="ml-8 mt-1 mb-2">
              {item.subItems?.map((subItem) => {
                const isSubItemActive = pathname === subItem.href;
                return (
                  <Link
                    key={subItem.name}
                    href={subItem.href}
                    className={cn(
                      "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition",
                      isSubItemActive && "bg-gray-100 font-medium"
                    )}
                  >
                    {subItem.name}
                  </Link>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.href || '#'}
          className={cn(
            "flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-100 transition",
            isActive && "bg-gray-200 font-semibold"
          )}
        >
          <item.icon className="h-5 w-5" />
          {item.name}
        </Link>
      )}
    </div>
  );
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-64 bg-white shadow h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="h-16 flex items-center justify-center border-b font-bold text-lg sticky top-0 bg-white z-10">
        Admin Panel
      </div>

      <nav className="mt-4 pb-8">
        {menuItems.map((item) => (
          <MenuItem key={item.name} item={item} pathname={pathname} />
        ))}
      </nav>
    </aside>
  );
}
