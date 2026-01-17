import LanguageSwitcher from "@/components/shared/language-switcher";
import UserInfoAndLogout from "@/components/shared/user_logout";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Care Centers Portal
            </h1>
            <p className="text-gray-600">Manage your care center</p>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher
              className="py-2 px-4"
              path={"/care-centers-portal"}
            />
            <UserInfoAndLogout />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;
