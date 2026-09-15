import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { z } from "zod";
import { useTranslations } from "next-intl";

const monitoringSchema = z.object({
  monitoringDate: z.string().min(1, "Date is required"),
  assessedBy: z.string().min(1, "Assessor name is required"),
  currentStatus: z.string().min(1, "Status is required"),
  score: z.coerce.number().min(0).max(100),
  remark: z.string().optional(),
});

type MonitoringFormValues = z.infer<typeof monitoringSchema>;

interface AddMonitoringDialogProps {
  onAdd: (data: MonitoringFormValues) => void;
  isPending?: boolean;
  buttonLabel?: string;
}

export default function AddMonitoringDialog({
  onAdd,
  isPending,
  buttonLabel,
}: AddMonitoringDialogProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("women");

  const form = useForm<MonitoringFormValues>({
    resolver: zodResolver(monitoringSchema) as any,
    defaultValues: {
      monitoringDate: new Date().toISOString().split("T")[0],
      assessedBy: "",
      currentStatus: "",
      score: 0,
      remark: "",
    },
  });

  const onSubmit = (values: MonitoringFormValues) => {
    onAdd(values);
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-8 text-xs font-semibold rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-[#F7F8FA] gap-1.5">
          <ClipboardList className="w-3.5 h-3.5" />
          {buttonLabel || t("monitoring.addFollowUp")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto rounded-xs border border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider font-mono flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-[#1769AA]" />
            {t("monitoring.title")}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">{t("monitoring.description")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-3">
            <FormField
              control={form.control}
              name="monitoringDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-700">{t("monitoring.monitoringDate")}</FormLabel>
                  <FormControl>
                    <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white" type="date" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assessedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-700">{t("monitoring.assessedBy")}</FormLabel>
                  <FormControl>
                    <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white" placeholder={t("monitoring.assessorPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("monitoring.currentStatus")}</FormLabel>
                    <FormControl>
                      <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white" placeholder={t("monitoring.statusPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("monitoring.score")}</FormLabel>
                    <FormControl>
                      <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white" type="number" placeholder="0-100" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-700">{t("support.register.remarks")}</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[60px] h-auto text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white resize-none" placeholder={t("monitoring.remarkPlaceholder")} rows={3} {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4 border-t border-[#E3E7EB]">
              <Button type="button" variant="outline" className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-[#F7F8FA]" onClick={() => setOpen(false)}>
                {t("form.buttons.cancel")}
              </Button>
              <Button type="submit" disabled={isPending} className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold shadow-2xs">
                {isPending ? t("monitoring.adding") : t("monitoring.addEntry")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}