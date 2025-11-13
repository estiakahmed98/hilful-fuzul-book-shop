import { ThemeProvider } from "@/components/ecommarce/theme-provider";
import Header from "@/components/ecommarce/header";
import Footer from "@/components/ecommarce/footer";

const KitabGhorLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <Header />
      <main className="overflow-y-auto">{children}</main>
      <Footer />
    </ThemeProvider>
  );
};

export default KitabGhorLayout;
