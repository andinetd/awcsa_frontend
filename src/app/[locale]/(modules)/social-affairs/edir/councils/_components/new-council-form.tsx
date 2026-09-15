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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ShieldPlus, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import {
  useCreateEdirCouncilMutation,
  useUpdateEdirCouncilMutation,
} from "@/hooks/social-affairs";
import { newEdirCouncilSchema, NewEdirCouncilSchemaType } from "@/schemas/edir-council";
import { toast } from "sonner";
import { EdirCouncil, EdirLevel } from "@/api/social-affairs/edir";
import { EdirCouncilPayload } from "@/api/social-affairs/council-api";
import {
  SubCitySelect,
  WoredaSelect,
} from "@/components/shared/location-selects";

interface NewCouncilFormProps {
  initialData?: EdirCouncil;
  councilId?: number;
  trigger?: React.ReactNode;
}

export default function NewCouncilForm({
  initialData,
  councilId,
  trigger,
}: NewCouncilFormProps) {
  const t = useTranslations("social-affairs.edir.councils");
  const [open, setOpen] = useState(false);
  const createMutation = useCreateEdirCouncilMutation();
  const updateMutation = useUpdateEdirCouncilMutation();

  const defaultValues: NewEdirCouncilSchemaType = {
    name: "",
    level: "WOREDA",
    subCity: "",
    woreda: "",
    kebele: "",
    establishmentDate: new Date().toISOString().slice(0, 10),
    chairpersonName: "",
    chairpersonPhone: "",
    contactPhone: "",
    address: "",
  };

  const form = useForm<NewEdirCouncilSchemaType>({
    resolver: zodResolver(newEdirCouncilSchema),
    defaultValues,
  });

  useEffect(() => {
    if (open && initialData) {
      form.reset({
        name: initialData.name,
        level: initialData.level,
        subCity: initialData.subCity,
        woreda: initialData.woreda || "",
        kebele: initialData.kebele || "",
        establishmentDate: initialData.establishmentDate.slice(0, 10),
        chairpersonName: initialData.chairpersonName || "",
        chairpersonPhone: initialData.chairpersonPhone || "",
        contactPhone: initialData.contactPhone || "",
        address: initialData.address || "",
      });
    }
    if (open && !initialData) form.reset(defaultValues);
  }, [open, initialData, form]);

  const onSubmit = async (values: NewEdirCouncilSchemaType) => {
    const payload: EdirCouncilPayload = {
      name: values.name,
      level: values.level as EdirLevel,
      subCity: values.subCity,
      woreda: values.woreda || undefined,
      kebele: values.kebele || undefined,
      establishmentDate: values.establishmentDate,
      chairpersonName: values.chairpersonName || undefined,
      chairpersonPhone: values.chairpersonPhone || undefined,
      contactPhone: values.contactPhone || undefined,
      address: values.address || undefined,
    };

    try {
      if (initialData && councilId) {
        await updateMutation.mutateAsync({ councilId, data: payload });
        toast.success(t("form.messages.successUpdate"));
      } else {
        await createMutation.mutateAsync(payload);
        toast.success(t("form.messages.successCreate"));
      }
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.message || t("form.messages.saveError"));
    }
  };

  const isEdit = !!initialData;
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const watchedLevel = form.watch("level");
  const showWoreda = watchedLevel !== "CITY";
  const watchedSubCity = form.watch("subCity");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs">
            {isEdit ? <Edit className="w-3.5 h-3.5 mr-1.5" /> : <ShieldPlus className="w-3.5 h-3.5 mr-1.5" />}
            {isEdit ? t("buttons.edit") : t("buttons.add")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto max-w-2xl rounded-xs border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-base font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
            {isEdit ? t("form.updateTitle") : t("form.createTitle")}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-mono">
            {isEdit ? t("form.updateDesc") : t("form.createDesc")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="border-b border-[#E3E7EB] pb-1 text-[11px] font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
              {t("form.sections.general")}
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                    {t("form.fields.name")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.placeholders.name")}
                      className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                      {t("form.fields.level")}
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xs border-[#E3E7EB]">
                        {(["WOREDA", "SUB_CITY", "CITY"] as EdirLevel[]).map(
                          (level) => (
                            <SelectItem key={level} value={level} className="text-xs font-mono">
                              {t(`level.${level}`)}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="establishmentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                      {t("form.fields.establishmentDate")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border-b border-[#E3E7EB] pb-1 pt-2 text-[11px] font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
              {t("form.sections.location")}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                      {t("form.fields.subCity")}
                    </FormLabel>
                    <FormControl>
                      <SubCitySelect
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder={t("form.placeholders.subCity")}
                        extraOptions={watchedLevel === "CITY" ? ["Addis Ababa"] : []}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {showWoreda && (
                <FormField
                  control={form.control}
                  name="woreda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                        {t("form.fields.woreda")}
                      </FormLabel>
                      <FormControl>
                        <WoredaSelect
                          value={field.value}
                          onValueChange={field.onChange}
                          subCity={watchedSubCity}
                          placeholder={t("form.placeholders.woreda")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="kebele"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                      {t("form.fields.kebele")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.placeholders.kebele")}
                        className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border-b border-[#E3E7EB] pb-1 pt-2 text-[11px] font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
              {t("form.sections.leadership")}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="chairpersonName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                      {t("form.fields.chairpersonName")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.placeholders.chairpersonName")}
                        className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="chairpersonPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                      {t("form.fields.chairpersonPhone")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.placeholders.chairpersonPhone")}
                        className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                      {t("form.fields.contactPhone")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.placeholders.contactPhone")}
                        className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                      {t("form.fields.address")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("form.placeholders.address")}
                        className="text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E3E7EB]">
              <Button
                type="button"
                variant="outline"
                className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                {t("buttons.dismiss")}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs"
              >
                {isSubmitting ? t("buttons.saving") : t("buttons.save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}