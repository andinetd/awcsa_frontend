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
import { ChevronDown, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NewChildForm() {
  const t = useTranslations("care-centers-portal.addChild");
  const te = useTranslations("care-centers-portal.enums");

  const router = useRouter();
  const token = useAuthStore((state) => state.token);

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

      toast.success(t("messages.success"));
      router.push("/adoption/children/");
    } catch (error) {
      console.error("Error submitting form:", error);

      // extract a useful message from AxiosError if possible
      let message = t("messages.error");

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="">
          <Card className="flex flex-col space-y-2 py-8 px-5">
            <CardTitle className="text-lg font-semibold">
              {t("title")}
            </CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.firstName")}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
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
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.lastName")}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
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
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.gender")}</FormLabel>
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between text-sm text-gray-800"
                          >
                            {field.value
                              ? te(`sex.${field.value}`)
                              : t("placeholders.selectGender")}
                            <ChevronDown />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-full">
                          <DropdownMenuItem
                            onSelect={() => field.onChange("MALE")}
                          >
                            {te("sex.MALE")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => field.onChange("FEMALE")}
                          >
                            {te("sex.FEMALE")}
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
                    <FormLabel>{t("fields.dob")}</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="current_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.status")}</FormLabel>
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between text-sm text-gray-800"
                          >
                            {field.value
                              ? te(`status.${field.value}`)
                              : t("placeholders.selectStatus")}
                            <ChevronDown />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-full">
                          <DropdownMenuItem
                            onSelect={() => {
                              field.onChange("FOUND");
                              setStatus("FOUND");
                            }}
                          >
                            {te("status.FOUND")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              field.onChange("IN_ADERA");
                              setStatus("IN_ADERA");
                            }}
                          >
                            {te("status.IN_ADERA")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              field.onChange("IN_CARE");
                              setStatus("IN_CARE");
                            }}
                          >
                            {te("status.IN_CARE")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              field.onChange("ADOPTED");
                              setStatus("ADOPTED");
                            }}
                          >
                            {te("status.ADOPTED")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              field.onChange("WITH_BLOOD_RELATIVE");
                              setStatus("WITH_BLOOD_RELATIVE");
                            }}
                          >
                            {te("status.WITH_BLOOD_RELATIVE")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              field.onChange("RETURNED");
                              setStatus("RETURNED");
                            }}
                          >
                            {te("status.RETURNED")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {status === "FOUND" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="found_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.foundAddress")}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
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
                  name="found_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.foundDate")}</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
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
                      <FormLabel>{t("fields.socialWorkerId")}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("placeholders.socialWorkerId")}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="care_center_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.careCenterId")}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("placeholders.careCenterId")}
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
                      <FormLabel>{t("fields.childIdFromCenter")}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("placeholders.childIdFromCenter")}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="bale_adera_city_id_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.baleAderaId")}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("placeholders.baleAderaId")}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="adopter_city_id_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.adopterId")}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("placeholders.adopterId")}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="blood_relative_city_id_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.bloodRelativeId")}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("placeholders.bloodRelativeId")}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="previous_adopter_city_id_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.prevAdopterId")}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("placeholders.prevAdopterId")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <div className="">
              <FormField
                control={form.control}
                name="additional_information"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.additionalInfo")}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("placeholders.additionalInfo")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => onSubmit(form.getValues())} className="px-8">
            {t("buttons.submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
