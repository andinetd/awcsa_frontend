import AuthProvider from "@/components/auth-provider";
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { ReactNode } from "react";
import { useTranslations } from "next-intl";

const ElderlyAndDisabledLayout = ({ children }: { children: ReactNode }) => {
  const t = useTranslations("social-affairs.elderlyAndDisabled.layout");
  return (
    <AuthProvider allowedRoles={["SOCIAL_AFFAIRS", null]}>
      <SidebarLayout title={t("title")}>{children}</SidebarLayout>
    </AuthProvider>
  );
};

export default ElderlyAndDisabledLayout;
