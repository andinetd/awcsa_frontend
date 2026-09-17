"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  supportServiceSchema,
  SupportServiceSchemaType,
} from "@/schemas/support-service";
import { useRegisterSupportMutation } from "@/hooks/support";
import ServiceTypeSelect from "./service-type-select";
import WomanSelect from "./woman-select";
import { useTranslations } from "next-intl";

interface RegisterSupportFormProps {
  defaultClientId?: number;
  defaultAssociationId?: number;
}

export default function RegisterSupportForm({
  defaultClientId,
  defaultAssociationId,
}: RegisterSupportFormProps) {
  const [open, setOpen] = useState(false);
  const registerMutation = useRegisterSupportMutation();
  const t = useTranslations("women");

  const form = useForm<SupportServiceSchemaType>({
    resolver: zodResolver(supportServiceSchema) as any,
    defaultValues: {
      serviceTypeId: 9007199254740991,
      clientId: defaultClientId,
      womenAssociationId: defaultAssociationId,
      provider: "",
      amountOrQuantity: "",
      dateProvided: new Date().toISOString().split("T")[0],
      facilitatorCityId: "",
      subCity: "",
      woreda: "",
      remark: "",
    },
  });

  function onSubmit(values: SupportServiceSchemaType) {
    registerMutation.mutate(values as any, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
        toast.success(t("support.register.messages.success"));
      },
      onError: (error: any) => {
        toast.error(error?.message || t("support.register.messages.error"));
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-8 text-xs font-semibold rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          {t("support.register.title")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-xs border border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider font-mono">{t("support.register.title")}</DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {t("support.register.description")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-3">
            {/* Client or Association Selection */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-1.5">
                {t("support.register.beneficiaryInfo")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">{t("support.register.womanClient")}</FormLabel>
                      <FormControl>
                        <WomanSelect
                          value={field.value?.toString()}
                          onValueChange={(value: string) =>
                            field.onChange(value ? parseInt(value) : undefined)
                          }
                          placeholder="Search beneficiary by name or ID..."
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="womenAssociationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        {t("support.register.associationId")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                          type="number"
                          placeholder={t(
                            "support.register.placeholder.associationId",
                          )}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              <p className="text-xs text-slate-500">
                {t("support.register.beneficiaryNote")}
              </p>
            </div>

            {/* Service & Provider Information */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-1.5">
                {t("support.register.serviceInfo")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="serviceTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">{t("support.register.serviceType")}</FormLabel>
                      <FormControl>
                        <ServiceTypeSelect
                          value={field.value?.toString()}
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateProvided"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        {t("support.register.dateProvided")}
                      </FormLabel>
                      <FormControl>
                        <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white" type="date" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        {t("support.register.providerName")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                          placeholder={t(
                            "support.register.placeholder.provider",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amountOrQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        {t("support.register.amountOrQuantity")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                          placeholder={t("support.register.placeholder.amount")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Location & Facilitator Information */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-1.5">
                {t("support.register.locationInfo")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="facilitatorCityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        {t("support.register.facilitatorCityId")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                          placeholder={t("support.register.placeholder.cityId")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">{t("support.register.subCity")}</FormLabel>
                      <FormControl>
                        <Input
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                          placeholder={t(
                            "support.register.placeholder.subCity",
                          )}
                          {...field}
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
                      <FormLabel className="text-xs font-semibold text-slate-700">{t("support.register.woreda")}</FormLabel>
                      <FormControl>
                        <Input
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                          placeholder={t("support.register.placeholder.woreda")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-3">
              <FormField
                control={form.control}
                name="remark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("support.register.remarks")}</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[60px] h-auto text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white resize-none"
                        placeholder={t("support.register.placeholder.remarks")}
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[#E3E7EB]">
              <Button
                type="button"
                variant="outline"
                className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-[#F7F8FA]"
                onClick={() => setOpen(false)}
              >
                {t("form.buttons.cancel")}
              </Button>
              <Button type="submit" disabled={registerMutation.isPending} className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold shadow-2xs">
                {registerMutation.isPending
                  ? t("form.buttons.registering")
                  : t("form.buttons.register")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}