"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/shared/language-switcher";

export default function UnauthorizedPage() {
  const router = useRouter();
  const t = useTranslations("unauthorized");

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center text-center relative px-4">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>

      <img
        src="/assets/WCSA_logo.jpg"
        alt={t("logoAlt")}
        className="w-40 h-20 md:w-80 md:h-60 object-contain mb-8"
      />

      <div className="flex flex-col items-center md:items-start justify-center gap-4">
        <h1 className="text-2xl font-semibold font-lexend mb-2">
          {t("title")}
        </h1>
        <p className="text-lg text-foreground/60 max-w-md">
          {t("description")}
        </p>

        <Button
          onClick={() => router.back()}
          className="w-40 h-10 hover:cursor-pointer"
        >
          {t("goBack")}
        </Button>
      </div>
    </div>
  );
}
