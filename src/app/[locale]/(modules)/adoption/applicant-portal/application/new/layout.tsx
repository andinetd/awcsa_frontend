import { StepProgress } from "../../_components/step-progress";

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Adoption Application
          </h1>
          <p className="text-gray-600">
            Complete all steps to submit your adoption application
          </p>
        </div>

        <StepProgress />

        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
