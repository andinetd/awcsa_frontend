"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/shared/language-switcher";
import { ShieldAlert, Home, LogIn } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { LOGIN_ROUTE } from "@/lib/auth-routes";

export default function UnauthorizedPage() {
  const router = useRouter();
  const t = useTranslations("unauthorized");
  const user = useAuthStore((s) => s.user);

  // If the user landed here while unauthenticated (e.g., an expired
  // session, or following a stale cookie), there's no useful information
  // to display — bounce straight to the login form so they can recover.
  useEffect(() => {
    if (!user) {
      router.replace(LOGIN_ROUTE);
    }
  }, [user, router]);

  const handleSignIn = () => {
    useAuthStore.getState().logout();
    router.replace(LOGIN_ROUTE);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 relative px-4">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>

      <div className="flex flex-col items-center text-center max-w-lg mx-auto">
        {/* Error Code Badge */}
        <span className="mb-6 inline-flex items-center rounded-full border border-destructive/30 bg-destructive/10 px-4 py-1.5 text-sm font-medium text-destructive">
          {t("errorCode")}
        </span>

        {/* Shield Icon */}
        <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-destructive/10">
          <ShieldAlert className="size-10 text-destructive" />
        </div>

        {/* Title & Description */}
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
          {t("title")}
        </h1>
        <p className="text-base text-muted-foreground max-w-md leading-relaxed mb-8">
          {t("description")}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-8">
          <Button
            onClick={handleSignIn}
            className="w-full sm:w-44 h-11 hover:cursor-pointer"
          >
            <LogIn className="size-4" />
            {t("signIn")}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="w-full sm:w-44 h-11 hover:cursor-pointer"
          >
            <Home className="size-4" />
            {t("goHome")}
          </Button>
        </div>

        {/* Help / Contact Card */}
        <div className="w-full rounded-xl border bg-card p-5 text-left">
          <h2 className="text-sm font-semibold text-foreground mb-1">
            {t("helpText")}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("contactInfo")}
          </p>
        </div>
      </div>

      {/* Decorative Background Logo */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03]">
        <img
          src="/assets/WCSA_logo.jpg"
          alt=""
          className="w-[500px] h-auto"
        />
      </div>
    </div>
  );
}
