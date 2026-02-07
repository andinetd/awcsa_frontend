import AuthProvider from "@/components/auth-provider";
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { ReactNode } from "react";
import { useTranslations } from "next-intl";

const WomenLayout = ({ children }: { children: ReactNode }) => {
  const t = useTranslations("womens");

  return (
    <AuthProvider>
      <SidebarLayout title={t("layout.title")}>{children}</SidebarLayout>;
    </AuthProvider>
  );
};

export default WomenLayout;
