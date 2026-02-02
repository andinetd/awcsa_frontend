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

export default function NewChildForm() {
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

      toast.success("Child registered successfully");
      router.push("/adoption/children/");
    } catch (error) {
      console.error("Error submitting form:", error);

      // extract a useful message from AxiosError if possible
      let message = "Failed to register child. Please try again.";

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
              Child Information
            </CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter first name"
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
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter last name"
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
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between text-sm text-gray-800"
                          >
                            {field.value
                              ? field.value === "MALE"
                                ? "Male"
                                : "Female"
                              : "Select gender"}
                            <ChevronDown />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-full">
                          <DropdownMenuItem
                            onSelect={() => field.onChange("MALE")}
                          >
                            Male
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => field.onChange("FEMALE")}
                          >
                            Female
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
                    <FormLabel>Date of Birth</FormLabel>
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
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between text-sm text-gray-800"
                          >
                            {field.value
                              ? field.value === "FOUND"
                                ? "Found"
                                : field.value === "IN_CARE"
                                  ? "In Care"
                                  : field.value === "IN_ADERA"
                                    ? "In Adera"
                                    : field.value === "ADOPTED"
                                      ? "Adopted"
                                      : field.value === "WITH_BLOOD_RELATIVE"
                                        ? "With Blood Relative"
                                        : field.value === "RETURNED"
                                          ? "Returned"
                                          : field.value
                              : "Select status"}
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
                            Found
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              field.onChange("IN_ADERA");
                              setStatus("IN_ADERA");
                            }}
                          >
                            In Adera
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              field.onChange("IN_CARE");
                              setStatus("IN_CARE");
                            }}
                          >
                            In Care
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              field.onChange("ADOPTED");
                              setStatus("ADOPTED");
                            }}
                          >
                            Adopted
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              field.onChange("WITH_BLOOD_RELATIVE");
                              setStatus("WITH_BLOOD_RELATIVE");
                            }}
                          >
                            With Blood Relative
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              field.onChange("RETURNED");
                              setStatus("RETURNED");
                            }}
                          >
                            Returned
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
                      <FormLabel>Address the child was found</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter address"
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
                      <FormLabel>Date child was found</FormLabel>
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
                      <FormLabel>Social Worker City Id Number</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Social Worker City Id Number"
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
                      <FormLabel>Care Center ID</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Care Center ID"
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
                      <FormLabel>Child ID from Care Center</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Child ID from Care Center"
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
                      <FormLabel>Bale Adera City ID Number</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Bale Adera City ID Number"
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
                      <FormLabel>Adopter City ID Number</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Adopter City ID Number"
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
                      <FormLabel>Blood Relative City ID Number</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Blood Relative City ID Number"
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
                      <FormLabel>Previous Adopter City ID Number</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Previous Adopter City ID Number"
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
                    <FormLabel>Additional Information</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Additional Information"
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
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
