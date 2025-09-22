"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  ShoppingCart,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <footer className="bg-slate-200 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">কিতাবঘর সম্পর্কে</h3>
            <p className="text-muted-foreground mb-4">
              কিতাবঘর হলো একটি পূর্ণাঙ্গ অনলাইন বুকস্টোর যেখানে আপনি ইসলামিক বই
              কিনতে পারবেন কিংবা PDF পড়তে পারবেন।
            </p>
            <div className="flex space-x-4">
              <a
                href="https://birdsofeden.me/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Button variant="ghost" size="icon">
                  <Facebook className="h-5 w-5" />
                </Button>
              </a>
              <a
                href="https://birdsofeden.me/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Button variant="ghost" size="icon">
                  <Instagram className="h-5 w-5" />
                </Button>
              </a>
              <a
                href="https://birdsofeden.me/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Button variant="ghost" size="icon">
                  <Twitter className="h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">দ্রুত লিংক</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/kitabghor/books/"
                  className="text-muted-foreground hover:text-primary"
                >
                  সকল বই
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-muted-foreground hover:text-primary"
                >
                  বিষয়সমূহ
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary"
                >
                  আমাদের সম্পর্কে
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary"
                >
                  যোগাযোগ
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-primary"
                >
                  সাধারণ জিজ্ঞাসা
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">গ্রাহক সেবা</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shipping"
                  className="text-muted-foreground hover:text-primary"
                >
                  শিপিং নীতিমালা
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-muted-foreground hover:text-primary"
                >
                  রিটার্ন এবং রিফান্ড
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary"
                >
                  প্রাইভেসি পলিসি
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary"
                >
                  ব্যবহারের শর্তাবলি
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">নিউজলেটার</h3>
            <p className="text-muted-foreground mb-4">
              নতুন বই ও অফার সম্পর্কে জানতে আমাদের নিউজলেটার সাবস্ক্রাইব করুন।
            </p>
            <div className="flex flex-col space-y-2 ">
              <Input
                type="email"
                placeholder="আপনার ইমেইল দিন"
                className="border-2 border-muted-foreground"
              />
              <Button>সাবস্ক্রাইব</Button>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">
                  atservice@birdsofeden.me
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">+88-01842781978</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-500 h-[2px] mt-5"></div>

        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} কিতাবঘর। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </footer>
  );
}
