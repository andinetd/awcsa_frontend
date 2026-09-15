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
import { useTranslations } from "next-intl";
import { useUpdateCMSSettings } from "@/hooks/cms";
import { Loader2, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const localizedSchema = z.object({
  en: z.string().default(""),
  am: z.string().default(""),
});

const contactSchema = z.object({
  address: localizedSchema,
  phone: z.string().default(""),
  email: z.string().email("Invalid email address").or(z.string().length(0)),
});

type ContactValues = z.infer<typeof contactSchema>;

interface ContactSettingsFormProps {
  initialData?: any;
}

export default function ContactSettingsForm({
  initialData,
}: ContactSettingsFormProps) {
  const t = useTranslations("super-admin.cms");
  const updateSettings = useUpdateCMSSettings();
  const [activeTab, setActiveTab] = React.useState("en");

  const getInitialValues = (data: any): ContactValues => {
    if (!data) {
      return {
        address: { en: "", am: "" },
        phone: "",
        email: "",
      };
    }

    return {
      address: {
        en: data.address_en || data.address?.en || "",
        am: data.address_am || data.address?.am || "",
      },
      phone: data.phone || "",
      email: data.email || "",
    };
  };

  const form = useForm<ContactValues>({
    // @ts-ignore
    resolver: zodResolver(contactSchema) as any,
    defaultValues: getInitialValues(initialData),
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset(getInitialValues(initialData));
    }
  }, [initialData, form]);

  const onSubmit = (values: ContactValues) => {
    const dataValue = {
      address: {
        en: values.address.en,
        am: values.address.am,
      },
      phone: values.phone,
      email: values.email,
    };

    updateSettings.mutate({
      key: "CONTACT_INFO",
      value: dataValue,
    });
  };

  return (
    <div className="rounded-xs border border-[#E3E7EB] bg-white p-6 shadow-2xs">
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <TabsContent value="en" className="space-y-3 mt-0">
              <FormField
                control={form.control as any}
                name="address.en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.address")} (EN)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter address in English"
                        className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                      />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="am" className="space-y-3 mt-0">
              <FormField
                control={form.control as any}
                name="address.am"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.address")} (AM)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="አድራሻ በአማርኛ ያስገቡ"
                        className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                      />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </TabsContent>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-[#E3E7EB] pt-3">
              <FormField
                control={form.control as any}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.phone")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="+251 9..."
                        className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                      />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.email")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="info@example.com"
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
