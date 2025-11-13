"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
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
  Search,
  LogOut,
  LogIn,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/ecommarce/CartContext";
import { useWishlist } from "@/components/ecommarce/WishlistContext";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartItems } = useCart();
  const { wishlistCount } = useWishlist();
  const [hasMounted, setHasMounted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleAuthClick = async () => {
    if (status === 'authenticated') {
      setIsPending(true);
      try {
        await signOut();
        router.push('/');
        router.refresh();
      } catch (error) {
        console.error('Error signing out:', error);
      }
    } else {
      router.push('/signin');
    }
  };

  useEffect(() => {
    setHasMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    { name: "বইমেলা 2025", href: "/kitabghor/book-fair", icon: CalendarCheck },
    { name: "ব্লগ", href: "/kitabghor/blogs", icon: Tag },
  ];

  const totalCartItems =
    cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#819A91] shadow-lg backdrop-blur-sm bg-opacity-35' 
        : 'bg-gradient-to-r from-[#819A91] to-[#A7C1A8]'
    }`}>
      {/* Top Bar */}
      <div className="bg-[#819A91] text-[#EEEFE0] py-1 px-4 text-sm">
        <div className="container mx-auto text-center">
          বিনামূল্যে ডেলিভারি - ৫০০৳ 
        </div>
      </div>

      <div className={`container mx-auto px-4 transition-all duration-300 ${
        isScrolled ? 'py-2' : 'py-4'
      }`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 group"
          >
            <div className="bg-[#EEEFE0] p-2 rounded-lg shadow-md group-hover:shadow-lg transition-shadow">
              <div className="w-8 h-8 bg-gradient-to-br from-[#2C4A3B] to-[#819A91] rounded-md flex items-center justify-center">
                <Book className="h-5 w-5 text-[#EEEFE0]" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className={`font-bold transition-all duration-300 ${
                isScrolled ? 'text-lg text-[#EEEFE0]' : 'text-xl text-[#EEEFE0]'
              }`}>
                হিলফুল-ফুযুল প্রকাশনী
              </span>
              <span className="text-xs text-[#D1D8BE]">বইয়ের জন্য বিশ্বস্ত সঙ্গী</span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="বই, লেখক বা বিষয় অনুসন্ধান করুন..."
                className="w-full px-4 py-2 pl-10 rounded-full border border-[#D1D8BE] focus:outline-none focus:ring-2 focus:ring-[#2C4A3B] focus:border-transparent bg-[#EEEFE0] text-gray-800 placeholder-gray-500"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/kitabghor/wishlist" className="relative">
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full bg-[#EEEFE0] bg-opacity-80 hover:bg-[#2C4A3B] hover:text-[#EEEFE0] text-[#819A91] transition-all duration-300 hover:scale-105"
              >
                <Heart className="h-5 w-5" />
                {hasMounted && wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>
            
            <Link href="/kitabghor/cart" className="relative">
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full bg-[#EEEFE0] bg-opacity-80 hover:bg-[#2C4A3B] hover:text-[#EEEFE0] text-[#819A91] transition-all duration-300 hover:scale-105"
              >
                <ShoppingCart className="h-5 w-5" />
                {hasMounted && totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                    {totalCartItems}
                  </span>
                )}
              </Button>
            </Link>

            {hasMounted && session && (
              <Link href={(session.user as any)?.role === 'admin' ? '/admin' : '/kitabghor/user/'}>
                <Button
                  variant="ghost"
                  className="rounded-full bg-[#EEEFE0] bg-opacity-80 hover:bg-[#2C4A3B] hover:text-[#EEEFE0] text-[#819A91] transition-all duration-300 hover:scale-105 px-4"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  ড্যাশবোর্ড
                </Button>
              </Link>
            )}

            <Button
              onClick={handleAuthClick}
              disabled={isPending}
              className="rounded-full bg-[#2C4A3B] hover:bg-[#1A3325] text-[#EEEFE0] font-semibold px-6 transition-all duration-300 border border-[#2C4A3B] hover:border-[#1A3325] hover:shadow-lg flex items-center space-x-2 hover:scale-105"
            >
              {isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : hasMounted && session ? (
                <>
                  <LogOut className="h-4 w-4" />
                  <span>লগআউট</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>লগইন</span>
                </>
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full bg-[#EEEFE0] bg-opacity-80 hover:bg-[#2C4A3B] hover:text-[#EEEFE0] text-[#819A91] transition-all"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center space-x-1 mt-4">
          {navItems.map((item) =>
            item.children ? (
              <div key={item.name} className="relative group">
                <button
                  className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 ${
                    item.children.some((child) => child.href === pathname)
                      ? "bg-[#EEEFE0] text-[#2C4A3B] font-semibold shadow-sm"
                      : "text-[#EEEFE0] hover:bg-[#2C4A3B] hover:text-[#EEEFE0] hover:font-semibold"
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </button>
                <div className="absolute top-full left-0 mt-2 bg-[#EEEFE0] shadow-xl border border-[#D1D8BE] rounded-lg w-64 hidden group-hover:block z-50 overflow-hidden">
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      className={`flex items-center px-4 py-3 hover:bg-[#2C4A3B] hover:text-[#EEEFE0] transition-all duration-300 border-b border-[#D1D8BE] last:border-b-0 group/item ${
                        pathname === child.href
                          ? "bg-[#2C4A3B] text-[#EEEFE0] font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      <child.icon className="h-4 w-4 mr-3 text-[#819A91] group-hover/item:text-[#EEEFE0] transition-colors" />
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 ${
                  pathname === item.href
                    ? "bg-[#EEEFE0] text-[#2C4A3B] font-semibold shadow-sm"
                    : "text-[#EEEFE0] hover:bg-[#2C4A3B] hover:text-[#EEEFE0] hover:font-semibold"
                }`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.name}
              </Link>
            )
          )}
        </nav>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#EEEFE0] shadow-inner">
          {/* Mobile Search */}
          <div className="p-4 border-b border-[#D1D8BE]">
            <div className="relative">
              <input
                type="text"
                placeholder="বই, লেখক বা বিষয় অনুসন্ধান করুন..."
                className="w-full px-4 py-2 pl-10 rounded-full border border-[#D1D8BE] focus:outline-none focus:ring-2 focus:ring-[#2C4A3B] bg-white text-gray-800"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            </div>
          </div>

          <nav className="flex flex-col py-2">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.name} className="border-b border-[#D1D8BE]">
                  <button
                    onClick={toggleDropdown}
                    className={`flex items-center justify-between w-full px-6 py-4 text-left font-semibold transition-all duration-300 ${
                      item.children.some((c) => c.href === pathname)
                        ? "text-[#2C4A3B] bg-[#D1D8BE] bg-opacity-50"
                        : "text-gray-700 hover:text-[#2C4A3B] hover:bg-[#D1D8BE] hover:bg-opacity-30"
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="h-4 w-4 mr-3 text-[#2C4A3B]" />
                      {item.name}
                    </div>
                    {isDropdownOpen ? (
                      <ChevronDown className="h-4 w-4 text-[#2C4A3B]" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-[#2C4A3B]" />
                    )}
                  </button>
                  {isDropdownOpen && (
                    <div className="bg-[#D1D8BE] bg-opacity-30">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={`flex items-center px-10 py-3 border-t border-[#D1D8BE] border-opacity-50 transition-all duration-300 ${
                            pathname === child.href
                              ? "text-[#2C4A3B] font-semibold bg-white"
                              : "text-gray-700 hover:text-[#2C4A3B] hover:bg-white hover:font-semibold"
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <child.icon className="h-4 w-4 mr-3 text-[#2C4A3B]" />
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
                  className={`flex items-center px-6 py-4 border-b border-[#D1D8BE] transition-all duration-300 ${
                    pathname === item.href
                      ? "text-[#2C4A3B] font-semibold bg-[#D1D8BE] bg-opacity-50"
                      : "text-gray-700 hover:text-[#2C4A3B] hover:bg-[#D1D8BE] hover:bg-opacity-30 hover:font-semibold"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4 mr-3 text-[#2C4A3B]" />
                  {item.name}
                </Link>
              )
            )}
            
            {session && (
              <div className="p-4 border-t border-[#D1D8BE]">
                <Link href={(session.user as any)?.role === 'admin' ? '/admin' : '/kitabghor/user/'} className="block w-full">
                  <Button 
                    className="w-full rounded-full bg-[#2C4A3B] hover:bg-[#1A3325] text-[#EEEFE0] font-semibold py-3 transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>ড্যাশবোর্ড</span>
                  </Button>
                </Link>
              </div>
            )}

            <div className="p-4 border-t border-[#D1D8BE]">
              <Button 
                onClick={handleAuthClick}
                disabled={isPending}
                className="w-full rounded-full bg-[#2C4A3B] hover:bg-[#1A3325] text-[#EEEFE0] font-semibold py-3 transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2"
              >
                {isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : session ? (
                  <>
                    <LogOut className="h-4 w-4" />
                    <span>লগআউট</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    <span>লগইন</span>
                  </>
                )}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}