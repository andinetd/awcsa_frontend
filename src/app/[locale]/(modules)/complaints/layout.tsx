"use client";
import AuthProvider from "@/components/auth-provider";
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { ReactNode } from "react";
import { useTranslations } from "next-intl";

const ComplaintsLayout = ({ children }: { children: ReactNode }) => {
  const t = useTranslations("complaints.management");

  return (
    <AuthProvider>
      <SidebarLayout title={t("layoutTitle")}>{children}</SidebarLayout>
    </AuthProvider>
  );
};

export default ComplaintsLayout;
