import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import TreeProvider from "@/providers/treeProvider";
import { CartProvider } from "@/components/ecommarce/CartContext";
import { WishlistProvider } from "@/components/ecommarce/WishlistContext";
import { AuthProvider } from "@/components/auth/AuthContext";
import Header from "@/components/ecommarce/header";
import Footer from "@/components/ecommarce/footer";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ইসলামি দাওয়াহ ইনস্টিটিউট বাংলাদেশ",
  description: "ইসলামি দাওয়াহ ইনস্টিটিউট বাংলাদেশ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <Providers>
            <TreeProvider>
              <CartProvider>
                <WishlistProvider>
                  {/* Conditional Header - You can make this more dynamic based on routes */}
                  <Header />
                  
                  {/* Main Content */}
                  <main className="min-h-screen">
                    {children}
                  </main>
                </WishlistProvider>
              </CartProvider>
            </TreeProvider>
          </Providers>
          <Toaster />
           <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}