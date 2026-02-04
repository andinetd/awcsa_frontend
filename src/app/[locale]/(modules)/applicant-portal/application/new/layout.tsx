"use client";

import { notFound } from "next/navigation";
import { StepProgress } from "../../_components/step-progress";
import { routing } from "@/i18n/routing";
import { NextIntlClientProvider, hasLocale, useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/shared/language-switcher";
import { DynamicBreadcrumb } from "@/components/shared/dynamic-breadcrumb";
import { useParams } from "next/navigation";

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const locale = params.locale as string;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = useTranslations("applicants-portal");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center">
          <div className="mb-8">
            {/* <DynamicBreadcrumb /> */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t("applicationLayout.title")}
            </h1>
            <p className="text-gray-600">{t("applicationLayout.subtitle")}</p>
          </div>
          <LanguageSwitcher />
        </div>

        <StepProgress />

        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
