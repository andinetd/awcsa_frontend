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
  path?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className,
  path,
}) => {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const locale = Array.isArray(params?.locale)
    ? params.locale[0]
    : params?.locale || "en";

  function handleSelect(newLocale: string) {
    if (newLocale !== locale) {
      router.push(`/${newLocale}/${path}`);
    }
  }

  return (
    <div style={{ position: "relative", zIndex: 50 }}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "px-4 py-1.5 rounded bg-primary text-white font-medium shadow focus:outline-none text-sm font-lexend hover:bg-primary/90 transition-colors hover:cursor-pointer flex items-center gap-1",
              className
            )}
          >
            {locale === "en" ? (
              <>
                <img
                  src="/flags/gb.svg"
                  alt="English"
                  className="w-5 h-5 inline-block mr-1"
                />{" "}
                ENG
              </>
            ) : (
              <>
                <img
                  src="/flags/et.svg"
                  alt="Amharic"
                  className="w-5 h-5 inline-block mr-1"
                />{" "}
                AMH
              </>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => handleSelect("en")}
            className={cn(
              locale === "en" && "bg-primary/10 font-semibold text-primary",
              "flex items-center gap-2"
            )}
          >
            {locale === "en" && (
              <CheckIcon className="w-4 h-4 mr-2 text-primary" />
            )}
            <img
              src="/flags/gb.svg"
              alt="English"
              className="w-5 h-5 inline-block mr-1"
            />{" "}
            ENG
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => handleSelect("am")}
            className={cn(
              locale === "am" && "bg-primary/10 font-semibold text-primary",
              "flex items-center gap-2"
            )}
          >
            {locale === "am" && (
              <CheckIcon className="w-4 h-4 mr-2 text-primary" />
            )}
            <img
              src="/flags/et.svg"
              alt="Amharic"
              className="w-5 h-5 inline-block mr-1"
            />{" "}
            AMH
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSwitcher;
