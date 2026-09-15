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
        <Loader2 className="h-7 w-7 animate-spin text-[#1769AA]" />
      </div>
    );
  }

  return (
    <div className="h-full flex-1 flex-col max-w-7xl mx-auto w-full space-y-6 p-6 md:p-8">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-1 border-b border-[#E3E7EB] pb-4">
        <div className="flex items-center gap-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500">
          <span>SUPER ADMIN</span>
          <span>/</span>
          <span className="text-[#1769AA] font-bold">{t("title")}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-1">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0B1F3A] font-mono uppercase">
              {t("title")}
            </h1>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              {t("description")}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="bg-slate-100/80 p-1 border border-[#E3E7EB] rounded-xs h-auto flex flex-wrap gap-1">
          <TabsTrigger
            value="hero"
            className="data-[state=active]:bg-white data-[state=active]:text-[#0B1F3A] data-[state=active]:shadow-2xs rounded-xs text-xs font-medium py-1 px-3"
          >
            {t("sections.hero")}
          </TabsTrigger>
          <TabsTrigger
            value="services"
            className="data-[state=active]:bg-white data-[state=active]:text-[#0B1F3A] data-[state=active]:shadow-2xs rounded-xs text-xs font-medium py-1 px-3"
          >
            {t("sections.services")}
          </TabsTrigger>
          <TabsTrigger
            value="testimonials"
            className="data-[state=active]:bg-white data-[state=active]:text-[#0B1F3A] data-[state=active]:shadow-2xs rounded-xs text-xs font-medium py-1 px-3"
          >
            {t("sections.testimonials")}
          </TabsTrigger>
          <TabsTrigger
            value="gallery"
            className="data-[state=active]:bg-white data-[state=active]:text-[#0B1F3A] data-[state=active]:shadow-2xs rounded-xs text-xs font-medium py-1 px-3"
          >
            {t("sections.gallery")}
          </TabsTrigger>
          <TabsTrigger
            value="social"
            className="data-[state=active]:bg-white data-[state=active]:text-[#0B1F3A] data-[state=active]:shadow-2xs rounded-xs text-xs font-medium py-1 px-3"
          >
            {t("sections.social")}
          </TabsTrigger>
          <TabsTrigger
            value="partners"
            className="data-[state=active]:bg-white data-[state=active]:text-[#0B1F3A] data-[state=active]:shadow-2xs rounded-xs text-xs font-medium py-1 px-3"
          >
            {t("sections.partners")}
          </TabsTrigger>
          <TabsTrigger
            value="quickLinks"
            className="data-[state=active]:bg-white data-[state=active]:text-[#0B1F3A] data-[state=active]:shadow-2xs rounded-xs text-xs font-medium py-1 px-3"
          >
            {t("sections.quickLinks")}
          </TabsTrigger>
          <TabsTrigger
            value="contact"
            className="data-[state=active]:bg-white data-[state=active]:text-[#0B1F3A] data-[state=active]:shadow-2xs rounded-xs text-xs font-medium py-1 px-3"
          >
            {t("sections.contact")}
          </TabsTrigger>
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
            type="GALLERY_IMAGE"
            items={landingData?.gallery || []}
            onSuccess={refetch}
          />
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <ContentListManager
            type="SOCIAL_LINK"
            items={landingData?.social || []}
            onSuccess={refetch}
          />
        </TabsContent>

        <TabsContent value="quickLinks" className="space-y-4">
          <ContentListManager
            type="QUICK_LINK"
            items={landingData?.quickLinks || []}
            onSuccess={refetch}
          />
        </TabsContent>

        <TabsContent value="partners" className="space-y-4">
          <ContentListManager
            type="PARTNER_LOGO"
            items={landingData?.partners || []}
            onSuccess={refetch}
          />
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <ContentListManager
            type="CONTACT"
            items={landingData?.contact || []}
            onSuccess={refetch}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
