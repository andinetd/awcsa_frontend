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
import { SubCitySelect, WoredaSelect } from "@/components/shared/location-selects";
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
      subCity: "",
      woreda: "",
      address: "",
      educationLevel: "",
      careerStatus: "",
      photoUrl: "",
    },
  });

  const subCity = form.watch("subCity");

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
        <Button className="bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold rounded-xs text-xs h-8 px-3 shadow-2xs gap-1.5 cursor-pointer">
          <Plus className="w-3.5 h-3.5" />
          {t("womenList.registerButton")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-xs border border-[#E3E7EB] bg-white shadow-lg p-6">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider font-mono">
            {t("form.registerTitle")}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {t("form.description")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-2">
            {/* Personal Information */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-1.5">
                {t("form.personalInfo")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="cityIdNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">{t("form.cityIdNumber")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.cityIdNumber")}
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50"
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
                      <FormLabel className="text-xs font-semibold text-slate-700">{t("form.age")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={t("form.agePlaceholder")}
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50"
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
                      <FormLabel className="text-xs font-semibold text-slate-700">{t("form.firstName")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.firstName")}
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50"
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
                      <FormLabel className="text-xs font-semibold text-slate-700">{t("form.lastName")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.lastName")}
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50"
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
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-xs font-semibold text-slate-700">{t("form.phoneNumber")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.phoneNumber")}
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-1.5">
                {t("form.addressTitle")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="subCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">{t("form.subCity")}</FormLabel>
                      <FormControl>
                        <SubCitySelect
                          value={field.value}
                          onValueChange={(val) => {
                            field.onChange(val);
                            form.setValue("woreda", "");
                          }}
                          placeholder={t("form.subCityPlaceholder")}
                        />
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
                      <FormLabel className="text-xs font-semibold text-slate-700">{t("form.woreda")}</FormLabel>
                      <FormControl>
                        <WoredaSelect
                          subCity={subCity || ""}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder={t("form.woredaPlaceholder")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("form.fullAddress")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.fullAddress")}
                        className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Education & Career */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-1.5">
                {t("form.educationEmployment")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="educationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">{t("form.educationLevel")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50">
                            <SelectValue
                              placeholder={t("form.educationLevelPlaceholder")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xs border-[#E3E7EB]">
                          <SelectItem value="NONE" className="text-xs">
                            {t("form.educationOptions.NONE")}
                          </SelectItem>
                          <SelectItem value="PRIMARY" className="text-xs">
                            {t("form.educationOptions.PRIMARY")}
                          </SelectItem>
                          <SelectItem value="SECONDARY" className="text-xs">
                            {t("form.educationOptions.SECONDARY")}
                          </SelectItem>
                          <SelectItem value="DIPLOMA" className="text-xs">
                            {t("form.educationOptions.DIPLOMA")}
                          </SelectItem>
                          <SelectItem value="BACHELOR" className="text-xs">
                            {t("form.educationOptions.BACHELOR")}
                          </SelectItem>
                          <SelectItem value="MASTERS" className="text-xs">
                            {t("form.educationOptions.MASTERS")}
                          </SelectItem>
                          <SelectItem value="DOCTORATE" className="text-xs">
                            {t("form.educationOptions.DOCTORATE")}
                          </SelectItem>
                          <SelectItem value="OTHER" className="text-xs">
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
                      <FormLabel className="text-xs font-semibold text-slate-700">{t("form.careerStatus")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50">
                            <SelectValue
                              placeholder={t("form.careerStatusPlaceholder")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xs border-[#E3E7EB]">
                          <SelectItem value="EMPLOYED" className="text-xs">
                            {t("form.careerOptions.EMPLOYED")}
                          </SelectItem>
                          <SelectItem value="SELF_EMPLOYED" className="text-xs">
                            {t("form.careerOptions.SELF_EMPLOYED")}
                          </SelectItem>
                          <SelectItem value="UNEMPLOYED" className="text-xs">
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
                      <FormLabel className="text-xs font-semibold text-slate-700">{t("form.photoUrl")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://..."
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E3E7EB]">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-[#F7F8FA] cursor-pointer"
              >
                {t("form.buttons.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold shadow-2xs cursor-pointer"
              >
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