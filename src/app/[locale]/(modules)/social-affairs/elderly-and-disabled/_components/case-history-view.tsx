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
import { FileText, FileCheck, FilePlus, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { caseNoteSchema, CaseNoteFormValues } from "@/schemas/srs-beneficiaries";
import { zodResolver } from "@hookform/resolvers/zod";

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
      <div className="p-6 flex items-center justify-center text-slate-500">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> {tCase("loading")}
      </div>
    );
  }

  if (!data) {
    return <div className="p-6 text-slate-500">{tCase("notFound")}</div>;
  }

  const { client, timeline } = data;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <Header client={client} />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="eligibility">{t("eligibility")}</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="documents">{t("documents")}</TabsTrigger>
          <TabsTrigger value="notes">Case Notes</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Overview client={client} />
        </TabsContent>

        <TabsContent value="eligibility" className="space-y-3">
          {client.EligibilityAssessment?.length ? (
            client.EligibilityAssessment.map((e: EligibilityAssessment) => (
              <Card key={e.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>
                      {new Date(e.assessedAt).toLocaleDateString()}
                    </CardTitle>
                    <Badge variant={e.decision === "ELIGIBLE" ? "default" : e.decision === "NOT_ELIGIBLE" ? "destructive" : "secondary"}>
                      {e.decision}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div>Residency: {e.residencyVerified ? "✓" : "✗"}</div>
                  <div>Community confirmation: {e.communityConfirmation ? "✓" : "✗"}</div>
                  <div>Woreda confirmation: {e.woredaConfirmation ? "✓" : "✗"}</div>
                  <div>Medical: {e.medicalVerificationStatus}</div>
                  {e.decisionNotes && <div>Notes: {e.decisionNotes}</div>}
                  {e.rejectionReason && <div>Rejection: {e.rejectionReason}</div>}
                </CardContent>
              </Card>
            ))
          ) : (
            <Empty message="No eligibility assessments yet" />
          )}
        </TabsContent>

        <TabsContent value="services" className="space-y-3">
          {client.ServiceRequest?.length ? (
            client.ServiceRequest.map((s: ServiceRequest) => (
              <Card key={s.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{SERVICE_TYPE_LABELS[s.serviceType]}</CardTitle>
                    <Badge variant="outline">{SERVICE_STATUS_LABELS[s.status]}</Badge>
                  </div>
                  <CardDescription>
                    Requested: {new Date(s.requestDate).toLocaleDateString()}
                    {s.serviceDate &&
                      ` • Service: ${new Date(s.serviceDate).toLocaleDateString()}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  {s.responsibleOffice && <div>Office: {s.responsibleOffice}</div>}
                  {s.subCity && <div>Location: {s.subCity} / {s.woreda}</div>}
                  {s.allowance && (
                    <div>
                      Allowance: {s.allowance.amount} ETB ({s.allowance.paymentStatus})
                    </div>
                  )}
                  {s.assistiveDevice && (
                    <div>Assistive device: {s.assistiveDevice.requestType}</div>
                  )}
                  {s.referral && (
                    <div>Referral to: {s.referral.destinationInstitution}</div>
                  )}
                  {s.confirmationConfirmedAt && (
                    <div>
                      Confirmed:{" "}
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

        <TabsContent value="documents" className="space-y-3">
          {documents?.length ? (
            documents.map((d: BeneficiaryDocument) => (
              <Card key={d.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{DOCUMENT_TYPE_LABELS[d.documentType]}</CardTitle>
                    <Badge variant="outline">{d.verificationStatus}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="text-sm">
                  <div>Uploaded: {new Date(d.uploadedAt).toLocaleString()}</div>
                  {d.remarks && <div>Notes: {d.remarks}</div>}
                </CardContent>
              </Card>
            ))
          ) : (
            <Empty message="No documents attached" />
          )}
        </TabsContent>

        <TabsContent value="notes" className="space-y-3">
          <div className="flex justify-end">
            <Dialog open={openNote} onOpenChange={setOpenNote}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" /> Add Note
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Case Note</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={noteForm.handleSubmit(onAddNote)}
                  className="space-y-3"
                >
                  <Textarea
                    placeholder="Note..."
                    {...noteForm.register("note")}
                  />
                  <input type="hidden" {...noteForm.register("category")} />
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpenNote(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={addNote.isPending}>
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {notes?.length ? (
            notes.map((n: CaseNote) => (
              <Card key={n.id}>
                <CardHeader>
                  <CardTitle>
                    {n.author
                      ? `${n.author.firstName} ${n.author.lastName}`
                      : "Staff"}
                  </CardTitle>
                  <CardDescription>
                    {new Date(n.createdAt).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm">{n.note}</CardContent>
              </Card>
            ))
          ) : (
            <Empty message="No case notes" />
          )}
        </TabsContent>

        <TabsContent value="timeline" className="space-y-2">
          {timeline.length ? (
            timeline.map((entry, idx) => (
              <div
                key={idx}
                className="flex gap-3 items-start border-l-2 border-slate-200 pl-3 py-2"
              >
                <div className="text-xs text-slate-500">
                  {new Date(entry.date).toLocaleString()}
                </div>
                <div className="text-sm">
                  <span className="font-medium">{entry.kind}</span> —{" "}
                  <span className="text-slate-500">
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
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-lexend">
          {client.firstName} {client.lastName}
        </h1>
        <p className="text-slate-500 mt-1">
          {client.faydaId ?? client.cityIdNumber ?? "—"} •{" "}
          {client.clientCategory}
        </p>
      </div>
    </div>
  );
}

function Overview({ client }: { client: Beneficiary }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 text-sm">
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
        <Field label="Marital" value={client.maritalStatus ?? "—"} />
      </CardContent>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function Empty({ message }: { message: string }) {
  return <div className="text-slate-500 p-6 text-center">{message}</div>;
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
