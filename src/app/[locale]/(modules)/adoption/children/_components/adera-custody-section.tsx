"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  HeartHandshake,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  Home,
  FileText,
  UserCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  useAderaCustody,
  useFormalizeAderaCustody,
  useRecordAderaCheckup,
  useConvertAderaStatus,
} from "@/hooks/adoption/useChildDetails";
import {
  Child,
  AderaCustodyRecord,
  AderaWelfareCheckup,
  AderaStatus,
} from "@/types/child-matching-types";

interface AderaCustodySectionProps {
  child: Child;
}

export function AderaCustodySection({ child }: AderaCustodySectionProps) {
  const t = useTranslations("adoption.aderaCustody");
  const childId = child.id;
  const { data: aderaData, isLoading } = useAderaCustody(childId);
  const formalizeMutation = useFormalizeAderaCustody(childId);
  const checkupMutation = useRecordAderaCheckup(childId);
  const convertMutation = useConvertAderaStatus(childId);

  const [isFormalizeOpen, setIsFormalizeOpen] = useState(false);
  const [isCheckupOpen, setIsCheckupOpen] = useState(false);
  const [isConvertOpen, setIsConvertOpen] = useState(false);

  // Formalize state
  const [custodianId, setCustodianId] = useState("");
  const [relationship, setRelationship] = useState("");
  const [reason, setReason] = useState("");
  const [agreementDocUrl, setAgreementDocUrl] = useState("");
  const [monthlyStipend, setMonthlyStipend] = useState("");
  const [isCourtApproved, setIsCourtApproved] = useState(false);
  const [formalizeNotes, setFormalizeNotes] = useState("");

  // Checkup state
  const [livingRating, setLivingRating] = useState<string>("GOOD");
  const [safetyRating, setSafetyRating] = useState<string>("SAFE");
  const [schoolingStatus, setSchoolingStatus] = useState("Enrolled & Attending");
  const [healthStatus, setHealthStatus] = useState("Good general health and nutrition");
  const [riskFlagsInput, setRiskFlagsInput] = useState("");
  const [remarks, setRemarks] = useState("");
  const [recommendation, setRecommendation] = useState("CONTINUE_ADERA");

  // Convert state
  const [targetStatus, setTargetStatus] = useState<AderaStatus>("CONVERTED_TO_GUARDIANSHIP");
  const [convertNotes, setConvertNotes] = useState("");

  const record: AderaCustodyRecord | undefined = aderaData || child.aderaCustody || undefined;

  const handleFormalize = async () => {
    if (!custodianId || !reason) return;
    await formalizeMutation.mutateAsync({
      custodianId: Number(custodianId),
      relationshipToChild: relationship || undefined,
      reasonForAdera: reason,
      custodyAgreementDocUrl: agreementDocUrl || undefined,
      monthlyStipend: monthlyStipend ? Number(monthlyStipend) : undefined,
      isCourtApproved,
      notes: formalizeNotes || undefined,
    });
    setIsFormalizeOpen(false);
  };

  const handleRecordCheckup = async () => {
    if (!remarks || !schoolingStatus || !healthStatus) return;
    const flags = riskFlagsInput
      ? riskFlagsInput.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    await checkupMutation.mutateAsync({
      livingConditionRating: livingRating,
      safetyAssessment: safetyRating,
      childSchoolingStatus: schoolingStatus,
      childHealthStatus: healthStatus,
      riskFlags: flags,
      socialWorkerRemarks: remarks,
      safetyRecommendation: recommendation,
    });
    setIsCheckupOpen(false);
    setRemarks("");
    setRiskFlagsInput("");
  };

  const handleConvertStatus = async () => {
    await convertMutation.mutateAsync({
      targetStatus,
      notes: convertNotes || undefined,
    });
    setIsConvertOpen(false);
  };

  return (
    <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
      <CardHeader className="bg-[#F7F8FA] border-b border-[#E3E7EB] py-3.5 px-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xs bg-[#1769AA]/10 text-[#1769AA] flex items-center justify-center">
              <HeartHandshake className="size-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wide font-mono">
                {t("title")}
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                {t("subtitle")}
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!record ? (
              <Button
                size="sm"
                onClick={() => setIsFormalizeOpen(true)}
                className="h-8 text-xs font-semibold rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white gap-1.5 cursor-pointer shadow-2xs"
              >
                <UserCheck className="size-3.5" />
                {t("buttons.formalize")}
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsConvertOpen(true)}
                  className="h-8 text-xs font-semibold rounded-xs border-[#BCD5EA] text-[#1769AA] hover:bg-[#E8F2FA] gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="size-3.5" />
                  {t("buttons.convert")}
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsCheckupOpen(true)}
                  className="h-8 text-xs font-semibold rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Home className="size-3.5" />
                  {t("buttons.recordVisit")}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        {!record ? (
          <div className="text-center py-8 text-slate-400 bg-[#F7F8FA] border border-dashed border-[#E3E7EB] rounded-xs">
            <HeartHandshake className="size-8 mx-auto mb-2 opacity-40 text-slate-400" />
            <p className="text-xs font-medium text-slate-600">
              {t("emptyTitle")}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-md mx-auto">
              {t("emptyDesc")}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status and Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-3 bg-[#F7F8FA] border border-[#E3E7EB] rounded-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  {t("summary.legalStatus")}
                </span>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <Badge
                    variant="outline"
                    className={`text-xs font-bold ${
                      record.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                        : record.status === "UNDER_SAFETY_REVIEW"
                        ? "bg-amber-50 text-amber-700 border-amber-300"
                        : "bg-blue-50 text-blue-700 border-blue-300"
                    }`}
                  >
                    {record.status === "ACTIVE"
                      ? t("summary.statusActive")
                      : record.status === "UNDER_SAFETY_REVIEW"
                      ? t("summary.statusReview")
                      : t("summary.statusConverted")}
                  </Badge>
                </div>
              </div>

              <div className="p-3 bg-[#F7F8FA] border border-[#E3E7EB] rounded-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  {t("summary.custodian")}
                </span>
                <p className="text-xs font-bold text-[#0B1F3A]">
                  {record.custodian ? `${record.custodian.firstName} ${record.custodian.lastName}` : `Client #${record.custodianId}`}
                </p>
                <p className="text-[11px] text-slate-500">
                  Rel: {record.relationshipToChild || t("summary.informalGuardian")}
                </p>
              </div>

              <div className="p-3 bg-[#F7F8FA] border border-[#E3E7EB] rounded-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  {t("summary.monthlyStipend")}
                </span>
                <p className="text-xs font-bold text-[#0B1F3A]">
                  {record.monthlyStipend ? `${record.monthlyStipend} ETB` : t("summary.none")}
                </p>
                <p className="text-[11px] text-slate-500">
                  {record.isCourtApproved ? t("summary.courtEndorsed") : t("summary.bureauMonitored")}
                </p>
              </div>

              <div className="p-3 bg-[#F7F8FA] border border-[#E3E7EB] rounded-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  {t("summary.nextHomeVisitDue")}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-[#1769AA] pt-0.5">
                  <Clock className="size-3.5" />
                  {record.nextCheckupDue ? new Date(record.nextCheckupDue).toLocaleDateString() : t("summary.noCheckupYet")}
                </div>
                <p className="text-[11px] text-slate-400">{t("summary.mandatoryInspection")}</p>
              </div>
            </div>

            {/* Checkup Visits Timeline */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#E3E7EB] pb-2">
                <h4 className="text-xs font-bold text-[#0B1F3A] uppercase font-mono tracking-wide">
                  {t("checkups.historyTitle", { count: record.welfareCheckups?.length || 0 })}
                </h4>
              </div>

              {record.welfareCheckups && record.welfareCheckups.length > 0 ? (
                <div className="space-y-3">
                  {record.welfareCheckups.map((visit) => (
                    <div
                      key={visit.id}
                      className="p-4 bg-[#F7F8FA] border border-[#E3E7EB] rounded-xs space-y-2.5 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] font-mono bg-white">
                            {t("checkups.visitDate", { date: new Date(visit.visitDate).toLocaleDateString() })}
                          </Badge>
                          <Badge
                            className={
                              visit.safetyAssessment === "SAFE"
                                ? "bg-emerald-600 text-white text-[10px]"
                                : "bg-rose-600 text-white text-[10px]"
                            }
                          >
                            {t("checkups.safety", { assessment: t(`dialogs.checkup.safetyRatings.${visit.safetyAssessment}` as any) || visit.safetyAssessment })}
                          </Badge>
                          <Badge variant="secondary" className="text-[10px]">
                            {t("checkups.living", { rating: t(`dialogs.checkup.livingRatings.${visit.livingConditionRating}` as any) || visit.livingConditionRating })}
                          </Badge>
                        </div>
                        {visit.visitedBy && (
                          <span className="text-[11px] text-slate-500">
                            {t("checkups.inspectedBy", { name: `${visit.visitedBy.firstName} ${visit.visitedBy.lastName}` })}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-xs border border-slate-200">
                        <div>
                          <strong>{t("checkups.schooling")}</strong> {visit.childSchoolingStatus}
                        </div>
                        <div>
                          <strong>{t("checkups.health")}</strong> {visit.childHealthStatus}
                        </div>
                      </div>

                      {visit.riskFlags && (visit.riskFlags as string[]).length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] font-semibold text-rose-600">{t("checkups.riskFlags")}</span>
                          {(visit.riskFlags as string[]).map((rf, i) => (
                            <Badge key={i} variant="destructive" className="text-[10px] py-0 px-1.5">
                              {rf}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="text-[11px] text-slate-700 bg-white p-2.5 rounded-xs border border-slate-200 space-y-1">
                        <p>
                          <strong>{t("checkups.observations")}</strong> {visit.socialWorkerRemarks}
                        </p>
                        <p className="text-[#1769AA] font-semibold">
                          {t("checkups.recommendation", { rec: visit.safetyRecommendation })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 bg-[#F7F8FA] border border-dashed border-[#E3E7EB] rounded-xs">
                  <Home className="size-6 mx-auto mb-1 opacity-40 text-slate-400" />
                  <p className="text-xs">{t("checkups.empty")}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {/* Formalize Dialog */}
      <Dialog open={isFormalizeOpen} onOpenChange={setIsFormalizeOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#0B1F3A]">
              {t("dialogs.formalize.title")}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {t("dialogs.formalize.desc")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">{t("dialogs.formalize.clientId")}</Label>
              <Input
                placeholder="e.g. 45"
                value={custodianId}
                onChange={(e) => setCustodianId(e.target.value)}
                className="h-8 text-xs rounded-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">{t("dialogs.formalize.relationship")}</Label>
              <Input
                placeholder="e.g. Neighbor, Distant Aunt, Godparent"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="h-8 text-xs rounded-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">{t("dialogs.formalize.reason")}</Label>
              <Textarea
                placeholder={t("dialogs.formalize.reasonPlaceholder")}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="text-xs rounded-xs h-16"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">{t("dialogs.formalize.stipend")}</Label>
                <Input
                  type="number"
                  placeholder="e.g. 1500"
                  value={monthlyStipend}
                  onChange={(e) => setMonthlyStipend(e.target.value)}
                  className="h-8 text-xs rounded-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">{t("dialogs.formalize.docUrl")}</Label>
                <Input
                  placeholder="https://..."
                  value={agreementDocUrl}
                  onChange={(e) => setAgreementDocUrl(e.target.value)}
                  className="h-8 text-xs rounded-xs"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFormalizeOpen(false)}
              className="h-8 text-xs rounded-xs"
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              size="sm"
              onClick={handleFormalize}
              disabled={formalizeMutation.isPending || !custodianId || !reason}
              className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white"
            >
              {formalizeMutation.isPending ? t("dialogs.formalize.submitting") : t("dialogs.formalize.submit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Home Visit Dialog */}
      <Dialog open={isCheckupOpen} onOpenChange={setIsCheckupOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#0B1F3A]">
              {t("dialogs.checkup.title")}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {t("dialogs.checkup.desc")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">{t("dialogs.checkup.livingRating")}</Label>
                <Select value={livingRating} onValueChange={setLivingRating}>
                  <SelectTrigger className="h-8 text-xs rounded-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXCELLENT">{t("dialogs.checkup.livingRatings.EXCELLENT")}</SelectItem>
                    <SelectItem value="GOOD">{t("dialogs.checkup.livingRatings.GOOD")}</SelectItem>
                    <SelectItem value="SATISFACTORY">{t("dialogs.checkup.livingRatings.SATISFACTORY")}</SelectItem>
                    <SelectItem value="NEEDS_IMPROVEMENT">{t("dialogs.checkup.livingRatings.NEEDS_IMPROVEMENT")}</SelectItem>
                    <SelectItem value="CRITICAL">{t("dialogs.checkup.livingRatings.CRITICAL")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">{t("dialogs.checkup.safetyAssessment")}</Label>
                <Select value={safetyRating} onValueChange={setSafetyRating}>
                  <SelectTrigger className="h-8 text-xs rounded-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SAFE">{t("dialogs.checkup.safetyRatings.SAFE")}</SelectItem>
                    <SelectItem value="MINOR_CONCERNS">{t("dialogs.checkup.safetyRatings.MINOR_CONCERNS")}</SelectItem>
                    <SelectItem value="MAJOR_CONCERNS">{t("dialogs.checkup.safetyRatings.MAJOR_CONCERNS")}</SelectItem>
                    <SelectItem value="UNSAFE">{t("dialogs.checkup.safetyRatings.UNSAFE")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">{t("dialogs.checkup.schooling")}</Label>
              <Input
                value={schoolingStatus}
                onChange={(e) => setSchoolingStatus(e.target.value)}
                placeholder={t("dialogs.checkup.schoolingPlaceholder")}
                className="h-8 text-xs rounded-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">{t("dialogs.checkup.health")}</Label>
              <Input
                value={healthStatus}
                onChange={(e) => setHealthStatus(e.target.value)}
                placeholder={t("dialogs.checkup.healthPlaceholder")}
                className="h-8 text-xs rounded-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">{t("dialogs.checkup.riskFlags")}</Label>
              <Input
                value={riskFlagsInput}
                onChange={(e) => setRiskFlagsInput(e.target.value)}
                placeholder={t("dialogs.checkup.riskFlagsPlaceholder")}
                className="h-8 text-xs rounded-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">{t("dialogs.checkup.remarks")}</Label>
              <Textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder={t("dialogs.checkup.remarksPlaceholder")}
                className="text-xs rounded-xs h-16"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCheckupOpen(false)}
              className="h-8 text-xs rounded-xs"
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              size="sm"
              onClick={handleRecordCheckup}
              disabled={checkupMutation.isPending || !remarks}
              className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white"
            >
              {checkupMutation.isPending ? t("dialogs.checkup.submitting") : t("dialogs.checkup.submit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Convert Legal Status Dialog */}
      <Dialog open={isConvertOpen} onOpenChange={setIsConvertOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#0B1F3A]">
              {t("dialogs.convert.title")}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {t("dialogs.convert.desc")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">{t("dialogs.convert.targetStatus")}</Label>
              <Select
                value={targetStatus}
                onValueChange={(v: AderaStatus) => setTargetStatus(v)}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONVERTED_TO_GUARDIANSHIP">
                    {t("dialogs.convert.statuses.CONVERTED_TO_GUARDIANSHIP")}
                  </SelectItem>
                  <SelectItem value="CONVERTED_TO_ADOPTION">
                    {t("dialogs.convert.statuses.CONVERTED_TO_ADOPTION")}
                  </SelectItem>
                  <SelectItem value="UNDER_SAFETY_REVIEW">
                    {t("dialogs.convert.statuses.UNDER_SAFETY_REVIEW")}
                  </SelectItem>
                  <SelectItem value="TERMINATED">
                    {t("dialogs.convert.statuses.TERMINATED")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">{t("dialogs.convert.notes")}</Label>
              <Textarea
                value={convertNotes}
                onChange={(e) => setConvertNotes(e.target.value)}
                placeholder={t("dialogs.convert.notesPlaceholder")}
                className="text-xs rounded-xs h-20"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConvertOpen(false)}
              className="h-8 text-xs rounded-xs"
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              size="sm"
              onClick={handleConvertStatus}
              disabled={convertMutation.isPending}
              className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white"
            >
              {convertMutation.isPending ? t("dialogs.convert.submitting") : t("dialogs.convert.submit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
