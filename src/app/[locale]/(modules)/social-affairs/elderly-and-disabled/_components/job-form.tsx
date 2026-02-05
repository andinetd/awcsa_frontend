"use client";

import React from "react";
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
  jobPlacementSchema,
  JobPlacementSchemaType,
} from "@/schemas/beneficiaries";
import {
  useRegisterJobMutation,
  useGetBeneficiariesQuery,
} from "@/hooks/beneficiaries";

interface JobFormProps {
  cityIdNumber?: string;
  trigger?: React.ReactNode;
}

export default function JobForm({ cityIdNumber, trigger }: JobFormProps) {
  const t = useTranslations("social-affairs.elderlyAndDisabled.jobs.form");
  const [open, setOpen] = React.useState(false);
  const registerMutation = useRegisterJobMutation();
  const { data: disabled } = useGetBeneficiariesQuery("DISABLED");
  const { data: elderly } = useGetBeneficiariesQuery("ELDERLY");

  const beneficiaries = [...(disabled || []), ...(elderly || [])];

  const form = useForm<JobPlacementSchemaType>({
    resolver: zodResolver(jobPlacementSchema) as any,
    defaultValues: {
      cityIdNumber: cityIdNumber || "",
      companyIdNumber: "",
      jobTitle: "",
      startDate: "",
      remark: "",
    },
  });

  const onSubmit = (values: JobPlacementSchemaType) => {
    registerMutation.mutate(values, {
      onSuccess: () => {
        toast.success(t("messages.success"));
        form.reset();
        setOpen(false);
      },
      onError: (error: any) => {
        toast.error(error?.message || t("messages.error"));
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            {t("addButton")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-lexend flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" />
            {t("title")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-4"
          >
            {!cityIdNumber && (
              <FormField
                control={form.control}
                name="cityIdNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.beneficiary")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("placeholders.selectBeneficiary")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {beneficiaries.map((b) => (
                          <SelectItem key={b.id} value={b.cityIdNumber}>
                            {b.firstName} {b.lastName} ({b.cityIdNumber})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="companyIdNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.companyId")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("placeholders.companyId")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.jobTitle")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("placeholders.jobTitle")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.startDate")}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
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
                  <FormControl>
                    <Input placeholder={t("placeholders.remark")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                {t("buttons.cancel")}
              </Button>
              <Button type="submit" disabled={registerMutation.isPending}>
                {registerMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {t("buttons.save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
