import { UserInfoSection } from "@/app/[locale]/(modules)/adoption/applicant-portal/_components/user-info-section";
import { ApplicationSummarySection } from "@/app/[locale]/(modules)/adoption/applicant-portal/_components/application-summary-section";
import { InitiationSection } from "@/app/[locale]/(modules)/adoption/applicant-portal/_components/initiation-section";
import { useMessages, useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/shared/language-switcher";
import AuthProvider from "@/components/auth-provider";

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
            <LanguageSwitcher
              className="py-2 px-4"
              path={"/adoption/applicant-portal/portal"}
            />
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
