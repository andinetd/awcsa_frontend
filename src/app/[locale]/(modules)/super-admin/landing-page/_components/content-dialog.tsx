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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const localizedSchema = z.object({
  en: z.string().default(""),
  am: z.string().default(""),
});

const contentSchema = z
  .object({
    type: z.string(), // Added to capture type in schema for conditional validation
    title: localizedSchema,
    subtitle: localizedSchema,
    content: localizedSchema,
    imageUrl: z.string().default(""),
    isVisible: z.boolean().default(true),
    order: z.number().default(0),
    link: z.string().optional(),
    linkText: localizedSchema.optional(),
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
  const [activeTab, setActiveTab] = React.useState("en");

  const form = useForm<ContentValues>({
    // @ts-ignore
    resolver: zodResolver(contentSchema) as any,
    defaultValues: {
      type,
      title: { en: "", am: "" },
      subtitle: { en: "", am: "" },
      content: { en: "", am: "" },
      imageUrl: "",
      isVisible: true,
      order: 0,
      link: "",
      linkText: { en: "", am: "" },
    },
  });

  useEffect(() => {
    if (open) {
      if (item) {
        form.reset({
          type: item.type || type,
          title: {
            en: item.title?.en || "",
            am: item.title?.am || "",
          },
          subtitle: {
            en: item.subtitle?.en || "",
            am: item.subtitle?.am || "",
          },
          content: {
            en: item.content?.en || "",
            am: item.content?.am || "",
          },
          imageUrl: item.imageUrl || "",
          isVisible: !!item.isVisible,
          order: item.order || 0,
          link: item.metadata?.link || "",
          linkText: {
            en: item.metadata?.linkText?.en || "",
            am: item.metadata?.linkText?.am || "",
          },
        });
      } else {
        form.reset({
          type,
          title: { en: "", am: "" },
          subtitle: { en: "", am: "" },
          content: { en: "", am: "" },
          imageUrl: "",
          isVisible: true,
          order: 0,
          link: "",
          linkText: { en: "", am: "" },
        });
      }
    }
  }, [item, form, open, type]);

  const onSubmit = (values: ContentValues) => {
    const { link, linkText, ...rest } = values;
    const data: CMSContent = {
      ...rest,
      type: type, // Ensure we use the prop type
      metadata: {
        link,
        linkText,
      },
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

  // Add error logging to help identify hidden validation issues
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      console.log("Form Errors:", form.formState.errors);
    }
  }, [form.formState.errors]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  const getLabels = () => {
    switch (type) {
      case "SERVICE":
        return {
          title: t("fields.serviceName"),
          subtitle: null,
          content: t("fields.serviceDescription"),
          imageUrl: t("fields.iconKey"),
          imagePlaceholder: "Baby, Building2, etc.",
          showLink: true,
          showLinkText: true,
          showTabs: true,
        };
      case "TESTIMONIAL":
        return {
          title: t("fields.personName"),
          subtitle: t("fields.role"),
          content: t("fields.quote"),
          imageUrl: t("fields.avatarUrl"),
          imagePlaceholder: "https://i.pravatar.cc/150?u=123",
          showLink: false,
          showLinkText: false,
          showTabs: true,
        };
      case "SOCIAL_LINK":
        return {
          title: t("fields.platformName"),
          subtitle: null,
          content: null,
          imageUrl: t("fields.iconKey"),
          imagePlaceholder: "Facebook, Twitter, etc.",
          showLink: true,
          showLinkText: false,
          showTabs: false,
        };
      case "QUICK_LINK":
        return {
          title: t("fields.linkName"),
          subtitle: null,
          content: null,
          imageUrl: "",
          imagePlaceholder: "",
          showLink: true,
          showLinkText: false,
          showTabs: true,
        };
      case "GALLERY_IMAGE":
        return {
          title: null,
          subtitle: null,
          content: null,
          imageUrl: t("fields.galleryImage"),
          imagePlaceholder: "https://example.com/gallery-image.jpg",
          showLink: false,
          showLinkText: false,
          showTabs: false,
        };
      case "PARTNER_LOGO":
        return {
          title: t("sections.partners"),
          subtitle: null,
          content: null,
          imageUrl: t("fields.logoUrl"),
          imagePlaceholder: "https://example.com/logo.png",
          showLink: true,
          showLinkText: false,
          showTabs: false,
        };
      case "CONTACT":
        return {
          title: t("fields.label"),
          subtitle: null,
          content: t("fields.value"),
          imageUrl: t("fields.iconKey"),
          imagePlaceholder: "Phone, MapPin, Mail, etc.",
          showLink: false,
          showLinkText: false,
          showTabs: true,
        };
      default:
        return {
          title: t("fields.title"),
          subtitle: t("fields.subtitle"),
          content: t("fields.content"),
          imageUrl: t("fields.imageUrl"),
          imagePlaceholder: "https://example.com/image.jpg",
          showLink: true,
          showLinkText: true,
          showTabs: true,
        };
    }
  };

  const labels = getLabels();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-xs border border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3 mb-2">
          <DialogTitle className="text-base font-bold font-mono text-[#0B1F3A] uppercase tracking-wide">
            {item ? t("actions.edit") : t("actions.add")}{" "}
            {t(`sections.${type.toLowerCase().replace("_", "") as "hero"}`)}
          </DialogTitle>
        </DialogHeader>

        <div className={labels.showTabs ? "" : "mt-2"}>
          {labels.showTabs ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-slate-100/80 p-1 border border-[#E3E7EB] rounded-xs mb-4 h-9">
                <TabsTrigger
                  value="en"
                  className="data-[state=active]:bg-white data-[state=active]:text-[#0B1F3A] data-[state=active]:shadow-2xs rounded-xs text-xs font-medium py-1 px-3"
                >
                  English
                </TabsTrigger>
                <TabsTrigger
                  value="am"
                  className="data-[state=active]:bg-white data-[state=active]:text-[#0B1F3A] data-[state=active]:shadow-2xs rounded-xs text-xs font-medium py-1 px-3"
                >
                  Amharic (አማርኛ)
                </TabsTrigger>
              </TabsList>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <TabsContent value="en" className="space-y-3 mt-0">
                    {labels.title && (
                      <FormField
                        control={form.control as any}
                        name="title.en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-slate-700">{labels.title} (EN)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter title in English"
                                className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                              />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                          </FormItem>
                        )}
                      />
                    )}
                    {labels.subtitle && (
                      <FormField
                        control={form.control}
                        name="subtitle.en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-slate-700">{labels.subtitle} (EN)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter subtitle in English"
                                className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                              />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                          </FormItem>
                        )}
                      />
                    )}
                    {labels.content && (
                      <FormField
                        control={form.control}
                        name="content.en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-slate-700">{labels.content} (EN)</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Enter content in English"
                                rows={4}
                                className="text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                              />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                          </FormItem>
                        )}
                      />
                    )}
                    <div className="grid grid-cols-1 gap-3">
                      {labels.showLinkText && (
                        <FormField
                          control={form.control}
                          name="linkText.en"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.linkText")} (EN)</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Learn More"
                                  className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                                />
                              </FormControl>
                              <FormMessage className="text-[11px]" />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="am" className="space-y-3 mt-0">
                    {labels.title && (
                      <FormField
                        control={form.control}
                        name="title.am"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-slate-700">{labels.title} (AM)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="ርዕስ በአማርኛ ያስገቡ"
                                className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                              />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                          </FormItem>
                        )}
                      />
                    )}
                    {labels.subtitle && (
                      <FormField
                        control={form.control}
                        name="subtitle.am"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-slate-700">{labels.subtitle} (AM)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="ንዑስ ርዕስ በአማርኛ ያስገቡ"
                                className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                              />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                          </FormItem>
                        )}
                      />
                    )}
                    {labels.content && (
                      <FormField
                        control={form.control}
                        name="content.am"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-slate-700">{labels.content} (AM)</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="ይዘት በአማርኛ ያስገቡ"
                                rows={4}
                                className="text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                              />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                          </FormItem>
                        )}
                      />
                    )}
                    {labels.showLinkText && (
                      <FormField
                        control={form.control}
                        name="linkText.am"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.linkText")} (AM)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="ምሳሌ፡ ተጨማሪ ያንብቡ"
                                className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                              />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                          </FormItem>
                        )}
                      />
                    )}
                  </TabsContent>

                  <div className="space-y-3 border-t border-[#E3E7EB] pt-3">
                    {labels.showLink && (
                      <FormField
                        control={form.control}
                        name="link"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.link")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com"
                                {...field}
                                className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                              />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                          </FormItem>
                        )}
                      />
                    )}
                    {labels.imageUrl && (
                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-slate-700">{labels.imageUrl}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={labels.imagePlaceholder}
                                className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                              />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                          </FormItem>
                        )}
                      />
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name="order"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.order")}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                                className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                              />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="isVisible"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2.5 space-y-0 rounded-xs border border-[#E3E7EB] p-2 bg-slate-50/50 h-8 mt-5">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-xs font-semibold text-slate-700 cursor-pointer">{t("fields.isVisible")}</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <DialogFooter className="pt-3 border-t border-[#E3E7EB] flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                      className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold shadow-2xs gap-1.5 px-4"
                    >
                      {isPending && (
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      )}
                      {t("actions.save")}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </Tabs>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="space-y-3">
                  {labels.title && (
                    <FormField
                      control={form.control as any}
                      name="title.en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-slate-700">{labels.title}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={
                                typeof labels.title === "string"
                                  ? `Enter ${labels.title.toLowerCase()}`
                                  : ""
                              }
                              className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                            />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />
                  )}

                  {labels.subtitle && (
                    <FormField
                      control={form.control}
                      name="subtitle.en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-slate-700">{labels.subtitle}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                            />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />
                  )}

                  {labels.content && (
                    <FormField
                      control={form.control}
                      name="content.en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-slate-700">{labels.content}</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={4}
                              className="text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                            />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />
                  )}

                  {labels.showLink && (
                    <FormField
                      control={form.control}
                      name="link"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.link")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com"
                              {...field}
                              className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                            />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />
                  )}

                  {labels.imageUrl && (
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-slate-700">{labels.imageUrl}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={labels.imagePlaceholder}
                              className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                            />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.order")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                              className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                            />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isVisible"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2.5 space-y-0 rounded-xs border border-[#E3E7EB] p-2 bg-slate-50/50 h-8 mt-5">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-xs font-semibold text-slate-700 cursor-pointer">{t("fields.isVisible")}</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <DialogFooter className="pt-3 border-t border-[#E3E7EB] flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold shadow-2xs gap-1.5 px-4"
                  >
                    {isPending && (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    )}
                    {t("actions.save")}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
