//Estiak

import Footer from "@/components/ecommarce/footer";
import Header from "@/components/ecommarce/header";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-50 shadow-md">
        <Header />
      </div>
      {children}
      <Footer />
    </div>
  );
};

export default AuthLayout;
