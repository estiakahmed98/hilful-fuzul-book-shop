"use client"; // Hitfulfuzul

import React, { useState, useEffect } from "react";
import Sidebar from "./dashboard/sidebar";
import {
  LuArrowLeftFromLine,
  LuArrowRightToLine,
  LuLayoutDashboard,
} from "react-icons/lu";
import { IoPersonAddSharp } from "react-icons/io5";
import { MdPeople } from "react-icons/md";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpenCheck, Library, LibraryBig } from "lucide-react";

const BookstoreSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (path: string): boolean => pathname === path;

  const toggleCollapse = (): void => {
    setIsCollapsed(!isCollapsed);
  };

  const allMenuItems = [
    {
      href: "/admin",
      icon: <LuLayoutDashboard className="size-6" />,
      label: "Dashboard",
    },
    {
      href: "/admin/users",
      icon: <MdPeople className="size-6" />,
      label: "See User",
    },
    {
      href: "/admin/add-book",
      icon: <LibraryBig className="size-6" />,
      label: "Add Book",
    },
    {
      href: "/admin/add-info",
      icon: <BookOpenCheck className="size-6" />,
      label: "Add Info",
    },
  ];

  return (
    <div className="flex h-screen">
      {!isMobile && (
        <div
          className={`transition-all duration-300 fixed md:relative h-full bg-sky-900 overflow-y-auto ${
            isCollapsed ? "w-[60px]" : "w-72"
          }`}
        >
          <div className="py-4 px-4 flex justify-between items-center">
            <button
              onClick={toggleCollapse}
              className="p-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 focus:outline-none"
            >
              {isCollapsed ? (
                <LuArrowRightToLine className="size-6" />
              ) : (
                <LuArrowLeftFromLine className="size-6" />
              )}
            </button>
          </div>

          <ul className="space-y-2 px-4">
            {allMenuItems.map(({ href, icon, label }) => (
              <Link
                href={href}
                key={href}
                className={`flex py-2 px-2 items-center font-medium whitespace-nowrap ${
                  isActive(href)
                    ? "bg-cyan-600 rounded-md text-white"
                    : "hover:text-white text-white/80"
                }`}
                aria-current={isActive(href) ? "page" : undefined}
              >
                <div className={`text-xl ${isCollapsed ? "mx-auto" : "mr-3"}`}>
                  {icon}
                </div>
                {!isCollapsed && <li className="text-sm">{label}</li>}
              </Link>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BookstoreSidebar;
