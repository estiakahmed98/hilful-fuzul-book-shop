"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button"; // Assumed component
import { Menu, Home, LogOut } from "lucide-react"; // Added LogOut icon
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // Assumed component
import Link from "next/link";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { data: session } = useSession();

  return (
    <header className="w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20 shadow-md">
      {/* Mobile menu toggle (Now takes an onClick handler) */}
      <button
        className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition"
        onClick={onMenuClick}
        aria-label="Toggle Menu"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
        Admin Dashboard
      </h1>
      <h1 className="text-xl font-bold text-gray-800 sm:hidden">Dashboard</h1>

      <div className="flex items-center space-x-3 sm:space-x-6">
        {/* View Site Link */}
        <Link
          href="/"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          title="View Live Site"
        >
          <Button variant="outline" size="sm" className="hidden sm:flex text-indigo-600 border-indigo-200 hover:bg-indigo-50">
            View Site
          </Button>
          <Home className="w-5 h-5 sm:hidden text-indigo-600" />
        </Link>

        {/* User Info & Avatar */}
        <div className="hidden md:flex flex-col text-right">
          <p className="text-gray-800 text-sm font-semibold leading-none">
            {session?.user?.name}
          </p>
          <p className="text-gray-500 text-xs leading-none mt-1">
            {session?.user?.role}
          </p>
        </div>

        <Link href="/admin/profile" title="View Profile">
          <Avatar className="h-9 w-9 border-2 border-indigo-400 cursor-pointer hover:opacity-80 transition">
            <AvatarImage
              src={(session?.user as any)?.image ?? undefined}
              alt={session?.user?.name ?? "Profile"}
            />
            <AvatarFallback className="bg-indigo-100 text-indigo-600 font-bold text-sm">
              {(session?.user?.name || "Me")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>

        {/* Logout Button */}
        <Button
          variant="destructive"
          size="sm"
          onClick={() => signOut()}
          className="text-white bg-red-500 hover:bg-red-600 hidden sm:flex"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => signOut()}
          className="sm:hidden"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}