"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
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
import { Eye, Edit, Loader2, History } from "lucide-react";
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
import { useUpdateBeneficiary } from "@/hooks/beneficiaries/srs-hooks";

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
];

const editSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phoneNumber: z.string().optional(),
  age: z.coerce.number().int().min(0).max(150).optional(),
  sex: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  educationLevel: z.string().optional(),
  occupation: z.string().optional(),
  employmentStatus: z.enum(["EMPLOYED", "UNEMPLOYED"]).optional(),
  maritalStatus: z.enum(["MARRIED", "UNMARRIED"]).optional(),
  familyMembersCount: z.coerce.number().int().min(0).optional(),
  subCity: z.string().optional(),
  woreda: z.string().optional(),
  zone: z.string().optional(),
  block: z.string().optional(),
  houseNumber: z.string().optional(),
  address: z.string().optional(),
  preferredTraining1: z
    .enum(TRAINING_OPTIONS as [TrainingField, ...TrainingField[]])
    .optional(),
  preferredTraining2: z
    .enum(TRAINING_OPTIONS as [TrainingField, ...TrainingField[]])
    .optional(),
  preferredTraining3: z
    .enum(TRAINING_OPTIONS as [TrainingField, ...TrainingField[]])
    .optional(),
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
  const [editing, setEditing] = useState<BeneficiaryV2 | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-xl bg-slate-50/50">
        <div className="animate-pulse text-slate-400 font-medium">
          {t("loading")}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border rounded-xl bg-slate-50/50 space-y-2">
        <p className="text-slate-500 font-medium">{t("noRecords")}</p>
        <p className="text-sm text-slate-400">{t("noRecordsSubtitle")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold">
                {t("table.fullName")}
              </TableHead>
              <TableHead className="font-semibold">
                {tSrs("faydaId")}
              </TableHead>
              <TableHead className="font-semibold">
                {t("table.phone")}
              </TableHead>
              <TableHead className="font-semibold">
                {tSrs("subCity")} / {tSrs("woreda")}
              </TableHead>
              <TableHead className="font-semibold">
                {type === "DISABLED"
                  ? t("table.disabilityType")
                  : tSrs("workplaceCondition")}
              </TableHead>
              <TableHead className="font-semibold">
                {tSrs("eligibility")}
              </TableHead>
              <TableHead className="text-right font-semibold">
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
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <TableCell className="font-medium">
                    {item.firstName} {item.lastName}
                    {item.age != null && (
                      <span className="text-xs text-slate-400 ml-1">
                        ({item.age}
                        {item.sex ? `, ${item.sex.charAt(0)}` : ""})
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {item.faydaId ?? item.cityIdNumber ?? "—"}
                  </TableCell>
                  <TableCell>{item.phoneNumber ?? "—"}</TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {item.subCity ?? "—"}
                    {item.woreda ? ` / ${item.woreda}` : ""}
                  </TableCell>
                  <TableCell>
                    {type === "DISABLED"
                      ? (item.DisabilityProfile?.disabilityType ?? "—")
                      : (item.ElderlyProfile?.workplaceCondition ?? "—")}
                  </TableCell>
                  <TableCell>
                    {latestEligibility ? (
                      <Badge
                        variant={
                          latestEligibility === "ELIGIBLE"
                            ? "default"
                            : latestEligibility === "NOT_ELIGIBLE"
                              ? "destructive"
                              : "secondary"
                        }
                        className={cn(
                          "rounded-full",
                          latestEligibility === "ELIGIBLE" &&
                            "bg-green-50 text-green-700 border-green-200",
                        )}
                      >
                        {latestEligibility}
                      </Badge>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        title="View case history"
                      >
                        <Link href={`${profileHref}/${item.id}`}>
                          <History className="w-4 h-4 text-slate-600" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditing(item)}
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-slate-600" />
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
  const update = useUpdateBeneficiary(beneficiary.id);
  const isDisabled = beneficiary.clientCategory === "DISABLED";
  const profile = isDisabled
    ? beneficiary.DisabilityProfile
    : beneficiary.ElderlyProfile;

  const form = useForm<EditFormValues>({
    resolver: zodResolver(editSchema) as any,
    defaultValues: {
      firstName: beneficiary.firstName ?? "",
      lastName: beneficiary.lastName ?? "",
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Edit {beneficiary.firstName} {beneficiary.lastName}
          </DialogTitle>
          <DialogDescription>
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
                          <SelectValue placeholder="—" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
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
                          <SelectValue placeholder="—" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EMPLOYED">Employed</SelectItem>
                        <SelectItem value="UNEMPLOYED">Unemployed</SelectItem>
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
                          <SelectValue placeholder="—" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MARRIED">Married</SelectItem>
                        <SelectItem value="UNMARRIED">Unmarried</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border-t pt-3 space-y-3">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                Training & Workplace
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="preferredTraining1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tSrs("preferredTraining1")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="—" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TRAINING_OPTIONS.map((o) => (
                            <SelectItem key={o} value={o}>
                              {o}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preferredTraining2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tSrs("preferredTraining2")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="—" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TRAINING_OPTIONS.map((o) => (
                            <SelectItem key={o} value={o}>
                              {o}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preferredTraining3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tSrs("preferredTraining3")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="—" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TRAINING_OPTIONS.map((o) => (
                            <SelectItem key={o} value={o}>
                              {o}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
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
                            <SelectValue placeholder="—" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="OWN_PRIVATE">
                            Own / Private
                          </SelectItem>
                          <SelectItem value="KEBELE_PUBLIC">
                            Kebele / Public
                          </SelectItem>
                          <SelectItem value="RENTED">Rented</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="previousProfession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tSrs("previousProfession")}</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t("buttons.cancel")}
              </Button>
              <Button type="submit" disabled={update.isPending}>
                {update.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
