//Estiak

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center  h-[calc(100vh-80px)] justify-center">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
};

export default AuthLayout;
