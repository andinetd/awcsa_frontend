"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { getDisabilityDisplayLabel } from "@/constants/disability-classification";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Eye, Edit, Loader2, History, BookOpen } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { z } from "zod";
import {
  Beneficiary as BeneficiaryV2,
  EmploymentStatus,
  MaritalStatus,
  Sex,
  WorkplaceCondition,
  TrainingField,
} from "@/api/beneficiaries/types-v2";
import {
  getWorkSectorOptions,
  getWorkSectorDisplayLabel,
} from "@/constants/work-sectors";
import { useUpdateBeneficiary } from "@/hooks/beneficiaries/srs-hooks";
import { BeneficiaryRowReportButton } from "./row-report-button";

const TRAINING_OPTIONS: TrainingField[] = [
  "AGRICULTURE",
  "BUSINESS",
  "HOTEL_HOSPITALITY",
  "HOUSE_CONSTRUCTION",
  "AUTOMOTIVE",
  "ELECTRICITY",
  "ICT",
  "MUNICIPALITY_ADMIN",
  "ROAD_CONSTRUCTION",
  "AGRO_PROCESSING",
  "FURNITURE_MAKING",
  "TEXTILE_GARMENT",
  "LEATHER_WORK",
  "METAL_WORKING",
  "OTHER",
  "BAKERY",
  "CHIPS_PRODUCTION",
  "HAIRDRESSING",
  "POULTRY_FARMING",
  "SHEEP_REARING",
  "URBAN_AGRICULTURE",
];

const editSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  grandfatherName: z.string().optional(),
  phoneNumber: z.string().optional(),
  age: z.coerce.number().int().min(0).max(150).optional(),
  sex: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  educationLevel: z.string().optional(),
  occupation: z.string().optional(),
  employmentStatus: z.enum(["EMPLOYED", "UNEMPLOYED"]).optional(),
  maritalStatus: z
    .enum(["MARRIED", "UNMARRIED", "DIVORCED", "WIDOWED"])
    .optional(),
  familyMembersCount: z.coerce.number().int().min(0).optional(),
  subCity: z.string().optional(),
  woreda: z.string().optional(),
  zone: z.string().optional(),
  block: z.string().optional(),
  houseNumber: z.string().optional(),
  address: z.string().optional(),
  preferredTraining1: z.string().optional(),
  preferredTraining2: z.string().optional(),
  preferredTraining3: z.string().optional(),
  previousProfession: z.string().optional(),
  workplaceCondition: z
    .enum(["OWN_PRIVATE", "KEBELE_PUBLIC", "RENTED"])
    .optional(),
  previousSupport: z.string().optional(),
  supportConfirmed: z.boolean().optional(),
  requiredSupportType: z.string().optional(),
});

type EditFormValues = z.infer<typeof editSchema>;

interface BeneficiaryTableProps {
  data: BeneficiaryV2[];
  isLoading: boolean;
  type: "DISABLED" | "ELDERLY";
  profileHref?: string;
}

