"use client";

import { useTranslations } from "next-intl";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import {
  useCreateEdirMutation,
  useUpdateEdirMutation,
} from "@/hooks/social-affairs";
import { newEdirSchema, NewEdirSchemaType } from "@/schemas/edir";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Edir } from "@/api/social-affairs/edir";

interface NewEdirFormProps {
  initialData?: Edir;
  edirId?: number;
  trigger?: React.ReactNode;
}

export default function NewEdirForm({
  initialData,
  edirId,
  trigger,
}: NewEdirFormProps) {
  const t = useTranslations("social-affairs.edir.form");
  const [open, setOpen] = useState(false);
  const createMutation = useCreateEdirMutation();
  const updateMutation = useUpdateEdirMutation();

  const isPending = createMutation.isPending || updateMutation.isPending;
  const isEditMode = !!edirId;

  // Helper to map array reasons to object
  const mapReasonsToObject = (reasons: string[] = []) => {
    return {
      religionBased: reasons.includes("RELIGION"),
      workplaceBased: reasons.includes("WORKPLACE"),
      birthplaceBased: reasons.includes("BIRTHPLACE"),
      professionBased: reasons.includes("PROFESSION"),
      residenceBased: reasons.includes("RESIDENCE"),
      genderBased: reasons.includes("GENDER"),
      ethnicityBased: reasons.includes("ETHNICITY"),
      other: "",
    };
  };

  const form = useForm<NewEdirSchemaType>({
    resolver: zodResolver(newEdirSchema) as any,
    defaultValues: {
      name: "",
      establishmentDate: new Date().toISOString().split("T")[0],
      formationMethod: "WILL_OF_PEOPLE",
      subCity: "",
      woreda: "",
      kebele: "",
      houseNumber: "",
      specificLocation: "",
      members: {
        management: { male: 0, female: 0, total: 0 },
        general: { male: 0, female: 0, total: 0 },
      },
      establishmentReasons: {
        religionBased: false,
        workplaceBased: false,
        birthplaceBased: false,
        professionBased: false,
        residenceBased: false,
        genderBased: false,
        ethnicityBased: false,
        other: "",
      },
      bankAccountNumber: "",
      monthlyPaymentDetails: "",
      remark: "",
    },
  });

  // Populate form with initial data when available
  useEffect(() => {
    if (initialData) {
      const dateStr = initialData.establishmentDate
        ? new Date(initialData.establishmentDate).toISOString().split("T")[0]
        : "";

      form.reset({
        name: initialData.name,
        establishmentDate: dateStr,
        formationMethod: initialData.formationMethod as any,
        subCity: initialData.subCity,
        woreda: initialData.woreda,
        kebele: initialData.kebele,
        houseNumber: initialData.houseNumber,
        specificLocation: initialData.specificLocation,
        members: {
          management: {
            male: initialData.managementMale || 0,
            female: initialData.managementFemale || 0,
            total:
              (initialData.managementMale || 0) +
              (initialData.managementFemale || 0),
          },
          general: {
            male: initialData.generalMale || 0,
            female: initialData.generalFemale || 0,
            total:
              (initialData.generalMale || 0) + (initialData.generalFemale || 0),
          },
        },
        establishmentReasons: {
          ...mapReasonsToObject(initialData.establishmentReasons),
          other: initialData.otherReasonDescription || "",
        },
        bankAccountNumber: initialData.bankAccountNumber,
        monthlyPaymentDetails: initialData.monthlyPaymentDetails,
        remark: initialData.remark || "",
      });
    }
  }, [initialData, form]);

  function onSubmit(values: NewEdirSchemaType) {
    const apiPayload = {
      ...values,
      managementMale: values.members.management.male,
      managementFemale: values.members.management.female,
      generalMale: values.members.general.male,
      generalFemale: values.members.general.female,
      establishmentReasons: values.establishmentReasons,
      otherReasonDescription: values.establishmentReasons.other,
    };

    if (isEditMode && edirId) {
      updateMutation.mutate(
        { id: edirId, data: apiPayload as any },
        {
          onSuccess: () => {
            setOpen(false);
            toast.success("Edir updated successfully");
          },
        },
      );
    } else {
      createMutation.mutate(apiPayload as any, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
          toast.success("Edir created successfully");
        },
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            {t("buttons.register")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? t("updateTitle") : t("createTitle")}
          </DialogTitle>
          <DialogDescription>
            {isEditMode ? t("updateDesc") : t("createDesc")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t("sections.basic")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.name")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("fields.name")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="establishmentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.date")}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="formationMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.method")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="GOVERNMENT_ISSUED">
                            {t("methods.government")}
                          </SelectItem>
                          <SelectItem value="WILL_OF_PEOPLE">
                            {t("methods.will")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t("sections.address")}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="subCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.subCity")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("fields.subCity")} {...field} />
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
                      <FormLabel>{t("fields.woreda")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("fields.woreda")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="kebele"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.kebele")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("fields.kebele")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="houseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.houseNumber")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("fields.houseNumber")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specificLocation"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{t("fields.location")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("fields.location")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Members Stats */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                {t("sections.membership")}
              </h3>
              <div className="space-y-2">
                <FormLabel>{t("fields.managementMembers")}</FormLabel>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="members.management.male"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          {t("fields.male")}
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="members.management.female"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          {t("fields.female")}
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="members.management.total"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          {t("fields.total")}
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <FormLabel>{t("fields.generalMembers")}</FormLabel>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="members.general.male"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          {t("fields.male")}
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="members.general.female"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          {t("fields.female")}
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="members.general.total"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          {t("fields.total")}
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Financials & Remarks */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                {t("sections.financials")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bankAccountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.bankAccount")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("fields.bankAccount")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="monthlyPaymentDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.contribution")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("fields.contribution")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="remark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.remarks")}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t("fields.remarks")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Establishment Reasons - Checkboxes */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t("sections.reasons")}</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="establishmentReasons.residenceBased"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t("reasons.residence")}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="establishmentReasons.religionBased"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t("reasons.religion")}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="establishmentReasons.workplaceBased"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t("reasons.workplace")}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="establishmentReasons.genderBased"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t("reasons.gender")}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="establishmentReasons.ethnicityBased"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t("reasons.ethnicity")}</FormLabel>
                      </div>
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
                {t("buttons.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? isEditMode
                    ? t("buttons.updating")
                    : t("buttons.registering")
                  : isEditMode
                    ? t("buttons.update")
                    : t("buttons.register")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
