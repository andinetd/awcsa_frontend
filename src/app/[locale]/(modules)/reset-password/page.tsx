"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/navigation";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import {
  forgotPasswordApi,
  resetPasswordApi,
} from "@/api/auth/password-reset";

const forgotSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [sent, setSent] = useState(false);
  const [resetCompleted, setResetCompleted] = useState(false);

  const forgotForm = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  async function onForgotSubmit(values: z.infer<typeof forgotSchema>) {
    try {
      await forgotPasswordApi(values.email);
      setSent(true);
      toast.success("Password reset request sent");
    } catch (err: any) {
      toast.error(err.message || "Failed to process reset request");
    }
  }

  async function onResetSubmit(values: z.infer<typeof resetSchema>) {
    if (!token) {
      toast.error("Missing or invalid reset token");
      return;
    }
    try {
      await resetPasswordApi(token, values.newPassword);
      setResetCompleted(true);
      toast.success("Password updated successfully");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password");
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl gap-10">
        <div className="flex flex-col items-center text-center md:text-left">
          <img
            src="/assets/WCSA_logo.jpg"
            alt="logo"
            className="w-40 h-20 md:w-80 md:h-60 object-contain mb-8"
          />
        </div>

        <Card className="w-full max-w-md flex flex-col px-10 py-10">
          {token ? (
            // Mode 2: Reset password with token
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold">Set New Password</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter your new password below.
                </p>
              </div>

              {resetCompleted ? (
                <div className="space-y-4 text-center">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex flex-col items-center gap-2">
                    <CheckCircle2 className="size-8 text-green-600" />
                    <p className="font-medium">Password changed successfully!</p>
                    <p className="text-xs text-green-600">
                      Redirecting you to the sign in page...
                    </p>
                  </div>
                  <Button
                    onClick={() => router.push("/login")}
                    className="w-full mt-2"
                  >
                    Go to Sign In
                  </Button>
                </div>
              ) : (
                <Form {...resetForm}>
                  <form
                    onSubmit={resetForm.handleSubmit(onResetSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={resetForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="At least 8 characters"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={resetForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Re-enter your new password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={resetForm.formState.isSubmitting}
                    >
                      {resetForm.formState.isSubmitting ? (
                        <Loader2 className="animate-spin size-4" />
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </>
          ) : (
            // Mode 1: Request password reset link
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold">Reset Password</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter your email to receive a password reset link.
                </p>
              </div>

              {sent ? (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm text-center">
                    If an account exists with this email, a password reset link
                    has been sent.
                  </div>
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mt-4"
                  >
                    <ArrowLeft className="size-4" />
                    <span>Back to Sign In</span>
                  </Link>
                </div>
              ) : (
                <Form {...forgotForm}>
                  <form
                    onSubmit={forgotForm.handleSubmit(onForgotSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={forgotForm.control}
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

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={forgotForm.formState.isSubmitting}
                    >
                      {forgotForm.formState.isSubmitting ? (
                        <Loader2 className="animate-spin size-4" />
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>

                    <div className="text-center mt-4">
                      <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ArrowLeft className="size-4" />
                        <span>Back to Sign In</span>
                      </Link>
                    </div>
                  </form>
                </Form>
              )}
            </>
          )}
        </Card>
      </div>

      <div className="absolute bottom-6 left-0 right-0 text-xs flex flex-wrap justify-center items-center gap-2 px-4 text-foreground/65">
        <p className="font-medium text-center font-lexend">
          {`@${new Date().getFullYear()} Bureau of Women, children & social Affairs.`}
        </p>
        <p className="font-semibold cursor-pointer hover:scale-105 transition font-lexend">
          Addis Ababa
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin size-6" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
