"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff } from "lucide-react";

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
import { moduleAndRouteMap } from "@/utils/app-route";
import { DeputyBureau } from "@/types/api/auth";

import { useSignInMutation } from "@/hooks/client/auth";
import { useAuthStore } from "@/stores/auth-store";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function SignInForm() {
  const router = useRouter();
  const locale = useLocale();
  const { mutate, isPending, isSuccess, data, isError, error } =
    useSignInMutation();
  const { user, orgUnit } = useAuthStore();

  const { executeRecaptcha } = useGoogleReCaptcha();

  const [isRecaptchaLoading, setRecaptchaLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormSchemaType) {
    if (!executeRecaptcha) {
      toast("Recaptcha not yet available, try again in a second");
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
      toast("Recaptcha failed, please try again");
    } finally {
      setRecaptchaLoading(false);
    }
  }

  // Handle success / error redirects and toasts
  // Redirect after successful login (watch user/orgUnit)
  useState(() => {}); // keep hooks order if needed

  useEffect(() => {
    if (!user && !orgUnit) return;

    console.log("DEBUG: Redirection Check", {
      user,
      accountType: user?.accountType,
      orgUnit,
      deputyBureau: orgUnit?.deputyBureau,
    });

    // Defer navigation to next tick to avoid interfering with rendering
    const t = setTimeout(() => {
      if (user?.accountType === "CLIENT") {
        router.push(`/applicant-portal/portal`);
      } else if (user?.accountType === "CHILD_CARE_FACLITY") {
        router.push(`/care-centers-portal`);
      } else if (orgUnit?.deputyBureau == null) {
        router.push("/bureau-head");
      } else {
        const route = moduleAndRouteMap(orgUnit?.deputyBureau as DeputyBureau);
        router.push(route);
      }
    }, 0);

    return () => clearTimeout(t);
  }, [user, orgUnit, router]);

  // Show error toast when sign-in mutation errors
  useEffect(() => {
    if (isError) {
      toast.error("Sign-in failed: " + (error as any)?.message);
    }
  }, [isError, error]);

  return (
    <div className="mx-auto w-full mt-5 max-w-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
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
              Forgot password?
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
              "Sign in"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
