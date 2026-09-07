"use client";

import { useTranslations } from "next-intl";

export function RegistrationHeader() {
  const t = useTranslations("adoption");

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {t("homeVisitRegistration.layout.title")}
      </h1>
      <p className="text-gray-600">
        {t("homeVisitRegistration.layout.subtitle")}
      </p>
    </div>
  );
}