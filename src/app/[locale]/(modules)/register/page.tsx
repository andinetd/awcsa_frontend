"use client";

import { useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useClientSignupMutation } from "@/hooks/client/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/shared/language-switcher";
import Link from "next/link";

export default function AdoptionRegisterPage() {
  const router = useRouter();
  const t = useTranslations("login.register");
  const tPage = useTranslations("login.page");

  const formSchema = useMemo(
    () =>
      z.object({
        firstName: z
          .string()
          .min(2, { message: t("validation.firstNameMin") }),
        lastName: z
          .string()
          .min(2, { message: t("validation.lastNameMin") }),
        email: z.string().email(t("validation.invalidEmail")),
        phoneNumber: z
          .string()
          .min(7, { message: t("validation.phoneMin") }),
        password: z
          .string()
          .min(8, t("validation.passwordMin")),
        cityIdNumber: z
          .string()
          .min(2, { message: t("validation.cityIdMin") }),
      }),
    [t]
  );

  type ClientSignUpSchemaType = z.infer<typeof formSchema>;

  const { mutate, data, isPending, isSuccess, error, isError } =
    useClientSignupMutation();

  const form = useForm<ClientSignUpSchemaType>({
    defaultValues: {
      cityIdNumber: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      phoneNumber: "",
    },
    resolver: zodResolver(formSchema),
  });

  function onSubmit(formData: ClientSignUpSchemaType) {
    const newData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
      cityIdNumber: formData.cityIdNumber,
      email: formData.email,
      password: formData.password,
    };
    mutate(newData);
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success(t("messages.success"));
      router.push("/applicant-portal/portal");
    }
    if (isError) {
      toast.error(t("messages.failed"), {
        description: error?.message,
      });
    }
  }, [isSuccess, isError, data, error, router, t]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-gray-50 relative">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl gap-10">
        {/* Left Side: Logo and Title */}
        <div className="flex flex-col items-center text-center md:text-left">
          <img
            src="/assets/WCSA_logo.jpg"
            alt={tPage("logoAlt")}
            className="w-40 h-20 md:w-80 md:h-60 object-contain mb-8"
          />
          <p className="text-2xl font-semibold font-lexend">{t("welcome")}</p>
        </div>

        {/* Right Side: Registration Form */}
        <Card className="w-full max-w-md flex flex-col px-10 py-10">
          <h1 className="text-xl font-semibold font-lexend mb-4">
            {t("title")}
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.firstName")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t("placeholders.firstName")} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.lastName")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t("placeholders.lastName")} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.phoneNumber")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t("placeholders.phoneNumber")} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cityIdNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.cityIdNumber")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t("placeholders.cityIdNumber")} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.email")}</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder={t("placeholders.email")} />
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
                    <FormLabel>{t("fields.password")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder={t("placeholders.password")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full mt-2" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  t("buttons.signUp")
                )}
              </Button>

              <div className="text-center text-xs text-slate-600 pt-2">
                {t("buttons.alreadyHaveAccount")}{" "}
                <Link href="/login" className="text-primary font-semibold hover:underline">
                  {t("buttons.logIn")}
                </Link>
              </div>
            </form>
          </Form>
        </Card>
      </div>

      <div className="absolute bottom-6 left-0 right-0 text-xs flex flex-wrap justify-center items-center gap-2 px-4 text-foreground/65">
        <p className="font-medium text-center font-lexend">
          {tPage("copyright", { year: new Date().getFullYear() })}
        </p>
        <p className="font-semibold cursor-pointer hover:scale-105 transition font-lexend">
          {tPage("location")}
        </p>
      </div>
    </div>
  );
}
