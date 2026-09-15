"use client";

/**
 * CrossDepartmentHistory
 *
 * A drop-in panel that displays the unified cross-department support history
 * for any registered individual.
 *
 * Supports lookup by either:
 *  - direct `clientId: number`
 *  - OR `cityIdNumber: string` / `faydaId: string` (automatically resolved via search)
 *
 * It shows:
 *  - Profile badges (Women, Disability, Elderly)
 *  - Department-of-origin tags on each event (Women's Affairs vs Elderly/Disability)
 *  - Cross-module benefit summary counts
 *  - Fully styled vertical timeline
 */

import React, { useState } from "react";
import { usePersonHistory, usePersonSearch } from "@/hooks/persons/persons-hooks";
import {
  TimelineEntry,
  TimelineKind,
  HistorySummary,
} from "@/api/persons/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Activity,
  HandHeart,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Zap,
  Users,
  FileText,
  StickyNote,
  Clock,
  History,
  Loader2,
  AlertCircle,
} from "lucide-react";

// ── Department & kind metadata ────────────────────────────────────────────────

export interface KindMeta {
  label: string;
  department: string;
  departmentColor: string;
  Icon: React.ElementType;
  dot: string;
  text: string;
  bg: string;
}

export const KIND_META: Record<TimelineKind, KindMeta> = {
  SUPPORT_RECORD: {
    label: "Support Record",
    department: "Social Support",
    departmentColor: "bg-rose-100 text-rose-800 border-rose-200",
    Icon: HandHeart,
    dot: "bg-rose-500",
    text: "text-rose-700",
    bg: "bg-rose-50",
  },
  SERVICE_REQUEST: {
    label: "Service Request",
    department: "Disability & Elderly",
    departmentColor: "bg-blue-100 text-blue-800 border-blue-200",
    Icon: ShieldCheck,
    dot: "bg-blue-500",
    text: "text-blue-700",
    bg: "bg-blue-50",
  },
  TRAINING: {
    label: "Training",
    department: "Social Affairs",
    departmentColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Icon: GraduationCap,
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  JOB_PLACEMENT: {
    label: "Job Placement",
    department: "Social Affairs",
    departmentColor: "bg-amber-100 text-amber-800 border-amber-200",
    Icon: Briefcase,
    dot: "bg-amber-500",
    text: "text-amber-700",
    bg: "bg-amber-50",
  },
  ELIGIBILITY_ASSESSMENT: {
    label: "Eligibility",
    department: "Disability & Elderly",
    departmentColor: "bg-purple-100 text-purple-800 border-purple-200",
    Icon: ShieldCheck,
    dot: "bg-purple-500",
    text: "text-purple-700",
    bg: "bg-purple-50",
  },
  WOMEN_TECH_SUPPORT: {
    label: "Tech Support",
    department: "Women's Affairs",
    departmentColor: "bg-sky-100 text-sky-800 border-sky-200",
    Icon: Zap,
    dot: "bg-sky-500",
    text: "text-sky-700",
    bg: "bg-sky-50",
  },
  WOMEN_TRAINING: {
    label: "Women Training",
    department: "Women's Affairs",
    departmentColor: "bg-teal-100 text-teal-800 border-teal-200",
    Icon: GraduationCap,
    dot: "bg-teal-500",
    text: "text-teal-700",
    bg: "bg-teal-50",
  },
  WOMEN_EMPLOYMENT: {
    label: "Employment",
    department: "Women's Affairs",
    departmentColor: "bg-orange-100 text-orange-800 border-orange-200",
    Icon: Briefcase,
    dot: "bg-orange-500",
    text: "text-orange-700",
    bg: "bg-orange-50",
  },
  ASSOCIATION_MEMBERSHIP: {
    label: "Association",
    department: "Women's Affairs",
    departmentColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    Icon: Users,
    dot: "bg-indigo-500",
    text: "text-indigo-700",
    bg: "bg-indigo-50",
  },
  CASE_NOTE: {
    label: "Case Note",
    department: "Case Management",
    departmentColor: "bg-slate-100 text-slate-800 border-slate-200",
    Icon: StickyNote,
    dot: "bg-slate-500",
    text: "text-slate-700",
    bg: "bg-slate-100",
  },
  AUDIT_LOG: {
    label: "Audit",
    department: "System Audit",
    departmentColor: "bg-gray-100 text-gray-700 border-gray-200",
    Icon: FileText,
    dot: "bg-gray-400",
    text: "text-gray-500",
    bg: "bg-gray-50",
  },
};

function entryLabel(entry: TimelineEntry): string {
  const p = entry.payload as any;
  switch (entry.kind) {
    case "SUPPORT_RECORD":
      return [p.serviceType?.name, p.amountOrQuantity, p.provider]
        .filter(Boolean)
        .join(" · ");
    case "SERVICE_REQUEST":
      return [p.serviceType, p.status, p.responsibleOffice].filter(Boolean).join(" · ");
    case "TRAINING":
      return [p.trainingType, p.provider].filter(Boolean).join(" @ ");
    case "JOB_PLACEMENT":
      return [p.jobTitle, p.companyIdNumber].filter(Boolean).join(" @ ");
    case "ELIGIBILITY_ASSESSMENT":
      return `Decision: ${p.decision ?? "PENDING"}${p.decisionNotes ? ` — ${p.decisionNotes}` : ""}`;
    case "WOMEN_TECH_SUPPORT":
      return [p.technologyType, p.description].filter(Boolean).join(" — ");
    case "WOMEN_TRAINING":
      return [p.trainingTopic, p.attended ? "Attended" : "Not attended", p.trainer]
        .filter(Boolean)
        .join(" · ");
    case "WOMEN_EMPLOYMENT":
      return [p.employmentType, p.sector, p.jobTitle].filter(Boolean).join(" / ");
    case "ASSOCIATION_MEMBERSHIP":
      return [p.association?.name, p.role].filter(Boolean).join(" · ");
    case "CASE_NOTE":
      return (p.note ?? "").slice(0, 140);
    case "AUDIT_LOG":
      return `${p.action ?? ""} on ${p.entityType ?? ""}`;
    default:
      return "";
  }
}

function StatBadge({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  if (value === 0) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
      <span className="font-bold text-slate-900">{value}</span> {label}
    </span>
  );
}

function TimelineRow({ entry }: { entry: TimelineEntry }) {
  const meta = KIND_META[entry.kind] ?? KIND_META.AUDIT_LOG;
  const { Icon, dot, text, bg, label, department, departmentColor } = meta;
  const detail = entryLabel(entry);

  return (
    <div className="flex gap-3 items-start group">
      {/* Vertical line + dot */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className={`w-3 h-3 rounded-full mt-1.5 ${dot} ring-2 ring-white`}
        />
        <div className="w-px flex-1 bg-slate-200 min-h-[1.5rem] group-last:hidden" />
      </div>

      {/* Content */}
      <div className="pb-4 flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold ${text} ${bg} px-2 py-0.5 rounded border border-current/20`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </span>
            <span
              className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full border ${departmentColor}`}
            >
              {department}
            </span>
          </div>

          <span className="text-[11px] text-slate-400 flex items-center gap-1 flex-shrink-0">
            <Clock className="w-3 h-3" />
            {new Date(entry.date).toLocaleString("en-ET", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {detail && (
          <p className="text-sm text-slate-700 mt-1 leading-snug font-normal">
            {detail}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export interface CrossDepartmentHistoryProps {
  /** The Client.id of the individual (if known) */
  clientId?: number;
  /** City ID number of the individual (if clientId is not directly known) */
  cityIdNumber?: string;
  /** Fayda ID of the individual */
  faydaId?: string;
  /** Person name (optional, shown in header/banners) */
  personName?: string;
  /** Initial expanded state (defaults to true) */
  defaultExpanded?: boolean;
  /** Optional: how many timeline items to show before "show more" */
  initialVisible?: number;
  /** If true, renders without outer Card wrapper (for embedding inside dialogs or tabs) */
  embedded?: boolean;
}

export default function CrossDepartmentHistory({
  clientId,
  cityIdNumber,
  faydaId,
  personName,
  defaultExpanded = true,
  initialVisible = 10,
  embedded = false,
}: CrossDepartmentHistoryProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [showAll, setShowAll] = useState(false);

  // If clientId is not provided, try to resolve via search query
  const needsSearch = !clientId && Boolean(cityIdNumber || faydaId);
  const { data: searchData, isLoading: searchLoading } = usePersonSearch({
    cityIdNumber: cityIdNumber || undefined,
    faydaId: faydaId || undefined,
    limit: 1,
  });

  const resolvedClientId = clientId ?? searchData?.results?.[0]?.id;

  const { data, isLoading: historyLoading, isError } = usePersonHistory(
    resolvedClientId
  );

  const isLoading = (needsSearch && searchLoading) || historyLoading;
  const timeline: TimelineEntry[] = data?.timeline ?? [];
  const summary: HistorySummary | undefined = data?.summary;
  const client = data?.client;

  // Filter out pure AUDIT_LOG entries from the view to keep it focused on benefits
  const filtered = timeline.filter((e) => e.kind !== "AUDIT_LOG");
  const visible = showAll ? filtered : filtered.slice(0, initialVisible);
  const hasMore = filtered.length > initialVisible && !showAll;

  // Calculate cross-department highlights
  const hasWomenRecords =
    (summary?.womenTechSupports ?? 0) > 0 ||
    (summary?.womenEmployments ?? 0) > 0 ||
    (summary?.associationMemberships ?? 0) > 0 ||
    Boolean(client?.WomenProfile);

  const hasDisabilityElderlyRecords =
    (summary?.serviceRequests ?? 0) > 0 ||
    Boolean(client?.DisabilityProfile) ||
    Boolean(client?.ElderlyProfile);

  const isCrossProgram = hasWomenRecords && hasDisabilityElderlyRecords;

  const content = (
    <div className="space-y-4">
      {/* Search in progress */}
      {needsSearch && searchLoading && (
        <div className="flex items-center gap-2 text-slate-500 text-sm py-4">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          Looking up citizen record in central database…
        </div>
      )}

      {/* No citizen record found for given ID */}
      {needsSearch && !searchLoading && !resolvedClientId && (
        <div className="p-4 bg-slate-50 border border-dashed rounded-lg text-sm text-slate-500 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-slate-800">
              No central client registration found
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {cityIdNumber ? `City ID: ${cityIdNumber}` : ""}
              {faydaId ? ` • Fayda ID: ${faydaId}` : ""}
              {personName ? ` (${personName})` : ""} has not been registered as a social service beneficiary yet.
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <p className="text-sm text-red-500 py-2">
          Unable to load history. You may need additional permissions or the server is unavailable.
        </p>
      )}

      {/* Loading history */}
      {historyLoading && (
        <div className="flex items-center gap-2 text-slate-500 text-sm py-4">
          <Loader2 className="w-4 h-4 animate-spin text-primary" /> Loading full history across all departments…
        </div>
      )}

      {/* Cross-Department Alert Banner */}
      {isCrossProgram && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900 flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-amber-950">
              Multi-Program Beneficiary:
            </span>{" "}
            This individual is enrolled across multiple bureau programs (
            {client?.WomenProfile && "Women's Affairs, "}
            {client?.DisabilityProfile && "Disability Support, "}
            {client?.ElderlyProfile && "Elderly Welfare"}
            ). Check existing benefits below before issuing new assistance.
          </div>
        </div>
      )}

      {/* Stat Badges */}
      {summary && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          <StatBadge label="support records" value={summary.supportRecords} />
          <StatBadge label="service requests" value={summary.serviceRequests} />
          <StatBadge label="trainings" value={summary.trainings} />
          <StatBadge label="job placements" value={summary.jobPlacements} />
          <StatBadge label="tech support" value={summary.womenTechSupports} />
          <StatBadge label="employment" value={summary.womenEmployments} />
          <StatBadge label="associations" value={summary.associationMemberships} />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && resolvedClientId && filtered.length === 0 && (
        <div className="py-8 text-center text-slate-400 text-sm border border-dashed rounded-lg bg-slate-50/50">
          <Activity className="w-6 h-6 mx-auto mb-1 opacity-30 text-slate-500" />
          No past support services or requests recorded for this individual.
        </div>
      )}

      {/* Timeline entries */}
      {visible.length > 0 && (
        <div className="pt-2">
          {visible.map((entry, idx) => (
            <TimelineRow key={idx} entry={entry} />
          ))}

          {hasMore && (
            <button
              type="button"
              className="text-xs font-semibold text-primary hover:underline mt-2 ml-6 block"
              onClick={() => setShowAll(true)}
            >
              Show {filtered.length - initialVisible} more events…
            </button>
          )}
        </div>
      )}
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden">
      {/* Header — click to toggle */}
      <CardHeader
        className="cursor-pointer select-none hover:bg-slate-50/80 transition-colors py-3.5 px-4 bg-slate-50/40 border-b"
        onClick={() => setExpanded((v) => !v)}
      >
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2 text-slate-800 font-lexend">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              <History className="w-4 h-4" />
            </div>
            <span>Cross-Department Support History</span>
            {personName && (
              <span className="text-xs font-normal text-slate-500 hidden sm:inline">
                ({personName})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {summary && (
              <Badge variant="secondary" className="text-xs font-medium">
                {filtered.length} event{filtered.length !== 1 ? "s" : ""}
              </Badge>
            )}
            {client?.WomenProfile && (
              <Badge variant="outline" className="text-[10px] text-rose-600 border-rose-200 hidden md:inline">
                Women
              </Badge>
            )}
            {client?.DisabilityProfile && (
              <Badge variant="outline" className="text-[10px] text-blue-600 border-blue-200 hidden md:inline">
                Disability
              </Badge>
            )}
            {client?.ElderlyProfile && (
              <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-200 hidden md:inline">
                Elderly
              </Badge>
            )}
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" type="button">
              {expanded ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      {/* Expandable Body */}
      {expanded && (
        <CardContent className="p-4 pt-4">
          {content}
        </CardContent>
      )}
    </Card>
  );
}
