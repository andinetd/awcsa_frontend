import AuthProvider from "@/components/auth-provider";
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import Link from "next/link";
import React, { ReactNode } from "react";
import { useTranslations } from "next-intl";

const Edirlayout = ({ children }: { children: ReactNode }) => {
  const t = useTranslations("social-affairs.edir.list");
  return (
    <AuthProvider>
      <SidebarLayout title={t("title")}>{children}</SidebarLayout>
    </AuthProvider>
  );
};

export default Edirlayout;
