// app/kitabghor/user/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";

export default function UserProfilePage() {
  const { data: session } = useSession();

  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";
  const userRole = (session?.user as any)?.role ?? "user";

  return (
    <>
      <Card className="px-6 py-4 shadow-sm border border-gray-100">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          My Profile
        </h1>
        <p className="text-xs md:text-sm text-gray-500 mt-1">
          Manage your account information and view your profile details.
        </p>
      </Card>

      <Card className="p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Account Information
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Name
            </p>
            <p className="text-sm text-gray-800">{userName}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Email
            </p>
            <p className="text-sm text-gray-800">{userEmail}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Role
            </p>
            <p className="inline-flex items-center px-2 py-1 text-[11px] rounded-full bg-[#E8F5E9] text-[#1B5E20] font-semibold">
              {userRole}
            </p>
          </div>
        </div>
      </Card>
    </>
  );
}
