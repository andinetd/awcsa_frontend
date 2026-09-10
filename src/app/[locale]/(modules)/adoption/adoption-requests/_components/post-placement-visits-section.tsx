"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Home,
  ShieldCheck,
  AlertTriangle,
  Heart,
  BookOpen,
  Users,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
  Star,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
} from "lucide-react";
import {
  useListPostPlacementVisits,
  useRecordPostPlacementVisit,
} from "@/hooks/adoption/useMatches";
import {
  PostPlacementVisit,
  VisitSafetyRating,
  VisitOverallRating,
  CreatePostPlacementVisitPayload,
} from "@/api/adoption/matches";

interface PostPlacementVisitsSectionProps {
  matchId?: number | null;
  matchStatus?: string;
  isOfficer?: boolean;
}

// ─── Rating configurations ───────────────────────────────────────────────────

const SAFETY_CONFIG: Record<
  VisitSafetyRating,
  { label: string; color: string; icon: React.ElementType }
> = {
  SAFE: {
    label: "Safe & Secure",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: CheckCircle2,
  },
  MINOR_CONCERNS: {
    label: "Minor Concerns",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: AlertCircle,
  },
  MAJOR_CONCERNS: {
    label: "Major Concerns",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: AlertTriangle,
  },
  UNSAFE: {
    label: "Unsafe Environment",
    color: "bg-rose-100 text-rose-800 border-rose-200",
    icon: AlertTriangle,
  },
};

const OVERALL_CONFIG: Record<
  VisitOverallRating,
  { label: string; color: string }
> = {
  EXCELLENT: {
    label: "Excellent",
    color: "bg-emerald-600 text-white",
  },
  GOOD: {
    label: "Good",
    color: "bg-blue-600 text-white",
  },
  SATISFACTORY: {
    label: "Satisfactory",
    color: "bg-slate-600 text-white",
  },
  NEEDS_IMPROVEMENT: {
    label: "Needs Improvement",
    color: "bg-amber-600 text-white",
  },
  CRITICAL: {
    label: "Critical Attention",
    color: "bg-rose-600 text-white",
  },
};

const VisitObservationField = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
}) => {
  if (!value) return null;
  return (
    <div className="flex gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <div className="mt-0.5 p-1.5 bg-slate-100 rounded-md shrink-0">
        <Icon className="w-3.5 h-3.5 text-slate-600" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <p className="text-sm text-slate-800 leading-relaxed">{value}</p>
      </div>
    </div>
  );
};

// ─── Visit Card ───────────────────────────────────────────────────────────────

