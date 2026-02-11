"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout, Save, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetLandingPage } from "@/hooks/cms";
import HeroSettingsForm from "@/app/[locale]/(modules)/super-admin/landing-page/_components/hero-settings-form";
import ContentListManager from "@/app/[locale]/(modules)/super-admin/landing-page/_components/content-list-manager";

export default function LandingPageCMS() {
  const t = useTranslations("super-admin.cms");
  const { data: landingData, isLoading, refetch } = useGetLandingPage();

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-full flex-1 flex-col max-w-7xl mx-auto w-full space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="hero">{t("sections.hero")}</TabsTrigger>
          <TabsTrigger value="services">{t("sections.services")}</TabsTrigger>
          <TabsTrigger value="testimonials">
            {t("sections.testimonials")}
          </TabsTrigger>
          <TabsTrigger value="gallery">{t("sections.gallery")}</TabsTrigger>
          <TabsTrigger value="contact">{t("sections.contact")}</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4">
          <HeroSettingsForm initialData={landingData?.hero} />
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <ContentListManager
            type="SERVICE"
            items={landingData?.services || []}
            onSuccess={refetch}
          />
        </TabsContent>

        <TabsContent value="testimonials" className="space-y-4">
          <ContentListManager
            type="TESTIMONIAL"
            items={landingData?.testimonials || []}
            onSuccess={refetch}
          />
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4">
          <ContentListManager
            type="GALLERY"
            items={landingData?.gallery || []}
            onSuccess={refetch}
          />
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <p className="text-muted-foreground">
              Contact settings coming soon...
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
