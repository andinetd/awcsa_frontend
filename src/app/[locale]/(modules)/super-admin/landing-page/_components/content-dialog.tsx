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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {item ? t("actions.edit") : t("actions.add")}{" "}
            {t(`sections.${type.toLowerCase().replace("_", "") as "hero"}`)}
          </DialogTitle>
        </DialogHeader>

        <div className={labels.showTabs ? "" : "mt-4"}>
          {labels.showTabs ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="am">Amharic (አማርኛ)</TabsTrigger>
              </TabsList>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6 mt-4"
                >
                  <TabsContent value="en" className="space-y-4 mt-0">
                    {labels.title && (
                      <FormField
                        control={form.control as any}
                        name="title.en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{labels.title} (EN)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter title in English"
                              />
                            </FormControl>
                            <FormMessage />
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
                            <FormLabel>{labels.subtitle} (EN)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter subtitle in English"
                              />
                            </FormControl>
                            <FormMessage />
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
                            <FormLabel>{labels.content} (EN)</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Enter content in English"
                                rows={4}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    <div className="grid grid-cols-1 gap-4">
                      {labels.showLinkText && (
                        <FormField
                          control={form.control}
                          name="linkText.en"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("fields.linkText")} (EN)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Learn More" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>{" "}
                  </TabsContent>

                  <TabsContent value="am" className="space-y-4 mt-0">
                    {labels.title && (
                      <FormField
                        control={form.control}
                        name="title.am"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{labels.title} (AM)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="ርዕስ በአማርኛ ያስገቡ" />
                            </FormControl>
                            <FormMessage />
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
                            <FormLabel>{labels.subtitle} (AM)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="ንዑስ ርዕስ በአማርኛ ያስገቡ"
                              />
                            </FormControl>
                            <FormMessage />
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
                            <FormLabel>{labels.content} (AM)</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="ይዘት በአማርኛ ያስገቡ"
                                rows={4}
                              />
                            </FormControl>
                            <FormMessage />
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
                            <FormLabel>{t("fields.linkText")} (AM)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="ምሳሌ፡ ተጨማሪ ያንብቡ" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </TabsContent>

                  <div className="space-y-4 border-t pt-4">
                    {labels.showLink && (
                      <FormField
                        control={form.control}
                        name="link"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("fields.link")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
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
                            <FormLabel>{labels.imageUrl}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={labels.imagePlaceholder}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="order"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("fields.order")}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
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
                        control={form.control}
                        name="isVisible"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-2 shadow-sm">
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
                  </div>

                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full sm:w-auto"
                    >
                      {isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
                className="space-y-6"
              >
                <div className="space-y-4 p-1">
                  {labels.title && (
                    <FormField
                      control={form.control as any}
                      name="title.en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{labels.title}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={
                                typeof labels.title === "string"
                                  ? `Enter ${labels.title.toLowerCase()}`
                                  : ""
                              }
                            />
                          </FormControl>
                          <FormMessage />
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
                          <FormLabel>{labels.subtitle}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
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
                          <FormLabel>{labels.content}</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={4} />
                          </FormControl>
                          <FormMessage />
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
                          <FormLabel>{t("fields.link")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
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
                          <FormLabel>{labels.imageUrl}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={labels.imagePlaceholder}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("fields.order")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
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
                      control={form.control}
                      name="isVisible"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
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
                </div>

                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full sm:w-auto"
                  >
                    {isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
