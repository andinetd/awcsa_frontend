"use client";

import { usePathname } from "next/navigation";
import { CheckCircle, Circle } from "lucide-react";
import { useTranslations } from "next-intl";

export function StepProgress() {
  const pathname = usePathname();
  const t = useTranslations("adoption");

  const steps = [
    {
      id: 1,
      name: t("homeVisitRegistration.steps.step1"),
      path: "/adoption/home-visit/Registration/step1",
    },
    {
      id: 2,
      name: t("homeVisitRegistration.steps.step2"),
      path: "/adoption/home-visit/Registration/step2",
    },
    {
      id: 3,
      name: t("homeVisitRegistration.steps.step3"),
      path: "/adoption/home-visit/Registration/step3",
    },
    {
      id: 4,
      name: t("homeVisitRegistration.steps.step4"),
      path: "/adoption/home-visit/Registration/step4",
    },
    {
      id: 5,
      name: t("homeVisitRegistration.steps.step5"),
      path: "/adoption/home-visit/Registration/step5",
    },
  ];

  const getCurrentStep = () => {
    const currentStep = steps.find((step) => pathname.includes(step.path));
    return currentStep?.id || 1;
  };

  const currentStepId = getCurrentStep();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500">
          {t("homeVisitRegistration.steps.status", {
            current: currentStepId,
            total: steps.length,
          })}
        </span>
        <span className="text-sm font-lexend text-gray-500">
          {t("homeVisitRegistration.steps.percentComplete", {
            percent: Math.round((currentStepId / steps.length) * 100),
          })}
        </span>
      </div>

      <div className="flex items-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex items-center">
              <div className="flex items-center justify-center">
                {step.id < currentStepId ? (
                  <CheckCircle className="h-6 w-6 text-secondary" />
                ) : step.id === currentStepId ? (
                  <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium font-lexend">
                      {step.id}
                    </span>
                  </div>
                ) : (
                  <Circle className="h-6 w-6 text-gray-300 font-lexend" />
                )}
              </div>
              <div className="ml-3 hidden sm:block">
                <p
                  className={`text-sm font-medium font-lexend ${
                    step.id <= currentStepId ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {step.name}
                </p>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div className="flex-1 mx-3.5">
                <div
                  className={`h-[3px] rounded-full ${
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
