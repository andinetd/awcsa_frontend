"use client";

import React, { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck2,
  FileText,
  Heart,
  Loader2,
  Plus,
  Scale,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";
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
  useClearChildForAdoption,
  useCreateCarePlan,
} from "@/hooks/adoption/useChildDetails";
import { Child, ChildCarePlan, CarePlanGoal } from "@/types/child-matching-types";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface CarePlanSectionProps {
  child: Child;
}

const GOAL_KEYS: CarePlanGoal[] = [
  "REUNIFICATION",
  "KINSHIP_CARE",
  "ADOPTION",
  "FOSTER_CARE",
  "INDEPENDENT_LIVING",
];

export const CarePlanSection: React.FC<CarePlanSectionProps> = ({ child }) => {
  const t = useTranslations("adoption.carePlan");
  const activePlan = child.carePlans?.find((p) => p.status === "ACTIVE") || child.carePlans?.[0];

  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  // Form states for Clear For Adoption
  const [effortDetails, setEffortDetails] = useState("");
  const [courtOrder, setCourtOrder] = useState("");
  const [clearNotes, setClearNotes] = useState("");

  // Form states for New Care Plan
  const [primaryGoal, setPrimaryGoal] = useState<CarePlanGoal>("REUNIFICATION");
  const [secondaryGoal, setSecondaryGoal] = useState<string>("KINSHIP_CARE");
  const [reviewDate, setReviewDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toISOString().split("T")[0];
  });
  const [planNotes, setPlanNotes] = useState("");
  const [effortNotes, setEffortNotes] = useState("");

  const clearMutation = useClearChildForAdoption(child.id);
  const planMutation = useCreateCarePlan(child.id);

  const handleClearAdoption = async () => {
    if (!effortDetails.trim()) return;
    await clearMutation.mutateAsync({
      reunificationEffortDetails: effortDetails.trim(),
      courtOrderNumber: courtOrder.trim() || undefined,
      notes: clearNotes.trim() || undefined,
    });
    setIsClearModalOpen(false);
  };

  const handleCreatePlan = async () => {
    await planMutation.mutateAsync({
      primaryGoal,
      secondaryGoal: secondaryGoal || undefined,
      nextReviewDue: new Date(reviewDate).toISOString(),
      notes: planNotes.trim() || undefined,
      reunificationEffortDetails: effortNotes.trim() || undefined,
    });
    setIsPlanModalOpen(false);
  };

  const isCleared = activePlan?.reunificationExhausted && activePlan?.clearedForAdoptionDate;

  return (
    <>
      <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
        <CardHeader className="bg-[#F7F8FA] border-b border-[#E3E7EB] py-3 px-4 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A] flex items-center gap-2 font-mono">
            <Scale className="size-3.5 text-[#1769AA]" />
            {t("title")}
          </CardTitle>
          <div className="flex items-center gap-2">
            {!isCleared && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsClearModalOpen(true)}
                className="h-7 text-xs border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 rounded-xs font-semibold cursor-pointer"
              >
                <FileCheck2 className="w-3.5 h-3.5 mr-1 text-amber-700" />
                {t("buttons.clearForAdoption")}
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => setIsPlanModalOpen(true)}
              className="h-7 text-xs bg-[#0B1F3A] hover:bg-[#122D52] text-white rounded-xs font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              {activePlan ? t("buttons.updatePlan") : t("buttons.createPlan")}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-3 px-4 pb-4">
          {activePlan ? (
            <div className="space-y-3">
              {/* Policy Status Badge */}
              <div
                className={cn(
                  "p-3 rounded-xs border flex items-start gap-3",
                  isCleared
                    ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                    : "bg-amber-50/70 border-amber-200 text-amber-950"
                )}
              >
                {isCleared ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="text-xs flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <p className="font-bold text-sm">
                      {isCleared
                        ? t("status.clearedTitle")
                        : t("status.activeTracingTitle")}
                    </p>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded-xs font-semibold bg-white/80 border border-current">
                      {t("status.statusLabel", { status: activePlan.status })}
                    </span>
                  </div>
                  <p className="mt-1 leading-relaxed text-slate-700">
                    {isCleared
                      ? t("status.clearedDesc", {
                          date: new Date(
                            activePlan.clearedForAdoptionDate!
                          ).toLocaleDateString(),
                        })
                      : t("status.activeTracingDesc")}
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="bg-[#F7F8FA] border border-[#E3E7EB] p-3 rounded-xs space-y-1">
                  <span className="text-[11px] font-mono text-slate-500 uppercase font-semibold">
                    {t("fields.primaryGoal")}
                  </span>
                  <p className="font-bold text-[#0B1F3A] text-sm">
                    {t(`goals.${activePlan.primaryGoal}` as any) || activePlan.primaryGoal}
                  </p>
                  {activePlan.secondaryGoal && (
                    <p className="text-[11px] text-slate-600">
                      {t("fields.secondaryGoal", {
                        goal: t(`goals.${activePlan.secondaryGoal}` as any) || activePlan.secondaryGoal,
                      })}
                    </p>
                  )}
                </div>

                <div className="bg-[#F7F8FA] border border-[#E3E7EB] p-3 rounded-xs space-y-1">
                  <span className="text-[11px] font-mono text-slate-500 uppercase font-semibold">
                    {t("fields.caseworker")}
                  </span>
                  <p className="font-bold text-[#0B1F3A]">
                    {activePlan.assignedWorker
                      ? `${activePlan.assignedWorker.firstName} ${activePlan.assignedWorker.lastName}`
                      : t("fields.defaultWorker")}
                  </p>
                  <p className="text-[11px] text-slate-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {t("fields.nextReview", {
                      date: new Date(activePlan.nextReviewDue).toLocaleDateString(),
                    })}
                  </p>
                </div>
              </div>

              {/* Tracing Documentation */}
              {activePlan.reunificationEffortDetails && (
                <div className="bg-[#F7F8FA] border border-[#E3E7EB] p-3 rounded-xs text-xs">
                  <span className="text-[11px] font-mono text-slate-500 uppercase font-bold block mb-1">
                    {t("fields.tracingFindings")}
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {activePlan.reunificationEffortDetails}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400">
              <Scale className="w-8 h-8 mx-auto mb-1 opacity-40 text-slate-300" />
              <p className="text-xs font-medium text-slate-600">
                {t("fields.emptyTitle")}
              </p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto">
                {t("fields.emptyDesc")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Dialog: Clear Child For Adoption ───────────────────────────────── */}
      <Dialog open={isClearModalOpen} onOpenChange={setIsClearModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-xs">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-[#0B1F3A] flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              {t("clearModal.title")}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {t("clearModal.desc")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs font-semibold">
                {t("clearModal.effortDetailsLabel")}
              </Label>
              <Textarea
                rows={3}
                placeholder={t("clearModal.effortDetailsPlaceholder")}
                value={effortDetails}
                onChange={(e) => setEffortDetails(e.target.value)}
                className="text-xs rounded-xs mt-1"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">
                {t("clearModal.courtOrderLabel")}
              </Label>
              <Input
                placeholder={t("clearModal.courtOrderPlaceholder")}
                value={courtOrder}
                onChange={(e) => setCourtOrder(e.target.value)}
                className="text-xs rounded-xs mt-1 h-8"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">
                {t("clearModal.notesLabel")}
              </Label>
              <Input
                placeholder={t("clearModal.notesPlaceholder")}
                value={clearNotes}
                onChange={(e) => setClearNotes(e.target.value)}
                className="text-xs rounded-xs mt-1 h-8"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsClearModalOpen(false)}
              className="text-xs rounded-xs"
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!effortDetails.trim() || clearMutation.isPending}
              onClick={handleClearAdoption}
              className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white rounded-xs font-semibold"
            >
              {clearMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
              )}
              {t("buttons.authorizeAdoption")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Create / Update Care Plan ──────────────────────────────── */}
      <Dialog open={isPlanModalOpen} onOpenChange={setIsPlanModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-xs">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-[#0B1F3A] flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#1769AA]" />
              {activePlan ? t("planModal.titleUpdate") : t("planModal.titleCreate")}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {t("planModal.desc")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs font-semibold">{t("planModal.primaryGoalLabel")}</Label>
              <Select
                value={primaryGoal}
                onValueChange={(val) => setPrimaryGoal(val as CarePlanGoal)}
              >
                <SelectTrigger className="text-xs rounded-xs mt-1 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GOAL_KEYS.map((k) => (
                    <SelectItem key={k} value={k} className="text-xs">
                      {t(`goals.${k}` as any)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-semibold">{t("planModal.secondaryGoalLabel")}</Label>
              <Select
                value={secondaryGoal}
                onValueChange={setSecondaryGoal}
              >
                <SelectTrigger className="text-xs rounded-xs mt-1 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GOAL_KEYS.map((k) => (
                    <SelectItem key={k} value={k} className="text-xs">
                      {t(`goals.${k}` as any)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-semibold">{t("planModal.reviewDateLabel")}</Label>
              <Input
                type="date"
                value={reviewDate}
                onChange={(e) => setReviewDate(e.target.value)}
                className="text-xs rounded-xs mt-1 h-8"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">{t("planModal.tracingEffortsLabel")}</Label>
              <Textarea
                rows={2}
                placeholder={t("planModal.tracingEffortsPlaceholder")}
                value={effortNotes}
                onChange={(e) => setEffortNotes(e.target.value)}
                className="text-xs rounded-xs mt-1"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">{t("planModal.generalNotesLabel")}</Label>
              <Input
                placeholder={t("planModal.generalNotesPlaceholder")}
                value={planNotes}
                onChange={(e) => setPlanNotes(e.target.value)}
                className="text-xs rounded-xs mt-1 h-8"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPlanModalOpen(false)}
              className="text-xs rounded-xs"
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={planMutation.isPending}
              onClick={handleCreatePlan}
              className="text-xs bg-[#0B1F3A] hover:bg-[#122D52] text-white rounded-xs font-semibold"
            >
              {planMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
              )}
              {t("buttons.savePlan")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
