"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import {
  womenAssociationSchema,
  WomenAssociationSchemaType,
  WOMEN_LEADER_POSITIONS,
} from "@/schemas/women-association";
import {
  useRegisterWomenAssociationMutation,
  useUpdateWomenAssociationMutation,
} from "@/hooks/womens";
import { SubCitySelect, WoredaSelect } from "@/components/shared/location-selects";
import {
  WomenAssociationRecord,
  WomenAssociationType,
} from "@/api/womens/associations";

const ASSOCIATION_TYPES: WomenAssociationType[] = [
  "ASSOCIATION",
  "DEVELOPMENT_ASSOCIATION",
  "FEDERATION",
];

const emptyLeaders = () =>
  WOMEN_LEADER_POSITIONS.map((position) => ({
    position,
    fullName: "",
    phoneNumber: "",
  }));

interface WomenAssociationFormProps {
  record?: WomenAssociationRecord | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function WomenAssociationForm({
  record,
  open: controlledOpen,
  onOpenChange,
}: WomenAssociationFormProps) {
  const t = useTranslations("women.associations");
  const [internalOpen, setInternalOpen] = useState(false);
  const isEditing = !!record;
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const registerMutation = useRegisterWomenAssociationMutation();
  const updateMutation = useUpdateWomenAssociationMutation();

  const form = useForm<WomenAssociationSchemaType>({
    resolver: zodResolver(womenAssociationSchema) as any,
    defaultValues: {
      name: "",
      type: "ASSOCIATION",
      establishmentDate: "",
      objective: "",
      subCity: "",
      woreda: "",
      houseNumber: "",
      block: "",
      totalMembers: undefined as any,
      leaders: emptyLeaders(),
    },
  });

  const subCity = form.watch("subCity");

  useEffect(() => {
    if (record && open) {
      const stored = record.leaders || [];
      form.reset({
        name: record.name,
        type: record.type,
        establishmentDate: record.establishmentDate
          ? record.establishmentDate.split("T")[0]
          : "",
        objective: record.objective || "",
        subCity: record.subCity,
        woreda: record.woreda,
        houseNumber: record.houseNumber || "",
        block: record.block || "",
        totalMembers: (record.totalMembers ?? undefined) as any,
        leaders: emptyLeaders().map((slot) => {
          const found = stored.find((l) => l.position === slot.position);
          return found
            ? { position: slot.position, fullName: found.fullName, phoneNumber: found.phoneNumber }
            : slot;
        }),
      });
    } else if (!open) {
      form.reset({
        name: "",
        type: "ASSOCIATION",
        establishmentDate: "",
        objective: "",
        subCity: "",
        woreda: "",
        houseNumber: "",
        block: "",
        totalMembers: undefined as any,
        leaders: emptyLeaders(),
      });
    }
  }, [record, open, form]);

  const buildPayload = (values: WomenAssociationSchemaType) => {
    const filledLeaders = values.leaders
      .filter((l) => l.fullName.trim() && l.phoneNumber.trim())
      .map((l) => ({
        position: l.position,
        fullName: l.fullName.trim(),
        phoneNumber: l.phoneNumber.trim(),
      }));
    const chair = filledLeaders.find((l) => l.position === "CHAIRPERSON");

    const { leaders: _leaders, ...rest } = values;

    return {
      ...rest,
      leaderName: chair?.fullName ?? "",
      leaderPhoneNumber: chair?.phoneNumber ?? "",
      ...(filledLeaders.length ? { leaders: filledLeaders } : {}),
    };
  };

  const onSubmit = (values: WomenAssociationSchemaType) => {
    const payload = buildPayload(values);

    if (isEditing && record) {
      updateMutation.mutate(
        { id: record.id, data: payload },
        {
          onSuccess: () => {
            toast.success(t("form.messages.success"));
            setOpen(false);
          },
          onError: (error: any) =>
            toast.error(error?.message || t("form.messages.error")),
        }
      );
    } else {
      registerMutation.mutate(payload as any, {
        onSuccess: () => {
          toast.success(t("form.messages.success"));
          form.reset();
          setOpen(false);
        },
        onError: (error: any) =>
          toast.error(error?.message || t("form.messages.error")),
      });
    }
  };

  const isPending = registerMutation.isPending || updateMutation.isPending;
  const leadersErrors = form.formState.errors.leaders as any;

  // Master data is editable only while the record is a draft.
  const isLocked = isEditing && record.approvalStatus !== "DRAFT";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isEditing && (
        <DialogTrigger asChild>
          <Button className="h-8 text-xs font-semibold rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            {t("form.addButton")}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[680px] max-h-[90vh] overflow-y-auto rounded-xs border border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider font-mono flex items-center gap-2">
            <Users className="w-4 h-4 text-[#1769AA]" />
            {isEditing ? t("form.editTitle") : t("form.title")}
          </DialogTitle>
        </DialogHeader>
        <fieldset disabled={isLocked} className="min-w-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-3"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("form.fields.name")}</FormLabel>
                    <FormControl>
                      <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white" placeholder={t("form.placeholders.name")} {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("form.fields.type")}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white">
                          <SelectValue placeholder={t("form.placeholders.type")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xs border-[#E3E7EB] shadow-md text-xs">
                        {ASSOCIATION_TYPES.map((type) => (
                          <SelectItem key={type} value={type} className="text-xs">
                            {t(`form.types.${type}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("form.fields.subCity")}</FormLabel>
                    <FormControl>
                      <SubCitySelect
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder={t("form.placeholders.subCity")}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="woreda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("form.fields.woreda")}</FormLabel>
                    <FormControl>
                      <WoredaSelect
                        subCity={subCity}
                        value={field.value}
                        onValueChange={(v) => {
                          field.onChange(v);
                        }}
                        placeholder={t("form.placeholders.woreda")}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="block"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("form.fields.block")}</FormLabel>
                    <FormControl>
                      <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white" placeholder={t("form.placeholders.block")} {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="houseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("form.fields.houseNumber")}</FormLabel>
                    <FormControl>
                      <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white" placeholder={t("form.placeholders.houseNumber")} {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalMembers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("form.fields.totalMembers")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                        placeholder={t("form.placeholders.totalMembers")}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="establishmentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-700">{t("form.fields.establishmentDate")}</FormLabel>
                  <FormControl>
                    <Input type="date" className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="objective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-700">{t("form.fields.objective")}</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      className="text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white resize-none"
                      placeholder={t("form.placeholders.objective")}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="space-y-3 rounded-xs border border-[#E3E7EB] bg-[#F7F8FA] p-4">
              <div>
                <FormLabel className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">{t("form.committeeSection")}</FormLabel>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t("form.committeeHint")}
                </p>
              </div>

              {WOMEN_LEADER_POSITIONS.map((position, index) => {
                const rowRequired = index < 3;
                return (
                  <div key={position} className="rounded-xs border border-[#E3E7EB] bg-white p-3 space-y-2">
                    <p className="text-xs font-semibold text-[#0B1F3A]">
                      {index + 1}. {t(`form.leaderPositions.${position}`)}
                      {!rowRequired && (
                        <span className="text-[11px] font-normal text-slate-500"> ({t("form.optional")})</span>
                      )}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name={`leaders.${index}.fullName` as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[11px] font-semibold text-slate-600">{t("form.fields.leaderFullName")}</FormLabel>
                            <FormControl>
                              <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white" placeholder={t("form.placeholders.leaderFullName")} {...field} />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`leaders.${index}.phoneNumber` as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[11px] font-semibold text-slate-600">{t("form.fields.leaderPhone")}</FormLabel>
                            <FormControl>
                              <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white" placeholder={t("form.placeholders.leaderPhone")} {...field} />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                );
              })}
              {leadersErrors?.message && !Array.isArray(leadersErrors) && (
                <p className="text-xs font-medium text-destructive">
                  {leadersErrors.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[#E3E7EB]">
              <Button type="button" variant="outline" className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-[#F7F8FA]" onClick={() => setOpen(false)}>
                {t("form.buttons.cancel")}
              </Button>
              {isLocked ? (
                <span className="text-xs text-slate-500 self-center">
                  {t("form.lockedNotice")}
                </span>
              ) : (
                <Button type="submit" disabled={isPending} className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold shadow-2xs">
                  {isPending && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                  {t("form.buttons.save")}
                </Button>
              )}
            </div>
          </form>
        </Form>
        </fieldset>
      </DialogContent>
    </Dialog>
  );
}
