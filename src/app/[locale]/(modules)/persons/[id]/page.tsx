"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePersonHistory } from "@/hooks/persons/persons-hooks";
import { TimelineEntry, TimelineKind, HistorySummary } from "@/api/persons/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Loader2,
  User,
  Activity,
  BarChart3,
  Clock,
  HandHeart,
  GraduationCap,
  Briefcase,
  Zap,
  Users,
  FileText,
  ShieldCheck,
  StickyNote,
} from "lucide-react";

// ── Kind → icon, label, colour ───────────────────────────────────────────────

const KIND_META: Record<
  TimelineKind,
  { label: string; Icon: React.ElementType; colour: string }
> = {
  SUPPORT_RECORD: {
    label: "Support",
    Icon: HandHeart,
    colour: "text-rose-600 bg-rose-50",
  },
  SERVICE_REQUEST: {
    label: "Service Request",
    Icon: ShieldCheck,
    colour: "text-blue-600 bg-blue-50",
  },
  TRAINING: {
    label: "Training",
    Icon: GraduationCap,
    colour: "text-green-600 bg-green-50",
  },
  JOB_PLACEMENT: {
    label: "Job Placement",
    Icon: Briefcase,
    colour: "text-amber-600 bg-amber-50",
  },
  ELIGIBILITY_ASSESSMENT: {
    label: "Eligibility",
    Icon: ShieldCheck,
    colour: "text-purple-600 bg-purple-50",
  },
  WOMEN_TECH_SUPPORT: {
    label: "Tech Support",
    Icon: Zap,
    colour: "text-sky-600 bg-sky-50",
  },
  WOMEN_TRAINING: {
    label: "Women Training",
    Icon: GraduationCap,
    colour: "text-teal-600 bg-teal-50",
  },
  WOMEN_EMPLOYMENT: {
    label: "Employment",
    Icon: Briefcase,
    colour: "text-orange-600 bg-orange-50",
  },
  ASSOCIATION_MEMBERSHIP: {
    label: "Association",
    Icon: Users,
    colour: "text-indigo-600 bg-indigo-50",
  },
  CASE_NOTE: {
    label: "Case Note",
    Icon: StickyNote,
    colour: "text-slate-600 bg-slate-100",
  },
  AUDIT_LOG: {
    label: "Audit",
    Icon: FileText,
    colour: "text-slate-400 bg-slate-50",
  },
};

function kindSummary(entry: TimelineEntry): string {
  const p = entry.payload as any;
  switch (entry.kind) {
    case "SUPPORT_RECORD":
      return `${p.amountOrQuantity ?? ""} — ${p.provider ?? ""} (${p.serviceType?.name ?? ""})`;
    case "SERVICE_REQUEST":
      return `${p.serviceType ?? ""} • ${p.status ?? ""}`;
    case "TRAINING":
      return `${p.trainingType ?? ""} @ ${p.provider ?? ""}`;
    case "JOB_PLACEMENT":
      return `${p.jobTitle ?? ""} @ ${p.companyIdNumber ?? ""}`;
    case "ELIGIBILITY_ASSESSMENT":
      return `Decision: ${p.decision ?? "PENDING"}`;
    case "WOMEN_TECH_SUPPORT":
      return p.technologyType ?? "";
    case "WOMEN_TRAINING":
      return `${p.trainingTopic ?? ""} — ${p.attended ? "Attended" : "Not attended"}`;
    case "WOMEN_EMPLOYMENT":
      return `${p.employmentType ?? ""} / ${p.sector ?? ""}`;
    case "ASSOCIATION_MEMBERSHIP":
      return p.association?.name ?? "";
    case "CASE_NOTE":
      return (p.note ?? "").slice(0, 120);
    case "AUDIT_LOG":
      return `${p.action ?? ""} on ${p.entityType ?? ""}${p.entityId ? ` #${p.entityId}` : ""}`;
    default:
      return "";
  }
}

// ── Page component ─────────────────────────────────────────────────────────

