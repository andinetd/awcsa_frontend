"use client";

import React from "react";
import { useTranslations } from "next-intl";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  beneficiaryRegistrationSchema,
  BeneficiaryRegistrationSchemaType,
} from "@/schemas/beneficiaries";
import { useRegisterBeneficiaryMutation } from "@/hooks/beneficiaries";
import { BeneficiaryType } from "@/api/beneficiaries/types";

interface RegistrationFormProps {
  type: BeneficiaryType;
}

export default function RegistrationForm({ type }: RegistrationFormProps) {
  const t = useTranslations("social-affairs.elderlyAndDisabled.registration");
  const [open, setOpen] = React.useState(false);
  const registerMutation = useRegisterBeneficiaryMutation();

  const form = useForm<BeneficiaryRegistrationSchemaType>({
    resolver: zodResolver(beneficiaryRegistrationSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      cityIdNumber: "",
      phoneNumber: "",
      dateOfBirth: "",
      address: "",
      educationLevel: "",
      occupation: "",
      disabilityType: "",
      disabilityLevel: "",
      cause: "",
      familyMembersCount: 0,
      type,
    },
  });

  const onSubmit = (values: BeneficiaryRegistrationSchemaType) => {
    registerMutation.mutate(values, {
      onSuccess: () => {
        toast.success(
          t("success", {
            type: type === "DISABLED" ? t("disabled") : t("elderly"),
          }),
        );
        form.reset();
        setOpen(false);
      },
      onError: (error: any) => {
        toast.error(error?.message || t("error"));
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          {t("registerNew")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-lexend">
            {t("title", {
              type: type === "DISABLED" ? t("disabled") : t("elderly"),
            })}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 pt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  {t("sections.basicInfo")}
                </h3>
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.firstName")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("placeholders.firstName")}
                          {...field}
                        />
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
                        <Input
                          placeholder={t("placeholders.lastName")}
                          {...field}
                        />
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
                      <FormLabel>{t("fields.cityId")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("placeholders.cityId")}
                          {...field}
                        />
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
                      <FormLabel>{t("fields.phone")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("placeholders.phone")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {type === "DISABLED" && (
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fields.dob")}</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  {t("sections.details", {
                    type: type === "DISABLED" ? t("disabled") : t("elderly"),
                  })}
                </h3>
                {type === "DISABLED" && (
                  <>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("fields.address")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("placeholders.address")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="disabilityType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("fields.disabilityType")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("placeholders.disabilityType")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="disabilityLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("fields.disabilityLevel")}</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t("placeholders.selectLevel")}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="MILD">
                                  {t("levels.mild")}
                                </SelectItem>
                                <SelectItem value="MODERATE">
                                  {t("levels.moderate")}
                                </SelectItem>
                                <SelectItem value="SEVERE">
                                  {t("levels.severe")}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cause"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("fields.cause")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("placeholders.cause")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <FormField
                  control={form.control}
                  name="educationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.education")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("placeholders.education")}
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
                      <FormLabel>{t("fields.occupation")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("placeholders.occupation")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="familyMembersCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.familyCount")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={t("placeholders.familyCount")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                {t("buttons.cancel")}
              </Button>
              <Button type="submit" disabled={registerMutation.isPending}>
                {registerMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {t("registerNew")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
