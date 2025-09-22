// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import { ThemeProvider } from "@/providers/theme-provider";
// import { Toaster } from "@/components/ui/sonner";
// import TreeProvider from "@/providers/treeProvider";
// import { CartProvider } from "@/components/ecommarce/CartContext";
// import { WishlistProvider } from "@/components/ecommarce/WishlistContext";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "ইসলামি দাওয়াহ ইনস্টিটিউট বাংলাদেশ",
//   description: "ইসলামি দাওয়াহ ইনস্টিটিউট বাংলাদেশ",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" suppressHydrationWarning={true}>
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="light"
//           disableTransitionOnChange
//         >
//           <TreeProvider>
//             <CartProvider>
//               <WishlistProvider>{children}</WishlistProvider>
//             </CartProvider>
//           </TreeProvider>
//           <Toaster />
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }

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
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <AuthProvider>
            <TreeProvider>
              <CartProvider>
                <WishlistProvider>{children}</WishlistProvider>
              </CartProvider>
            </TreeProvider>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