export default function PersonHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = parseInt(params.id as string);

  const { data, isLoading, isError } = usePersonHistory(
    Number.isNaN(clientId) ? undefined : clientId
  );

  if (Number.isNaN(clientId)) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-slate-500">Invalid ID.</p>
        <Button onClick={() => router.back()}>Go back</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center gap-2 text-slate-500">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading history…
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 text-slate-500">
        Person not found or could not be loaded.
        <Button variant="link" onClick={() => router.back()}>
          Go back
        </Button>
      </div>
    );
  }

  const { client, summary, timeline } = data;

  return (
    <div className="max-w-5xl mx-auto w-full">
      {/* Back */}
      <div className="p-6 pb-0 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <span className="text-sm text-slate-500">Back to search</span>
      </div>

      <div className="p-6 space-y-6">
        {/* Person header */}
        <PersonHeader client={client} />

        {/* Summary cards */}
        <SummaryRow summary={summary} />

        {/* Tabs */}
        <Tabs defaultValue="timeline">
          <TabsList>
            <TabsTrigger value="timeline" className="gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Timeline
            </TabsTrigger>
            <TabsTrigger value="overview" className="gap-1.5">
              <User className="w-3.5 h-3.5" /> Profile
            </TabsTrigger>
          </TabsList>

          {/* Timeline */}
          <TabsContent value="timeline" className="mt-4">
            {timeline.length === 0 ? (
              <div className="p-8 text-center text-slate-400 border rounded-lg border-dashed">
                No support events recorded for this person yet.
              </div>
            ) : (
              <div className="relative space-y-0">
                {timeline.map((entry: TimelineEntry, idx: number) => (
                  <TimelineRow key={idx} entry={entry} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Profile overview */}
          <TabsContent value="overview" className="mt-4">
            <ProfileOverview client={client} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function PersonHeader({ client }: { client: Record<string, any> }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-lexend">
            {client.firstName} {client.lastName}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5 flex flex-wrap gap-x-3">
            {client.cityIdNumber && <span>City ID: {client.cityIdNumber}</span>}
            {client.faydaId && <span>Fayda: {client.faydaId}</span>}
            {client.phoneNumber && <span>📞 {client.phoneNumber}</span>}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Badge variant="secondary">{client.clientCategory}</Badge>
            {client.WomenProfile && (
              <Badge variant="outline" className="border-rose-200 text-rose-600">
                Women
              </Badge>
            )}
            {client.DisabilityProfile && (
              <Badge variant="outline" className="border-blue-200 text-blue-600">
                Disability
              </Badge>
            )}
            {client.ElderlyProfile && (
              <Badge variant="outline" className="border-amber-200 text-amber-600">
                Elderly
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ summary }: { summary: HistorySummary }) {
  const stats = [
    { label: "Total Events", value: summary.totalEvents, Icon: Activity },
    { label: "Support Records", value: summary.supportRecords, Icon: HandHeart },
    { label: "Service Requests", value: summary.serviceRequests, Icon: ShieldCheck },
    { label: "Trainings", value: summary.trainings, Icon: GraduationCap },
    { label: "Job Placements", value: summary.jobPlacements, Icon: Briefcase },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {stats.map(({ label, value, Icon }) => (
        <Card key={label} className="text-center">
          <CardContent className="p-3">
            <Icon className="w-4 h-4 mx-auto mb-1 text-slate-400" />
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            <div className="text-xs text-slate-500">{label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TimelineRow({ entry }: { entry: TimelineEntry }) {
  const meta = KIND_META[entry.kind];
  const { Icon, colour, label } = meta;
  const summary = kindSummary(entry);

  return (
    <div className="flex gap-4 items-start group">
      {/* Vertical line */}
      <div className="flex flex-col items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colour}`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div className="w-px flex-1 bg-slate-200 min-h-[1.5rem] group-last:hidden" />
      </div>

      {/* Content */}
      <div className="pb-5 flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <span className="font-medium text-slate-800 text-sm">{label}</span>
          <span className="text-xs text-slate-400 flex items-center gap-1 flex-shrink-0">
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
        {summary && (
          <p className="text-sm text-slate-500 mt-0.5 truncate">{summary}</p>
        )}
      </div>
    </div>
  );
}

function ProfileOverview({ client }: { client: Record<string, any> }) {
  const fields: { label: string; value: string | null }[] = [
    { label: "Phone", value: client.phoneNumber },
    { label: "Age", value: client.age?.toString() },
    { label: "Sex", value: client.sex },
    { label: "Sub-city", value: client.subCity },
    { label: "Woreda", value: client.woreda },
    { label: "Education", value: client.educationLevel },
    { label: "Occupation", value: client.occupation },
    { label: "Employment", value: client.employmentStatus },
    { label: "Marital", value: client.maritalStatus },
    {
      label: "Monthly Income",
      value: client.monthlyIncome ? `${client.monthlyIncome} ETB` : null,
    },
    {
      label: "Family Members",
      value: client.familyMembersCount?.toString(),
    },
    {
      label: "Registered",
      value: client.createdAt
        ? new Date(client.createdAt).toLocaleDateString()
        : null,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Details registered across all departments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 text-sm">
          {fields
            .filter((f) => f.value)
            .map(({ label, value }) => (
              <div key={label}>
                <div className="text-xs text-slate-400 uppercase tracking-wide">
                  {label}
                </div>
                <div className="font-medium text-slate-800 mt-0.5">
                  {value}
                </div>
              </div>
            ))}
        </div>

        {/* Disability profile summary */}
        {client.DisabilityProfile && (
          <div className="mt-6 pt-4 border-t">
            <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">
              Disability Profile
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-slate-400">Type</div>
                <div className="font-medium">
                  {client.DisabilityProfile.disabilityType}
                </div>
              </div>
              {client.DisabilityProfile.disabilitySeverity && (
                <div>
                  <div className="text-xs text-slate-400">Severity</div>
                  <div className="font-medium">
                    {client.DisabilityProfile.disabilitySeverity}
                  </div>
                </div>
              )}
              {client.DisabilityProfile.cause && (
                <div>
                  <div className="text-xs text-slate-400">Cause</div>
                  <div className="font-medium">
                    {client.DisabilityProfile.cause}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
