import { notFound } from "next/navigation";
import { StepProgress } from "../_components/step_progress";
import { routing } from "@/i18n/routing";
import { NextIntlClientProvider, hasLocale, useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/shared/language-switcher";

export default async function ApplicationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = useTranslations("adoption");

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t("homeVisitRegistration.layout.title")}
            </h1>
            <p className="text-gray-600">
              {t("homeVisitRegistration.layout.subtitle")}
            </p>
          </div>
        </div>

        <StepProgress />

        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
