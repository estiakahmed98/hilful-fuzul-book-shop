import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/signin');
  }

  // Redirect based on role
  if (session.user.role === 'admin') {
    redirect('/admin');
  } else {
    redirect('/dashboard');
  }

  return null; // This will never be reached due to the redirects
}
