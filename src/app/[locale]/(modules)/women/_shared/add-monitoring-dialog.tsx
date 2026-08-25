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
        <Button variant="outline" className="gap-2">
          <ClipboardList className="w-4 h-4" />
          {buttonLabel || t("monitoring.addFollowUp")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("monitoring.title")}</DialogTitle>
          <DialogDescription>{t("monitoring.description")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="monitoringDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("monitoring.monitoringDate")}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assessedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("monitoring.assessedBy")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("monitoring.assessorPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("monitoring.currentStatus")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("monitoring.statusPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("monitoring.score")}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0-100" {...field} />
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
                  <FormLabel>{t("support.register.remarks")}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t("monitoring.remarkPlaceholder")} rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {t("form.buttons.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? t("monitoring.adding") : t("monitoring.addEntry")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}