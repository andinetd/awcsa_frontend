"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState, useMemo, useEffect } from "react";
import {
  registerSupportService,
  SERVICE_TYPES,
} from "@/api/beneficiaries/services";
import { useGetBeneficiariesQuery } from "@/hooks/beneficiaries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  SubCitySelect,
  WoredaSelect,
} from "@/components/shared/location-selects";
import { useJurisdictionScope } from "@/hooks/use-jurisdiction-scope";

export default function ServiceForm() {
  const t = useTranslations("social-affairs.elderlyAndDisabled.services.form");
  const tServices = useTranslations(
    "social-affairs.elderlyAndDisabled.services",
  );
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { userSubCity, userWoreda } = useJurisdictionScope();

  // Fetch beneficiaries for selection
  const { data: disabledBeneficiaries } = useGetBeneficiariesQuery("DISABLED");
  const { data: elderlyBeneficiaries } = useGetBeneficiariesQuery("ELDERLY");

  const allBeneficiaries = useMemo(() => {
    const list = [
      ...(Array.isArray(disabledBeneficiaries) ? disabledBeneficiaries : []),
      ...(Array.isArray(elderlyBeneficiaries) ? elderlyBeneficiaries : []),
    ];
    const seen = new Set<string>();
    return list.filter((b: any) => {
      const idStr =
        b?.faydaId?.trim() ||
        b?.cityIdNumber?.trim() ||
        (b?.id ? String(b.id) : "");
      if (!idStr || seen.has(idStr)) return false;
      seen.add(idStr);
      return true;
    });
  }, [disabledBeneficiaries, elderlyBeneficiaries]);

  const formSchema = z.object({
    cityIdNumber: z.string().min(1, t("fields.beneficiary")),
    serviceTypeId: z.coerce.number().min(1, t("fields.serviceType")),
    provider: z.string().min(1, t("fields.provider")),
    amountOrQuantity: z.string().min(1, t("fields.amount")),
    dateProvided: z.string().min(1, t("fields.dateProvided")),
    subCity: z.string().min(1, t("fields.subCity")),
    woreda: z.string().min(1, t("fields.woreda")),
    remark: z.string().optional(),
    facilitatorCityId: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      provider: "",
      amountOrQuantity: "",
      subCity: userSubCity || "",
      woreda: userWoreda || "",
      remark: "",
      dateProvided: new Date().toISOString().split("T")[0],
      serviceTypeId: 0,
      cityIdNumber: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (userSubCity) form.setValue("subCity", userSubCity);
      if (userWoreda) form.setValue("woreda", userWoreda);
    }
  }, [open, userSubCity, userWoreda, form]);

  const mutation = useMutation({
    mutationFn: registerSupportService,
    onSuccess: () => {
      toast.success(t("messages.success"));
      setOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["support-services"] });
    },
    onError: (error: any) => {
      toast.error(error.message || t("messages.error"));
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-8 px-3 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs font-semibold gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          {t("addButton")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-xs border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-sm font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-mono">
            {t("title")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="cityIdNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">
                    {t("fields.beneficiary")}
                  </FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                      const selected = allBeneficiaries.find((b: any) => {
                        const identifier =
                          b?.cityIdNumber?.trim() ||
                          b?.faydaId?.trim() ||
                          (b?.id ? String(b.id) : "");
                        return identifier === val;
                      });
                      if (selected) {
                        if (selected.subCity && (!userSubCity || userSubCity === selected.subCity)) {
                          form.setValue("subCity", selected.subCity);
                        }
                        if (selected.woreda && (!userWoreda || userWoreda === selected.woreda)) {
                          form.setValue("woreda", selected.woreda);
                        }
                      }
                    }}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] focus:ring-1 focus:ring-[#1769AA]">
                        <SelectValue
                          placeholder={t("placeholders.selectBeneficiary")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[300px]">
                      {allBeneficiaries.length === 0 ? (
                        <SelectItem value="_NONE" disabled className="text-xs text-slate-400">
                          {tCommon("noBeneficiaries")}
                        </SelectItem>
                      ) : (
                        allBeneficiaries.map((b: any) => {
                          const identifier =
                            b?.cityIdNumber?.trim() ||
                            b?.faydaId?.trim() ||
                            (b?.id ? String(b.id) : "");
                          const fullName = [b?.firstName, b?.lastName].filter(Boolean).join(" ") || "Unknown";
                          const idDisplay = b?.faydaId ? `FAN: ${b.faydaId}` : (b?.cityIdNumber || `#${b?.id}`);
                          const categoryBadge = b?.clientCategory === "DISABLED" || b?.DisabilityProfile ? "Disabled" : "Elderly";
                          return (
                            <SelectItem key={identifier} value={identifier}>
                              {fullName} ({idDisplay}) — {categoryBadge}
                            </SelectItem>
                          );
                        })
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">
                    {t("fields.serviceType")}
                  </FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(val ? Number(val) : 0)}
                    value={field.value ? field.value.toString() : undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] focus:ring-1 focus:ring-[#1769AA]">
                        <SelectValue
                          placeholder={t("placeholders.selectService")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[300px]">
                      {SERVICE_TYPES.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {tServices.has(`types.${type.id}`)
                            ? tServices(`types.${type.id}`)
                            : type.name}{" "}
                          (
                          {tServices.has(`categories.${type.category}`)
                            ? tServices(`categories.${type.category}`)
                            : type.category}
                          )
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">
                      {t("fields.provider")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("placeholders.provider")}
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
                name="amountOrQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">
                      {t("fields.amount")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("placeholders.amount")}
                        className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="dateProvided"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">
                      {t("fields.dateProvided")}
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
                name="subCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">
                      {t("fields.subCity")}
                    </FormLabel>
                    <FormControl>
                      <SubCitySelect
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder={t("placeholders.subCity")}
                      />
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
                    <FormLabel className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">
                      {t("fields.woreda")}
                    </FormLabel>
                    <FormControl>
                      <WoredaSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        subCity={form.watch("subCity")}
                        placeholder={t("placeholders.woreda")}
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
                  <FormLabel className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">
                    {t("fields.remark")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("placeholders.remark")}
                      className="resize-none rounded-xs border-[#E3E7EB] text-xs font-mono focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="border-t border-[#E3E7EB] pt-4 mt-6">
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
                disabled={mutation.isPending}
                className="h-8 px-4 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs font-semibold"
              >
                {mutation.isPending && (
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                )}
                {t("buttons.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
