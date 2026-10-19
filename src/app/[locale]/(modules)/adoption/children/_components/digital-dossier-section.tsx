"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Activity,
  AlertCircle,
  Calendar,
  Camera,
  CheckCircle2,
  FileSearch,
  FileText,
  HeartPulse,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Radio,
  Sparkles,
  Stethoscope,
  Syringe,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAddDevelopmentMilestone,
  useAddFamilyTracingLog,
  useAddGrowthPhoto,
  useUpsertMedicalRecord,
} from "@/hooks/adoption/useChildDetails";
import {
  Child,
  MilestoneType,
  MilestoneStatus,
  TracingMethod,
  TracingOutcome,
} from "@/types/child-matching-types";
import { cn } from "@/lib/utils";

interface DigitalDossierSectionProps {
  child: Child;
}

export const DigitalDossierSection: React.FC<DigitalDossierSectionProps> = ({
  child,
}) => {
  const t = useTranslations("adoption.digitalDossier");
  const medical = child.medicalRecord;
  const milestones = child.developmentMilestones || [];
  const photos = child.growthPhotos || [];
  const tracingLogs = child.familyTracingLogs || [];

  // Modal dialog states
  const [isMedicalModalOpen, setIsMedicalModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isTracingModalOpen, setIsTracingModalOpen] = useState(false);

  // Form states: Medical
  const [bloodGroup, setBloodGroup] = useState(medical?.bloodGroup || "");
  const [allergies, setAllergies] = useState(
    Array.isArray(medical?.allergies) ? medical.allergies.join(", ") : ""
  );
  const [chronicConditions, setChronicConditions] = useState(
    Array.isArray(medical?.chronicConditions)
      ? medical.chronicConditions.join(", ")
      : ""
  );
  const [generalHealth, setGeneralHealth] = useState(
    medical?.generalHealthSummary || ""
  );
  const [specialNeeds, setSpecialNeeds] = useState(
    medical?.specialCareNeeds || ""
  );

  // Form states: Milestone
  const [milestoneType, setMilestoneType] = useState<MilestoneType>("COGNITIVE");
  const [ageCategory, setAgeCategory] = useState("1-2 YEARS");
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneStatus, setMilestoneStatus] = useState<MilestoneStatus>("ON_TRACK");
  const [observations, setObservations] = useState("");

  // Form states: Photo
  const [photoUrl, setPhotoUrl] = useState("");
  const [approxAge, setApproxAge] = useState("");
  const [caption, setCaption] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);

  // Form states: Tracing
  const [tracingMethod, setTracingMethod] = useState<TracingMethod>("PUBLIC_BROADCAST");
  const [tracingLocation, setTracingLocation] = useState("");
  const [tracingFindings, setTracingFindings] = useState("");
  const [tracingOutcome, setTracingOutcome] = useState<TracingOutcome>("IN_PROGRESS");

  const medicalMutation = useUpsertMedicalRecord(child.id);
  const milestoneMutation = useAddDevelopmentMilestone(child.id);
  const photoMutation = useAddGrowthPhoto(child.id);
  const tracingMutation = useAddFamilyTracingLog(child.id);

  const handleSaveMedical = async () => {
    await medicalMutation.mutateAsync({
      bloodGroup: bloodGroup.trim() || undefined,
      allergies: allergies
        ? allergies.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      chronicConditions: chronicConditions
        ? chronicConditions.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      generalHealthSummary: generalHealth.trim() || undefined,
      specialCareNeeds: specialNeeds.trim() || undefined,
      lastCheckupDate: new Date().toISOString(),
    });
    setIsMedicalModalOpen(false);
  };

  const handleSaveMilestone = async () => {
    if (!milestoneTitle.trim()) return;
    await milestoneMutation.mutateAsync({
      milestoneType,
      ageCategory,
      milestoneTitle: milestoneTitle.trim(),
      status: milestoneStatus,
      observations: observations.trim() || undefined,
    });
    setIsMilestoneModalOpen(false);
    setMilestoneTitle("");
    setObservations("");
  };

  const handleSavePhoto = async () => {
    if (!photoUrl.trim()) return;
    await photoMutation.mutateAsync({
      photoUrl: photoUrl.trim(),
      approximateAgeMonths: approxAge ? parseInt(approxAge) : undefined,
      caption: caption.trim() || undefined,
      isPrimaryPortrait: isPrimary,
    });
    setIsPhotoModalOpen(false);
    setPhotoUrl("");
    setCaption("");
    setApproxAge("");
    setIsPrimary(false);
  };

  const handleSaveTracing = async () => {
    if (!tracingFindings.trim()) return;
    await tracingMutation.mutateAsync({
      searchMethod: tracingMethod,
      location: tracingLocation.trim() || undefined,
      findings: tracingFindings.trim(),
      outcome: tracingOutcome,
    });
    setIsTracingModalOpen(false);
    setTracingLocation("");
    setTracingFindings("");
  };

  return (
    <>
      <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
        <CardHeader className="bg-[#F7F8FA] border-b border-[#E3E7EB] py-3 px-4">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A] flex items-center gap-2 font-mono">
            <Sparkles className="size-3.5 text-[#1769AA]" />
            {t("title")}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4">
          <Tabs defaultValue="medical" className="w-full">
            <TabsList className="bg-[#F7F8FA] border border-[#E3E7EB] p-1 rounded-xs flex flex-wrap gap-1 h-auto mb-4">
              <TabsTrigger
                value="medical"
                className="text-xs py-1.5 px-3 data-[state=active]:bg-[#0B1F3A] data-[state=active]:text-white rounded-xs font-semibold cursor-pointer"
              >
                <Stethoscope className="w-3.5 h-3.5 mr-1.5" />
                {t("tabs.medical")}
              </TabsTrigger>
              <TabsTrigger
                value="milestones"
                className="text-xs py-1.5 px-3 data-[state=active]:bg-[#0B1F3A] data-[state=active]:text-white rounded-xs font-semibold cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5 mr-1.5" />
                {t("tabs.milestones", { count: milestones.length })}
              </TabsTrigger>
              <TabsTrigger
                value="photos"
                className="text-xs py-1.5 px-3 data-[state=active]:bg-[#0B1F3A] data-[state=active]:text-white rounded-xs font-semibold cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5 mr-1.5" />
                {t("tabs.photos", { count: photos.length })}
              </TabsTrigger>
              <TabsTrigger
                value="tracing"
                className="text-xs py-1.5 px-3 data-[state=active]:bg-[#0B1F3A] data-[state=active]:text-white rounded-xs font-semibold cursor-pointer"
              >
                <FileSearch className="w-3.5 h-3.5 mr-1.5" />
                {t("tabs.tracing", { count: tracingLogs.length })}
              </TabsTrigger>
            </TabsList>

            {/* ── 1. Medical Tab ────────────────────────────────────────────── */}
            <TabsContent value="medical" className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {t("medical.subtitle")}
                </span>
                <Button
                  size="sm"
                  onClick={() => setIsMedicalModalOpen(true)}
                  className="h-7 text-xs bg-[#0B1F3A] hover:bg-[#122D52] text-white rounded-xs font-semibold cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5 mr-1" />
                  {t("buttons.editMedical")}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-[#F7F8FA] border border-[#E3E7EB] p-3 rounded-xs">
                  <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block mb-1">
                    {t("medical.bloodGroup")}
                  </span>
                  <span className="text-sm font-bold text-[#0B1F3A] font-mono">
                    {medical?.bloodGroup || t("medical.notTyped")}
                  </span>
                </div>

                <div className="bg-[#F7F8FA] border border-[#E3E7EB] p-3 rounded-xs">
                  <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block mb-1">
                    {t("medical.allergies")}
                  </span>
                  {Array.isArray(medical?.allergies) && medical.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {medical.allergies.map((a: string, i: number) => (
                        <span
                          key={i}
                          className="bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded-xs text-[10px] font-semibold"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-500 italic">{t("medical.noneReported")}</span>
                  )}
                </div>

                <div className="bg-[#F7F8FA] border border-[#E3E7EB] p-3 rounded-xs">
                  <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block mb-1">
                    {t("medical.chronicConditions")}
                  </span>
                  {Array.isArray(medical?.chronicConditions) &&
                  medical.chronicConditions.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {medical.chronicConditions.map((c: string, i: number) => (
                        <span
                          key={i}
                          className="bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded-xs text-[10px] font-semibold"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-500 italic">{t("medical.noneReported")}</span>
                  )}
                </div>
              </div>

              <div className="bg-[#F7F8FA] border border-[#E3E7EB] p-3.5 rounded-xs text-xs space-y-2">
                <div>
                  <span className="text-[11px] font-mono text-slate-500 uppercase font-bold block mb-0.5">
                    {t("medical.generalHealthTitle")}
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {medical?.generalHealthSummary ||
                      t("medical.generalHealthDefault")}
                  </p>
                </div>

                {medical?.specialCareNeeds && (
                  <div className="pt-2 border-t border-[#E3E7EB]">
                    <span className="text-[11px] font-mono text-amber-800 uppercase font-bold block mb-0.5">
                      {t("medical.specialCareTitle")}
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {medical.specialCareNeeds}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* ── 2. Milestones Tab ─────────────────────────────────────────── */}
            <TabsContent value="milestones" className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {t("milestones.subtitle")}
                </span>
                <Button
                  size="sm"
                  onClick={() => setIsMilestoneModalOpen(true)}
                  className="h-7 text-xs bg-[#0B1F3A] hover:bg-[#122D52] text-white rounded-xs font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  {t("buttons.addMilestone")}
                </Button>
              </div>

              {milestones.length > 0 ? (
                <div className="space-y-2">
                  {milestones.map((m) => (
                    <div
                      key={m.id}
                      className="bg-[#F7F8FA] border border-[#E3E7EB] p-3 rounded-xs text-xs flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-[#0B1F3A]">
                            {m.milestoneTitle}
                          </span>
                          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-xs bg-[#E8F2FA] text-[#1769AA] border border-[#BCD5EA]">
                            {t(`milestones.types.${m.milestoneType}` as any) || m.milestoneType}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-xs bg-slate-200 text-slate-700">
                            {t("milestones.age", { age: m.ageCategory })}
                          </span>
                        </div>
                        {m.observations && (
                          <p className="text-slate-600 leading-relaxed">
                            {m.observations}
                          </p>
                        )}
                        <span className="text-[11px] text-slate-400 block pt-0.5">
                          {t("milestones.assessedOn", { date: new Date(m.assessmentDate).toLocaleDateString() })}
                          {m.evaluator &&
                            ` ${t("milestones.assessedBy", { name: `${m.evaluator.firstName} ${m.evaluator.lastName}` })}`}
                        </span>
                      </div>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-xs text-[10px] font-bold font-mono shrink-0",
                          m.status === "ON_TRACK"
                            ? "bg-emerald-100 text-emerald-800"
                            : m.status === "ADVANCED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        )}
                      >
                        {t(`milestones.statuses.${m.status}` as any) || m.status.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <Activity className="w-8 h-8 mx-auto mb-1 opacity-40 text-slate-300" />
                  <p className="text-xs font-medium text-slate-600">
                    {t("milestones.empty")}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* ── 3. Photos Tab ─────────────────────────────────────────────── */}
            <TabsContent value="photos" className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {t("photos.subtitle")}
                </span>
                <Button
                  size="sm"
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="h-7 text-xs bg-[#0B1F3A] hover:bg-[#122D52] text-white rounded-xs font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  {t("buttons.addPhoto")}
                </Button>
              </div>

              {photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {photos.map((p) => (
                    <div
                      key={p.id}
                      className="border border-[#E3E7EB] rounded-xs overflow-hidden bg-[#F7F8FA] group relative text-xs"
                    >
                      <div className="aspect-square bg-slate-200 relative overflow-hidden flex items-center justify-center">
                        <img
                          src={p.photoUrl}
                          alt={p.caption || "Child growth portrait"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                        <Camera className="w-8 h-8 text-slate-400 absolute opacity-30 pointer-events-none" />
                        {p.isPrimaryPortrait && (
                          <span className="absolute top-1.5 left-1.5 bg-[#0B1F3A] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs font-mono shadow-xs">
                            {t("photos.primaryPortrait")}
                          </span>
                        )}
                      </div>
                      <div className="p-2 space-y-0.5">
                        <span className="font-bold text-[#0B1F3A] block truncate">
                          {p.approximateAgeMonths
                            ? t("photos.monthsOld", { months: p.approximateAgeMonths })
                            : new Date(p.photoDate).toLocaleDateString()}
                        </span>
                        {p.caption && (
                          <p className="text-[11px] text-slate-500 truncate">
                            {p.caption}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-40 text-slate-300" />
                  <p className="text-xs font-medium text-slate-600">
                    {t("photos.empty")}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* ── 4. Family Tracing Tab ─────────────────────────────────────── */}
            <TabsContent value="tracing" className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {t("tracing.subtitle")}
                </span>
                <Button
                  size="sm"
                  onClick={() => setIsTracingModalOpen(true)}
                  className="h-7 text-xs bg-[#0B1F3A] hover:bg-[#122D52] text-white rounded-xs font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  {t("buttons.logTracing")}
                </Button>
              </div>

              {tracingLogs.length > 0 ? (
                <div className="space-y-2">
                  {tracingLogs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-[#F7F8FA] border border-[#E3E7EB] p-3 rounded-xs text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#0B1F3A] font-mono">
                            {t(`tracing.methods.${log.searchMethod}` as any) || log.searchMethod.replace("_", " ")}
                          </span>
                          {log.location && (
                            <span className="text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {log.location}
                            </span>
                          )}
                        </div>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-xs text-[10px] font-bold font-mono",
                            log.outcome === "PARENTS_LOCATED"
                              ? "bg-emerald-100 text-emerald-800"
                              : log.outcome === "UNTRACEABLE"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          )}
                        >
                          {t(`tracing.outcomes.${log.outcome}` as any) || log.outcome.replace("_", " ")}
                        </span>
                      </div>

                      <p className="text-slate-700 leading-relaxed">
                        {log.findings}
                      </p>

                      <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between">
                        <span>
                          {t("tracing.conductedOn", { date: new Date(log.conductedAt).toLocaleDateString() })}
                        </span>
                        {log.investigator && (
                          <span>
                            {t("tracing.investigator", { name: `${log.investigator.firstName} ${log.investigator.lastName}` })}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <FileSearch className="w-8 h-8 mx-auto mb-1 opacity-40 text-slate-300" />
                  <p className="text-xs font-medium text-slate-600">
                    {t("tracing.empty")}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* ── Dialog: Edit Medical Record ────────────────────────────────────── */}
      <Dialog open={isMedicalModalOpen} onOpenChange={setIsMedicalModalOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-xs">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-[#0B1F3A] flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#1769AA]" />
              {t("medical.dialogTitle")}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {t("medical.dialogDesc")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs font-semibold">{t("medical.bloodGroup")}</Label>
              <Input
                placeholder={t("medical.bloodGroupPlaceholder")}
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="text-xs rounded-xs mt-1 h-8"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">{t("medical.allergiesLabel")}</Label>
              <Input
                placeholder={t("medical.allergiesPlaceholder")}
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="text-xs rounded-xs mt-1 h-8"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">{t("medical.chronicLabel")}</Label>
              <Input
                placeholder={t("medical.chronicPlaceholder")}
                value={chronicConditions}
                onChange={(e) => setChronicConditions(e.target.value)}
                className="text-xs rounded-xs mt-1 h-8"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">{t("medical.generalHealthLabel")}</Label>
              <Textarea
                rows={2}
                placeholder={t("medical.generalHealthPlaceholder")}
                value={generalHealth}
                onChange={(e) => setGeneralHealth(e.target.value)}
                className="text-xs rounded-xs mt-1"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">{t("medical.specialCareLabel")}</Label>
              <Input
                placeholder={t("medical.specialCarePlaceholder")}
                value={specialNeeds}
                onChange={(e) => setSpecialNeeds(e.target.value)}
                className="text-xs rounded-xs mt-1 h-8"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsMedicalModalOpen(false)}
              className="text-xs rounded-xs"
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={medicalMutation.isPending}
              onClick={handleSaveMedical}
              className="text-xs bg-[#0B1F3A] hover:bg-[#122D52] text-white rounded-xs font-semibold"
            >
              {medicalMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
              )}
              {t("buttons.saveMedical")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Add Development Milestone ──────────────────────────────── */}
      <Dialog open={isMilestoneModalOpen} onOpenChange={setIsMilestoneModalOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-xs">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-[#0B1F3A] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#1769AA]" />
              {t("milestones.dialogTitle")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-semibold">{t("milestones.categoryLabel")}</Label>
                <Select
                  value={milestoneType}
                  onValueChange={(val) => setMilestoneType(val as MilestoneType)}
                >
                  <SelectTrigger className="text-xs rounded-xs mt-1 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MOTOR">{t("milestones.types.MOTOR")}</SelectItem>
                    <SelectItem value="COGNITIVE">{t("milestones.types.COGNITIVE")}</SelectItem>
                    <SelectItem value="LANGUAGE">{t("milestones.types.LANGUAGE")}</SelectItem>
                    <SelectItem value="SOCIAL_EMOTIONAL">{t("milestones.types.SOCIAL_EMOTIONAL")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold">{t("milestones.statusLabel")}</Label>
                <Select
                  value={milestoneStatus}
                  onValueChange={(val) => setMilestoneStatus(val as MilestoneStatus)}
                >
                  <SelectTrigger className="text-xs rounded-xs mt-1 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ON_TRACK">{t("milestones.statuses.ON_TRACK")}</SelectItem>
                    <SelectItem value="ADVANCED">{t("milestones.statuses.ADVANCED")}</SelectItem>
                    <SelectItem value="DELAYED">{t("milestones.statuses.DELAYED")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold">{t("milestones.ageBracketLabel")}</Label>
              <Input
                placeholder={t("milestones.ageBracketPlaceholder")}
                value={ageCategory}
                onChange={(e) => setAgeCategory(e.target.value)}
                className="text-xs rounded-xs mt-1 h-8"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">{t("milestones.titleLabel")}</Label>
              <Input
                placeholder={t("milestones.titlePlaceholder")}
                value={milestoneTitle}
                onChange={(e) => setMilestoneTitle(e.target.value)}
                className="text-xs rounded-xs mt-1 h-8"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">{t("milestones.observationsLabel")}</Label>
              <Textarea
                rows={2}
                placeholder={t("milestones.observationsPlaceholder")}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="text-xs rounded-xs mt-1"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsMilestoneModalOpen(false)}
              className="text-xs rounded-xs"
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!milestoneTitle.trim() || milestoneMutation.isPending}
              onClick={handleSaveMilestone}
              className="text-xs bg-[#0B1F3A] hover:bg-[#122D52] text-white rounded-xs font-semibold"
            >
              {milestoneMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
              )}
              {t("buttons.saveMilestone")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Add Growth Photo ───────────────────────────────────────── */}
      <Dialog open={isPhotoModalOpen} onOpenChange={setIsPhotoModalOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-xs">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-[#0B1F3A] flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#1769AA]" />
              {t("photos.dialogTitle")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs font-semibold">{t("photos.urlLabel")}</Label>
              <Input
                placeholder={t("photos.urlPlaceholder")}
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="text-xs rounded-xs mt-1 h-8"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">{t("photos.ageLabel")}</Label>
              <Input
                type="number"
                placeholder={t("photos.agePlaceholder")}
                value={approxAge}
                onChange={(e) => setApproxAge(e.target.value)}
                className="text-xs rounded-xs mt-1 h-8"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">{t("photos.captionLabel")}</Label>
              <Input
                placeholder={t("photos.captionPlaceholder")}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="text-xs rounded-xs mt-1 h-8"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isPrimary"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="rounded-xs"
              />
              <Label htmlFor="isPrimary" className="text-xs font-medium cursor-pointer">
                {t("photos.primaryCheckbox")}
              </Label>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPhotoModalOpen(false)}
              className="text-xs rounded-xs"
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!photoUrl.trim() || photoMutation.isPending}
              onClick={handleSavePhoto}
              className="text-xs bg-[#0B1F3A] hover:bg-[#122D52] text-white rounded-xs font-semibold"
            >
              {photoMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
              )}
              {t("buttons.savePhoto")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Add Family Tracing Log ─────────────────────────────────── */}
      <Dialog open={isTracingModalOpen} onOpenChange={setIsTracingModalOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-xs">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-[#0B1F3A] flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-[#1769AA]" />
              {t("tracing.dialogTitle")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-semibold">{t("tracing.methodLabel")}</Label>
                <Select
                  value={tracingMethod}
                  onValueChange={(val) => setTracingMethod(val as TracingMethod)}
                >
                  <SelectTrigger className="text-xs rounded-xs mt-1 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUBLIC_BROADCAST">{t("tracing.methods.PUBLIC_BROADCAST")}</SelectItem>
                    <SelectItem value="POLICE_REPORT">{t("tracing.methods.POLICE_REPORT")}</SelectItem>
                    <SelectItem value="COMMUNITY_INQUIRY">{t("tracing.methods.COMMUNITY_INQUIRY")}</SelectItem>
                    <SelectItem value="DATABASE_CROSSMATCH">{t("tracing.methods.DATABASE_CROSSMATCH")}</SelectItem>
                    <SelectItem value="PHYSICAL_SEARCH">{t("tracing.methods.PHYSICAL_SEARCH")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold">{t("tracing.outcomeLabel")}</Label>
                <Select
                  value={tracingOutcome}
                  onValueChange={(val) => setTracingOutcome(val as TracingOutcome)}
                >
                  <SelectTrigger className="text-xs rounded-xs mt-1 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN_PROGRESS">{t("tracing.outcomes.IN_PROGRESS")}</SelectItem>
                    <SelectItem value="PARENTS_LOCATED">{t("tracing.outcomes.PARENTS_LOCATED")}</SelectItem>
                    <SelectItem value="DECEASED">{t("tracing.outcomes.DECEASED")}</SelectItem>
                    <SelectItem value="UNTRACEABLE">{t("tracing.outcomes.UNTRACEABLE")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold">{t("tracing.locationLabel")}</Label>
              <Input
                placeholder={t("tracing.locationPlaceholder")}
                value={tracingLocation}
                onChange={(e) => setTracingLocation(e.target.value)}
                className="text-xs rounded-xs mt-1 h-8"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">{t("tracing.findingsLabel")}</Label>
              <Textarea
                rows={3}
                placeholder={t("tracing.findingsPlaceholder")}
                value={tracingFindings}
                onChange={(e) => setTracingFindings(e.target.value)}
                className="text-xs rounded-xs mt-1"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsTracingModalOpen(false)}
              className="text-xs rounded-xs"
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!tracingFindings.trim() || tracingMutation.isPending}
              onClick={handleSaveTracing}
              className="text-xs bg-[#0B1F3A] hover:bg-[#122D52] text-white rounded-xs font-semibold"
            >
              {tracingMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
              )}
              {t("buttons.saveTracing")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
