"use client";

import { useState, useEffect } from "react";
import SignInForm from "@/components/shared/auth/sign-in-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/shared/language-switcher";
import { Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const t = useTranslations("login.page");
  const [isClient, setIsClient] = useState(false);

  // This ensures the component only renders on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 relative">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl gap-10">
        {/* Left Side: Logo and Title */}
        <div className="flex flex-col items-center text-center md:text-left">
          <img
            src="/assets/WCSA_logo.jpg"
            alt={t("logoAlt")}
            className="w-40 h-20 md:w-80 md:h-60 object-contain mb-8"
          />
          <p className="text-2xl font-semibold font-lexend">{t("welcome")}</p>
        </div>

        {/* Right Side: SignIn Form */}
        <div className="flex flex-col w-full max-w-md gap-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="font-lexend">{t("signInTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <GoogleReCaptchaProvider
                reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                scriptProps={{
                  async: true,
                  defer: true,
                  appendTo: "head",
                }}
              >
                <SignInForm />
              </GoogleReCaptchaProvider>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-lexend mt-4 hover:underline"
              >
                <Home className="size-4" />
                <span>{t("backToHome")}</span>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 text-xs flex flex-wrap justify-center items-center gap-2 px-4 text-foreground/65">
        <p className="font-medium text-center font-lexend">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>

        <p className="font-semibold cursor-pointer hover:scale-105 transition font-lexend">
          {t("location")}
        </p>
      </div>
    </div>
  );
}
