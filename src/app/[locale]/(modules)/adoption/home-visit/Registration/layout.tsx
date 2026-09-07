import { StepProgress } from "../_components/step_progress";
import { RegistrationHeader } from "./_components/registration-header";

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center">
          <RegistrationHeader />
        </div>

        <StepProgress />

        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
