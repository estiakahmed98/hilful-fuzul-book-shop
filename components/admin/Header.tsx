"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Menu, Home } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Header() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full h-16 bg-white shadow flex items-center justify-between px-6">
      {/* Mobile menu toggle */}
      <button
        className="lg:hidden block"
        onClick={() => setOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </button>

      <h1 className="text-xl font-semibold">Admin Dashboard</h1>

      <div className="flex items-center space-x-4">
        <Link href="/" className="text-sm font-medium text-gray-700 hover:text-gray-900">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            View Site
          </Button>
          <Home className="w-5 h-5 sm:hidden" />
        </Link>
        <p className="text-gray-600 text-sm">
          {session?.user?.name} ({session?.user?.role})
        </p>

        <Link href="/admin/profile" className="inline-flex">
          <Avatar className="h-9 w-9">
            <AvatarImage src={(session?.user as any)?.image ?? undefined} alt={session?.user?.name ?? "Profile"} />
            <AvatarFallback>
              {(session?.user?.name || "Me")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>

        <Button variant="destructive" size="sm" onClick={() => signOut()}>
          Logout
        </Button>
      </div>
    </header>
  );
}
