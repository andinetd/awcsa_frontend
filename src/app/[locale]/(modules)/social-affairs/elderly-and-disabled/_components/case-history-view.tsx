"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useCaseHistory,
  useCaseNotes,
  useAddCaseNote,
  useBeneficiaryDocuments,
} from "@/hooks/beneficiaries/srs-hooks";
import {
  SERVICE_TYPE_LABELS,
  SERVICE_STATUS_LABELS,
  DOCUMENT_TYPE_LABELS,
  Beneficiary,
  ServiceRequest,
  EligibilityAssessment,
  CaseNote,
  BeneficiaryDocument,
} from "@/api/beneficiaries/types-v2";
import { FileText, FileCheck, FilePlus, Loader2, Plus, History } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { caseNoteSchema, CaseNoteFormValues } from "@/schemas/srs-beneficiaries";
import { zodResolver } from "@hookform/resolvers/zod";
import CrossDepartmentHistory from "@/components/shared/cross-department-history";

interface CaseHistoryViewProps {
  clientId: number;
}

export default function CaseHistoryView({ clientId }: CaseHistoryViewProps) {
  const t = useTranslations("social-affairs.elderlyAndDisabled.srs");
  const tCase = useTranslations("social-affairs.elderlyAndDisabled.profile");
  const { data, isLoading } = useCaseHistory(clientId);
  const { data: notes } = useCaseNotes(clientId);
  const { data: documents } = useBeneficiaryDocuments(clientId);
  const addNote = useAddCaseNote(clientId);
  const [openNote, setOpenNote] = useState(false);

  const noteForm = useForm<CaseNoteFormValues>({
    resolver: zodResolver(caseNoteSchema),
    defaultValues: { note: "", category: "" },
  });

  const onAddNote = (values: CaseNoteFormValues) => {
    addNote.mutate(values, {
      onSuccess: () => {
        toast.success("Note added");
        setOpenNote(false);
        noteForm.reset();
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-pulse text-xs font-mono uppercase tracking-wider text-slate-400">
          <Loader2 className="w-3.5 h-3.5 mr-2 inline animate-spin" /> {tCase("loading")}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xs border border-dashed border-[#E3E7EB] bg-white p-12 text-center text-slate-400 font-mono text-xs uppercase tracking-wider">
        {tCase("notFound")}
      </div>
    );
  }

  const { client, timeline } = data;

  return (
    <div className="space-y-6 w-full">
      <Header client={client} />

      <Tabs defaultValue="overview">
        <TabsList className="h-9 p-1 rounded-xs bg-slate-100 border border-[#E3E7EB] flex-wrap">
          <TabsTrigger
            value="overview"
            className="h-7 px-3 text-xs font-mono uppercase tracking-wider rounded-xs data-[state=active]:bg-[#1769AA] data-[state=active]:text-white data-[state=active]:shadow-2xs font-bold"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="eligibility"
            className="h-7 px-3 text-xs font-mono uppercase tracking-wider rounded-xs data-[state=active]:bg-[#1769AA] data-[state=active]:text-white data-[state=active]:shadow-2xs font-bold"
          >
            {t("eligibility")}
          </TabsTrigger>
          <TabsTrigger
            value="services"
            className="h-7 px-3 text-xs font-mono uppercase tracking-wider rounded-xs data-[state=active]:bg-[#1769AA] data-[state=active]:text-white data-[state=active]:shadow-2xs font-bold"
          >
            Services
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="h-7 px-3 text-xs font-mono uppercase tracking-wider rounded-xs data-[state=active]:bg-[#1769AA] data-[state=active]:text-white data-[state=active]:shadow-2xs font-bold"
          >
            {t("documents")}
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            className="h-7 px-3 text-xs font-mono uppercase tracking-wider rounded-xs data-[state=active]:bg-[#1769AA] data-[state=active]:text-white data-[state=active]:shadow-2xs font-bold"
          >
            Case Notes
          </TabsTrigger>
          <TabsTrigger
            value="timeline"
            className="h-7 px-3 text-xs font-mono uppercase tracking-wider rounded-xs data-[state=active]:bg-[#1769AA] data-[state=active]:text-white data-[state=active]:shadow-2xs font-bold"
          >
            Timeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-2">
          <Overview client={client} />
        </TabsContent>

        <TabsContent value="eligibility" className="space-y-3 pt-2">
          {client.EligibilityAssessment?.length ? (
            client.EligibilityAssessment.map((e: EligibilityAssessment) => (
              <Card key={e.id} className="rounded-xs border-[#E3E7EB] bg-white shadow-2xs overflow-hidden">
                <CardHeader className="border-b border-[#E3E7EB] bg-slate-50/50 py-3 px-5">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
                      Assessment • {new Date(e.assessedAt).toLocaleDateString()}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className={`font-mono text-[10px] uppercase font-bold rounded-xs px-2 py-0.5 border ${
                        e.decision === "ELIGIBLE"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : e.decision === "NOT_ELIGIBLE"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {e.decision}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-5 text-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-500">Residency:</span>{" "}
                    <span className="font-semibold text-slate-800">{e.residencyVerified ? "✓ Verified" : "✗ Not verified"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-500">Community Confirmation:</span>{" "}
                    <span className="font-semibold text-slate-800">{e.communityConfirmation ? "✓ Confirmed" : "✗ Pending"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-500">Woreda Confirmation:</span>{" "}
                    <span className="font-semibold text-slate-800">{e.woredaConfirmation ? "✓ Confirmed" : "✗ Pending"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-500">Medical Status:</span>{" "}
                    <span className="font-semibold text-slate-800">{e.medicalVerificationStatus}</span>
                  </div>
                  {e.decisionNotes && (
                    <div className="col-span-full pt-1">
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-500">Decision Notes:</span>{" "}
                      <span className="text-slate-700">{e.decisionNotes}</span>
                    </div>
                  )}
                  {e.rejectionReason && (
                    <div className="col-span-full pt-1 text-rose-600">
                      <span className="text-[10px] font-mono font-bold uppercase text-rose-500">Rejection Reason:</span>{" "}
                      <span>{e.rejectionReason}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Empty message="No eligibility assessments yet" />
          )}
        </TabsContent>

        <TabsContent value="services" className="space-y-3 pt-2">
          {client.ServiceRequest?.length ? (
            client.ServiceRequest.map((s: ServiceRequest) => (
              <Card key={s.id} className="rounded-xs border-[#E3E7EB] bg-white shadow-2xs overflow-hidden">
                <CardHeader className="border-b border-[#E3E7EB] bg-slate-50/50 py-3 px-5">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
                      {SERVICE_TYPE_LABELS[s.serviceType] || s.serviceType}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] uppercase font-bold rounded-xs px-2 py-0.5 border bg-slate-100 text-slate-700 border-slate-200"
                    >
                      {SERVICE_STATUS_LABELS[s.status] || s.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs text-slate-500 font-mono mt-0.5">
                    Requested: {new Date(s.requestDate).toLocaleDateString()}
                    {s.serviceDate &&
                      ` • Service: ${new Date(s.serviceDate).toLocaleDateString()}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-5 text-xs space-y-1.5">
                  {s.responsibleOffice && <div><span className="font-mono text-slate-500 font-bold">Office:</span> {s.responsibleOffice}</div>}
                  {s.subCity && <div><span className="font-mono text-slate-500 font-bold">Location:</span> {s.subCity} / {s.woreda}</div>}
                  {s.allowance && (
                    <div>
                      <span className="font-mono text-slate-500 font-bold">Allowance:</span> {s.allowance.amount} ETB ({s.allowance.paymentStatus})
                    </div>
                  )}
                  {s.assistiveDevice && (
                    <div><span className="font-mono text-slate-500 font-bold">Assistive device:</span> {s.assistiveDevice.requestType}</div>
                  )}
                  {s.referral && (
                    <div><span className="font-mono text-slate-500 font-bold">Referral to:</span> {s.referral.destinationInstitution}</div>
                  )}
                  {s.confirmationConfirmedAt && (
                    <div>
                      <span className="font-mono text-slate-500 font-bold">Confirmed:</span>{" "}
                      {new Date(s.confirmationConfirmedAt).toLocaleDateString()}
                      {s.confirmationMethod && ` via ${s.confirmationMethod}`}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Empty message="No services requested" />
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-3 pt-2">
          {documents?.length ? (
            documents.map((d: BeneficiaryDocument) => (
              <Card key={d.id} className="rounded-xs border-[#E3E7EB] bg-white shadow-2xs overflow-hidden">
                <CardHeader className="border-b border-[#E3E7EB] bg-slate-50/50 py-3 px-5">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
                      {DOCUMENT_TYPE_LABELS[d.documentType] || d.documentType}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] uppercase font-bold rounded-xs px-2 py-0.5 border bg-slate-100 text-slate-700 border-slate-200"
                    >
                      {d.verificationStatus}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-5 text-xs">
                  <div><span className="font-mono text-slate-500 font-bold">Uploaded:</span> {new Date(d.uploadedAt).toLocaleString()}</div>
                  {d.remarks && <div className="mt-1"><span className="font-mono text-slate-500 font-bold">Notes:</span> {d.remarks}</div>}
                </CardContent>
              </Card>
            ))
          ) : (
            <Empty message="No documents attached" />
          )}
        </TabsContent>

        <TabsContent value="notes" className="space-y-3 pt-2">
          <div className="flex justify-end">
            <Dialog open={openNote} onOpenChange={setOpenNote}>
              <DialogTrigger asChild>
                <Button className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Add Note
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-xs border-[#E3E7EB] bg-white p-6 shadow-lg max-w-md">
                <DialogHeader className="border-b border-[#E3E7EB] pb-3">
                  <DialogTitle className="text-base font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
                    Add Case Note
                  </DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={noteForm.handleSubmit(onAddNote)}
                  className="space-y-3 pt-2"
                >
                  <Textarea
                    placeholder="Enter case note..."
                    className="text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                    {...noteForm.register("note")}
                  />
                  <input type="hidden" {...noteForm.register("category")} />
                  <DialogFooter className="pt-3 border-t border-[#E3E7EB]">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-slate-50"
                      onClick={() => setOpenNote(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={addNote.isPending}
                      className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs"
                    >
                      {addNote.isPending && (
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      )}
                      Save Note
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {notes?.length ? (
            notes.map((n: CaseNote) => (
              <Card key={n.id} className="rounded-xs border-[#E3E7EB] bg-white shadow-2xs overflow-hidden">
                <CardHeader className="border-b border-[#E3E7EB] bg-slate-50/50 py-3 px-5">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
                    {n.author
                      ? `${n.author.firstName} ${n.author.lastName}`
                      : "Staff"}
                  </CardTitle>
                  <CardDescription className="text-[11px] font-mono text-slate-500 mt-0.5">
                    {new Date(n.createdAt).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-5 text-xs text-slate-700">{n.note}</CardContent>
              </Card>
            ))
          ) : (
            <Empty message="No case notes" />
          )}
        </TabsContent>

        <TabsContent value="timeline" className="space-y-2 pt-2">
          {timeline.length ? (
            timeline.map((entry, idx) => (
              <div
                key={idx}
                className="flex gap-3 items-start border-l-2 border-[#BCD5EA] pl-3 py-2 bg-white rounded-xs border border-[#E3E7EB] p-3 shadow-2xs"
              >
                <div className="text-[11px] font-mono text-slate-500 shrink-0">
                  {new Date(entry.date).toLocaleString()}
                </div>
                <div className="text-xs">
                  <span className="font-bold text-[#0B1F3A] font-mono">{entry.kind}</span> —{" "}
                  <span className="text-slate-600">
                    {summarize(entry.kind, entry.payload)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <Empty message="No timeline events" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Header({ client }: { client: Beneficiary }) {
  const fullName = [client.firstName, client.lastName, client.grandfatherName]
    .filter(Boolean)
    .join(" ");

  const isElderly = client.clientCategory === "ELDERLY";

  return (
    <div className="border-b border-[#E3E7EB] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
            {fullName}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          <Badge
            variant="outline"
            className={`font-mono text-[10px] uppercase font-bold rounded-xs px-2 py-0.5 border ${
              isElderly
                ? "bg-purple-50 text-purple-700 border-purple-200"
                : "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]"
            }`}
          >
            {client.clientCategory}
          </Badge>
          {(client.faydaId || client.cityIdNumber) && (
            <span className="font-mono text-xs text-slate-600 bg-slate-50 px-2 py-0.5 rounded-xs border border-slate-200/80">
              {client.faydaId ?? client.cityIdNumber}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Overview({ client }: { client: Beneficiary }) {
  const fullName = [client.firstName, client.lastName, client.grandfatherName]
    .filter(Boolean)
    .join(" ");

  return (
    <Card className="rounded-xs border-[#E3E7EB] bg-white shadow-2xs overflow-hidden">
      <CardHeader className="border-b border-[#E3E7EB] bg-slate-50/50 py-3 px-5">
        <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-xs">
        <Field label="Full Name" value={fullName} />
        <Field label="Phone" value={client.phoneNumber ?? "—"} />
        <Field label="Age" value={client.age?.toString() ?? "—"} />
        <Field label="Sex" value={client.sex ?? "—"} />
        <Field
          label="Address"
          value={`${client.subCity ?? "—"}${client.woreda ? ` / ${client.woreda}` : ""}`}
        />
        <Field label="Education" value={client.educationLevel ?? "—"} />
        <Field label="Occupation" value={client.occupation ?? "—"} />
        <Field label="Employment" value={client.employmentStatus ?? "—"} />
        <Field label="Marital Status" value={client.maritalStatus ?? "—"} />
        {client.DisabilityProfile?.documentName && (
          <div className="col-span-full pt-3 border-t border-[#E3E7EB] mt-1">
            <div className="text-[10px] font-mono font-bold uppercase text-slate-500">Supporting Document / Medical Evidence</div>
            <div className="font-mono text-xs text-slate-800 flex items-center gap-1.5 mt-1 bg-slate-50 px-3 py-2 rounded-xs border border-[#E3E7EB] w-fit">
              <FileText className="w-4 h-4 text-[#1769AA]" />
              <span>{client.DisabilityProfile.documentName}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="font-semibold text-slate-800 font-mono mt-0.5">{value}</div>
    </div>
  );
}

function Empty({ message }: { message: string }) {
  return (
    <div className="rounded-xs border border-dashed border-[#E3E7EB] bg-slate-50/50 p-8 text-center text-slate-400 font-mono text-xs uppercase tracking-wider">
      {message}
    </div>
  );
}

function summarize(kind: string, payload: any): string {
  if (kind === "SERVICE_REQUEST") {
    return `${payload.serviceType} • ${payload.status}`;
  }
  if (kind === "ELIGIBILITY") {
    return `Decision: ${payload.decision}`;
  }
  if (kind === "TRAINING") {
    return `${payload.trainingType} @ ${payload.provider}`;
  }
  if (kind === "JOB") {
    return `${payload.jobTitle} @ ${payload.companyIdNumber}`;
  }
  if (kind === "SUPPORT") {
    return `${payload.amountOrQuantity} (${payload.provider})`;
  }
  if (kind === "NOTE") {
    return payload.note;
  }
  if (kind === "AUDIT") {
    return `${payload.action} on ${payload.entityType}#${payload.entityId ?? ""}`;
  }
  return "";
}
