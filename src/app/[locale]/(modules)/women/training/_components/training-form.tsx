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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Loader2, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import {
  womenTrainingSchema,
  WomenTrainingSchemaType,
} from "@/schemas/women-training";
import {
  useRegisterWomenTrainingMutation,
  useUpdateTrainingMutation,
} from "@/hooks/womens";
import { WomenTrainingRecord } from "@/api/womens/training";

const trainingTopics = [
  "ENTREPRENEURSHIP", "TAILORING", "AGRICULTURE", "BAKERY",
  "BEAUTY_SALON", "INFORMATION_TECHNOLOGY", "LITERACY",
  "HEALTH_AWARENESS", "LEGAL_RIGHTS", "LEADERSHIP", "OTHER",
];

interface WomenTrainingFormProps {
  record?: WomenTrainingRecord | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function WomenTrainingForm({ record, open: controlledOpen, onOpenChange }: WomenTrainingFormProps) {
  const t = useTranslations("women.training.form");
  const [internalOpen, setInternalOpen] = useState(false);
  const isEditing = !!record;
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const registerMutation = useRegisterWomenTrainingMutation();
  const updateMutation = useUpdateTrainingMutation();

  const form = useForm<WomenTrainingSchemaType>({
    resolver: zodResolver(womenTrainingSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      trainingTopic: "",
      startDate: "",
      completionDate: "",
      attended: false,
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
        trainingTopic: record.trainingTopic,
        startDate: record.startDate ? record.startDate.split("T")[0] : "",
        completionDate: record.completionDate ? record.completionDate.split("T")[0] : "",
        attended: record.attended,
        remark: record.remark || "",
      });
    } else if (!open) {
      form.reset({
        firstName: "",
        lastName: "",
        trainingTopic: "",
        startDate: "",
        completionDate: "",
        attended: false,
        remark: "",
      });
    }
  }, [record, open, form]);

  const onSubmit = (values: WomenTrainingSchemaType) => {
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
            <GraduationCap className="w-6 h-6 text-primary" />
            {isEditing ? "Edit Training" : t("title")}
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
              name="trainingTopic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.trainingTopic")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder={t("placeholders.selectTrainingTopic")} /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {trainingTopics.map((topic) => (
                        <SelectItem key={topic} value={topic}>{t(`trainingTopics.${topic}`)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.startDate")}</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="completionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.completionDate")}</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="attended"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none"><FormLabel>{t("fields.attended")}</FormLabel></div>
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