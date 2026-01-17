import type { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      {children}
    </div>
  );
};

export default Layout;
