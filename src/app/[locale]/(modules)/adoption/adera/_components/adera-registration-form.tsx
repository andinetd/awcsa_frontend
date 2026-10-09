"use client";

import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRegisterAderaMutation } from "@/hooks/adoption/adera";
import { NewAderaSchema, NewAderaSchemaType } from "@/schemas/adera-schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

const NewAderaRegistrationForm = () => {
  const t = useTranslations("adoption");
  const { mutate, isPending, error } = useRegisterAderaMutation();
  const router = useRouter();

  const form = useForm<NewAderaSchemaType>({
    resolver: zodResolver(NewAderaSchema),
    defaultValues: {},
  });

  async function onSubmit(values: NewAderaSchemaType) {
    console.log("submitting values: ", JSON.stringify(values));
    mutate(values, {
      onSuccess: () => {
        toast.success(t("adera.registration.successToast"));
        router.push("/adoption/adera");
      },
      onError: (err) => {
        toast.error(t("adera.registration.errorToast") + (err?.message ? `: ${err.message}` : ""));
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Card className="max-w-6xl mx-auto px-6 py-10 shadow-lg space-y-8">
          {/* Header Banner */}
          <div className="border-b border-[#E3E7EB] pb-4">
            <h1 className="text-xl font-bold tracking-tight text-[#0B1F3A]">
              {t("adera.registration.title")}
            </h1>
            <p className="text-xs text-slate-500">
              {t("adera.registration.subtitle")}
            </p>
          </div>

          {/* Personal Information Section */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">
              {t("adera.registration.personalInfo")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="cityIdNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("adera.registration.cityIdNumber")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="partnerCityIdNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("adera.registration.partnerCityIdNumber")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Education and Job Info */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">
              {t("adera.registration.spouseInfo")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="educationLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("adera.registration.educationLevel")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
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
                    <FormLabel>{t("adera.registration.occupation")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="monthlyIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("adera.registration.monthlyIncome")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
                              : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Child Preference Info */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">
              {t("adera.registration.placementPreferences")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="preferredChildGender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("adera.registration.preferredChildGender")}</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("adera.registration.genderPlaceholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">
                            {t("adera.registration.male")}
                          </SelectItem>
                          <SelectItem value="FEMALE">
                            {t("adera.registration.female")}
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
                name="preferredChildMinAge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("adera.registration.preferredChildMinAge")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
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
                name="preferredChildMaxAge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("adera.registration.preferredChildMaxAge")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
                              : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Facilitator */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">
              {t("adera.registration.facilitator")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="facilitatorCityIdNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("adera.registration.facilitatorCityIdNumber")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Submit */}
          <CardFooter className="flex justify-between items-center pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/adoption/adera")}
              className="rounded-xs text-xs font-medium h-8 border-[#E3E7EB] px-4 cursor-pointer"
            >
              {t("adera.registration.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isPending || form.formState.isSubmitting}
              className="bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold rounded-xs text-xs h-8 px-6 shadow-2xs cursor-pointer"
            >
              {isPending || form.formState.isSubmitting
                ? t("adera.registration.creating")
                : t("adera.registration.create")}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default NewAderaRegistrationForm;
