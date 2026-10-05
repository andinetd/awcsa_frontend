"use client";

import { useState, useEffect, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { jwtDecode } from "jwt-decode";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/navigation";
import {
  getRouteByDirectorate,
  getRouteByDepartment,
} from "@/utils/directorate-route";
import { routePermissions } from "@/utils/routePermissions";

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
        rememberMe: z.boolean(),
      }),
    [t],
  );

  type FormSchemaType = z.infer<typeof formSchema>;

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  async function onSubmit(values: FormSchemaType) {
    let recaptchaToken = "";

    if (executeRecaptcha) {
      try {
        setRecaptchaLoading(true);
        recaptchaToken = await executeRecaptcha("signin");
      } catch (err) {
        console.error("Recaptcha execution failed:", err);
      } finally {
        setRecaptchaLoading(false);
      }
    }

    const payload = {
      email: values.email,
      password: values.password,
      recaptchaToken,
      rememberMe: values.rememberMe,
    };

    mutate(payload);
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

    const navTimer = setTimeout(() => {
      const { department, userRole } = useAuthStore.getState();
      console.log("Navigating authenticated user:", {
        user,
        userRole,
        department,
      });

      if (userRole === "Super_Admin" || (user as any).role === "Super_Admin") {
        router.push("/super-admin/dashboard");
        return;
      }

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
        const route = getRouteByDepartment(department);

        const matchedRoute = Object.keys(routePermissions).find(
          (r) => route === r || route.startsWith(r + "/"),
        );
        if (matchedRoute) {
          const guard = routePermissions[matchedRoute];
          const accountOk = guard.allowedAccountTypes.includes("EMPLOYEE");
          const roleOk =
            !guard.allowedRoles ||
            (department != null && guard.allowedRoles.includes(department as any));
          if (accountOk && roleOk) {
            router.push(route as any);
          } else {
            console.warn("Permission check failed, redirecting to /unauthorized");
            router.push("/unauthorized");
          }
        } else {
          console.warn("No matched route for department:", department);
          router.push("/unauthorized");
        }
      } else {
        console.warn("Fallback routing to applicant-portal for accountType:", user.accountType);
        router.push(`/applicant-portal/portal`);
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

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <label
                      htmlFor="rememberMe"
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      {t("rememberMe")}
                    </label>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

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
