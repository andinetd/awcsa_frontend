"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  NewChildformSchemaNew,
  NewChildformTypeNew,
} from "@/schemas/new-child-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import type { AxiosError } from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { BASE_URL } from "@/lib/base-url";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NewChildForm() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const t = useTranslations("adoption.children.registration");

  const [status, setStatus] = React.useState<string>("FOUND");

  const form = useForm<NewChildformTypeNew>({
    resolver: zodResolver(NewChildformSchemaNew),
    defaultValues: {
      current_status: "FOUND",
    },
  });

  async function onSubmit(values: NewChildformTypeNew) {
    const formatDateOnly = (d?: Date | string) => {
      if (!d) return undefined;
      const dt = d instanceof Date ? d : new Date(String(d));
      if (isNaN(dt.getTime())) return undefined;
      return dt.toISOString().split("T")[0];
    };

    const payload: Record<string, any> = {
      firstName: values?.first_name ?? "",
      lastName: values?.last_name ?? "",
      sex: values?.sex ?? "",
      dateOfBirth: formatDateOnly(values?.date_of_birth),
      currentStatus: values?.current_status ?? undefined,
      additionalInfo: values?.additional_information ?? undefined,
    };

    if (values?.current_status === "FOUND") {
      payload.placeWhereChildFound = values?.found_address ?? undefined;
      payload.timeWhenChildFound = values?.found_date ?? undefined;
      payload.socialWorkerCityIdNumber =
        values?.child_founder_city_id_number ?? undefined;
    } else if (values?.current_status === "IN_CARE") {
      payload.childCareFacilityId = Number(values?.care_center_id) ?? undefined;
      payload.childIdFromFacility =
        values?.child_id_from_care_center ?? undefined;
    } else if (values?.current_status === "IN_ADERA") {
      payload.baleAderaCityIdNumber =
        values?.bale_adera_city_id_number ?? undefined;
    } else if (values?.current_status === "ADOPTED") {
      payload.adopterCityIdNumber = values?.adopter_city_id_number ?? undefined;
    } else if (values?.current_status === "WITH_BLOOD_RELATIVE") {
      payload.bloodRelativeCityIdNumber =
        values?.blood_relative_city_id_number ?? undefined;
    } else if (values?.current_status === "RETURNED") {
      payload.previousAdopterCityIdNumber =
        values?.previous_adopter_city_id_number ?? undefined;
    }

    console.log("values submitted (payload):", payload);

    try {
      await axios.post(`${BASE_URL}/adoption/child`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success(t("toasts.success"));
      router.push("/adoption/children/");
    } catch (error) {
      console.error("Error submitting form:", error);

      // extract a useful message from AxiosError if possible
      let message = t("toasts.error", { message: "Unknown error" });

      if (axios.isAxiosError(error)) {
        const axiosErr = error as AxiosError<any>;
        // prefer server-provided message shape
        const respData = axiosErr.response?.data;
        if (respData) {
          if (typeof respData === "string") {
            message = respData;
          } else if (respData.message) {
            message = String(respData.message);
          } else if (respData.errors) {
            try {
              // if errors is array or object, make it readable
              if (Array.isArray(respData.errors)) {
                message = respData.errors
                  .map((e: any) => e.message || JSON.stringify(e))
                  .join("; ");
              } else {
                message = JSON.stringify(respData.errors);
              }
            } catch {
              message = String(respData.errors);
            }
          } else {
            try {
              message = JSON.stringify(respData);
            } catch {
              message = String(respData);
            }
          }
        } else if (axiosErr.message) {
          message = axiosErr.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      // show the extracted message in the toast
      toast.error(message);
      return;
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* ── Institutional Header Banner ──────────────────────────────────────── */}
      <div className="bg-white border border-[#E3E7EB] p-4 sm:p-5 rounded-xs shadow-2xs space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          <span>Addis Ababa City Administration</span>
          <span>·</span>
          <span>Women &amp; Social Affairs Bureau</span>
          <span>·</span>
          <span className="text-[#1769AA] font-semibold">
            Child Protection &amp; Care
          </span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-[#0B1F3A]">
          {t("title") || "Register New Child Record"}
        </h1>
        <p className="text-xs text-slate-500">
          {t("subtitle") ||
            "Complete institutional intake, identify child placement, and establish legal registry custody."}
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs p-5 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-2">
              {t("title") || "Child Biodata & Placement Details"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">
                      {t("fields.firstName")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("placeholders.firstName")}
                        className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">
                      {t("fields.lastName")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("placeholders.lastName")}
                        className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">
                      {t("fields.gender")}
                    </FormLabel>
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between h-8 text-xs bg-white border-[#E3E7EB] rounded-xs text-slate-800"
                          >
                            {field.value
                              ? field.value === "MALE"
                                ? t("options.male")
                                : t("options.female")
                              : t("placeholders.selectGender")}
                            <ChevronDown className="size-3.5 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-full rounded-xs border-[#E3E7EB]">
                          <DropdownMenuItem
                            onSelect={() => field.onChange("MALE")}
                            className="text-xs"
                          >
                            {t("options.male")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => field.onChange("FEMALE")}
                            className="text-xs"
                          >
                            {t("options.female")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">
                      {t("fields.dateOfBirth")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                        value={
                          field.value
                            ? field.value instanceof Date
                              ? field.value.toISOString().split("T")[0]
                              : String(field.value)
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? new Date(e.target.value)
                              : undefined,
                          )
                        }
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Status Selection */}
            <div className="pt-2 border-t border-[#E3E7EB]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="current_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        {t("fields.status")}
                      </FormLabel>
                      <FormControl>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between h-8 text-xs bg-white border-[#E3E7EB] rounded-xs text-slate-800"
                            >
                              {field.value
                                ? field.value === "FOUND"
                                  ? t("options.found")
                                  : field.value === "IN_CARE"
                                    ? t("options.inCare")
                                    : field.value === "IN_ADERA"
                                      ? t("options.inAdera")
                                      : field.value === "ADOPTED"
                                        ? t("options.adopted")
                                        : field.value === "WITH_BLOOD_RELATIVE"
                                          ? t("options.withBloodRelative")
                                          : field.value === "RETURNED"
                                            ? t("options.returned")
                                            : field.value
                                : t("placeholders.selectStatus")}
                              <ChevronDown className="size-3.5 text-slate-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-full rounded-xs border-[#E3E7EB]">
                            <DropdownMenuItem
                              onSelect={() => {
                                field.onChange("FOUND");
                                setStatus("FOUND");
                              }}
                              className="text-xs"
                            >
                              {t("options.found")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => {
                                field.onChange("IN_ADERA");
                                setStatus("IN_ADERA");
                              }}
                              className="text-xs"
                            >
                              {t("options.inAdera")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => {
                                field.onChange("IN_CARE");
                                setStatus("IN_CARE");
                              }}
                              className="text-xs"
                            >
                              {t("options.inCare")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => {
                                field.onChange("ADOPTED");
                                setStatus("ADOPTED");
                              }}
                              className="text-xs"
                            >
                              {t("options.adopted")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => {
                                field.onChange("WITH_BLOOD_RELATIVE");
                                setStatus("WITH_BLOOD_RELATIVE");
                              }}
                              className="text-xs"
                            >
                              {t("options.withBloodRelative")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => {
                                field.onChange("RETURNED");
                                setStatus("RETURNED");
                              }}
                              className="text-xs"
                            >
                              {t("options.returned")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Dynamic Placement Fields */}
            {status === "FOUND" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 border-t border-[#E3E7EB]">
                <FormField
                  control={form.control}
                  name="found_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        {t("fields.addressFound")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("placeholders.addressFound")}
                          className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="found_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        {t("fields.foundDate")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                          value={
                            field.value
                              ? field.value instanceof Date
                                ? field.value.toISOString().split("T")[0]
                                : String(field.value)
                              : ""
                          }
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? new Date(e.target.value)
                                : undefined,
                            )
                          }
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="child_founder_city_id_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        {t("fields.socialWorkerId")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("placeholders.socialWorkerId")}
                          className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {status === "IN_CARE" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 border-t border-[#E3E7EB]">
                <FormField
                  control={form.control}
                  name="care_center_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        {t("fields.careCenterId")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("placeholders.careCenterId")}
                          className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="child_id_from_care_center"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        {t("fields.childIdFromCareCenter")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("placeholders.childIdFromCareCenter")}
                          className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {status === "IN_ADERA" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 border-t border-[#E3E7EB]">
                <FormField
                  control={form.control}
                  name="bale_adera_city_id_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        {t("fields.baleAderaId")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("placeholders.baleAderaId")}
                          className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {status === "ADOPTED" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 border-t border-[#E3E7EB]">
                <FormField
                  control={form.control}
                  name="adopter_city_id_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        {t("fields.adopterId")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("placeholders.adopterId")}
                          className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {status === "WITH_BLOOD_RELATIVE" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 border-t border-[#E3E7EB]">
                <FormField
                  control={form.control}
                  name="blood_relative_city_id_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        {t("fields.bloodRelativeId")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("placeholders.bloodRelativeId")}
                          className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {status === "RETURNED" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 border-t border-[#E3E7EB]">
                <FormField
                  control={form.control}
                  name="previous_adopter_city_id_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        {t("fields.previousAdopterId")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("placeholders.previousAdopterId")}
                          className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="pt-2 border-t border-[#E3E7EB]">
              <FormField
                control={form.control}
                name="additional_information"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">
                      {t("fields.additionalInfo")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("placeholders.additionalInfo")}
                        className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          <div className="flex justify-between items-center pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/adoption/children")}
              className="rounded-xs text-xs font-medium h-8 border-[#E3E7EB] px-4 cursor-pointer"
            >
              {t("buttons.back") || "Back"}
            </Button>
            <Button
              type="submit"
              className="bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold rounded-xs text-xs h-8 px-6 shadow-2xs cursor-pointer"
            >
              {t("buttons.submit") || "Register Child Record"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
