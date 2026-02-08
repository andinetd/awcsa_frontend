import AuthProvider from "@/components/auth-provider";
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { useTranslations } from "next-intl";
import React, { ReactNode } from "react";

const BackupsLayout = ({ children }: { children: ReactNode }) => {
  const t = useTranslations("super-admin.moduleTitles");
  return (
    <AuthProvider>
      <SidebarLayout title={t("backups")}>{children}</SidebarLayout>
    </AuthProvider>
  );
};

export default BackupsLayout;
