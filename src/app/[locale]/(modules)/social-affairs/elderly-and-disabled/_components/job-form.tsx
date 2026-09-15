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
          <Button className="h-8 px-3 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs font-semibold gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            {t("addButton")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-xs border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-sm font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#1769AA]" />
            {t("title")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-2"
          >
            {!cityIdNumber && (
              <FormField
                control={form.control}
                name="cityIdNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">
                      {t("fields.beneficiary")}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] focus:ring-1 focus:ring-[#1769AA]">
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
                  <FormLabel className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">
                    {t("fields.companyId")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("placeholders.companyId")}
                      className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] focus-visible:ring-1 focus-visible:ring-[#1769AA]"
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
                  <FormLabel className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">
                    {t("fields.jobTitle")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("placeholders.jobTitle")}
                      className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] focus-visible:ring-1 focus-visible:ring-[#1769AA]"
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
                  <FormLabel className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">
                    {t("fields.startDate")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                      {...field}
                    />
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
                  <FormLabel className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">
                    {t("fields.remark")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("placeholders.remark")}
                      className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4 border-t border-[#E3E7EB]">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="h-8 px-3 text-xs font-mono uppercase tracking-wider rounded-xs border-[#E3E7EB] hover:bg-slate-50"
              >
                {t("buttons.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="h-8 px-4 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs font-semibold"
              >
                {registerMutation.isPending && (
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
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
