"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  combinedRegistrationSchema,
  CombinedRegistrationSchemaType,
} from "@/schemas/support-service";
import { useRegisterCombinedMutation } from "@/hooks/support";
import ServiceTypeSelect from "./service-type-select";
import { useTranslations } from "next-intl";

export default function QuickRegistrationForm() {
  const registerCombinedMutation = useRegisterCombinedMutation();
  const t = useTranslations("womens");

  const form = useForm<CombinedRegistrationSchemaType>({
    resolver: zodResolver(combinedRegistrationSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      cityIdNumber: "",
      phoneNumber: "",
      educationLevel: "",
      occupation: "",
      serviceTypeId: 0,
      provider: "",
      amountOrQuantity: "",
      dateProvided: new Date().toISOString().split("T")[0],
      subCity: "",
      woreda: "",
      facilitatorCityId: "",
      remark: "",
    },
  });

  function onSubmit(values: CombinedRegistrationSchemaType) {
    const payload = {
      ...values,
      remark: values.remark || "",
    };
    registerCombinedMutation.mutate(payload, {
      onSuccess: () => {
        form.reset();
        toast.success(t("support.quick.messages.success"));
      },
      onError: (error: any) => {
        toast.error(error?.message || t("support.quick.messages.error"));
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Woman Profile Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              {t("support.quick.womanInfo")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.firstName")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("form.firstName")} {...field} />
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
                    <FormLabel>{t("form.lastName")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("form.lastName")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cityIdNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.cityIdNumber")}</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. AA-12345" {...field} />
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
                  <FormLabel>{t("form.phoneNumber")}</FormLabel>
                  <FormControl>
                    <Input placeholder="09..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="educationLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.educationLevel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.educationLevel")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.occupation")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("form.occupation")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Support Service Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              {t("support.quick.supportDetails")}
            </h3>

            <FormField
              control={form.control}
              name="serviceTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("support.register.serviceType")}</FormLabel>
                  <FormControl>
                    <ServiceTypeSelect
                      value={field.value.toString()}
                      onValueChange={(val) => field.onChange(parseInt(val))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("support.register.providerName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("support.register.placeholder.provider")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amountOrQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("support.register.amountOrQuantity")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("support.register.placeholder.amount")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="dateProvided"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("support.register.dateProvided")}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("report.subCity")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("report.subCity")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="woreda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("report.woreda")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("report.woreda")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="facilitatorCityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("support.register.facilitatorCityId")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("support.register.placeholder.cityId")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("support.register.remarks")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("support.register.placeholder.remarks")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end border-t pt-6">
          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto px-12"
            disabled={registerCombinedMutation.isPending}
          >
            {registerCombinedMutation.isPending
              ? t("form.buttons.registering")
              : t("support.quick.submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
