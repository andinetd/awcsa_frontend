import AuthProvider from "@/components/auth-provider";
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  const t = useTranslations("care-centers-portal.layout");

  return (
    <AuthProvider
      allowedRoles={["CARE_CENTERS_PORTAL", "SYSTEM", "CHILDREN_AFFAIRS"]}
    >
      <SidebarLayout title={t("title")}>{children}</SidebarLayout>
    </AuthProvider>
  );
};

export default Layout;

