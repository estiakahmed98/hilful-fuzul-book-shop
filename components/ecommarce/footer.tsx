"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Shield,
  Truck,
  HeadphonesIcon,
  Send,
  ArrowRight,
  Copyright,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#819A91] to-[#2C4A3B] text-[#EEEFE0] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-[#A7C1A8] rounded-full"></div>
        <div className="absolute top-1/3 right-20 w-16 h-16 border border-[#D1D8BE] rotate-45"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 border-2 border-[#A7C1A8] rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-12 h-12 bg-[#D1D8BE] rotate-12"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-16">
          {/* Left Section - Brand & Contact */}
          <div className="space-y-8">
            {/* Brand */}
            <div className="space-y-4">
              <Link href="/" className="inline-block group">
                <div className="flex items-center gap-3">
                  <div className="bg-[#EEEFE0] p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#819A91] to-[#A7C1A8] rounded-lg flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-[#EEEFE0]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#EEEFE0]">কিতাবঘর</h3>
                    <p className="text-[#D1D8BE] text-sm">জ্ঞানের আলো ছড়িয়ে দেয়া</p>
                  </div>
                </div>
              </Link>
              <p className="text-[#D1D8BE] leading-relaxed max-w-md">
                কিতাবঘর হলো একটি পূর্ণাঙ্গ অনলাইন বুকস্টোর যেখানে আপনি ইসলামিক বই
                কিনতে পারবেন কিংবা PDF পড়তে পারবেন। জ্ঞানের আলো ছড়িয়ে দেয়ার লক্ষ্যে আমরা নিরলসভাবে কাজ করে যাচ্ছি।
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="bg-[#819A91] p-2 rounded-lg group-hover:bg-[#A7C1A8] transition-colors">
                  <Phone className="h-4 w-4 text-[#EEEFE0]" />
                </div>
                <div>
                  <p className="text-sm text-[#D1D8BE]">কল করুন</p>
                  <p className="font-semibold text-[#EEEFE0]">+88-01842781978</p>
                </div>
              </div>

              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="bg-[#819A91] p-2 rounded-lg group-hover:bg-[#A7C1A8] transition-colors">
                  <Mail className="h-4 w-4 text-[#EEEFE0]" />
                </div>
                <div>
                  <p className="text-sm text-[#D1D8BE]">ইমেইল করুন</p>
                  <p className="font-semibold text-[#EEEFE0]">atservice@birdsofeden.me</p>
                </div>
              </div>

              <div className="flex items-start gap-3 group cursor-pointer">
                <div className="bg-[#819A91] p-2 rounded-lg group-hover:bg-[#A7C1A8] transition-colors mt-1">
                  <MapPin className="h-4 w-4 text-[#EEEFE0]" />
                </div>
                <div>
                  <p className="text-sm text-[#D1D8BE]">ঠিকানা</p>
                  <p className="font-semibold text-[#EEEFE0] leading-relaxed">
                    গ্রীন রোড, ঢাকা-১২১৫<br />
                    বাংলাদেশ
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="https://birdsofeden.me/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-xl bg-[#819A91] hover:bg-[#A7C1A8] text-[#EEEFE0] hover:scale-110 transition-all duration-300 border-0"
                >
                  <Facebook className="h-5 w-5" />
                </Button>
              </a>
              <a
                href="https://birdsofeden.me/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-xl bg-[#819A91] hover:bg-[#A7C1A8] text-[#EEEFE0] hover:scale-110 transition-all duration-300 border-0"
                >
                  <Instagram className="h-5 w-5" />
                </Button>
              </a>
              <a
                href="https://birdsofeden.me/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-xl bg-[#819A91] hover:bg-[#A7C1A8] text-[#EEEFE0] hover:scale-110 transition-all duration-300 border-0"
                >
                  <Twitter className="h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>

          {/* Right Section - Links & Newsletter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-[#EEEFE0] flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-[#A7C1A8] to-[#D1D8BE] rounded-full"></div>
                দ্রুত লিংক
              </h3>
              <ul className="space-y-3">
                {[
                  { href: "/kitabghor/books/", label: "সকল বই" },
                  { href: "/categories", label: "বিষয়সমূহ" },
                  { href: "/about", label: "আমাদের সম্পর্কে" },
                  { href: "/contact", label: "যোগাযোগ" },
                  { href: "/faq", label: "সাধারণ জিজ্ঞাসা" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[#D1D8BE] hover:text-[#EEEFE0] flex items-center gap-2 group transition-all duration-300 hover:translate-x-1"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-[#EEEFE0] flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-[#A7C1A8] to-[#D1D8BE] rounded-full"></div>
                গ্রাহক সেবা
              </h3>
              <ul className="space-y-3">
                {[
                  { href: "/shipping", label: "শিপিং নীতিমালা", icon: Truck },
                  { href: "/returns", label: "রিটার্ন এবং রিফান্ড", icon: HeadphonesIcon },
                  { href: "/privacy", label: "প্রাইভেসি পলিসি", icon: Shield },
                  { href: "/terms", label: "ব্যবহারের শর্তাবলি", icon: BookOpen },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[#D1D8BE] hover:text-[#EEEFE0] flex items-center gap-2 group transition-all duration-300"
                    >
                      <link.icon className="h-3 w-3" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-[#EEEFE0] flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-[#A7C1A8] to-[#D1D8BE] rounded-full"></div>
                নিউজলেটার
              </h3>
              <div className="space-y-4">
                <p className="text-[#D1D8BE] text-sm leading-relaxed">
                  নতুন বই ও অফার সম্পর্কে জানতে আমাদের নিউজলেটার সাবস্ক্রাইব করুন।
                </p>
                <div className="space-y-3">
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="আপনার ইমেইল দিন"
                      className="rounded-xl bg-white/10 border-2 border-[#A7C1A8]/30 focus:border-[#A7C1A8] text-[#EEEFE0] placeholder-[#D1D8BE] pl-4 pr-12 py-6 backdrop-blur-sm"
                    />
                    <Send className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#D1D8BE]" />
                  </div>
                  <Button 
                    className="w-full rounded-xl bg-gradient-to-r from-[#819A91] to-[#A7C1A8] hover:from-[#A7C1A8] hover:to-[#819A91] text-[#EEEFE0] font-semibold py-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    সাবস্ক্রাইব করুন
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#A7C1A8]/30"></div>

        {/* Bottom Bar */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-[#D1D8BE]">
              <Copyright className="h-4 w-4" />
              <span>{currentYear} কিতাবঘর। সর্বস্বত্ব সংরক্ষিত।</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-[#D1D8BE]">
              <Link href="/privacy" className="hover:text-[#EEEFE0] transition-colors">
                গোপনীয়তা নীতি
              </Link>
              <Link href="/terms" className="hover:text-[#EEEFE0] transition-colors">
                ব্যবহারের শর্তাবলী
              </Link>
              <Link href="/sitemap" className="hover:text-[#EEEFE0] transition-colors">
                সাইটম্যাপ
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-10 right-10 opacity-10">
        <BookOpen className="h-20 w-20" />
      </div>
    </footer>
  );
}