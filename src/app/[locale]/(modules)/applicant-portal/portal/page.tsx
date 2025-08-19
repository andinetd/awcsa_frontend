import { useMessages, useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/shared/language-switcher";
import AuthProvider from "@/components/auth-provider";
import { UserInfoSection } from "../_components/user-info-section";
import { ApplicationSummarySection } from "../_components/application-summary-section";
import { InitiationSection } from "../_components/initiation-section";
import { useSignInMutation } from "@/hooks/client/auth";
import UserInfoAndLogout from "@/components/shared/user_logout";

export default function DashboardPage() {
  const application = useTranslations("applicationMessages");
  return (
    // <AuthProvider allowedRoles={[""]}>
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {application("header.title")}
            </h1>
            <p className="text-gray-600">{application("header.subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher
              className="py-2 px-4"
              path={"/applicant-portal/portal"}
            />
            <UserInfoAndLogout />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <UserInfoSection />
            <ApplicationSummarySection />
          </div>

          <div className="lg:col-span-2">
            <InitiationSection />
          </div>
        </div>
      </div>
    </div>
    // </>
  );
}
