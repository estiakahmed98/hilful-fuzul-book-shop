import Footer from "@/components/ecommarce/footer";
import Header from "@/components/ecommarce/header";
import { ThemeProvider } from "@/components/ecommarce/theme-provider";

const KitabGhorLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <div className="fixed top-0 left-0 right-0 z-50 shadow-md">
        <Header />
      </div>

      <main className="mt-12 overflow-y-auto p-2 lg:p-6">{children}</main>
      <Footer />
    </ThemeProvider>
  );
};

export default KitabGhorLayout;
