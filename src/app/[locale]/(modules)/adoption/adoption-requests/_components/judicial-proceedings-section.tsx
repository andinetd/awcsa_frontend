"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Scale,
  FileCheck2,
  Calendar,
  Building,
  UserCheck,
  FileText,
  PlusCircle,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Landmark,
  Stamp,
  Globe2,
} from "lucide-react";
import {
  AdoptionCourtCase,
  CourtBundleManifest,
} from "@/types/child-matching-types";
import {
  getCourtCaseDetails,
  getCourtBundleManifest,
  initiateCourtPetition,
  recordCourtHearing,
  finalizeAdoptionDecree,
  recordVeraLinkage,
} from "@/api/adoption/matches";
import { toast } from "sonner";

interface JudicialProceedingsSectionProps {
  matchId?: number | null;
  matchStatus?: string;
  isOfficer?: boolean;
}

export const JudicialProceedingsSection: React.FC<JudicialProceedingsSectionProps> = ({
  matchId,
  matchStatus,
  isOfficer = true,
}) => {
  const t = useTranslations("adoption.judicial");
  const [loading, setLoading] = useState(false);
  const [courtCase, setCourtCase] = useState<AdoptionCourtCase | null>(null);
  const [courtBundle, setCourtBundle] = useState<CourtBundleManifest | null>(null);
  const [showPetitionForm, setShowPetitionForm] = useState(false);
  const [showHearingForm, setShowHearingForm] = useState(false);
  const [showDecreeForm, setShowDecreeForm] = useState(false);
  const [showVeraForm, setShowVeraForm] = useState(false);
  const [showBundleModal, setShowBundleModal] = useState(false);

  // Petition Form State
  const [petitionData, setPetitionData] = useState({
    courtName: "Federal First Instance Court, Lideta Bench",
    benchName: "Family & Child Protection Bench",
    courtFileNumber: "",
    presidingJudge: "",
    filingDate: new Date().toISOString().split("T")[0],
    nextHearingDate: "",
    statusRemarks: "",
  });

  // Hearing Form State
  const [hearingData, setHearingData] = useState({
    hearingDate: new Date().toISOString().split("T")[0],
    hearingType: "PRELIMINARY_EVIDENCE_HEARING",
    attendeesText: "Judge, Social Worker, Adoptive Parent",
    judgeOrders: "",
    postponementReason: "",
    nextHearingDate: "",
  });

  // Decree Form State
  const [decreeData, setDecreeData] = useState({
    decreeNumber: "",
    decreeDate: new Date().toISOString().split("T")[0],
    decreeDocumentUrl: "",
    certifiedCopyUrl: "",
    legalOrdersSummary: "Full adoption granted with irrevocable parental rights transfer pursuant to Revised Family Code.",
  });

  // VERA Linkage Form State
  const [veraData, setVeraData] = useState({
    veraOfficeBranch: "Addis Ababa Vital Events Registration Bureau",
    registrationNumber: "",
    amendedBirthCertNumber: "",
    dateIssued: new Date().toISOString().split("T")[0],
    certificateDocumentUrl: "",
    originalCertArchived: true,
    notes: "Original birth entry cross-referenced and sealed. Amended birth certificate issued under adoptive parent surname.",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (matchId) {
      loadData();
    }
  }, [matchId]);

  const loadData = async () => {
    if (!matchId) return;
    setLoading(true);
    try {
      const caseRes = await getCourtCaseDetails(matchId);
      if (caseRes?.data) {
        setCourtCase(caseRes.data);
      } else if (caseRes) {
        setCourtCase(caseRes);
      }
    } catch (err) {
      console.error("Failed to load court case", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchBundle = async () => {
    if (!matchId) return;
    try {
      const res = await getCourtBundleManifest(matchId);
      setCourtBundle(res?.data || res);
      setShowBundleModal(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to compile court evidence bundle");
    }
  };

  const handleSubmitPetition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchId) return;
    setSubmitting(true);
    try {
      await initiateCourtPetition(matchId, petitionData);
      toast.success("Court petition registered successfully");
      setShowPetitionForm(false);
      loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to record court petition");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitHearing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courtCase?.id) return;
    setSubmitting(true);
    try {
      const attendees = hearingData.attendeesText
        .split(",")
        .map((a) => ({ name: a.trim(), role: "ATTENDEE" }));

      await recordCourtHearing(courtCase.id, {
        hearingDate: hearingData.hearingDate,
        hearingType: hearingData.hearingType,
        attendees,
        judgeOrders: hearingData.judgeOrders,
        postponementReason: hearingData.postponementReason || undefined,
        nextHearingDate: hearingData.nextHearingDate || undefined,
      });

      toast.success("Hearing minutes recorded successfully");
      setShowHearingForm(false);
      loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to record hearing session");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitDecree = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courtCase?.id) return;
    setSubmitting(true);
    try {
      await finalizeAdoptionDecree(courtCase.id, decreeData);
      toast.success("Final Adoption Decree registered! Case completed.");
      setShowDecreeForm(false);
      loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to record decree");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitVera = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchId) return;
    setSubmitting(true);
    try {
      await recordVeraLinkage(matchId, veraData);
      toast.success("Amended birth certificate registered with VERA");
      setShowVeraForm(false);
      loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to record VERA civil registry data");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>{t("loading")}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Controls */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-5 rounded-xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-lg">
            <Scale className="w-6 h-6 text-indigo-300" />
          </div>
          <div>
            <h3 className="text-base font-bold">{t("title")}</h3>
            <p className="text-xs text-indigo-200 mt-0.5">
              {t("subtitle")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleFetchBundle}
            className="border-white/20 text-indigo-900 bg-white hover:bg-slate-100 text-xs font-semibold"
          >
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            {t("buttons.compileBundle")}
          </Button>
          {!courtCase && (
            <Button
              size="sm"
              onClick={() => setShowPetitionForm(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
              {t("buttons.filePetition")}
            </Button>
          )}
        </div>
      </div>

      {/* Petition Form Modal */}
      {showPetitionForm && (
        <Card className="border-indigo-200 bg-indigo-50/40">
          <CardHeader className="py-3 px-4 border-b border-indigo-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-indigo-900 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-indigo-600" />
              {t("petitionDialog.title")}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPetitionForm(false)}
              className="h-7 text-xs"
            >
              {t("buttons.cancel")}
            </Button>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <form onSubmit={handleSubmitPetition} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700">{t("petitionDialog.courtName")}</label>
                  <Input
                    value={petitionData.courtName}
                    onChange={(e) => setPetitionData({ ...petitionData, courtName: e.target.value })}
                    required
                    className="mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700">{t("petitionDialog.benchDivision")}</label>
                  <Input
                    value={petitionData.benchName}
                    onChange={(e) => setPetitionData({ ...petitionData, benchName: e.target.value })}
                    className="mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700">{t("petitionDialog.fileNumber")}</label>
                  <Input
                    value={petitionData.courtFileNumber}
                    placeholder={t("petitionDialog.fileNumberPlaceholder")}
                    onChange={(e) => setPetitionData({ ...petitionData, courtFileNumber: e.target.value })}
                    required
                    className="mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700">{t("petitionDialog.judge")}</label>
                  <Input
                    value={petitionData.presidingJudge}
                    placeholder={t("petitionDialog.judgePlaceholder")}
                    onChange={(e) => setPetitionData({ ...petitionData, presidingJudge: e.target.value })}
                    className="mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700">{t("petitionDialog.filingDate")}</label>
                  <Input
                    type="date"
                    value={petitionData.filingDate}
                    onChange={(e) => setPetitionData({ ...petitionData, filingDate: e.target.value })}
                    className="mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700">{t("petitionDialog.nextHearingDate")}</label>
                  <Input
                    type="date"
                    value={petitionData.nextHearingDate}
                    onChange={(e) => setPetitionData({ ...petitionData, nextHearingDate: e.target.value })}
                    className="mt-1 text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                  {t("buttons.submitPetition")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Case Details Card */}
      {courtCase ? (
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/80 border-b border-slate-100 py-3.5 px-4 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-indigo-600" />
                <span className="font-bold text-sm text-slate-900">
                  {t("caseDetails.caseDocket", { docket: courtCase.courtFileNumber })}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wider">
                  {courtCase.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowHearingForm(!showHearingForm)}
                  className="h-7 text-xs"
                >
                  <Calendar className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                  {t("buttons.addHearing")}
                </Button>
                {courtCase.status !== "DECREE_GRANTED" && (
                  <Button
                    size="sm"
                    onClick={() => setShowDecreeForm(!showDecreeForm)}
                    className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Stamp className="w-3.5 h-3.5 mr-1" />
                    {t("buttons.recordDecree")}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">{t("caseDetails.courtAndBench")}</span>
                <span className="font-semibold text-slate-800">{courtCase.courtName}</span>
                <p className="text-slate-500 text-[11px]">{courtCase.benchName || t("caseDetails.generalBench")}</p>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">{t("caseDetails.presidingJudge")}</span>
                <span className="font-semibold text-slate-800">{courtCase.presidingJudge || t("caseDetails.notAssigned")}</span>
                <p className="text-slate-500 text-[11px]">
                  {courtCase.filingDate ? t("caseDetails.filingDate", { date: new Date(courtCase.filingDate).toLocaleDateString() }) : "—"}
                </p>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">{t("caseDetails.nextScheduledHearing")}</span>
                <span className="font-semibold text-indigo-600">
                  {courtCase.nextHearingDate
                    ? new Date(courtCase.nextHearingDate).toLocaleDateString()
                    : t("caseDetails.noneScheduled")}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Hearing Record Modal / Form */}
          {showHearingForm && (
            <Card className="border-indigo-100 bg-indigo-50/30">
              <CardHeader className="py-2.5 px-4 border-b border-indigo-100 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-900">
                  {t("hearingDialog.title")}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowHearingForm(false)} className="h-6 text-xs">
                  {t("buttons.cancel")}
                </Button>
              </CardHeader>
              <CardContent className="pt-3">
                <form onSubmit={handleSubmitHearing} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-slate-700">{t("hearingDialog.date")}</label>
                      <Input
                        type="date"
                        value={hearingData.hearingDate}
                        onChange={(e) => setHearingData({ ...hearingData, hearingDate: e.target.value })}
                        required
                        className="mt-1 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-700">{t("hearingDialog.type")}</label>
                      <Input
                        value={hearingData.hearingType}
                        onChange={(e) => setHearingData({ ...hearingData, hearingType: e.target.value })}
                        className="mt-1 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-700">{t("hearingDialog.nextHearing")}</label>
                      <Input
                        type="date"
                        value={hearingData.nextHearingDate}
                        onChange={(e) => setHearingData({ ...hearingData, nextHearingDate: e.target.value })}
                        className="mt-1 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-700">{t("hearingDialog.attendees")}</label>
                    <Input
                      value={hearingData.attendeesText}
                      onChange={(e) => setHearingData({ ...hearingData, attendeesText: e.target.value })}
                      className="mt-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-700">{t("hearingDialog.judgeOrders")}</label>
                    <textarea
                      value={hearingData.judgeOrders}
                      onChange={(e) => setHearingData({ ...hearingData, judgeOrders: e.target.value })}
                      rows={2}
                      required
                      placeholder={t("hearingDialog.ordersPlaceholder")}
                      className="mt-1 w-full p-2 border border-slate-200 rounded-md text-xs focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="submit"
                      disabled={submitting}
                      size="sm"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
                    >
                      {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                      {t("buttons.saveHearing")}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Hearings Timeline */}
          {courtCase.hearings && courtCase.hearings.length > 0 && (
            <Card>
              <CardHeader className="py-3 px-4 bg-slate-50 border-b border-slate-100">
                <CardTitle className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  {t("hearingsTimeline.title", { count: courtCase.hearings.length })}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 divide-y divide-slate-100">
                {courtCase.hearings.map((h, i) => (
                  <div key={h.id || i} className="py-2.5 first:pt-0 last:pb-0 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">
                        {new Date(h.hearingDate).toLocaleDateString()} — {h.hearingType}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {t("hearingsTimeline.recordedBy", { name: `${h.recordedBy?.firstName || ""} ${h.recordedBy?.lastName || ""}` })}
                      </span>
                    </div>
                    {h.judgeOrders && (
                      <p className="mt-1 text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                        <strong className="text-slate-800">{t("hearingsTimeline.judgeOrders")}</strong> {h.judgeOrders}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Record Final Adoption Decree Modal / Form */}
          {showDecreeForm && (
            <Card className="border-emerald-200 bg-emerald-50/30">
              <CardHeader className="py-2.5 px-4 border-b border-emerald-100 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-emerald-950 flex items-center gap-2">
                  <Stamp className="w-4 h-4 text-emerald-600" />
                  {t("decree.dialogTitle")}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowDecreeForm(false)} className="h-6 text-xs">
                  {t("buttons.cancel")}
                </Button>
              </CardHeader>
              <CardContent className="pt-3">
                <form onSubmit={handleSubmitDecree} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-slate-700">{t("decree.decreeNumber")}</label>
                      <Input
                        value={decreeData.decreeNumber}
                        placeholder={t("decree.decreeNumberPlaceholder")}
                        onChange={(e) => setDecreeData({ ...decreeData, decreeNumber: e.target.value })}
                        required
                        className="mt-1 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-700">{t("decree.decreeDate")}</label>
                      <Input
                        type="date"
                        value={decreeData.decreeDate}
                        onChange={(e) => setDecreeData({ ...decreeData, decreeDate: e.target.value })}
                        required
                        className="mt-1 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-700">{t("decree.decreeDocUrl")}</label>
                      <Input
                        value={decreeData.decreeDocumentUrl}
                        placeholder="/documents/decrees/ffic-4401.pdf"
                        onChange={(e) => setDecreeData({ ...decreeData, decreeDocumentUrl: e.target.value })}
                        className="mt-1 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-700">{t("decree.certifiedCopyUrl")}</label>
                      <Input
                        value={decreeData.certifiedCopyUrl}
                        placeholder="/documents/decrees/certified-4401.pdf"
                        onChange={(e) => setDecreeData({ ...decreeData, certifiedCopyUrl: e.target.value })}
                        className="mt-1 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-700">{t("decree.legalOrdersSummary")}</label>
                    <textarea
                      value={decreeData.legalOrdersSummary}
                      onChange={(e) => setDecreeData({ ...decreeData, legalOrdersSummary: e.target.value })}
                      rows={2}
                      className="mt-1 w-full p-2 border border-slate-200 rounded-md text-xs focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="submit"
                      disabled={submitting}
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                    >
                      {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                      {t("buttons.grantDecree")}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Decree Granted Status Display */}
          {courtCase.decreeNumber && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-800 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 text-sm">
                    {t("decree.grantedTitle", { decreeNumber: courtCase.decreeNumber })}
                  </h4>
                  <p className="text-emerald-800 text-xs mt-0.5">
                    {t("decree.orderDate", { date: courtCase.decreeDate ? new Date(courtCase.decreeDate).toLocaleDateString() : "—" })}
                  </p>
                  {courtCase.legalOrdersSummary && (
                    <p className="text-slate-600 text-xs mt-2 bg-white/70 p-2 rounded border border-emerald-100">
                      {courtCase.legalOrdersSummary}
                    </p>
                  )}
                </div>
              </div>
              {!courtCase.veraLinkage && (
                <Button
                  size="sm"
                  onClick={() => setShowVeraForm(true)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs shrink-0"
                >
                  <Globe2 className="w-3.5 h-3.5 mr-1" />
                  {t("buttons.linkVera")}
                </Button>
              )}
            </div>
          )}

          {/* VERA Linkage Form */}
          {showVeraForm && (
            <Card className="border-sky-200 bg-sky-50/30">
              <CardHeader className="py-2.5 px-4 border-b border-sky-100 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-sky-950 flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-sky-600" />
                  {t("vera.dialogTitle")}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowVeraForm(false)} className="h-6 text-xs">
                  {t("buttons.cancel")}
                </Button>
              </CardHeader>
              <CardContent className="pt-3">
                <form onSubmit={handleSubmitVera} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-slate-700">{t("vera.officeBranch")}</label>
                      <Input
                        value={veraData.veraOfficeBranch}
                        onChange={(e) => setVeraData({ ...veraData, veraOfficeBranch: e.target.value })}
                        required
                        className="mt-1 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-700">{t("vera.amendedCertNumber")}</label>
                      <Input
                        value={veraData.amendedBirthCertNumber}
                        placeholder={t("vera.amendedCertPlaceholder")}
                        onChange={(e) => setVeraData({ ...veraData, amendedBirthCertNumber: e.target.value })}
                        required
                        className="mt-1 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-700">{t("vera.dateIssued")}</label>
                      <Input
                        type="date"
                        value={veraData.dateIssued}
                        onChange={(e) => setVeraData({ ...veraData, dateIssued: e.target.value })}
                        className="mt-1 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-700">{t("vera.registrationNumber")}</label>
                      <Input
                        value={veraData.registrationNumber}
                        placeholder={t("vera.registrationPlaceholder")}
                        onChange={(e) => setVeraData({ ...veraData, registrationNumber: e.target.value })}
                        className="mt-1 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-700">{t("vera.notes")}</label>
                    <textarea
                      value={veraData.notes}
                      onChange={(e) => setVeraData({ ...veraData, notes: e.target.value })}
                      rows={2}
                      className="mt-1 w-full p-2 border border-slate-200 rounded-md text-xs focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="submit"
                      disabled={submitting}
                      size="sm"
                      className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold"
                    >
                      {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                      {t("buttons.linkVeraEntry")}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* VERA Status Card */}
          {courtCase.veraLinkage && (
            <Card className="border-sky-200 bg-sky-50/20">
              <CardHeader className="py-2.5 px-4 bg-sky-50/60 border-b border-sky-100 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-sky-950 flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-sky-600" />
                  {t("vera.linkedTitle")}
                </CardTitle>
                <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full uppercase">
                  {t("vera.badge")}
                </span>
              </CardHeader>
              <CardContent className="pt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">{t("vera.branch")}</span>
                  <span className="font-semibold text-slate-800">{courtCase.veraLinkage.veraOfficeBranch}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">{t("vera.amendedCert")}</span>
                  <span className="font-semibold text-sky-700">{courtCase.veraLinkage.amendedBirthCertNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">{t("vera.issuedOn")}</span>
                  <span className="font-semibold text-slate-800">
                    {courtCase.veraLinkage.dateIssued
                      ? new Date(courtCase.veraLinkage.dateIssued).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 text-center">
          <Scale className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-700">{t("empty.title")}</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {t("empty.desc")}
          </p>
        </div>
      )}

      {/* Court Bundle Manifest Modal */}
      {showBundleModal && courtBundle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-slate-900 px-5 py-4 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  {courtBundle.bundleTitle}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {t("bundle.compiledOn", { date: new Date(courtBundle.compiledAt).toLocaleString() })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBundleModal(false)}
                className="text-white hover:bg-slate-800 h-8"
              >
                {t("buttons.close")}
              </Button>
            </div>
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">{t("bundle.checklistTitle")}</span>
                <ul className="space-y-1 text-slate-600">
                  <li className="flex items-center gap-2">
                    {courtBundle.evidentiarySections.childMedicalClearance.present ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <span>{t("bundle.medicalClearance", { bloodGroup: courtBundle.evidentiarySections.childMedicalClearance.bloodGroup || "N/A" })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {courtBundle.evidentiarySections.socialWorkerHomeStudy.present ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <span>{t("bundle.homeStudy")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {courtBundle.evidentiarySections.familySuitabilityAssessment.present ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <span>{t("bundle.suitability", { score: courtBundle.evidentiarySections.familySuitabilityAssessment.compositeScore ?? "N/A" })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {courtBundle.evidentiarySections.placementCommitteeMinutes.present ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <span>{t("bundle.committeeMinutes", { decision: courtBundle.evidentiarySections.placementCommitteeMinutes.decision || "PENDING" })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {courtBundle.evidentiarySections.familyTracingStatus.reunificationExhausted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <span>{t("bundle.tracingCertificate", { count: courtBundle.evidentiarySections.familyTracingStatus.logsCount })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{courtBundle.evidentiarySections.siblingIntegrity.inSiblingGroup ? t("bundle.siblingReviewGroup", { count: courtBundle.evidentiarySections.siblingIntegrity.siblingsCount }) : t("bundle.siblingReviewSingle")}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
