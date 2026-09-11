"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus } from "lucide-react";
import { useState } from "react";
import { useRegisterWomenProfileMutation } from "@/hooks/womens";
import {
  womenProfileSchema,
  WomenProfileSchemaType,
} from "@/schemas/women-profile";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function NewWomenProfileForm() {
  const [open, setOpen] = useState(false);
  const registerMutation = useRegisterWomenProfileMutation();
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

  function onSubmit(values: WomenProfileSchemaType) {
    const payload = {
      ...values,
      occupation: values.careerStatus,
    };
    registerMutation.mutate(payload as any, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
        toast.success(t("form.messages.successRegister"));
      },
      onError: (error: any) => {
        toast.error(error?.message || t("form.messages.errorRegister"));
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          {t("womenList.registerButton")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("form.registerTitle")}</DialogTitle>
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
                onClick={() => setOpen(false)}
              >
                {t("form.buttons.cancel")}
              </Button>
              <Button type="submit" disabled={registerMutation.isPending}>
                {registerMutation.isPending
                  ? t("form.buttons.registering")
                  : t("form.buttons.register")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}