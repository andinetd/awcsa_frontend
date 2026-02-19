"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { jwtDecode } from "jwt-decode";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import {
  getRouteByDirectorate,
  getRouteByDepartment,
} from "@/utils/directorate-route";

import { useSignInMutation } from "@/hooks/client/auth";
import { useAuthStore } from "@/stores/auth-store";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function SignInForm() {
  const t = useTranslations("login.form");
  const router = useRouter();
  const locale = useLocale();
  const { mutate, isPending, isSuccess, data, isError, error } =
    useSignInMutation();
  const { user, orgUnit } = useAuthStore();

  const { executeRecaptcha } = useGoogleReCaptcha();

  const [isRecaptchaLoading, setRecaptchaLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formSchema = useMemo(
    () =>
      z.object({
        email: z.string().email(t("errors.invalidEmail")),
        password: z.string().min(8, t("errors.passwordMin")),
      }),
    [t],
  );

  type FormSchemaType = z.infer<typeof formSchema>;

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormSchemaType) {
    if (!executeRecaptcha) {
      toast(t("errors.recaptchaNotAvailable"));
      return;
    }

    try {
      setRecaptchaLoading(true);
      // Generate a fresh token on every submit
      const recaptchaToken = await executeRecaptcha("signin");

      const payload = {
        email: values.email,
        password: values.password,
        recaptchaToken,
      };

      console.log("Sign-in payload:", payload);
      mutate(payload);
    } catch (err) {
      console.error("Recaptcha execution failed:", err);
      toast(t("errors.recaptchaFailed"));
    } finally {
      setRecaptchaLoading(false);
    }
  }

  // Reset form state on mount to ensure clean state after logout/redirect
  useEffect(() => {
    form.reset();
    setShowPassword(false);
    setRecaptchaLoading(false);
  }, []);


  useEffect(() => {
    // Clear any potentially stale state if it's not actually valid
    const token = useAuthStore.getState().token;
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          useAuthStore.getState().logout();
        }
      } catch (e) {
        useAuthStore.getState().logout();
      }
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const token = useAuthStore.getState().token;
    if (!token) return;

    // Double check token validity
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        useAuthStore.getState().logout();
        return;
      }
    } catch (e) {
      useAuthStore.getState().logout();
      return;
    }

    const { userRole } = useAuthStore.getState();

    console.log("DEBUG: Redirection Check", {
      user,
      accountType: user.accountType,
      userRole,
      orgUnit,
    });

    const navTimer = setTimeout(() => {
      if (
        user.accountType === "CLIENT" ||
        (user as any).accountType === "CLIENT"
      ) {
        router.push(`/applicant-portal/portal`);
      } else if (
        user.accountType === "CHILD_CARE_FACLITY" ||
        user.accountType === "CHILD_CARE_FACILITY"
      ) {
        router.push(`/care-centers-portal`);
      } else if (user.accountType === "EMPLOYEE") {
        if (userRole === "Super_Admin") {
          router.push("/super-admin/dashboard");
        } else {
          const { department, userRole } = useAuthStore.getState();

          if (userRole === "Super_Admin") {
            router.push("/super-admin/dashboard");
          } else {
            const route = getRouteByDepartment(department);
            router.push(route);
          }
        }
      }
    }, 0);

    return () => clearTimeout(navTimer);
  }, [user, orgUnit, router]);
  useEffect(() => {
    if (isError) {
      toast.error(
        t("errors.signInFailed", { message: (error as any)?.message }),
      );
    }
  }, [isError, error, t]);

  return (
    <div className="mx-auto w-full mt-5 max-w-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("email")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("password")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={t("passwordPlaceholder")}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="float-right mt-2 mb-6">
            <Link
              href="/reset-password"
              className="text-sm text-foreground underline hover:opacity-80"
            >
              {t("forgotPassword")}
            </Link>
          </div>

          <Button
            className="w-full"
            disabled={
              form.formState.isSubmitting || isRecaptchaLoading || isPending
            }
          >
            {isRecaptchaLoading || isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              t("signIn")
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
