"use client";

import { useParams, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { CheckIcon } from "lucide-react";

import React from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const locale = Array.isArray(params?.locale)
    ? params.locale[0]
    : params?.locale || "en";

  function handleSelect(newLocale: string) {
    if (newLocale !== locale) {
      router.push(`/${newLocale}`);
    }
  }

  return (
    <div style={{ position: "relative", zIndex: 50 }}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "px-4 py-1.5 rounded bg-primary text-white font-medium shadow focus:outline-none text-sm font-lexend hover:bg-primary/90 transition-colors hover:cursor-pointer",
              className
            )}
          >
            {t("navbar.language")}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => handleSelect("en")}
            className={cn(
              locale === "en" && "bg-primary/10 font-semibold text-primary"
            )}
          >
            {locale === "en" && (
              <CheckIcon className="w-4 h-4 mr-2 text-primary" />
            )}
            English
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => handleSelect("am")}
            className={cn(
              locale === "am" && "bg-primary/10 font-semibold text-primary"
            )}
          >
            {locale === "am" && (
              <CheckIcon className="w-4 h-4 mr-2 text-primary" />
            )}
            አማርኛ
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSwitcher;
