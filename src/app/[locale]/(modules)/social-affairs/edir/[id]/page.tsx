"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { useGetEdirAssociationByIdQuery } from "@/hooks/social-affairs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
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

const statusStyles: Record<EdirStatus, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  EXPIRED: "bg-amber-100 text-amber-700",
  REVOKED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-200 text-gray-700",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

import { useTranslations } from "next-intl";

export default function EdirDetailsPage({ params }: PageProps) {
  const t = useTranslations("social-affairs.edir.edir-details");
  const router = useRouter();
  const resolvedParams = use(params);
  const id = parseInt(resolvedParams.id);

  const { data: edir, isLoading, isError } = useGetEdirAssociationByIdQuery(id);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        {t("loading")}
      </div>
    );
  }

  if (isError || !edir) {
    return <div className="p-8 text-center text-red-500">{t("error")}</div>;
  }

  const typedEdir = edir as Edir; // Cast to Edir interface

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full p-4 md:p-8">
      {/* Header / Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/social-affairs/edir/list")}
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{typedEdir.name}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            {typedEdir.status && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  statusStyles[typedEdir.status] || "bg-gray-100 text-gray-700"
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

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">{t("tabs.overview")}</TabsTrigger>
          <TabsTrigger value="members">{t("tabs.members")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="flex flex-wrap justify-end items-center gap-2">
            <EdirAccreditationActions edir={typedEdir} />
            <NewEdirForm
              initialData={typedEdir}
              edirId={typedEdir.id}
              trigger={<Button>{t("buttons.edit")}</Button>}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Info Column */}
            <div className="md:col-span-2 space-y-6">
              {/* Registration & Accreditation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ScrollText className="w-5 h-5 text-primary" />
                    {t("sections.accreditation")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <div>
                    <p className="text-muted-foreground">
                      {t("fields.registrationNumber")}
                    </p>
                    <p className="font-mono font-medium">
                      {typedEdir.registrationNumber || t("fields.notAvailable")}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      {t("fields.registrationDate")}
                    </p>
                    <p className="font-medium">
                      {typedEdir.registrationDate
                        ? new Date(typedEdir.registrationDate).toLocaleDateString()
                        : t("fields.notAvailable")}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      {t("fields.certificateIssuedAt")}
                    </p>
                    <p className="font-medium">
                      {typedEdir.certificateIssuedAt
                        ? new Date(typedEdir.certificateIssuedAt).toLocaleDateString()
                        : t("fields.notAvailable")}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      {t("fields.renewedForYear")}
                    </p>
                    <p className="font-medium">
                      {typedEdir.renewedForYear ?? t("fields.notRenewed")}
                    </p>
                  </div>
                  {typedEdir.renewalPenaltyApplied && (
                    <div className="col-span-full">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                        {t("fields.penaltyApplied")}
                      </span>
                    </div>
                  )}
                  {typedEdir.cancelledAt && (
                    <div className="col-span-full">
                      <p className="text-muted-foreground">
                        {t("fields.cancelledAt")}
                      </p>
                      <p className="font-medium">
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
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    {t("sections.foundingMembers")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {typedEdir.foundingMembers?.length ? (
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                          <tr>
                            <th className="px-4 py-2 font-medium">
                              {t("fields.founderName")}
                            </th>
                            <th className="px-4 py-2 font-medium">
                              {t("fields.founderAddress")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {typedEdir.foundingMembers.map((fm) => (
                            <tr key={fm.id ?? fm.fullName} className="border-t">
                              <td className="px-4 py-2">{fm.fullName}</td>
                              <td className="px-4 py-2 text-muted-foreground">
                                {fm.address || "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      {t("fields.noFoundingMembers")}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${
                        typedEdir.assetsAuditedByAuditCommittee
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {t("fields.auditCommittee")}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${
                        typedEdir.assetsApprovedByGeneralAssembly
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {t("fields.generalAssembly")}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Assets at registration (Article 7.b) */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <HandCoins className="w-5 h-5 text-primary" />
                    {t("sections.assets")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {typedEdir.assets?.length ? (
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                          <tr>
                            <th className="px-4 py-2 font-medium">
                              {t("fields.assetType")}
                            </th>
                            <th className="px-4 py-2 font-medium">
                              {t("fields.assetDescription")}
                            </th>
                            <th className="px-4 py-2 font-medium text-right">
                              {t("fields.assetValue")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {typedEdir.assets.map((asset) => (
                            <tr key={asset.id ?? asset.description} className="border-t">
                              <td className="px-4 py-2">
                                {t(`assetTypes.${asset.type}`)}
                              </td>
                              <td className="px-4 py-2">{asset.description}</td>
                              <td className="px-4 py-2 text-right font-medium">
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
                    <p className="text-muted-foreground text-sm">
                      {t("fields.noAssets")}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Documents (Article 7.e) */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-primary" />
                    {t("sections.documents")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {typedEdir.byLawsDoc ? (
                    <div className="flex items-center justify-between gap-4 rounded-md border p-3">
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="font-medium">
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
                        className="text-sm text-primary underline"
                      >
                        {t("fields.viewDocument")}
                      </a>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      {t("fields.noDocument")}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* General Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    {t("sections.general")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <div>
                    <p className="text-muted-foreground">
                      {t("fields.method")}
                    </p>
                    <p className="font-medium">{typedEdir.formationMethod}</p>
                  </div>
                  <div className="col-span-full">
                    <p className="text-muted-foreground">
                      {t("fields.remarks")}
                    </p>
                    <p className="leading-relaxed mt-1">
                      {typedEdir.remark || t("fields.noRemarks")}
                    </p>
                  </div>
                  {typedEdir.otherReasonDescription && (
                    <div className="col-span-full">
                      <p className="text-muted-foreground">
                        {t("fields.otherReason")}
                      </p>
                      <p className="mt-1">{typedEdir.otherReasonDescription}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Membership Stats (Moved back to Overview) */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    {t("sections.membership")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-3">
                        {t("fields.managementMembers")}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-xs">
                            {t("fields.male")}
                          </span>
                          <span className="font-medium">
                            {typedEdir.managementMale || 0}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-xs">
                            {t("fields.female")}
                          </span>
                          <span className="font-medium">
                            {typedEdir.managementFemale || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-3">
                        {t("fields.generalMembers")}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-xs">
                            {t("fields.male")}
                          </span>
                          <span className="font-medium">
                            {typedEdir.generalMale || 0}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-xs">
                            {t("fields.female")}
                          </span>
                          <span className="font-medium">
                            {typedEdir.generalFemale || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t flex justify-end">
                    <p className="font-medium text-sm">
                      {t("fields.total")}:{" "}
                      {(typedEdir.managementMale || 0) +
                        (typedEdir.managementFemale || 0) +
                        (typedEdir.generalMale || 0) +
                        (typedEdir.generalFemale || 0)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Establishment Reasons */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    {t("sections.reasons")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {typedEdir.establishmentReasons?.length > 0 ? (
                      typedEdir.establishmentReasons.map((reason, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {t(`reasons.${reason}`)}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        {t("fields.noReasons")}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side Info Column */}
            <div className="space-y-6">
              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {t("sections.location")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground block text-xs">
                      {t("fields.subCityWoredaKebele")}
                    </span>
                    <span className="font-medium">
                      {typedEdir.subCity}, {t("address.woreda")}{" "}
                      {typedEdir.woreda}, {t("address.kebele")}{" "}
                      {typedEdir.kebele}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">
                      {t("fields.houseNumber")}
                    </span>
                    <span className="font-medium">{typedEdir.houseNumber}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">
                      {t("fields.specificLocation")}
                    </span>
                    <span className="font-medium">
                      {typedEdir.specificLocation}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Financials */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    {t("sections.financial")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground block text-xs">
                      {t("fields.bankAccountNumber")}
                    </span>
                    <span className="font-mono text-base font-medium text-slate-700">
                      {typedEdir.bankAccountNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">
                      {t("fields.monthlyPayment")}
                    </span>
                    <span className="font-medium">
                      {typedEdir.monthlyPaymentDetails}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="members" className="mt-6">
          {typedEdir.id && <EdirMembersList associationId={typedEdir.id} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
