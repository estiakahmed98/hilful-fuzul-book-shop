"use client";

import { SidebarProvider, useSidebar } from "@/providers/sidebar-provider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

// Client component that uses the Sidebar context
function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { openMobile, toggleSidebar, setOpenMobile } = useSidebar();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/kitabghor/user");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Mobile Sidebar Overlay */}
      {openMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setOpenMobile(false)}
        />
      )}
      
      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${openMobile ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-30 lg:hidden`}>
        <Sidebar isMobile onClose={() => setOpenMobile(false)} />
      </div>
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-64">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SidebarProvider>
  );
}