export default function BeneficiaryTable({
  data,
  isLoading,
  type,
  profileHref = "/social-affairs/elderly-and-disabled/beneficiaries",
}: BeneficiaryTableProps) {
  const t = useTranslations("social-affairs.elderlyAndDisabled.beneficiaries");
  const tSrs = useTranslations("social-affairs.elderlyAndDisabled.srs");
  const locale = useLocale() === "en" ? "en" : "am";
  const [editing, setEditing] = useState<BeneficiaryV2 | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-pulse font-mono text-xs uppercase tracking-wider text-slate-400">
          {t("loading")}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 space-y-1 p-6 text-center">
        <p className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold">{t("noRecords")}</p>
        <p className="text-xs text-slate-400 font-mono">{t("noRecordsSubtitle")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50 border-b border-[#E3E7EB]">
            <TableRow>
              <TableHead className="font-mono text-[11px] font-bold uppercase text-slate-600">
                {t("table.fullName")}
              </TableHead>
              <TableHead className="font-mono text-[11px] font-bold uppercase text-slate-600">
                {tSrs("faydaId")}
              </TableHead>
              <TableHead className="font-mono text-[11px] font-bold uppercase text-slate-600">
                {t("table.phone")}
              </TableHead>
              <TableHead className="font-mono text-[11px] font-bold uppercase text-slate-600">
                {tSrs("subCity")} / {tSrs("woreda")}
              </TableHead>
              <TableHead className="font-mono text-[11px] font-bold uppercase text-slate-600">
                {type === "DISABLED"
                  ? t("table.disabilityType")
                  : tSrs("workplaceCondition")}
              </TableHead>
              <TableHead className="font-mono text-[11px] font-bold uppercase text-slate-600">
                {tSrs("eligibility")}
              </TableHead>
              <TableHead className="text-right font-mono text-[11px] font-bold uppercase text-slate-600">
                {t("table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => {
              const latestEligibility =
                item.EligibilityAssessment?.[0]?.decision ?? null;
              return (
                <TableRow
                  key={item.id}
                  className="border-b border-[#E3E7EB] hover:bg-slate-50/50 transition-colors"
                >
                  <TableCell className="font-medium text-xs text-[#0B1F3A]">
                    {item.firstName} {item.lastName}
                    {item.age != null && (
                      <span className="text-[11px] font-mono text-slate-400 ml-1">
                        ({item.age}
                        {item.sex ? `, ${item.sex.charAt(0)}` : ""})
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    <span className="bg-slate-50 px-1.5 py-0.5 rounded-xs border border-slate-200/80 text-slate-700">
                      {item.faydaId ?? item.cityIdNumber ?? "—"}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-600">{item.phoneNumber ?? "—"}</TableCell>
                  <TableCell className="text-xs text-slate-600">
                    {item.subCity ?? "—"}
                    {item.woreda ? ` / ${item.woreda}` : ""}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">
                    {type === "DISABLED"
                      ? getDisabilityDisplayLabel(item.DisabilityProfile?.disabilityType, locale)
                      : (item.ElderlyProfile?.workplaceCondition ?? "—")}
                  </TableCell>
                  <TableCell>
                    {latestEligibility ? (
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-mono text-[10px] uppercase font-bold rounded-xs px-2 py-0.5 border",
                          latestEligibility === "ELIGIBLE" &&
                            "bg-emerald-50 text-emerald-700 border-emerald-200",
                          latestEligibility === "NOT_ELIGIBLE" &&
                            "bg-rose-50 text-rose-700 border-rose-200",
                          latestEligibility !== "ELIGIBLE" &&
                            latestEligibility !== "NOT_ELIGIBLE" &&
                            "bg-amber-50 text-amber-700 border-amber-200",
                        )}
                      >
                        {latestEligibility}
                      </Badge>
                    ) : (
                      <span className="text-slate-400 font-mono text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        className="h-7 w-7 rounded-xs border-[#E3E7EB] hover:bg-[#E8F2FA] hover:text-[#1769AA] transition-colors"
                        title="View case history"
                      >
                        <Link href={`${profileHref}/${item.id}`}>
                          <History className="w-3.5 h-3.5 text-slate-600" />
                        </Link>
                      </Button>
                      <BeneficiaryRowReportButton beneficiary={item} />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-xs border-[#E3E7EB] hover:bg-slate-50 transition-colors"
                        onClick={() => setEditing(item)}
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5 text-slate-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {editing && (
        <EditBeneficiaryDialog
          beneficiary={editing}
          open={!!editing}
          onOpenChange={(open) => {
            if (!open) setEditing(null);
          }}
        />
      )}
    </>
  );
}

function EditBeneficiaryDialog({
  beneficiary,
  open,
  onOpenChange,
}: {
  beneficiary: BeneficiaryV2;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("social-affairs.elderlyAndDisabled.registration");
  const tSrs = useTranslations("social-affairs.elderlyAndDisabled.srs");
  const tOpt = useTranslations("social-affairs.elderlyAndDisabled.options");
  const locale = useLocale() === "en" ? "en" : "am";
  const update = useUpdateBeneficiary(beneficiary.id);
  const isDisabled = beneficiary.clientCategory === "DISABLED";
  const workSectorOptions = getWorkSectorOptions(isDisabled ? "DISABLED" : "ELDERLY");
  const profile = isDisabled
    ? beneficiary.DisabilityProfile
    : beneficiary.ElderlyProfile;

  const form = useForm<EditFormValues>({
    resolver: zodResolver(editSchema) as any,
    defaultValues: {
      firstName: beneficiary.firstName ?? "",
      lastName: beneficiary.lastName ?? "",
      grandfatherName: beneficiary.grandfatherName ?? "",
      phoneNumber: beneficiary.phoneNumber ?? "",
      age: beneficiary.age ?? undefined,
      sex: beneficiary.sex ?? undefined,
      educationLevel: beneficiary.educationLevel ?? "",
      occupation: beneficiary.occupation ?? "",
      employmentStatus: beneficiary.employmentStatus ?? undefined,
      maritalStatus: beneficiary.maritalStatus ?? undefined,
      familyMembersCount: beneficiary.familyMembersCount ?? undefined,
      subCity: beneficiary.subCity ?? "",
      woreda: beneficiary.woreda ?? "",
      zone: beneficiary.zone ?? "",
      block: beneficiary.block ?? "",
      houseNumber: beneficiary.houseNumber ?? "",
      address: beneficiary.address ?? "",
      preferredTraining1: profile?.preferredTraining1 ?? undefined,
      preferredTraining2: profile?.preferredTraining2 ?? undefined,
      preferredTraining3: profile?.preferredTraining3 ?? undefined,
      previousProfession: profile?.previousProfession ?? "",
      workplaceCondition: profile?.workplaceCondition ?? undefined,
      previousSupport: profile?.previousSupport ?? "",
      supportConfirmed: profile?.supportConfirmed ?? false,
      requiredSupportType: beneficiary.ElderlyProfile?.requiredSupportType ?? "",
    } as any,
  });

  const onSubmit = (values: EditFormValues) => {
    update.mutate(values as any, {
      onSuccess: () => {
        toast.success("Beneficiary updated");
        onOpenChange(false);
      },
      onError: (err: any) => {
        toast.error(err?.message || "Update failed");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto rounded-xs border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-base font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
            Edit {beneficiary.firstName} {beneficiary.lastName}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-mono">
            {beneficiary.faydaId ?? beneficiary.cityIdNumber} •{" "}
            {beneficiary.clientCategory}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.firstName")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>{t("fields.lastName")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="grandfatherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grandfather Name</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} placeholder="Grandfather's name" />
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
                    <FormLabel>{t("fields.phone")}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
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
                    <FormLabel>{tSrs("age")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={(field.value as any) ?? ""}
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
                    <FormLabel>{tSrs("sex")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={tOpt("placeholders.selectGender")}>
                            {field.value ? tOpt(`sex.${field.value}` as any) : undefined}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">{tOpt("sex.MALE")}</SelectItem>
                        <SelectItem value="FEMALE">{tOpt("sex.FEMALE")}</SelectItem>
                        <SelectItem value="OTHER">{tOpt("sex.OTHER")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="educationLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.education")}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
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
                    <FormLabel>{t("fields.occupation")}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="familyMembersCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.familyCount")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={(field.value as any) ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSrs("subCity")}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
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
                    <FormLabel>{tSrs("woreda")}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSrs("zone")}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="block"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSrs("block")}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
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
                    <FormLabel>{tSrs("houseNumber")}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employmentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSrs("employmentStatus")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={tOpt("placeholders.selectEmployment")}>
                            {field.value ? tOpt(`employment.${field.value}` as any) : undefined}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EMPLOYED">{tOpt("employment.EMPLOYED")}</SelectItem>
                        <SelectItem value="UNEMPLOYED">{tOpt("employment.UNEMPLOYED")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maritalStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSrs("maritalStatus")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={tOpt("placeholders.selectMarital")}>
                            {field.value ? tOpt(`marital.${field.value}` as any) : undefined}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MARRIED">{tOpt("marital.MARRIED")}</SelectItem>
                        <SelectItem value="UNMARRIED">{tOpt("marital.UNMARRIED")}</SelectItem>
                        <SelectItem value="DIVORCED">{tOpt("marital.DIVORCED")}</SelectItem>
                        <SelectItem value="WIDOWED">{tOpt("marital.WIDOWED")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border-t pt-3 space-y-3">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                {tOpt("trainingAndWorkplace")}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="preferredTraining1"
                  render={({ field }) => {
                    const options = field.value && !workSectorOptions.includes(field.value as any)
                      ? [field.value, ...workSectorOptions]
                      : workSectorOptions;
                    return (
                      <FormItem>
                        <FormLabel>{tSrs("preferredTraining1")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={tOpt("placeholders.firstChoice")}>
                                {field.value ? (tOpt(`training.${field.value}` as any) || getWorkSectorDisplayLabel(field.value, locale)) : undefined}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {options.map((o) => (
                              <SelectItem key={o} value={o}>
                                {tOpt(`training.${o}` as any) || getWorkSectorDisplayLabel(o, locale)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="preferredTraining2"
                  render={({ field }) => {
                    const options = field.value && !workSectorOptions.includes(field.value as any)
                      ? [field.value, ...workSectorOptions]
                      : workSectorOptions;
                    return (
                      <FormItem>
                        <FormLabel>{tSrs("preferredTraining2")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={tOpt("placeholders.secondChoice")}>
                                {field.value ? (tOpt(`training.${field.value}` as any) || getWorkSectorDisplayLabel(field.value, locale)) : undefined}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {options.map((o) => (
                              <SelectItem key={o} value={o}>
                                {tOpt(`training.${o}` as any) || getWorkSectorDisplayLabel(o, locale)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="preferredTraining3"
                  render={({ field }) => {
                    const options = field.value && !workSectorOptions.includes(field.value as any)
                      ? [field.value, ...workSectorOptions]
                      : workSectorOptions;
                    return (
                      <FormItem>
                        <FormLabel>{tSrs("preferredTraining3")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={tOpt("placeholders.thirdChoice")}>
                                {field.value ? (tOpt(`training.${field.value}` as any) || getWorkSectorDisplayLabel(field.value, locale)) : undefined}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {options.map((o) => (
                              <SelectItem key={o} value={o}>
                                {tOpt(`training.${o}` as any) || getWorkSectorDisplayLabel(o, locale)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="workplaceCondition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tSrs("workplaceCondition")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={tOpt("placeholders.selectWorkplace")}>
                              {field.value ? tOpt(`workplace.${field.value}` as any) : undefined}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="OWN_PRIVATE">
                            {tOpt("workplace.OWN_PRIVATE")}
                          </SelectItem>
                          <SelectItem value="KEBELE_PUBLIC">
                            {tOpt("workplace.KEBELE_PUBLIC")}
                          </SelectItem>
                          <SelectItem value="RENTED">
                            {tOpt("workplace.RENTED")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isDisabled && (
                  <FormField
                    control={form.control}
                    name="previousProfession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{tSrs("previousProfession")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={tSrs("disabledProfessionPlaceholder")}
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {!isDisabled && (
                <div className="rounded-lg border border-sky-200 bg-sky-50/60 p-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-sky-950 font-medium text-xs">
                    <BookOpen className="h-3.5 w-3.5 text-sky-700" />
                    <span>{tSrs("elderlyProfessionMentorship")}</span>
                  </div>
                  <FormField
                    control={form.control}
                    name="previousProfession"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            rows={2}
                            className="bg-white text-xs border-sky-200 placeholder:text-slate-400"
                            placeholder={tSrs("elderlyProfessionPlaceholder")}
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <FormField
                control={form.control}
                name="previousSupport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSrs("previousSupport")}</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={2}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="supportConfirmed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">
                      {tSrs("supportConfirmed")}
                    </FormLabel>
                  </FormItem>
                )}
              />
              {beneficiary.clientCategory === "ELDERLY" && (
                <FormField
                  control={form.control}
                  name="requiredSupportType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tSrs("requiredSupportType")}</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter className="pt-3 border-t border-[#E3E7EB]">
              <Button
                type="button"
                variant="outline"
                className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-slate-50"
                onClick={() => onOpenChange(false)}
              >
                {t("buttons.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={update.isPending}
                className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs"
              >
                {update.isPending && (
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                )}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
