"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGetEdirAssociationByIdQuery } from "@/hooks/social-affairs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  ChevronRight,
  Home,
  MapPin,
  Users,
  Building2,
  CreditCard,
  FileText,
  ScrollText,
  HandCoins,
  FolderOpen,
} from "lucide-react";
import { Edir, EdirStatus } from "@/api/social-affairs/edir";
import { downloadEdirDocument } from "@/api/social-affairs/accreditation-api";
import NewEdirForm from "../list/_components/new-edir-form";
import EdirMembersList from "./_components/edir-members-list";
import EdirAccreditationActions from "./_components/edir-accreditation-actions";
import { useTranslations } from "next-intl";

const statusStyles: Record<EdirStatus, string> = {
  ACTIVE: "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]",
  EXPIRED: "bg-amber-50 text-amber-700 border-amber-200",
  REVOKED: "bg-rose-50 text-rose-700 border-rose-200",
  CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EdirDetailsPage({ params }: PageProps) {
  const t = useTranslations("social-affairs.edir.edir-details");
  const router = useRouter();
  const resolvedParams = use(params);
  const id = parseInt(resolvedParams.id);

  const { data: edir, isLoading, isError } = useGetEdirAssociationByIdQuery(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-xs font-mono uppercase tracking-wider text-slate-400">
          {t("loading")}
        </div>
      </div>
    );
  }

  if (isError || !edir) {
    return (
      <div className="p-8 text-center text-xs font-mono uppercase text-rose-600">
        {t("error")}
      </div>
    );
  }

  const typedEdir = edir as Edir;

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full p-4 md:p-8">
      {/* Municipal Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
        <Link href="/" className="hover:text-[#1769AA] flex items-center gap-1 transition-colors">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-600">Social Affairs</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/social-affairs/edir/list" className="hover:text-[#1769AA] transition-colors">
          Edir Associations
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0B1F3A] font-bold truncate max-w-xs">{typedEdir.name}</span>
      </div>

      {/* Header Bar */}
      <div className="border-b border-[#E3E7EB] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/social-affairs/edir/list")}
            className="h-8 w-8 rounded-xs border-[#E3E7EB] hover:bg-[#F7F8FA] shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </Button>
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
              {typedEdir.name}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
              {typedEdir.status && (
                <span
                  className={`px-2 py-0.5 rounded-xs text-[11px] font-mono font-semibold border ${
                    statusStyles[typedEdir.status] || "bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  {t(`status.${typedEdir.status}`)}
                </span>
              )}
              <span>•</span>
              <span>
                {t("fields.established")}:{" "}
                {new Date(typedEdir.establishmentDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <EdirAccreditationActions edir={typedEdir} />
          <NewEdirForm
            initialData={typedEdir}
            edirId={typedEdir.id}
            trigger={
              <Button className="h-8 text-xs font-semibold rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs">
                {t("buttons.edit")}
              </Button>
            }
          />
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="h-9 p-1 rounded-xs bg-slate-100 border border-[#E3E7EB]">
          <TabsTrigger
            value="overview"
            className="h-7 text-xs font-mono uppercase tracking-wider rounded-xs data-[state=active]:bg-white data-[state=active]:text-[#0B1F3A] data-[state=active]:shadow-2xs font-semibold"
          >
            {t("tabs.overview")}
          </TabsTrigger>
          <TabsTrigger
            value="members"
            className="h-7 text-xs font-mono uppercase tracking-wider rounded-xs data-[state=active]:bg-white data-[state=active]:text-[#0B1F3A] data-[state=active]:shadow-2xs font-semibold"
          >
            {t("tabs.members")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Main Info Column (2 cols) */}
            <div className="md:col-span-2 space-y-4">
              {/* Registration & Accreditation */}
              <Card className="rounded-xs border border-[#E3E7EB] bg-white shadow-2xs">
                <CardHeader className="border-b border-[#E3E7EB] px-5 py-3.5">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-2">
                    <ScrollText className="w-3.5 h-3.5 text-[#1769AA]" />
                    {t("sections.accreditation")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-xs">
                  <div>
                    <p className="text-slate-500 font-mono text-[11px] uppercase tracking-wider">
                      {t("fields.registrationNumber")}
                    </p>
                    <p className="font-mono font-semibold text-slate-800 mt-0.5">
                      {typedEdir.registrationNumber || t("fields.notAvailable")}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-mono text-[11px] uppercase tracking-wider">
                      {t("fields.registrationDate")}
                    </p>
                    <p className="font-mono font-medium text-slate-800 mt-0.5">
                      {typedEdir.registrationDate
                        ? new Date(typedEdir.registrationDate).toLocaleDateString()
                        : t("fields.notAvailable")}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-mono text-[11px] uppercase tracking-wider">
                      {t("fields.certificateIssuedAt")}
                    </p>
                    <p className="font-mono font-medium text-slate-800 mt-0.5">
                      {typedEdir.certificateIssuedAt
                        ? new Date(typedEdir.certificateIssuedAt).toLocaleDateString()
                        : t("fields.notAvailable")}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-mono text-[11px] uppercase tracking-wider">
                      {t("fields.renewedForYear")}
                    </p>
                    <p className="font-mono font-medium text-slate-800 mt-0.5">
                      {typedEdir.renewedForYear ?? t("fields.notRenewed")}
                    </p>
                  </div>
                  {typedEdir.renewalPenaltyApplied && (
                    <div className="col-span-full">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-[11px] font-mono font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        {t("fields.penaltyApplied")}
                      </span>
                    </div>
                  )}
                  {typedEdir.cancelledAt && (
                    <div className="col-span-full pt-2 border-t border-[#E3E7EB]">
                      <p className="text-slate-500 font-mono text-[11px] uppercase tracking-wider">
                        {t("fields.cancelledAt")}
                      </p>
                      <p className="font-medium text-rose-700 mt-0.5">
                        {new Date(typedEdir.cancelledAt).toLocaleDateString()}
                        {typedEdir.cancellationReason
                          ? ` — ${t(`cancellationReasons.${typedEdir.cancellationReason}`)}`
                          : ""}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Founding Members (Article 7.a) */}
              <Card className="rounded-xs border border-[#E3E7EB] bg-white shadow-2xs">
                <CardHeader className="border-b border-[#E3E7EB] px-5 py-3.5">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#1769AA]" />
                    {t("sections.foundingMembers")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-3">
                  {typedEdir.foundingMembers?.length ? (
                    <div className="border border-[#E3E7EB] rounded-xs overflow-hidden">
                      <table className="w-full text-xs">
                        <thead className="bg-slate-50 text-left border-b border-[#E3E7EB]">
                          <tr>
                            <th className="px-4 py-2.5 font-mono font-bold text-slate-600 uppercase text-[11px]">
                              {t("fields.founderName")}
                            </th>
                            <th className="px-4 py-2.5 font-mono font-bold text-slate-600 uppercase text-[11px]">
                              {t("fields.founderAddress")}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E3E7EB]">
                          {typedEdir.foundingMembers.map((fm) => (
                            <tr key={fm.id ?? fm.fullName} className="hover:bg-slate-50/60">
                              <td className="px-4 py-2 font-medium text-slate-800">{fm.fullName}</td>
                              <td className="px-4 py-2 text-slate-500">
                                {fm.address || "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-xs font-mono">
                      {t("fields.noFoundingMembers")}
                    </p>
                  )}
                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-xs font-medium border ${
                        typedEdir.assetsAuditedByAuditCommittee
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      {t("fields.auditCommittee")}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-xs font-medium border ${
                        typedEdir.assetsApprovedByGeneralAssembly
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      {t("fields.generalAssembly")}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Assets at registration (Article 7.b) */}
              <Card className="rounded-xs border border-[#E3E7EB] bg-white shadow-2xs">
                <CardHeader className="border-b border-[#E3E7EB] px-5 py-3.5">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-2">
                    <HandCoins className="w-3.5 h-3.5 text-[#1769AA]" />
                    {t("sections.assets")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  {typedEdir.assets?.length ? (
                    <div className="border border-[#E3E7EB] rounded-xs overflow-hidden">
                      <table className="w-full text-xs">
                        <thead className="bg-slate-50 text-left border-b border-[#E3E7EB]">
                          <tr>
                            <th className="px-4 py-2.5 font-mono font-bold text-slate-600 uppercase text-[11px]">
                              {t("fields.assetType")}
                            </th>
                            <th className="px-4 py-2.5 font-mono font-bold text-slate-600 uppercase text-[11px]">
                              {t("fields.assetDescription")}
                            </th>
                            <th className="px-4 py-2.5 font-mono font-bold text-slate-600 uppercase text-[11px] text-right">
                              {t("fields.assetValue")}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E3E7EB]">
                          {typedEdir.assets.map((asset) => (
                            <tr key={asset.id ?? asset.description} className="hover:bg-slate-50/60">
                              <td className="px-4 py-2">
                                <span className="inline-flex px-1.5 py-0.5 rounded-xs text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                  {t(`assetTypes.${asset.type}`)}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-slate-700">{asset.description}</td>
                              <td className="px-4 py-2 text-right font-mono font-medium text-slate-900">
                                {Number(asset.value).toLocaleString(
                                  undefined,
                                  { style: "currency", currency: "ETB" }
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-xs font-mono">
                      {t("fields.noAssets")}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Documents (Article 7.e) */}
              <Card className="rounded-xs border border-[#E3E7EB] bg-white shadow-2xs">
                <CardHeader className="border-b border-[#E3E7EB] px-5 py-3.5">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-2">
                    <FolderOpen className="w-3.5 h-3.5 text-[#1769AA]" />
                    {t("sections.documents")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  {typedEdir.byLawsDoc ? (
                    <div className="flex items-center justify-between gap-4 rounded-xs border border-[#E3E7EB] p-3 bg-slate-50/40">
                      <div className="flex items-center gap-2 text-xs">
                        <FileText className="w-4 h-4 text-[#1769AA]" />
                        <span className="font-medium text-slate-800">
                          {typedEdir.byLawsDoc.fileName}
                        </span>
                      </div>
                      <a
                        href="/social-affairs/edir/list"
                        onClick={(e) => {
                          e.preventDefault();
                          downloadEdirDocument(typedEdir.byLawsDoc!.id).then(
                            (url) => window.open(url, "_blank")
                          );
                        }}
                        className="text-xs font-semibold text-[#1769AA] hover:underline"
                      >
                        {t("fields.viewDocument")}
                      </a>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-xs font-mono">
                      {t("fields.noDocument")}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* General Remarks */}
              <Card className="rounded-xs border border-[#E3E7EB] bg-white shadow-2xs">
                <CardHeader className="border-b border-[#E3E7EB] px-5 py-3.5">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-[#1769AA]" />
                    {t("sections.general")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 text-xs">
                  <p className="text-slate-500 font-mono text-[11px] uppercase tracking-wider">
                    {t("fields.remarks")}
                  </p>
                  <p className="leading-relaxed mt-1 text-slate-700">
                    {typedEdir.remark || t("fields.noRemarks")}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Column (1 col) */}
            <div className="space-y-4">
              {/* Membership Stats */}
              <Card className="rounded-xs border border-[#E3E7EB] bg-white shadow-2xs">
                <CardHeader className="border-b border-[#E3E7EB] px-5 py-3.5">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#1769AA]" />
                    {t("sections.membership")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-3">
                  <div className="bg-slate-50/70 p-3 rounded-xs border border-[#E3E7EB]">
                    <h4 className="font-semibold text-xs text-slate-800 mb-2">
                      {t("fields.managementMembers")}
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex flex-col">
                        <span className="text-slate-500 text-[11px] font-mono">
                          {t("fields.male")}
                        </span>
                        <span className="font-mono font-semibold text-slate-900">
                          {typedEdir.managementMale || 0}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-slate-500 text-[11px] font-mono">
                          {t("fields.female")}
                        </span>
                        <span className="font-mono font-semibold text-slate-900">
                          {typedEdir.managementFemale || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50/70 p-3 rounded-xs border border-[#E3E7EB]">
                    <h4 className="font-semibold text-xs text-slate-800 mb-2">
                      {t("fields.generalMembers")}
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex flex-col">
                        <span className="text-slate-500 text-[11px] font-mono">
                          {t("fields.male")}
                        </span>
                        <span className="font-mono font-semibold text-slate-900">
                          {typedEdir.generalMale || 0}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-slate-500 text-[11px] font-mono">
                          {t("fields.female")}
                        </span>
                        <span className="font-mono font-semibold text-slate-900">
                          {typedEdir.generalFemale || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E3E7EB] flex justify-between items-center">
                    <span className="text-xs font-mono text-slate-600 font-bold uppercase">{t("fields.total")}</span>
                    <span className="font-mono font-bold text-sm text-[#0B1F3A]">
                      {(typedEdir.managementMale || 0) +
                        (typedEdir.managementFemale || 0) +
                        (typedEdir.generalMale || 0) +
                        (typedEdir.generalFemale || 0)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="rounded-xs border border-[#E3E7EB] bg-white shadow-2xs">
                <CardHeader className="border-b border-[#E3E7EB] px-5 py-3.5">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#1769AA]" />
                    {t("sections.location")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px] font-mono uppercase tracking-wider">
                      {t("fields.subCityWoredaKebele")}
                    </span>
                    <span className="font-medium text-slate-800 mt-0.5 block">
                      {typedEdir.subCity}, {t("address.woreda")}{" "}
                      {typedEdir.woreda}, {t("address.kebele")}{" "}
                      {typedEdir.kebele}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px] font-mono uppercase tracking-wider">
                      {t("fields.houseNumber")}
                    </span>
                    <span className="font-mono font-medium text-slate-800 mt-0.5 block">{typedEdir.houseNumber || "—"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px] font-mono uppercase tracking-wider">
                      {t("fields.specificLocation")}
                    </span>
                    <span className="font-medium text-slate-800 mt-0.5 block">
                      {typedEdir.specificLocation || "—"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Financials */}
              <Card className="rounded-xs border border-[#E3E7EB] bg-white shadow-2xs">
                <CardHeader className="border-b border-[#E3E7EB] px-5 py-3.5">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-[#1769AA]" />
                    {t("sections.financial")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px] font-mono uppercase tracking-wider">
                      {t("fields.bankAccountNumber")}
                    </span>
                    <span className="font-mono text-sm font-semibold text-slate-800 mt-0.5 block">
                      {typedEdir.bankAccountNumber || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px] font-mono uppercase tracking-wider">
                      {t("fields.monthlyPayment")}
                    </span>
                    <span className="font-medium text-slate-800 mt-0.5 block">
                      {typedEdir.monthlyPaymentDetails || "—"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="members" className="mt-4">
          {typedEdir.id && <EdirMembersList associationId={typedEdir.id} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
