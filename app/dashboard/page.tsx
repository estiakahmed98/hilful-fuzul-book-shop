// app/user/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";

export default function UserDashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p className="p-6">Loading...</p>;

  if (!session?.user) return redirect("/signin");

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-4">User Dashboard</h1>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-2">Welcome, {session.user.name}</h2>
        <p className="text-gray-600">Email: {session.user.email}</p>
        <p className="text-gray-600">Role: {session.user.role}</p>
      </Card>
    </div>
  );
}
