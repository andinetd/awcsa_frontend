import UserInfoAndLogout from "@/components/shared/user_logout";
import type { ReactNode } from "react";

const RegisterNewChildCareCenter = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen ">
      {/* Header */}
      <header className="flex justify-between items-center px-12 py-4    shadow-sm">
        <h1 className="text-xl md:text-2xl  font-semibold text-gray-800">
          New Child Registration
        </h1>
        <UserInfoAndLogout />
      </header>

      {/* Content */}
      <main className=" px-6 py-4   w-full">{children}</main>
    </div>
  );
};

export default RegisterNewChildCareCenter;
