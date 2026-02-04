"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useEffect } from "react";
import { useUpdateWomenProfileMutation } from "@/hooks/womens";
import {
  womenProfileSchema,
  WomenProfileSchemaType,
} from "@/schemas/women-profile";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { WomenProfile } from "@/api/womens/women-profile";
import { useTranslations } from "next-intl";

interface EditWomenProfileFormProps {
  profile: WomenProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditWomenProfileForm({
  profile,
  open,
  onOpenChange,
}: EditWomenProfileFormProps) {
  const updateMutation = useUpdateWomenProfileMutation();
  const t = useTranslations("womens");

  const form = useForm<WomenProfileSchemaType>({
    resolver: zodResolver(womenProfileSchema) as any,
    defaultValues: {
      cityIdNumber: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      dateOfBirth: new Date().toISOString().split("T")[0],
      address: "",
      educationLevel: "",
      occupation: "",
      monthlyIncome: 0,
      photoUrl: "",
    },
  });

  useEffect(() => {
    if (profile) {
      const dateStr = profile.client.dateOfBirth
        ? new Date(profile.client.dateOfBirth).toISOString().split("T")[0]
        : "";

      form.reset({
        cityIdNumber: profile.client.cityIdNumber,
        firstName: profile.client.firstName,
        lastName: profile.client.lastName,
        phoneNumber: profile.client.phoneNumber,
        dateOfBirth: dateStr,
        address: profile.client.address,
        educationLevel: profile.educationLevel,
        occupation: profile.occupation,
        monthlyIncome: profile.client.monthlyIncome,
        photoUrl: profile.photoUrl || "",
      });
    }
  }, [profile, form]);

  function onSubmit(values: WomenProfileSchemaType) {
    if (!profile?.id) return;

    updateMutation.mutate(
      { id: profile.id, data: values as any },
      {
        onSuccess: () => {
          onOpenChange(false);
          toast.success(t("form.messages.successUpdate"));
        },
        onError: (error: any) => {
          toast.error(error?.message || t("form.messages.errorUpdate"));
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("form.editTitle")}</DialogTitle>
          <DialogDescription>{t("form.description")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t("form.personalInfo")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cityIdNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.cityIdNumber")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.cityIdNumber")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.dateOfBirth")}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.phoneNumber")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("form.phoneNumber")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t("form.addressTitle")}</h3>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.fullAddress")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("form.fullAddress")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Education & Employment */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                {t("form.educationEmployment")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <FormField
                  control={form.control}
                  name="monthlyIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.monthlyIncome")}</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="photoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.photoUrl")}</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t("form.buttons.cancel")}
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending
                  ? t("form.buttons.saving")
                  : t("form.buttons.save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
