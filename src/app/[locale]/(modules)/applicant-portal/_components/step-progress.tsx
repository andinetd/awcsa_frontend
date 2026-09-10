"use client";

import { usePathname } from "next/navigation";
import { CheckCircle, Circle } from "lucide-react";
import { useTranslations } from "next-intl";

export function StepProgress() {
  const pathname = usePathname();
  const t = useTranslations("applicants-portal");

  const steps = [
    {
      id: 1,
      name: t("stepProgress.steps.step1"),
      path: "/applicant-portal/application/new/step1",
    },
    {
      id: 2,
      name: t("stepProgress.steps.step2"),
      path: "/applicant-portal/application/new/step2",
    },
    {
      id: 3,
      name: t("stepProgress.steps.step3"),
      path: "/applicant-portal/application/new/step3",
    },
    {
      id: 4,
      name: t("stepProgress.steps.step4"),
      path: "/applicant-portal/application/new/review",
    },
  ];

  const getCurrentStep = () => {
    const currentStep = steps.find((step) => pathname.includes(step.path));
    return currentStep?.id || 1;
  };

  const currentStepId = getCurrentStep();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="min-w-0">
          <span className="text-xs sm:text-sm font-medium text-gray-500">
            {t("stepProgress.step")} {currentStepId} {t("stepProgress.of")}{" "}
            {steps.length}
          </span>
          <span className="md:hidden text-xs font-semibold text-gray-800 ml-2 truncate">
            • {steps.find((s) => s.id === currentStepId)?.name}
          </span>
        </div>
        <span className="text-xs sm:text-sm font-lexend text-gray-500 shrink-0 ml-2">
          {Math.round((currentStepId / steps.length) * 100)}%{" "}
          {t("stepProgress.complete")}
        </span>
      </div>

      <div className="flex items-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1 min-w-0">
            <div className="flex items-center shrink-0">
              <div className="flex items-center justify-center shrink-0">
                {step.id < currentStepId ? (
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
                ) : step.id === currentStepId ? (
                  <div className="h-5 w-5 sm:h-6 sm:w-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm font-medium font-lexend">
                      {step.id}
                    </span>
                  </div>
                ) : (
                  <Circle className="h-5 w-5 sm:h-6 sm:w-6 text-gray-300 font-lexend" />
                )}
              </div>
              <div className="ml-2 sm:ml-3 hidden md:block">
                <p
                  className={`text-xs sm:text-sm font-medium font-lexend ${
                    step.id <= currentStepId ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {step.name}
                </p>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div className="flex-1 mx-1.5 sm:mx-3.5">
                <div
                  className={`h-[2px] sm:h-[3px] rounded-full ${
                    step.id < currentStepId ? "bg-secondary" : "bg-gray-200"
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
