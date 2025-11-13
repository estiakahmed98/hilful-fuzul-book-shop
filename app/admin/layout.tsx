import { SidebarProvider } from "@/providers/sidebar-provider";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/signin");
  }
  if (session.user.role !== 'admin') {
    redirect("/dashboard");
  }

  return (
    <SidebarProvider>
      <div className="flex fixed size-full">
        <div className="w-full overflow-hidden">
          <main className="h-[calc(100vh-80px)] overflow-y-auto p-2 lg:p-6 ">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
