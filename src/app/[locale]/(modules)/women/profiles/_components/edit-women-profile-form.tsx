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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useUpdateWomenProfileMutation } from "@/hooks/womens";
import {
  womenProfileSchema,
  WomenProfileSchemaType,
} from "@/schemas/women-profile";
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
  const t = useTranslations("women");

  const form = useForm<WomenProfileSchemaType>({
    resolver: zodResolver(womenProfileSchema) as any,
    defaultValues: {
      cityIdNumber: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      age: "" as any,
      address: "",
      educationLevel: "",
      careerStatus: "",
      photoUrl: "",
    },
  });

  useEffect(() => {
    if (profile) {
      let calculatedAge = profile.client.age;
      if (!calculatedAge && profile.client.dateOfBirth) {
        const diff = Date.now() - new Date(profile.client.dateOfBirth).getTime();
        calculatedAge = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
      }

      form.reset({
        cityIdNumber: profile.client.cityIdNumber,
        firstName: profile.client.firstName,
        lastName: profile.client.lastName,
        phoneNumber: profile.client.phoneNumber,
        age: calculatedAge ?? ("" as any),
        address: profile.client.address,
        educationLevel: profile.educationLevel || "",
        careerStatus: profile.careerStatus || profile.occupation || "",
        photoUrl: profile.photoUrl || "",
      });
    }
  }, [profile, form]);

  function onSubmit(values: WomenProfileSchemaType) {
    if (!profile?.id) return;

    const payload = {
      ...values,
      occupation: values.careerStatus,
    };

    updateMutation.mutate(
      { id: profile.id, data: payload as any },
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
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.age")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={t("form.agePlaceholder")}
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value)
                            )
                          }
                        />
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
                    <FormItem className="md:col-span-2">
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

            {/* Education & Career */}
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("form.educationLevelPlaceholder")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="NONE">
                            {t("form.educationOptions.NONE")}
                          </SelectItem>
                          <SelectItem value="PRIMARY">
                            {t("form.educationOptions.PRIMARY")}
                          </SelectItem>
                          <SelectItem value="SECONDARY">
                            {t("form.educationOptions.SECONDARY")}
                          </SelectItem>
                          <SelectItem value="DIPLOMA">
                            {t("form.educationOptions.DIPLOMA")}
                          </SelectItem>
                          <SelectItem value="BACHELOR">
                            {t("form.educationOptions.BACHELOR")}
                          </SelectItem>
                          <SelectItem value="MASTERS">
                            {t("form.educationOptions.MASTERS")}
                          </SelectItem>
                          <SelectItem value="DOCTORATE">
                            {t("form.educationOptions.DOCTORATE")}
                          </SelectItem>
                          <SelectItem value="OTHER">
                            {t("form.educationOptions.OTHER")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="careerStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.careerStatus")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("form.careerStatusPlaceholder")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="EMPLOYED">
                            {t("form.careerOptions.EMPLOYED")}
                          </SelectItem>
                          <SelectItem value="SELF_EMPLOYED">
                            {t("form.careerOptions.SELF_EMPLOYED")}
                          </SelectItem>
                          <SelectItem value="UNEMPLOYED">
                            {t("form.careerOptions.UNEMPLOYED")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="photoUrl"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
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