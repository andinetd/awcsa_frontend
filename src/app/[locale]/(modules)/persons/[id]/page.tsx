"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePersonHistory } from "@/hooks/persons/persons-hooks";
import { TimelineEntry, TimelineKind, HistorySummary } from "@/api/persons/types";
import { useTranslations, useLocale } from "next-intl";
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
  const t = useTranslations("persons");
  const params = useParams();
  const router = useRouter();
  const clientId = parseInt(params.id as string);

  const { data, isLoading, isError } = usePersonHistory(
    Number.isNaN(clientId) ? undefined : clientId
  );

  if (Number.isNaN(clientId)) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-slate-500">{t("detail.invalidId")}</p>
        <Button onClick={() => router.back()}>{t("detail.goBack")}</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center gap-2 text-slate-500">
        <Loader2 className="w-4 h-4 animate-spin" /> {t("detail.loading")}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 text-slate-500">
        {t("detail.notFound")}
        <Button variant="link" onClick={() => router.back()}>
          {t("detail.goBack")}
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
        <span className="text-sm text-slate-500">{t("detail.backToSearch")}</span>
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
              <Activity className="w-3.5 h-3.5" /> {t("detail.tabs.timeline")}
            </TabsTrigger>
            <TabsTrigger value="overview" className="gap-1.5">
              <User className="w-3.5 h-3.5" /> {t("detail.tabs.profile")}
            </TabsTrigger>
          </TabsList>

          {/* Timeline */}
          <TabsContent value="timeline" className="mt-4">
            {timeline.length === 0 ? (
              <div className="p-8 text-center text-slate-400 border rounded-lg border-dashed">
                {t("detail.noEvents")}
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
  const t = useTranslations("persons");
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
            {client.cityIdNumber && <span>{t("cityId", { id: client.cityIdNumber })}</span>}
            {client.faydaId && <span>{t("fayda", { id: client.faydaId })}</span>}
            {client.phoneNumber && <span>📞 {client.phoneNumber}</span>}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Badge variant="secondary">{client.clientCategory}</Badge>
            {client.WomenProfile && (
              <Badge variant="outline" className="border-rose-200 text-rose-600">
                {t("profiles.women")}
              </Badge>
            )}
            {client.DisabilityProfile && (
              <Badge variant="outline" className="border-blue-200 text-blue-600">
                {t("profiles.disability")}
              </Badge>
            )}
            {client.ElderlyProfile && (
              <Badge variant="outline" className="border-amber-200 text-amber-600">
                {t("profiles.elderly")}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ summary }: { summary: HistorySummary }) {
  const t = useTranslations("persons");
  const stats = [
    { label: t("detail.summary.totalEvents"), value: summary.totalEvents, Icon: Activity },
    { label: t("detail.summary.supportRecords"), value: summary.supportRecords, Icon: HandHeart },
    { label: t("detail.summary.serviceRequests"), value: summary.serviceRequests, Icon: ShieldCheck },
    { label: t("detail.summary.trainings"), value: summary.trainings, Icon: GraduationCap },
    { label: t("detail.summary.jobPlacements"), value: summary.jobPlacements, Icon: Briefcase },
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
  const t = useTranslations("persons");
  const locale = useLocale();
  const meta = KIND_META[entry.kind];
  const { Icon, colour } = meta;
  const label = t.has(`detail.kinds.${entry.kind}`) ? t(`detail.kinds.${entry.kind}`) : meta.label;
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
            {new Date(entry.date).toLocaleString(locale === "am" ? "am-ET" : "en-ET", {
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
  const t = useTranslations("persons");
  const locale = useLocale();
  const fields: { label: string; value: string | null }[] = [
    { label: t("detail.profileSection.phone"), value: client.phoneNumber },
    { label: t("detail.profileSection.age"), value: client.age?.toString() },
    { label: t("detail.profileSection.sex"), value: client.sex },
    { label: t("detail.profileSection.subCity"), value: client.subCity },
    { label: t("detail.profileSection.woreda"), value: client.woreda },
    { label: t("detail.profileSection.education"), value: client.educationLevel },
    { label: t("detail.profileSection.occupation"), value: client.occupation },
    { label: t("detail.profileSection.employment"), value: client.employmentStatus },
    { label: t("detail.profileSection.marital"), value: client.maritalStatus },
    {
      label: t("detail.profileSection.monthlyIncome"),
      value: client.monthlyIncome ? `${client.monthlyIncome} ETB` : null,
    },
    {
      label: t("detail.profileSection.familyMembers"),
      value: client.familyMembersCount?.toString(),
    },
    {
      label: t("detail.profileSection.registered"),
      value: client.createdAt
        ? new Date(client.createdAt).toLocaleDateString(locale === "am" ? "am-ET" : "en-ET")
        : null,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("detail.profileSection.title")}</CardTitle>
        <CardDescription>
          {t("detail.profileSection.subtitle")}
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
              {t("detail.profileSection.disabilityProfile")}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-slate-400">{t("detail.profileSection.disabilityType")}</div>
                <div className="font-medium">
                  {client.DisabilityProfile.disabilityType}
                </div>
              </div>
              {client.DisabilityProfile.disabilitySeverity && (
                <div>
                  <div className="text-xs text-slate-400">{t("detail.profileSection.severity")}</div>
                  <div className="font-medium">
                    {client.DisabilityProfile.disabilitySeverity}
                  </div>
                </div>
              )}
              {client.DisabilityProfile.cause && (
                <div>
                  <div className="text-xs text-slate-400">{t("detail.profileSection.cause")}</div>
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
