"use client";

import { useSubmitComplaintMutation } from "@/hooks/complaints";
import { ComplaintCategory } from "@/types/complaints";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export function ComplaintForm({ onSuccess }: { onSuccess?: () => void }) {
  const t = useTranslations("applicants-portal.complaints");

  const complaintSchema = useMemo(
    () =>
      z.object({
        subject: z.string().min(5, t("form.validation.subjectMin")),
        category: z.nativeEnum(ComplaintCategory, {
          message: t("form.validation.categoryRequired"),
        }),
        description: z.string().min(10, t("form.validation.descriptionMin")),
      }),
    [t],
  );

  type ComplaintFormValues = z.infer<typeof complaintSchema>;

  const form = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      subject: "",
      description: "",
      category: ComplaintCategory.PROCESS_DELAY,
    },
  });

  const { mutate: submitComplaint, isPending } = useSubmitComplaintMutation();

  const onSubmit = (data: ComplaintFormValues) => {
    submitComplaint(data, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });
  };

  const getCategoryLabel = (category: string) => {
    const key = category.toLowerCase() as keyof typeof ComplaintCategory;
    return t(`categories.${category.toLowerCase()}`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.subject")}</FormLabel>
              <FormControl>
                <Input placeholder={t("form.subjectPlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.category")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="hover:cursor-pointer">
                    <SelectValue placeholder={t("form.categoryPlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(ComplaintCategory).map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="hover:cursor-pointer"
                    >
                      {getCategoryLabel(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.description")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("form.descriptionPlaceholder")}
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full hover:cursor-pointer"
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? t("form.submitting") : t("form.submit")}
        </Button>
      </form>
    </Form>
  );
}
