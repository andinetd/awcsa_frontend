"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  NewChildformSchema,
  type NewChildformSchemaType,
} from "@/schemas/new-child-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDownIcon, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useChildDetails, useUpdateChild } from "@/hooks/adoption/useChildDetails";
import { differenceInYears, format } from "date-fns";

interface EditChildFormProps {
  childId: string;
}

export default function EditChildForm({ childId }: EditChildFormProps) {
  const t = useTranslations("care-centers-portal.addChild");
  const tGender = useTranslations("care-centers-portal.gender");
  const tView = useTranslations("care-centers-portal.childView");
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const router = useRouter();
  const numericId = Number(childId);

  const { data: child, isLoading: isFetchingChild } = useChildDetails(numericId);
  const { mutate: updateChildMutate, isPending: isUpdating } = useUpdateChild(numericId);

  const form = useForm<NewChildformSchemaType>({
    resolver: zodResolver(NewChildformSchema),
    defaultValues: {
      age: 0,
      current_status: "IN_CARE",
    },
  });

  useEffect(() => {
    if (!child) return;
    const fd = (child.serviceData?.formData || {}) as Record<string, any>;
    const dob = fd.dateOfBirth ? new Date(fd.dateOfBirth) : undefined;
    const foundDate = child.timeWhenChildFound || fd.timeWhenChildFound;
    const parsedFoundDate = foundDate ? new Date(foundDate) : undefined;

    const populatedData: Partial<NewChildformSchemaType> = {
      first_name: fd.firstName || "",
      last_name: fd.lastName || "",
      sex: (fd.sex as any) || "MALE",
      date_of_birth: dob,
      age: fd.age ?? (dob ? differenceInYears(new Date(), dob) : 0),
      current_status: (child.currentStatus || fd.currentStatus || "IN_CARE") as any,
      found_address: child.placeWhereChildFound || fd.placeWhereChildFound || "",
      found_date: parsedFoundDate,
      additional_information: child.additionalInfo || fd.additionalInfo || "",
      child_founder_city_id_number: child.socialWorkerCityIdNumber || fd.socialWorkerCityIdNumber || "",
      child_id_from_care_center: child.childIdFromFacility || fd.childIdFromFacility || "",
      care_center_id: String(child.childCareFacilityId || ""),
      name_by_family: fd.name_by_family || "",
      father_name: fd.father_name || "",
      admitance_reason: fd.admitance_reason || "",
      name_by_care_center: fd.name_by_care_center || `${fd.firstName || ""} ${fd.lastName || ""}`.trim(),
    };

    form.reset(populatedData as NewChildformSchemaType);
    if (parsedFoundDate) setDate(parsedFoundDate);
  }, [child, form]);

  async function onSubmit(values: NewChildformSchemaType) {
    const payload: Record<string, any> = {
      firstName: values.first_name,
      lastName: values.last_name,
      sex: values.sex,
      dateOfBirth: values.date_of_birth ? format(values.date_of_birth, "yyyy-MM-dd") : undefined,
      currentStatus: values.current_status,
      placeWhereChildFound: values.found_address,
      timeWhenChildFound: values.found_date ? values.found_date.toISOString() : undefined,
      socialWorkerCityIdNumber: values.child_founder_city_id_number,
      childCareFacilityId: values.care_center_id ? Number(values.care_center_id) : undefined,
      childIdFromFacility: values.child_id_from_care_center,
      additionalInfo: values.additional_information,
      formData: {
        ...values,
      },
    };

    updateChildMutate(payload, {
      onSuccess: () => {
        router.push(`/care-centers-portal/child/${childId}/view`);
      },
    });
  }

  if (isFetchingChild) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{tView("loadingChild")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl mt-10">

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information Section */}
          <Card className="flex flex-col space-y-10 py-8 px-5">
            <CardTitle className="text-lg font-semibold">
              {tView("sections.basic")}
            </CardTitle>

            {/* Name Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="name_by_family"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tView("fields.nameByFamily")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name_by_care_center"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tView("fields.nameByCenter")} *</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="father_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {tView("fields.fatherName")}{" "}
                      <span className="text-muted-foreground text-sm">
                        {tView("fields.optional")}
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Gender & Age */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.gender")} *</FormLabel>
                    <FormControl>
                      <Select
                        name="sex"
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("placeholders.selectGender")}>
                            {field.value === "MALE" && tGender("male")}
                            {field.value === "FEMALE" && tGender("female")}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">{tGender("male")}</SelectItem>
                          <SelectItem value="FEMALE">{tGender("female")}</SelectItem>
                        </SelectContent>
                      </Select>
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
                    <FormLabel>{tView("fields.estimatedAge")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const stringValue = e.target.value;
                          const numberValue =
                            stringValue === "" ? null : Number(stringValue);
                          field.onChange(numberValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Admitance Reason */}
            <FormField
              control={form.control}
              name="admitance_reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tView("fields.admittanceReason")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={tView("placeholders.admittanceReason")}
                      rows={4}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="found_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tView("fields.placeFound")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="found_subcity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tView("fields.subCity")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="found_woreda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tView("fields.woreda")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Date Found */}
            <FormField
              control={form.control}
              name="found_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tView("fields.dateFound")} *</FormLabel>
                  <FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="justify-between w-full font-normal bg-transparent"
                        >
                          {field.value
                            ? field.value.toLocaleDateString()
                            : tView("placeholders.selectDate")}
                          <ChevronDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          {...field}
                          mode="single"
                          selected={field.value}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            field.onChange(date);
                            setDate(date);
                            setOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional Info */}
            <FormField
              control={form.control}
              name="additional_information"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tView("fields.additionalInfo")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={tView("placeholders.additionalInfo")}
                      rows={4}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>

          <Card className="flex flex-col space-y-10 py-8 px-5">
            <CardTitle className="text-lg font-semibold">
              {tView("sections.founder")}
            </CardTitle>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="child_founder_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tView("fields.founderName")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="child_founder_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tView("fields.founderAddress")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="child_founder_subcity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tView("fields.founderSubCity")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="child_found_woreda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tView("fields.founderWoreda")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="child_founder_house_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tView("fields.houseNo")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const stringValue = e.target.value;
                          const numberValue =
                            stringValue === ""
                              ? undefined
                              : Number(stringValue);
                          field.onChange(numberValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="child_founder_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tView("fields.founderPhone")}</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          <Card className="flex flex-col space-y-10 py-8 px-5">
            <CardTitle className="text-lg font-semibold">
              {tView("sections.officer")}
            </CardTitle>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="officer_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tView("fields.officerName")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="officer_responsibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tView("fields.responsibility")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="officer_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tView("fields.officerAddress")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="officer_subcity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tView("fields.officerSubCity")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="officer_woreda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tView("fields.officerWoreda")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="officer_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tView("fields.officerPhone")}</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="officer_id_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tView("fields.officerId")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          <Card className="flex flex-col space-y-10 py-8 px-5">
            <CardTitle className="text-lg font-semibold">
              {tView("sections.worker")}
            </CardTitle>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="care_center_worker_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tView("fields.workerName")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="care_center_worker_responsibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tView("fields.responsibility")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="care_center_worker_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tView("fields.workerAddress")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="care_center_worker_subcity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tView("fields.workerSubCity")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="care_center_worker_woreda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tView("fields.workerWoreda")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="care_center_worker_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tView("fields.workerPhone")}</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="care_center_worker_id_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tView("fields.workerId")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          <Card className="flex flex-col space-y-10 py-8 px-5">
            <CardTitle className="text-lg font-semibold">
              {tView("sections.health")}
            </CardTitle>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="health_officer_1_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tView("fields.healthOfficer1")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="heallth_officer_2_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tView("fields.healthOfficer2")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push(`/care-centers-portal/child/${childId}/view`)
                }
                className="flex-1"
              >
                {tView("buttons.cancel")}
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={form.formState.isSubmitting || isUpdating}
              >
                {form.formState.isSubmitting || isUpdating
                  ? tView("buttons.updating")
                  : tView("buttons.update")}
              </Button>
            </div>
          </Card>
        </form>
      </Form>
    </div>
  );
}
