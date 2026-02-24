"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { useUpdateCMSSettings } from "@/hooks/cms";
import { Loader2, Save } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const localizedSchema = z.object({
  en: z.string().default(""),
  am: z.string().default(""),
});

const heroSchema = z.object({
  title: localizedSchema.refine(
    (data) => data.en.trim().length > 0 || data.am.trim().length > 0,
    { message: "Title is required in at least one language" },
  ),
  subtitle: localizedSchema.refine(
    (data) => data.en.trim().length > 0 || data.am.trim().length > 0,
    { message: "Subtitle is required in at least one language" },
  ),
  description: localizedSchema,
  imageUrl: z.string().optional(),
  buttonText: localizedSchema,
  buttonLink: z.string().optional(),
});

type HeroValues = z.infer<typeof heroSchema>;

interface HeroSettingsFormProps {
  initialData?: any;
}

export default function HeroSettingsForm({
  initialData,
}: HeroSettingsFormProps) {
  const t = useTranslations("super-admin.cms");
  const updateSettings = useUpdateCMSSettings();
  const [activeTab, setActiveTab] = React.useState("en");

  // Helper to unflatten data from the API format to the form format
  const getInitialValues = (data: any): HeroValues => {
    if (!data) {
      return {
        title: { en: "", am: "" },
        subtitle: { en: "", am: "" },
        description: { en: "", am: "" },
        imageUrl: "",
        buttonText: { en: "", am: "" },
        buttonLink: "",
      };
    }

    return {
      title: {
        en: data.title_en || data.title?.en || "",
        am: data.title_am || data.title?.am || "",
      },
      subtitle: {
        en: data.subtitle_en || data.subtitle?.en || "",
        am: data.subtitle_am || data.subtitle?.am || "",
      },
      description: {
        en: data.description_en || data.description?.en || "",
        am: data.description_am || data.description?.am || "",
      },
      imageUrl: data.imageUrl || "",
      buttonText: {
        en: data.buttonText_en || data.buttonText?.en || "",
        am: data.buttonText_am || data.buttonText?.am || "",
      },
      buttonLink: data.buttonLink || "",
    };
  };

  const form = useForm<HeroValues>({
    // @ts-ignore
    resolver: zodResolver(heroSchema) as any,
    defaultValues: getInitialValues(initialData),
  });

  // Update form values when initialData changes (after API fetch)
  React.useEffect(() => {
    if (initialData) {
      form.reset(getInitialValues(initialData));
    }
  }, [initialData, form]);

  const onSubmit = (values: HeroValues) => {
    // Flatten localized fields for the settings API
    const flattenedValue = {
      title_en: values.title.en,
      title_am: values.title.am,
      subtitle_en: values.subtitle.en,
      subtitle_am: values.subtitle.am,
      description_en: values.description.en,
      description_am: values.description.am,
      buttonText_en: values.buttonText.en,
      buttonText_am: values.buttonText.am,
      imageUrl: values.imageUrl,
      buttonLink: values.buttonLink,
    };

    updateSettings.mutate({
      key: "LANDING_HERO",
      value: flattenedValue,
    });
  };

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="am">Amharic (አማርኛ)</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TabsContent value="en" className="space-y-4 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control as any}
                  name="title.en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.title")} (EN)</FormLabel>
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
                <FormField
                  control={form.control}
                  name="subtitle.en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.subtitle")} (EN)</FormLabel>
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
              </div>

              <FormField
                control={form.control}
                name="description.en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.content")} (EN)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter description in English"
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buttonText.en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.linkText")} (EN)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Learn More" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="am" className="space-y-4 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title.am"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.title")} (AM)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="ርዕስ በአማርኛ ያስገቡ" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subtitle.am"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.subtitle")} (AM)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="ንዑስ ርዕስ በአማርኛ ያስገቡ" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description.am"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.content")} (AM)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="መግለጫ በአማርኛ ያስገቡ"
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buttonText.am"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.linkText")} (AM)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ለምሳሌ፡ ተጨማሪ ያንብቡ" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <div className="space-y-4 border-t pt-4">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.imageUrl")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://example.com/hero.jpg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buttonLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.link")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="/services" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={updateSettings.isPending}>
                {updateSettings.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {t("actions.save")}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}
