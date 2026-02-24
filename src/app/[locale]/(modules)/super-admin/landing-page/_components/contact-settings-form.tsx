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
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="am">Amharic (አማርኛ)</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TabsContent value="en" className="space-y-4 mt-0">
              <FormField
                control={form.control as any}
                name="address.en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.address")} (EN)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter address in English"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="am" className="space-y-4 mt-0">
              <FormField
                control={form.control as any}
                name="address.am"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.address")} (AM)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="አድራሻ በአማርኛ ያስገቡ" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <FormField
                control={form.control as any}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.phone")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+251 9..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.email")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="info@example.com" />
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
