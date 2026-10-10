"use client";

import React, { useState } from "react";
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
                Customary Adera Formalization & Child Protection
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Ethical traditional care oversight, Bale Adera custodian accountability & mandatory welfare checkups
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
                Formalize Adera Custody
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
                  Convert Legal Status
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsCheckupOpen(true)}
                  className="h-8 text-xs font-semibold rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Home className="size-3.5" />
                  Record Home Welfare Visit
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
              This child is not currently under a formalized customary Adera care arrangement.
            </p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-md mx-auto">
              Under Ethiopian customary practice, when a child is left under informal care (Adera), the Bureau mandates formalizing the Bale Adera custodian to prevent exploitation and enable monthly monitoring.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status and Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-3 bg-[#F7F8FA] border border-[#E3E7EB] rounded-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Adera Legal Status
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
                    {record.status}
                  </Badge>
                </div>
              </div>

              <div className="p-3 bg-[#F7F8FA] border border-[#E3E7EB] rounded-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Bale Adera Custodian
                </span>
                <p className="text-xs font-bold text-[#0B1F3A]">
                  {record.custodian ? `${record.custodian.firstName} ${record.custodian.lastName}` : `Client #${record.custodianId}`}
                </p>
                <p className="text-[11px] text-slate-500">
                  Rel: {record.relationshipToChild || "Informal Guardian"}
                </p>
              </div>

              <div className="p-3 bg-[#F7F8FA] border border-[#E3E7EB] rounded-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Monthly Stipend
                </span>
                <p className="text-xs font-bold text-[#0B1F3A]">
                  {record.monthlyStipend ? `${record.monthlyStipend} ETB` : "None"}
                </p>
                <p className="text-[11px] text-slate-500">
                  {record.isCourtApproved ? "Court Endorsed" : "Bureau Monitored"}
                </p>
              </div>

              <div className="p-3 bg-[#F7F8FA] border border-[#E3E7EB] rounded-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Next Home Visit Due
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-[#1769AA] pt-0.5">
                  <Clock className="size-3.5" />
                  {new Date(record.nextCheckupDue).toLocaleDateString()}
                </div>
                <p className="text-[11px] text-slate-400">Mandatory 30-day inspection</p>
              </div>
            </div>

            {/* Checkup Visits Timeline */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#E3E7EB] pb-2">
                <h4 className="text-xs font-bold text-[#0B1F3A] uppercase font-mono tracking-wide">
                  Periodic Home Welfare Checkup History ({record.welfareCheckups?.length || 0})
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
                            Visit Date: {new Date(visit.visitDate).toLocaleDateString()}
                          </Badge>
                          <Badge
                            className={
                              visit.safetyAssessment === "SAFE"
                                ? "bg-emerald-600 text-white text-[10px]"
                                : "bg-rose-600 text-white text-[10px]"
                            }
                          >
                            Safety: {visit.safetyAssessment}
                          </Badge>
                          <Badge variant="secondary" className="text-[10px]">
                            Living: {visit.livingConditionRating}
                          </Badge>
                        </div>
                        {visit.visitedBy && (
                          <span className="text-[11px] text-slate-500">
                            Inspected by: {visit.visitedBy.firstName} {visit.visitedBy.lastName}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-xs border border-slate-200">
                        <div>
                          <strong>Education / Schooling:</strong> {visit.childSchoolingStatus}
                        </div>
                        <div>
                          <strong>Physical & Health Appearance:</strong> {visit.childHealthStatus}
                        </div>
                      </div>

                      {visit.riskFlags && (visit.riskFlags as string[]).length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] font-semibold text-rose-600">Risk Flags:</span>
                          {(visit.riskFlags as string[]).map((rf, i) => (
                            <Badge key={i} variant="destructive" className="text-[10px] py-0 px-1.5">
                              {rf}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="text-[11px] text-slate-700 bg-white p-2.5 rounded-xs border border-slate-200 space-y-1">
                        <p>
                          <strong>Social Worker Observations:</strong> {visit.socialWorkerRemarks}
                        </p>
                        <p className="text-[#1769AA] font-semibold">
                          Recommendation: {visit.safetyRecommendation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 bg-[#F7F8FA] border border-dashed border-[#E3E7EB] rounded-xs">
                  <Home className="size-6 mx-auto mb-1 opacity-40 text-slate-400" />
                  <p className="text-xs">No home inspection visits recorded yet.</p>
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
              Formalize Customary Adera Care
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Register the informal caregiver (*Bale Adera*) and schedule child welfare checkups.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Bale Adera Client ID *</Label>
              <Input
                placeholder="e.g. 45"
                value={custodianId}
                onChange={(e) => setCustodianId(e.target.value)}
                className="h-8 text-xs rounded-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Relationship to Child</Label>
              <Input
                placeholder="e.g. Neighbor, Distant Aunt, Godparent"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="h-8 text-xs rounded-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Reason Placed in Adera *</Label>
              <Textarea
                placeholder="Circumstances under which the biological parents left the child..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="text-xs rounded-xs h-16"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Monthly Stipend (ETB)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 1500"
                  value={monthlyStipend}
                  onChange={(e) => setMonthlyStipend(e.target.value)}
                  className="h-8 text-xs rounded-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Document URL</Label>
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
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleFormalize}
              disabled={formalizeMutation.isPending || !custodianId || !reason}
              className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white"
            >
              {formalizeMutation.isPending ? "Formalizing..." : "Formalize Arrangement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Home Visit Dialog */}
      <Dialog open={isCheckupOpen} onOpenChange={setIsCheckupOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#0B1F3A]">
              Record Home Welfare Checkup
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Social worker periodic home inspection and living condition evaluation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Living Condition Rating</Label>
                <Select value={livingRating} onValueChange={setLivingRating}>
                  <SelectTrigger className="h-8 text-xs rounded-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXCELLENT">Excellent</SelectItem>
                    <SelectItem value="GOOD">Good</SelectItem>
                    <SelectItem value="SATISFACTORY">Satisfactory</SelectItem>
                    <SelectItem value="NEEDS_IMPROVEMENT">Needs Improvement</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Safety Assessment</Label>
                <Select value={safetyRating} onValueChange={setSafetyRating}>
                  <SelectTrigger className="h-8 text-xs rounded-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SAFE">Safe</SelectItem>
                    <SelectItem value="MINOR_CONCERNS">Minor Concerns</SelectItem>
                    <SelectItem value="MAJOR_CONCERNS">Major Concerns</SelectItem>
                    <SelectItem value="UNSAFE">Unsafe / Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Schooling / Education Status</Label>
              <Input
                value={schoolingStatus}
                onChange={(e) => setSchoolingStatus(e.target.value)}
                placeholder="e.g. Attending grade 4"
                className="h-8 text-xs rounded-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Health & Nutrition Observations</Label>
              <Input
                value={healthStatus}
                onChange={(e) => setHealthStatus(e.target.value)}
                placeholder="e.g. Clean, well-fed, healthy appearance"
                className="h-8 text-xs rounded-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Risk Flags (comma separated)</Label>
              <Input
                value={riskFlagsInput}
                onChange={(e) => setRiskFlagsInput(e.target.value)}
                placeholder="CHILD_LABOR, DOMESTIC_SERVITUDE, MISSING_SCHOOL"
                className="h-8 text-xs rounded-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Detailed Remarks *</Label>
              <Textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Observation of living quarters, interaction with custodian..."
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
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleRecordCheckup}
              disabled={checkupMutation.isPending || !remarks}
              className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white"
            >
              {checkupMutation.isPending ? "Saving..." : "Save Checkup Record"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Convert Legal Status Dialog */}
      <Dialog open={isConvertOpen} onOpenChange={setIsConvertOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#0B1F3A]">
              Transition Legal Custody Status
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Convert the customary informal arrangement to formal legal status.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Target Legal Status</Label>
              <Select
                value={targetStatus}
                onValueChange={(v: AderaStatus) => setTargetStatus(v)}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONVERTED_TO_GUARDIANSHIP">
                    Convert to Formal Court Guardianship
                  </SelectItem>
                  <SelectItem value="CONVERTED_TO_ADOPTION">
                    Convert to Domestic Adoption
                  </SelectItem>
                  <SelectItem value="UNDER_SAFETY_REVIEW">
                    Place under Safety Review
                  </SelectItem>
                  <SelectItem value="TERMINATED">
                    Terminate & Return Child to Care Center
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Transition Notes & Rationale</Label>
              <Textarea
                value={convertNotes}
                onChange={(e) => setConvertNotes(e.target.value)}
                placeholder="Court decree details, social worker justification..."
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
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConvertStatus}
              disabled={convertMutation.isPending}
              className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white"
            >
              {convertMutation.isPending ? "Updating..." : "Confirm Status Transition"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
