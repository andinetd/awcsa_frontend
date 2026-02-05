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
import { Plus, Loader2, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { trainingSchema, TrainingSchemaType } from "@/schemas/beneficiaries";
import {
  useRegisterTrainingMutation,
  useGetBeneficiariesQuery,
} from "@/hooks/beneficiaries";

interface TrainingFormProps {
  cityIdNumber?: string;
  trigger?: React.ReactNode;
}

export default function TrainingForm({
  cityIdNumber,
  trigger,
}: TrainingFormProps) {
  const t = useTranslations("social-affairs.elderlyAndDisabled.training.form");
  const [open, setOpen] = React.useState(false);
  const registerMutation = useRegisterTrainingMutation();
  const { data: disabled } = useGetBeneficiariesQuery("DISABLED");
  const { data: elderly } = useGetBeneficiariesQuery("ELDERLY");

  const beneficiaries = [...(disabled || []), ...(elderly || [])];
  const form = useForm<TrainingSchemaType>({
    resolver: zodResolver(trainingSchema) as any,
    defaultValues: {
      cityIdNumber: cityIdNumber || "",
      trainingType: "AGRICULTURE",
      provider: "",
      startDate: "",
      completionDate: "",
      dropoutDate: "",
      dropoutReason: "",
      hasCOC: false,
      remark: "",
    },
  });

  const onSubmit = (values: TrainingSchemaType) => {
    registerMutation.mutate(values as any, {
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
            <GraduationCap className="w-6 h-6 text-primary" />
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
              name="trainingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.trainingType")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("placeholders.selectTrainingType")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AGRICULTURE">
                        {t("trainingTypes.AGRICULTURE")}
                      </SelectItem>
                      <SelectItem value="BUSINESS">
                        {t("trainingTypes.BUSINESS")}
                      </SelectItem>
                      <SelectItem value="HOTEL_HOSPITALITY">
                        {t("trainingTypes.HOTEL_HOSPITALITY")}
                      </SelectItem>
                      <SelectItem value="HOUSE_CONSTRUCTION">
                        {t("trainingTypes.HOUSE_CONSTRUCTION")}
                      </SelectItem>
                      <SelectItem value="AUTOMOTIVE">
                        {t("trainingTypes.AUTOMOTIVE")}
                      </SelectItem>
                      <SelectItem value="ELECTRICITY">
                        {t("trainingTypes.ELECTRICITY")}
                      </SelectItem>
                      <SelectItem value="ICT">
                        {t("trainingTypes.ICT")}
                      </SelectItem>
                      <SelectItem value="MUNICIPALITY_ADMIN">
                        {t("trainingTypes.MUNICIPALITY_ADMIN")}
                      </SelectItem>
                      <SelectItem value="ROAD_CONSTRUCTION">
                        {t("trainingTypes.ROAD_CONSTRUCTION")}
                      </SelectItem>
                      <SelectItem value="AGRO_PROCESSING">
                        {t("trainingTypes.AGRO_PROCESSING")}
                      </SelectItem>
                      <SelectItem value="FURNITURE_MAKING">
                        {t("trainingTypes.FURNITURE_MAKING")}
                      </SelectItem>
                      <SelectItem value="TEXTILE_GARMENT">
                        {t("trainingTypes.TEXTILE_GARMENT")}
                      </SelectItem>
                      <SelectItem value="LEATHER_WORK">
                        {t("trainingTypes.LEATHER_WORK")}
                      </SelectItem>
                      <SelectItem value="METAL_WORKING">
                        {t("trainingTypes.METAL_WORKING")}
                      </SelectItem>
                      <SelectItem value="OTHER">
                        {t("trainingTypes.OTHER")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.provider")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("placeholders.provider")}
                      {...field}
                    />
                  </FormControl>
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
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dropoutDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.dropoutDate")}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dropoutReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.dropoutReason")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("placeholders.dropoutReason")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="hasCOC"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("fields.hasCOC")}</FormLabel>
                  </div>
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
