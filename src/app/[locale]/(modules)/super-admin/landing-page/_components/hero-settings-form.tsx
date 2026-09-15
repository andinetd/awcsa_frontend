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
  title: localizedSchema,
  subtitle: localizedSchema,
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
    <div className="rounded-xs border border-[#E3E7EB] bg-white p-6 shadow-2xs">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100/80 p-1 border border-[#E3E7EB] rounded-xs mb-6 h-9">
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <TabsContent value="en" className="space-y-4 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control as any}
                  name="title.en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.title")} (EN)</FormLabel>
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
                <FormField
                  control={form.control}
                  name="subtitle.en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.subtitle")} (EN)</FormLabel>
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
              </div>

              <FormField
                control={form.control}
                name="description.en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.content")} (EN)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter description in English"
                        rows={4}
                        className="text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                      />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buttonText.en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.linkText")} (EN)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Learn More"
                        className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                      />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
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
                      <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.title")} (AM)</FormLabel>
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
                <FormField
                  control={form.control}
                  name="subtitle.am"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.subtitle")} (AM)</FormLabel>
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
              </div>

              <FormField
                control={form.control}
                name="description.am"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.content")} (AM)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="መግለጫ በአማርኛ ያስገቡ"
                        rows={4}
                        className="text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                      />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buttonText.am"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.linkText")} (AM)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="ለምሳሌ፡ ተጨማሪ ያንብቡ"
                        className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                      />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </TabsContent>

            <div className="space-y-4 border-t border-[#E3E7EB] pt-4">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.imageUrl")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://example.com/hero.jpg"
                        className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                      />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buttonLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.link")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="/services"
                        className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                      />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={updateSettings.isPending}
                className="h-8 rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white text-xs font-semibold shadow-2xs gap-1.5 px-4"
              >
                {updateSettings.isPending ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="mr-1.5 h-3.5 w-3.5" />
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