const VisitCard = ({ visit }: { visit: PostPlacementVisit }) => {
  const [expanded, setExpanded] = useState(false);
  const safetyCfg = SAFETY_CONFIG[visit.safetyAssessment];
  const overallCfg = OVERALL_CONFIG[visit.overallRating];
  const SafetyIcon = safetyCfg.icon;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between p-4 gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              {new Date(visit.visitDate).toLocaleDateString()}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${safetyCfg.color}`}
            >
              <SafetyIcon className="w-3 h-3" />
              {safetyCfg.label}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${overallCfg.color}`}
            >
              <Star className="w-3 h-3 mr-1" />
              {overallCfg.label}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              Conducted by: {visit.visitedBy.firstName} {visit.visitedBy.lastName} ({visit.visitedBy.employeeRole})
            </span>
            {visit.nextVisitDue && (
              <span className="flex items-center gap-1 text-indigo-600 font-medium">
                <Clock className="w-3 h-3" />
                Next Due: {new Date(visit.nextVisitDue).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 shrink-0"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded observations */}
      {expanded && (
        <div className="border-t border-slate-100 px-4 pb-4 pt-1 space-y-3">
          <div className="space-y-0">
            <VisitObservationField
              icon={Home}
              label="Living Conditions & Environment"
              value={visit.livingConditions}
            />
            <VisitObservationField
              icon={Heart}
              label="Child Health & Nutrition"
              value={visit.childHealthStatus}
            />
            <VisitObservationField
              icon={Users}
              label="Bonding & Family Attachment"
              value={visit.bondingObservation}
            />
            <VisitObservationField
              icon={BookOpen}
              label="Schooling & Education Progress"
              value={visit.schoolingStatus}
            />
          </div>

          {/* Concerns Alert */}
          {visit.concerns && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
              <p className="text-xs font-bold text-rose-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Concerns & Red Flags Observed
              </p>
              <p className="text-sm text-rose-800">{visit.concerns}</p>
            </div>
          )}

          {/* Recommendations Box */}
          {visit.recommendations && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
              <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                Officer Recommendations & Action Plan
              </p>
              <p className="text-sm text-indigo-900">{visit.recommendations}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────

export const PostPlacementVisitsSection: React.FC<PostPlacementVisitsSectionProps> = ({
  matchId,
  matchStatus,
  isOfficer = false,
}) => {
  const t = useTranslations("adoption");
  const [isRecordOpen, setIsRecordOpen] = useState(false);

  // Form state
  const [form, setForm] = useState<CreatePostPlacementVisitPayload>({
    visitDate: new Date().toISOString().split("T")[0],
    livingConditions: "",
    childHealthStatus: "",
    bondingObservation: "",
    schoolingStatus: "",
    safetyAssessment: "SAFE",
    overallRating: "GOOD",
    concerns: "",
    recommendations: "",
    nextVisitDue: "",
  });

  const { data: visits = [], isLoading } = useListPostPlacementVisits(matchId);
  const recordMutation = useRecordPostPlacementVisit(matchId);

  const handleSubmit = () => {
    recordMutation.mutate(
      {
        ...form,
        visitDate: form.visitDate ? new Date(form.visitDate).toISOString() : new Date().toISOString(),
        nextVisitDue: form.nextVisitDue ? new Date(form.nextVisitDue).toISOString() : null,
      },
      {
        onSuccess: () => {
          setIsRecordOpen(false);
          setForm({
            visitDate: new Date().toISOString().split("T")[0],
            livingConditions: "",
            childHealthStatus: "",
            bondingObservation: "",
            schoolingStatus: "",
            safetyAssessment: "SAFE",
            overallRating: "GOOD",
            concerns: "",
            recommendations: "",
            nextVisitDue: "",
          });
        },
      },
    );
  };

  const isFormValid =
    form.livingConditions.trim() &&
    form.childHealthStatus.trim() &&
    form.bondingObservation.trim();

  if (!matchId) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-slate-400 text-sm">
        Match details unavailable
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Home className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Post-Placement Home Visits
            </h3>
            <p className="text-xs text-slate-500">
              Periodic in-person home evaluations by social welfare officers
            </p>
          </div>
          {visits.length > 0 && (
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
              {visits.length}
            </span>
          )}
        </div>

        {isOfficer && matchStatus !== "TERMINATED" && (
          <Button
            size="sm"
            onClick={() => setIsRecordOpen(true)}
            className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Home className="w-3.5 h-3.5 mr-1.5" />
            Record Home Visit
          </Button>
        )}
      </div>

      {/* Visits List */}
      {isLoading ? (
        <div className="py-8 text-center text-slate-400 text-sm">
          Loading visit evaluations...
        </div>
      ) : visits.length === 0 ? (
        <div className="py-10 text-center bg-white rounded-xl border border-dashed border-slate-200">
          <Home className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No post-placement visits recorded yet.</p>
          <p className="text-xs text-slate-400 mt-1">
            Conduct an in-person home visit and record the evaluation here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visits.map((visit) => (
            <VisitCard key={visit.id} visit={visit} />
          ))}
        </div>
      )}

      {/* Record Visit Dialog */}
      <Dialog open={isRecordOpen} onOpenChange={setIsRecordOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Record Post-Placement Home Visit</DialogTitle>
            <DialogDescription>
              Document in-person observations regarding the child's living conditions, safety, bonding, and schooling.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                  Visit Date <span className="text-rose-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={form.visitDate}
                  onChange={(e) => setForm((f) => ({ ...f, visitDate: e.target.value }))}
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                  Next Scheduled Visit <span className="text-slate-400 font-normal">(optional)</span>
                </Label>
                <Input
                  type="date"
                  value={form.nextVisitDue || ""}
                  onChange={(e) => setForm((f) => ({ ...f, nextVisitDue: e.target.value }))}
                />
              </div>
            </div>

            {/* Ratings Selection */}
            <div>
              <Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                Safety Assessment <span className="text-rose-500">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {(["SAFE", "MINOR_CONCERNS", "MAJOR_CONCERNS", "UNSAFE"] as VisitSafetyRating[]).map(
                  (s) => {
                    const cfg = SAFETY_CONFIG[s];
                    return (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setForm((f) => ({ ...f, safetyAssessment: s }))}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all text-left flex items-center gap-1.5 ${
                          form.safetyAssessment === s
                            ? cfg.color + " ring-2 ring-emerald-500/30"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <cfg.icon className="w-3.5 h-3.5 shrink-0" />
                        {cfg.label}
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                Overall Placement Rating <span className="text-rose-500">*</span>
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {(["EXCELLENT", "GOOD", "SATISFACTORY", "NEEDS_IMPROVEMENT", "CRITICAL"] as VisitOverallRating[]).map(
                  (r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setForm((f) => ({ ...f, overallRating: r }))}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        form.overallRating === r
                          ? OVERALL_CONFIG[r].color + " shadow-sm"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {OVERALL_CONFIG[r].label}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Text Observations */}
            <div>
              <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                Living Conditions & Home Environment <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                placeholder="Describe home cleanliness, sleeping space, adequate bedding, safety hazards..."
                rows={2}
                value={form.livingConditions}
                onChange={(e) => setForm((f) => ({ ...f, livingConditions: e.target.value }))}
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                Child Health & Nutrition <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                placeholder="Physical appearance, hygiene, nutritional adequacy, medical visits, vaccinations..."
                rows={2}
                value={form.childHealthStatus}
                onChange={(e) => setForm((f) => ({ ...f, childHealthStatus: e.target.value }))}
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                Bonding & Attachment Observation <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                placeholder="Interaction between child and adoptive parents, siblings, comfort level, affection..."
                rows={2}
                value={form.bondingObservation}
                onChange={(e) => setForm((f) => ({ ...f, bondingObservation: e.target.value }))}
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                Schooling Status <span className="text-slate-400 font-normal">(optional)</span>
              </Label>
              <Textarea
                placeholder="School enrollment, attendance, grade performance, socialization with peers..."
                rows={2}
                value={form.schoolingStatus || ""}
                onChange={(e) => setForm((f) => ({ ...f, schoolingStatus: e.target.value }))}
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                Concerns Observed <span className="text-slate-400 font-normal">(optional)</span>
              </Label>
              <Textarea
                placeholder="Any red flags, risks, or areas requiring immediate attention..."
                rows={2}
                value={form.concerns || ""}
                onChange={(e) => setForm((f) => ({ ...f, concerns: e.target.value }))}
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                Recommendations & Next Steps <span className="text-slate-400 font-normal">(optional)</span>
              </Label>
              <Textarea
                placeholder="Guidance or action plan provided to the adoptive parents..."
                rows={2}
                value={form.recommendations || ""}
                onChange={(e) => setForm((f) => ({ ...f, recommendations: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRecordOpen(false)}
              disabled={recordMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || recordMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {recordMutation.isPending ? "Recording..." : "Save Evaluation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
