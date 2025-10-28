import { ThemeProvider } from "@/components/ecommarce/theme-provider";

const KitabGhorLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      

      <main className="mt-12 overflow-y-auto p-2 lg:p-6">{children}</main>
      
    </ThemeProvider>
  );
};

export default KitabGhorLayout;
