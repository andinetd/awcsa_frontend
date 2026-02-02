import { notFound } from "next/navigation";
import { StepProgress } from "../../_components/step-progress";
import { routing } from "@/i18n/routing";
import { NextIntlClientProvider, hasLocale, useMessages } from "next-intl";
import LanguageSwitcher from "@/components/shared/language-switcher";
import { DynamicBreadcrumb } from "@/components/shared/dynamic-breadcrumb";

export default async function ApplicationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const param = await params;
  const locale = param.locale;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex justify-between items-center">
            <div className="mb-8">
              {/* <DynamicBreadcrumb /> */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Adoption Application
              </h1>
              <p className="text-gray-600">
                Complete all steps to submit your adoption application
              </p>
            </div>
          </div>

          <StepProgress />

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </NextIntlClientProvider>
  );
}
