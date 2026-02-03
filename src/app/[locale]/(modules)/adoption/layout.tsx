import AuthProvider from "@/components/auth-provider";
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { useTranslations } from "next-intl";
import React, { ReactNode } from "react";

const Adoptionlayout = ({ children }: { children: ReactNode }) => {
  const t = useTranslations("adoption");
  return (
    <AuthProvider>
      <SidebarLayout title={t("moduleTitle")}>{children}</SidebarLayout>;
    </AuthProvider>
  );
};

export default Adoptionlayout;
