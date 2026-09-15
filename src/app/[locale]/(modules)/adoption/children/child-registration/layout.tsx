import { ReactNode } from "react";

const RegisterNewChild = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen w-full p-4 sm:p-6 lg:p-8">
      {children}
    </div>
  );
};

export default RegisterNewChild;
