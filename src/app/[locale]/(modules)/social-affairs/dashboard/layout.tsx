import AuthProvider from "@/components/auth-provider";
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { useTranslations } from "next-intl";
import React, { ReactNode } from "react";

const SocialAffairsDashboardLayout = ({
  children,
}: {
  children: ReactNode;
}) => {
  const t = useTranslations("social-rehab.dashboard");
  return (
    <AuthProvider>
      <SidebarLayout title={t("title")}>{children}</SidebarLayout>
    </AuthProvider>
  );
};

export default SocialAffairsDashboardLayout;
