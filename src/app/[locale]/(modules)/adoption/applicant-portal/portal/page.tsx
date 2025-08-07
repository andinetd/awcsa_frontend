import { UserInfoSection } from "@/app/[locale]/(modules)/adoption/applicant-portal/_components/user-info-section";
import { ApplicationSummarySection } from "@/app/[locale]/(modules)/adoption/applicant-portal/_components/application-summary-section";
import { InitiationSection } from "@/app/[locale]/(modules)/adoption/applicant-portal/_components/initiation-section";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Adoption Applicant Portal
          </h1>
          <p className="text-gray-600">
            Welcome to your adoption application dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <UserInfoSection />
            <ApplicationSummarySection />
          </div>

          <div className="lg:col-span-1">
            <InitiationSection />
          </div>
        </div>
      </div>
    </div>
  );
}
