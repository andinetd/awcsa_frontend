"use client";

import React, { useTransition } from "react";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
}

const LOCALE_NAMES: Record<"en" | "am", { native: string; secondary: string }> =
  {
    en: { native: "English", secondary: "አማርኛ" },
    am: { native: "አማርኛ", secondary: "English" },
  };

const FLAGS: Record<"en" | "am", string> = {
  en: "/flags/gb.svg",
  am: "/flags/et.svg",
};

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const locale: "en" | "am" = (
    Array.isArray(params?.locale) ? params.locale[0] : params?.locale
  ) as "en" | "am" || "en";

  const nextLocale: "en" | "am" = locale === "en" ? "am" : "en";

  function handleToggle() {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  const names = LOCALE_NAMES[locale];

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      aria-label={`Switch to ${LOCALE_NAMES[nextLocale].native}`}
      aria-busy={isPending}
      title={`${names.native} → ${LOCALE_NAMES[nextLocale].native}`}
      className={cn(
        "px-4 py-1.5 rounded bg-primary text-white font-medium shadow focus:outline-none text-sm font-lexend hover:bg-primary/90 transition-colors hover:cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-wait",
        className,
      )}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
      ) : (
        <img src={FLAGS[nextLocale]} alt="" className="h-5 w-5 shrink-0" />
      )}
      <span>
        {isPending
          ? `${LOCALE_NAMES[nextLocale].native}…`
          : names.native}
      </span>
    </button>
  );
};

export default LanguageSwitcher;