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
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            {/* <DynamicBreadcrumb /> */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              {t("applicationLayout.title")}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">{t("applicationLayout.subtitle")}</p>
          </div>
          <div className="self-end sm:self-auto">
            <LanguageSwitcher />
          </div>
        </div>

        <StepProgress />

        <div className="mt-6 sm:mt-8">{children}</div>
      </div>
    </div>
  );
}
