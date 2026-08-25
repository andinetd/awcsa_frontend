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
import { Plus, Loader2, Briefcase } from "lucide-react";
import { toast } from "sonner";
import {
  womenEmploymentSchema,
  WomenEmploymentSchemaType,
} from "@/schemas/women-employment";
import {
  useRegisterWomenEmploymentMutation,
  useUpdateEmploymentMutation,
} from "@/hooks/womens";
import { WomenEmploymentRecord } from "@/api/womens/employment";

const sectors = [
  "AGRICULTURE", "TEXTILE", "TRADE", "SERVICES", "MANUFACTURING",
  "CONSTRUCTION", "TRANSPORT", "EDUCATION", "HEALTHCARE", "OTHER",
];

interface WomenEmploymentFormProps {
  record?: WomenEmploymentRecord | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function WomenEmploymentForm({ record, open: controlledOpen, onOpenChange }: WomenEmploymentFormProps) {
  const t = useTranslations("women.employment.form");
  const [internalOpen, setInternalOpen] = useState(false);
  const isEditing = !!record;
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const registerMutation = useRegisterWomenEmploymentMutation();
  const updateMutation = useUpdateEmploymentMutation();

  const form = useForm<WomenEmploymentSchemaType>({
    resolver: zodResolver(womenEmploymentSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      employmentType: "INDIVIDUAL",
      sector: "",
      year: "",
      remark: "",
    },
  });

  useEffect(() => {
    if (record && open) {
      form.reset({
        firstName:
          record.womenProfile?.client?.firstName || record.firstName || "",
        lastName:
          record.womenProfile?.client?.lastName || record.lastName || "",
        employmentType: record.employmentType,
        sector: record.sector,
        year: record.year,
        remark: record.remark || "",
      });
    } else if (!open) {
      form.reset({
        firstName: "",
        lastName: "",
        employmentType: "INDIVIDUAL",
        sector: "",
        year: "",
        remark: "",
      });
    }
  }, [record, open, form]);

  const onSubmit = (values: WomenEmploymentSchemaType) => {
    if (isEditing && record) {
      const { firstName: _f, lastName: _l, ...rest } = values;
      updateMutation.mutate(
        { id: record.id, data: rest as any },
        {
          onSuccess: () => { toast.success(t("messages.success")); setOpen(false); },
          onError: (error: any) => toast.error(error?.message || t("messages.error")),
        },
      );
    } else {
      registerMutation.mutate(values as any, {
        onSuccess: () => { toast.success(t("messages.success")); form.reset(); setOpen(false); },
        onError: (error: any) => toast.error(error?.message || t("messages.error")),
      });
    }
  };

  const isPending = registerMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isEditing && (
        <DialogTrigger asChild>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            {t("addButton")}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-lexend flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" />
            {isEditing ? "Edit Employment" : t("title")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.firstName")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("placeholders.firstName")} {...field} disabled={isEditing} />
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
                      <Input placeholder={t("placeholders.lastName")} {...field} disabled={isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="employmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.employmentType")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="INDIVIDUAL">{t("employmentTypes.INDIVIDUAL")}</SelectItem>
                      <SelectItem value="GROUP">{t("employmentTypes.GROUP")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sector"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.sector")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder={t("placeholders.selectSector")} /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sectors.map((s) => (
                        <SelectItem key={s} value={s}>{t(`sectors.${s}`)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.year")}</FormLabel>
                  <FormControl><Input type="number" min="2000" max="2100" placeholder="2024" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.remark")}</FormLabel>
                  <FormControl><Input placeholder={t("placeholders.remark")} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {t("buttons.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {t("buttons.save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}