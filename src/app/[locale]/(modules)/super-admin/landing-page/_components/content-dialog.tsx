"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useCreateCMSContent, useUpdateCMSContent } from "@/hooks/cms";
import { Loader2 } from "lucide-react";
import { CMSContent, CMSContentType } from "@/types/cms";

const contentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().default(""),
  content: z.string().default(""),
  imageUrl: z.string().default(""),
  isVisible: z.boolean().default(true),
  order: z.number().default(0),
});

type ContentValues = z.infer<typeof contentSchema>;

interface ContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: CMSContentType;
  item?: CMSContent;
  onSuccess: () => void;
}

export default function ContentDialog({
  open,
  onOpenChange,
  type,
  item,
  onSuccess,
}: ContentDialogProps) {
  const t = useTranslations("super-admin.cms");
  const createMutation = useCreateCMSContent();
  const updateMutation = useUpdateCMSContent();

  const form = useForm<ContentValues>({
    // @ts-ignore
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      content: "",
      imageUrl: "",
      isVisible: true,
      order: 0,
    },
  });

  useEffect(() => {
    if (open) {
      if (item) {
        form.reset({
          title: item.title || "",
          subtitle: item.subtitle || "",
          content: item.content || "",
          imageUrl: item.imageUrl || "",
          isVisible: !!item.isVisible,
          order: item.order || 0,
        });
      } else {
        form.reset({
          title: "",
          subtitle: "",
          content: "",
          imageUrl: "",
          isVisible: true,
          order: 0,
        });
      }
    }
  }, [item, form, open]);

  const onSubmit = (values: ContentValues) => {
    const data: CMSContent = {
      ...values,
      type,
    };

    if (item?.id) {
      updateMutation.mutate(
        { id: item.id, data },
        { onSuccess: () => onSuccess() },
      );
    } else {
      createMutation.mutate(data, { onSuccess: () => onSuccess() });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {item ? t("actions.edit") : t("actions.add")}{" "}
            {t(`sections.${type.toLowerCase() as "hero"}`)}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit as any)}
            className="space-y-4"
          >
            <FormField
              control={form.control as any}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.title")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as any}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.subtitle")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as any}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.content")}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as any}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.imageUrl")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control as any}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.order")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="isVisible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{t("fields.isVisible")}</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("actions.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
