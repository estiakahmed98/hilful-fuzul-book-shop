"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import {
  Menu,
  X,
  ShoppingCart,
  Heart,
  BookOpen,
  LibraryBig,
  Layers,
  Archive,
  Book,
  Pen,
  School,
  BookType,
  AudioLines,
  MessageSquareQuote,
  House,
  Tag,
  User,
  Store,
  CalendarCheck,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/ecommarce/CartContext";
import { useWishlist } from "@/components/ecommarce/WishlistContext";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { cartItems } = useCart();
  const { wishlistCount } = useWishlist();
  const [hasMounted, setHasMounted] = useState(false);
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleAuthClick = async () => {
    if (session) {
      try {
        await authClient.signOut();
        router.push('/');
        router.refresh(); // Refresh the page to update the UI
      } catch (error) {
        console.error('Error signing out:', error);
      }
    } else {
      router.push('/signin');
    }
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const navItems = [
    { name: "হোম", href: "/", icon: House },
    { name: "সকল বইসমূহ", href: "/kitabghor/books", icon: Book },
    { name: "বিষয়সমূহ", href: "/kitabghor/categories", icon: Tag },
    { name: "লেখক", href: "/kitabghor/authors", icon: User },
    { name: "প্রকাশক", href: "/kitabghor/publishers", icon: Store },
    {
      name: "কওমী পাঠ্য কিতাব",
      icon: LibraryBig,
      children: [
        { name: "দাওরায়ে হাদীস", href: "/kowmi/daura", icon: BookOpen },
        { name: "মাদানী নেসাব", href: "/kowmi/madani", icon: Layers },
        { name: "মকতব বিভাগ", href: "/kowmi/maktab", icon: School },
        { name: "হিফজ বিভাগ", href: "/kowmi/hifz", icon: Book },
        { name: "তাকমীল বিভাগ", href: "/kowmi/takmil", icon: Pen },
        { name: "ফতওয়া বিভাগ", href: "/kowmi/fatwa", icon: Archive },
        { name: "জামাতে তাফসীর", href: "/kowmi/tafsir", icon: Book },
        { name: "জামাতে কিরাত", href: "/kowmi/qirat", icon: AudioLines },
        { name: "জামাতে নাহব", href: "/kowmi/nahw", icon: MessageSquareQuote },
        { name: "জামাতে হাদীস", href: "/kowmi/hadith", icon: BookType },
        { name: "জামাতে শরহে বেকায়া", href: "/kowmi/bekaya", icon: School },
        { name: "জামাতে মেশকাত", href: "/kowmi/meshkat", icon: BookOpen },
      ],
    },
    { name: "বইমেলা 2024", href: "/kitabghor/book-fair", icon: CalendarCheck },
  ];

  const totalCartItems =
    cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <header className="bg-slate-200 shadow-sm">
      <div className="container flex items-center gap-10 justify-between h-20 px-4 md:px-8">
        <Link href="/" className="md:font-bold md:text-2xl text-gray-800">
          হিলফুল-ফুযুল প্রকাশনী
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6">
          {navItems.map((item) =>
            item.children ? (
              <div key={item.name} className="relative group">
                <button
                  className={`text-gray-700 flex items-center hover:text-primary transition-colors ${
                    item.children.some((child) => child.href === pathname)
                      ? "text-primary font-semibold"
                      : ""
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2 text-gray-500" />
                  {item.name}
                </button>
                <div className="absolute top-full left-0 mt-2 bg-white shadow-lg border rounded w-64 hidden group-hover:block z-50">
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      className={`flex items-center px-4 py-2 hover:bg-gray-100 text-sm ${
                        pathname === child.href
                          ? "text-primary font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      <child.icon className="h-4 w-4 mr-2 text-gray-500" />
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center transition-colors ${
                  pathname === item.href
                    ? "text-primary font-semibold"
                    : "text-gray-700 hover:text-primary"
                }`}
              >
                <item.icon className="h-4 w-4 mr-2 text-gray-500" />
                {item.name}
              </Link>
            )
          )}
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          <Link href="/kitabghor/wishlist" className="relative">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
              {hasMounted && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Button>
          </Link>
          <Link href="/kitabghor/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {hasMounted && totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </Button>
          </Link>
          <Button
            variant="ghost"
            onClick={handleAuthClick}
            disabled={isPending}
          >
            {isPending ? 'লোড হচ্ছে...' : hasMounted && session ? 'লগআউট' : 'লগইন'}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden py-4 border-t px-4">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.name}>
                  <button
                    onClick={toggleDropdown}
                    className={`flex items-center w-full justify-between text-sm font-semibold ${
                      item.children.some((c) => c.href === pathname)
                        ? "text-primary"
                        : "text-gray-700"
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="h-4 w-4 mr-2 text-gray-500" />
                      {item.name}
                    </div>
                    {isDropdownOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {isDropdownOpen && (
                    <div className="ml-4 mt-1 space-y-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={`flex items-center text-sm ${
                            pathname === child.href
                              ? "text-primary font-semibold"
                              : "text-gray-700 hover:text-primary"
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <child.icon className="h-4 w-4 mr-2 text-gray-500" />
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center ${
                    pathname === item.href
                      ? "text-primary font-semibold"
                      : "text-gray-700 hover:text-primary"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4 mr-2 text-gray-500" />
                  {item.name}
                </Link>
              )
            )}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleAuthClick}
              disabled={isPending}
            >
              {isPending ? 'লোড হচ্ছে...' : session ? 'লগআউট' : 'লগইন'}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
