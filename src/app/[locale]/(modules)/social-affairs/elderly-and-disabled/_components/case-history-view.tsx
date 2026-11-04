"use client";

import { useTranslations, useLocale } from "next-intl";
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
import { Input } from "@/components/ui/input";
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
  useUpdateBeneficiary,
} from "@/hooks/beneficiaries/srs-hooks";
import { Checkbox } from "@/components/ui/checkbox";
import {
  SERVICE_TYPE_LABELS,
  SERVICE_STATUS_LABELS,
  DOCUMENT_TYPE_LABELS,
  Beneficiary,
  ServiceRequest,
  EligibilityAssessment,
  CaseNote,
  BeneficiaryDocument,
  TrainingField,
  WorkplaceCondition,
} from "@/api/beneficiaries/types-v2";
import {
  FileText,
  FileCheck,
  FilePlus,
  Loader2,
  Plus,
  History,
  Briefcase,
  Pencil,
  Users,
  User,
  UserCheck,
  Edit3,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  HandHeart,
  StickyNote,
  Activity,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { caseNoteSchema, CaseNoteFormValues } from "@/schemas/srs-beneficiaries";
import { zodResolver } from "@hookform/resolvers/zod";
import CrossDepartmentHistory from "@/components/shared/cross-department-history";
import { BeneficiaryReportMenu } from "./beneficiary-report-menu";
import { AssistiveDeviceSelect } from "./beneficiary-form-body";

interface CaseHistoryViewProps {
  clientId: number;
}

export default function CaseHistoryView({ clientId }: CaseHistoryViewProps) {
  const t = useTranslations("social-affairs.elderlyAndDisabled.srs");
  const tCase = useTranslations("social-affairs.elderlyAndDisabled.profile");
  const locale = useLocale() === "en" ? "en" : "am";
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

  if (!data || !data.client) {
    return (
      <div className="rounded-xs border border-dashed border-[#E3E7EB] bg-white p-12 text-center text-slate-400 font-mono text-xs uppercase tracking-wider">
        {tCase("notFound")}
      </div>
    );
  }

  const client = data.client;
  const timeline = data.timeline || [];

  return (
    <div className="space-y-6 w-full">
      <Header client={client} />

      <Tabs defaultValue="overview">
        <TabsList className="h-9 p-1 rounded-xs bg-slate-100 border border-[#E3E7EB] flex-wrap">
          <TabsTrigger
            value="overview"
            className="h-7 px-3 text-xs font-mono uppercase tracking-wider rounded-xs data-[state=active]:bg-[#1769AA] data-[state=active]:text-white data-[state=active]:shadow-2xs font-bold"
          >
            {tCase("tabs.overview")}
          </TabsTrigger>
          <TabsTrigger
            value="eligibility"
            className="h-7 px-3 text-xs font-mono uppercase tracking-wider rounded-xs data-[state=active]:bg-[#1769AA] data-[state=active]:text-white data-[state=active]:shadow-2xs font-bold"
          >
            {tCase("tabs.eligibility")}
          </TabsTrigger>
          <TabsTrigger
            value="services"
            className="h-7 px-3 text-xs font-mono uppercase tracking-wider rounded-xs data-[state=active]:bg-[#1769AA] data-[state=active]:text-white data-[state=active]:shadow-2xs font-bold"
          >
            {tCase("tabs.services")}
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="h-7 px-3 text-xs font-mono uppercase tracking-wider rounded-xs data-[state=active]:bg-[#1769AA] data-[state=active]:text-white data-[state=active]:shadow-2xs font-bold"
          >
            {tCase("tabs.documents")}
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            className="h-7 px-3 text-xs font-mono uppercase tracking-wider rounded-xs data-[state=active]:bg-[#1769AA] data-[state=active]:text-white data-[state=active]:shadow-2xs font-bold"
          >
            {tCase("tabs.notes")}
          </TabsTrigger>
          <TabsTrigger
            value="timeline"
            className="h-7 px-3 text-xs font-mono uppercase tracking-wider rounded-xs data-[state=active]:bg-[#1769AA] data-[state=active]:text-white data-[state=active]:shadow-2xs font-bold"
          >
            {tCase("tabs.timeline")}
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
                      {tCase("assessment.title", { date: new Date(e.assessedAt).toLocaleDateString() })}
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
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-500">{tCase("assessment.residency")}</span>{" "}
                    <span className="font-semibold text-slate-800">{e.residencyVerified ? tCase("assessment.verified") : tCase("assessment.notVerified")}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-500">{tCase("assessment.communityConfirmation")}</span>{" "}
                    <span className="font-semibold text-slate-800">{e.communityConfirmation ? tCase("assessment.confirmed") : tCase("assessment.pending")}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-500">{tCase("assessment.woredaConfirmation")}</span>{" "}
                    <span className="font-semibold text-slate-800">{e.woredaConfirmation ? tCase("assessment.confirmed") : tCase("assessment.pending")}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-500">{tCase("assessment.medicalStatus")}</span>{" "}
                    <span className="font-semibold text-slate-800">{e.medicalVerificationStatus}</span>
                  </div>
                  {e.decisionNotes && (
                    <div className="col-span-full pt-1">
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-500">{tCase("assessment.decisionNotes")}</span>{" "}
                      <span className="text-slate-700">{e.decisionNotes}</span>
                    </div>
                  )}
                  {e.rejectionReason && (
                    <div className="col-span-full pt-1 text-rose-600">
                      <span className="text-[10px] font-mono font-bold uppercase text-rose-500">{tCase("assessment.rejectionReason")}</span>{" "}
                      <span>{e.rejectionReason}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Empty message={tCase("assessment.noAssessments")} />
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
                    {tCase("serviceRecord.requested", { date: new Date(s.requestDate).toLocaleDateString() })}
                    {s.serviceDate &&
                      tCase("serviceRecord.serviceDate", { date: new Date(s.serviceDate).toLocaleDateString() })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-5 text-xs space-y-1.5">
                  {s.responsibleOffice && <div><span className="font-mono text-slate-500 font-bold">{tCase("serviceRecord.office")}</span> {s.responsibleOffice}</div>}
                  {s.subCity && <div><span className="font-mono text-slate-500 font-bold">{tCase("serviceRecord.location")}</span> {s.subCity} / {s.woreda}</div>}
                  {s.allowance && (
                    <div>
                      <span className="font-mono text-slate-500 font-bold">{tCase("serviceRecord.allowance")}</span> {s.allowance.amount} ETB ({s.allowance.paymentStatus})
                    </div>
                  )}
                  {s.assistiveDevice && (
                    <div>
                      <span className="font-mono text-slate-500 font-bold">{tCase("serviceRecord.assistiveDevice")}</span>{" "}
                      {s.assistiveDevice.description || s.assistiveDevice.requestType} ({s.assistiveDevice.confirmationStatus || "PENDING"})
                    </div>
                  )}
                  {s.remarks && (
                    <div>
                      <span className="font-mono text-slate-500 font-bold">
                        {locale === "am" ? "ማስታወሻ:" : "Remarks:"}
                      </span>{" "}
                      {s.remarks}
                    </div>
                  )}
                  {s.referral && (
                    <div><span className="font-mono text-slate-500 font-bold">{tCase("serviceRecord.referral")}</span> {s.referral.destinationInstitution}</div>
                  )}
                  {s.confirmationConfirmedAt && (
                    <div>
                      {tCase("serviceRecord.confirmedVia", {
                        date: new Date(s.confirmationConfirmedAt).toLocaleDateString(),
                        method: s.confirmationMethod || "N/A",
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Empty message={tCase("serviceRecord.noServices")} />
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
                  <div>
                    <span className="font-mono text-slate-500 font-bold">
                      {tCase("documentsSection.uploadedOn", { date: new Date(d.uploadedAt).toLocaleString() })}
                    </span>
                  </div>
                  {d.remarks && <div className="mt-1"><span className="font-mono text-slate-500 font-bold">Notes:</span> {d.remarks}</div>}
                </CardContent>
              </Card>
            ))
          ) : (
            <Empty message={tCase("documentsSection.noDocuments")} />
          )}
        </TabsContent>

        <TabsContent value="notes" className="space-y-3 pt-2">
          <div className="flex justify-end">
            <Dialog open={openNote} onOpenChange={setOpenNote}>
              <DialogTrigger asChild>
                <Button className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs gap-1.5 cursor-pointer">
                  <Plus className="w-3.5 h-3.5" /> {tCase("notesSection.addNote")}
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-xs border-[#E3E7EB] bg-white p-6 shadow-lg max-w-md">
                <DialogHeader className="border-b border-[#E3E7EB] pb-3">
                  <DialogTitle className="text-base font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
                    {tCase("notesSection.addNote")}
                  </DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={noteForm.handleSubmit(onAddNote)}
                  className="space-y-3 pt-2"
                >
                  <Textarea
                    placeholder={tCase("notesSection.notePlaceholder")}
                    className="text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                    {...noteForm.register("note")}
                  />
                  <input type="hidden" {...noteForm.register("category")} />
                  <DialogFooter className="pt-3 border-t border-[#E3E7EB]">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-slate-50 cursor-pointer"
                      onClick={() => setOpenNote(false)}
                    >
                      {tCase("notesSection.cancel")}
                    </Button>
                    <Button
                      type="submit"
                      disabled={addNote.isPending}
                      className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs cursor-pointer"
                    >
                      {addNote.isPending && (
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      )}
                      {tCase("notesSection.saveNote")}
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
            <Empty message={tCase("notesSection.noNotes")} />
          )}
        </TabsContent>

        <TabsContent value="timeline" className="space-y-3 pt-2">
          {timeline.length ? (
            <div className="space-y-2.5">
              {timeline.map((entry, idx) => {
                const meta = getTimelineMeta(entry, locale);
                const Icon = meta.icon;
                const formattedDate = new Date(entry.date).toLocaleString(
                  locale === "am" ? "am-ET" : "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                );

                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 p-3.5 bg-white rounded-xs border border-[#E3E7EB] shadow-2xs hover:border-[#BCD5EA] transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${meta.categoryColor}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-[#0B1F3A] font-mono">
                            {meta.title}
                          </span>
                          <span
                            className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded border ${meta.categoryColor}`}
                          >
                            {meta.category}
                          </span>
                          {meta.metaBadge && (
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                              {meta.metaBadge}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 shrink-0">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{formattedDate}</span>
                        </div>
                      </div>

                      {meta.description && (
                        <p className="text-xs text-slate-600 mt-1 font-normal leading-relaxed">
                          {meta.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
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

  const locale = useLocale() === "en" ? "en" : "am";
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
            {isElderly ? (locale === "am" ? "አረጋዊ" : "Elderly") : (locale === "am" ? "አካል ጉዳተኛ" : "Disability")}
          </Badge>
          {(client.faydaId || client.cityIdNumber) && (
            <span className="font-mono text-xs text-slate-600 bg-slate-50 px-2 py-0.5 rounded-xs border border-slate-200/80">
              {client.faydaId ?? client.cityIdNumber}
            </span>
          )}
          {client.isDeceased && (
            <Badge
              variant="outline"
              className="font-mono text-[10px] uppercase font-bold rounded-xs px-2 py-0.5 border bg-rose-50 text-rose-700 border-rose-200"
            >
              {locale === "am" ? "በሞት የተለዩ" : "Deceased"}
            </Badge>
          )}
          {client.previousSubCity && (
            <Badge
              variant="outline"
              className="font-mono text-[10px] uppercase font-bold rounded-xs px-2 py-0.5 border bg-purple-50 text-purple-700 border-purple-200"
            >
              {locale === "am"
                ? `ከ${client.previousSubCity} ${client.previousWoreda || ""} የተዛወሩ`
                : `Relocated from ${client.previousSubCity} ${client.previousWoreda || ""}`}
            </Badge>
          )}
          {client.ElderlyProfile?.isAssociationMember && (
            <Badge
              variant="outline"
              className="font-mono text-[10px] uppercase font-bold rounded-xs px-2 py-0.5 border bg-blue-50 text-blue-700 border-blue-200"
            >
              {locale === "am" ? "የማህበር አባል" : "Association Member"}
            </Badge>
          )}
          {client.ElderlyProfile?.isDirectSupport && (
            <Badge
              variant="outline"
              className="font-mono text-[10px] uppercase font-bold rounded-xs px-2 py-0.5 border bg-amber-50 text-amber-700 border-amber-200"
            >
              {locale === "am" ? "ቀ.ድ. ተጠቃሚ" : "Direct Support"}
            </Badge>
          )}
          {client.ElderlyProfile?.hasHealthInsurance && (
            <Badge
              variant="outline"
              className="font-mono text-[10px] uppercase font-bold rounded-xs px-2 py-0.5 border bg-teal-50 text-teal-700 border-teal-200"
            >
              {locale === "am" ? "የጤና መድህን" : "Health Insurance"}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <BeneficiaryReportMenu beneficiary={client} />
      </div>
    </div>
  );
}

function EditPersonalInfoDialog({ client }: { client: Beneficiary }) {
  const [open, setOpen] = useState(false);
  const updateBeneficiary = useUpdateBeneficiary(client.id);
  const locale = useLocale() === "en" ? "en" : "am";

  const [firstName, setFirstName] = useState(client.firstName || "");
  const [lastName, setLastName] = useState(client.lastName || "");
  const [grandfatherName, setGrandfatherName] = useState(client.grandfatherName || "");
  const [phoneNumber, setPhoneNumber] = useState(client.phoneNumber || "");
  const [age, setAge] = useState(client.age?.toString() || "");
  const [sex, setSex] = useState(client.sex || "MALE");
  const [maritalStatus, setMaritalStatus] = useState(client.maritalStatus || "");
  const [educationLevel, setEducationLevel] = useState(client.educationLevel || "");
  const [occupation, setOccupation] = useState(client.occupation || "");
  const [employmentStatus, setEmploymentStatus] = useState(client.employmentStatus || "");
  const [subCity, setSubCity] = useState(client.subCity || "");
  const [woreda, setWoreda] = useState(client.woreda || "");
  const [zone, setZone] = useState(client.zone || "");
  const [block, setBlock] = useState(client.block || "");
  const [houseNumber, setHouseNumber] = useState(client.houseNumber || "");

  const handleSave = () => {
    updateBeneficiary.mutate(
      {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        grandfatherName: grandfatherName || undefined,
        phoneNumber: phoneNumber || undefined,
        age: age ? parseInt(age, 10) : undefined,
        sex: sex as any,
        maritalStatus: (maritalStatus as any) || undefined,
        educationLevel: educationLevel || undefined,
        occupation: occupation || undefined,
        employmentStatus: (employmentStatus as any) || undefined,
        subCity: subCity || undefined,
        woreda: woreda || undefined,
        zone: zone || undefined,
        block: block || undefined,
        houseNumber: houseNumber || undefined,
      },
      {
        onSuccess: () => {
          toast.success(
            locale === "am"
              ? "የግል መረጃ በተሳካ ሁኔታ ተዘምኗል"
              : "Personal information updated successfully"
          );
          setOpen(false);
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message ||
              (locale === "am" ? "መረጃውን ማዘመን አልተቻለም" : "Failed to update profile")
          );
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2.5 text-xs font-mono uppercase tracking-wider rounded-xs border-[#E3E7EB] hover:bg-slate-100 gap-1 text-[#1769AA]"
        >
          <Pencil className="w-3 h-3" />
          <span>{locale === "am" ? "አስተካክል" : "Edit"}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto rounded-xs bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-sm font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-2">
            <User className="w-4 h-4 text-[#1769AA]" />
            <span>{locale === "am" ? "የግል መረጃ ማስተካከያ" : "Edit Personal Information"}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-3 text-xs font-mono">
          {/* Name fields */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-slate-600 font-bold block mb-1">
                {locale === "am" ? "ስም" : "First Name"}
              </label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={locale === "am" ? "ስም" : "First Name"}
                className="h-8 text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 font-bold block mb-1">
                {locale === "am" ? "የአባት ስም" : "Father's Name"}
              </label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={locale === "am" ? "የአባት ስም" : "Father's Name"}
                className="h-8 text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 font-bold block mb-1">
                {locale === "am" ? "የአያት ስም" : "Grandfather's Name"}
              </label>
              <Input
                value={grandfatherName}
                onChange={(e) => setGrandfatherName(e.target.value)}
                placeholder={locale === "am" ? "የአያት ስም" : "Grandfather's Name"}
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>

          {/* Demographics: Phone, Age, Sex */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-slate-600 font-bold block mb-1">
                {locale === "am" ? "ስልክ ቁጥር" : "Phone Number"}
              </label>
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="09..."
                className="h-8 text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 font-bold block mb-1">
                {locale === "am" ? "እድሜ" : "Age"}
              </label>
              <Input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="65"
                className="h-8 text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 font-bold block mb-1">
                {locale === "am" ? "ፆታ" : "Sex"}
              </label>
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value as "MALE" | "FEMALE" | "OTHER")}
                className="w-full h-8 px-2 border border-slate-200 rounded-xs bg-white text-xs font-mono"
              >

                <option value="MALE">{locale === "am" ? "ወንድ" : "Male"}</option>
                <option value="FEMALE">{locale === "am" ? "ሴት" : "Female"}</option>
              </select>
            </div>
          </div>

          {/* Marital & Employment */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-600 font-bold block mb-1">
                {locale === "am" ? "የጋብቻ ሁኔታ" : "Marital Status"}
              </label>
              <select
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
                className="w-full h-8 px-2 border border-slate-200 rounded-xs bg-white text-xs font-mono"
              >
                <option value="">— {locale === "am" ? "ይምረጡ" : "Select"} —</option>
                <option value="MARRIED">{locale === "am" ? "ባለትዳር" : "Married"}</option>
                <option value="SINGLE">{locale === "am" ? "ያላገባ/ች" : "Single"}</option>
                <option value="WIDOWED">{locale === "am" ? "በሞት የተለየ/ች" : "Widowed"}</option>
                <option value="DIVORCED">{locale === "am" ? "የተፋታ/ች" : "Divorced"}</option>
              </select>
            </div>
            <div>
              <label className="text-slate-600 font-bold block mb-1">
                {locale === "am" ? "የሥራ ሁኔታ" : "Employment Status"}
              </label>
              <select
                value={employmentStatus}
                onChange={(e) => setEmploymentStatus(e.target.value)}
                className="w-full h-8 px-2 border border-slate-200 rounded-xs bg-white text-xs font-mono"
              >
                <option value="">— {locale === "am" ? "ይምረጡ" : "Select"} —</option>
                <option value="EMPLOYED">{locale === "am" ? "ተቀጣሪ" : "Employed"}</option>
                <option value="SELF_EMPLOYED">{locale === "am" ? "የግል ስራ" : "Self-Employed"}</option>
                <option value="UNEMPLOYED">{locale === "am" ? "ስራ አጥ" : "Unemployed"}</option>
              </select>
            </div>
          </div>

          {/* Education & Occupation */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-600 font-bold block mb-1">
                {locale === "am" ? "የትምህርት ደረጃ" : "Education Level"}
              </label>
              <Input
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                placeholder={locale === "am" ? "ምሳሌ፡ 8ኛ ክፍል" : "e.g. Primary, High School..."}
                className="h-8 text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 font-bold block mb-1">
                {locale === "am" ? "ሙያ" : "Occupation"}
              </label>
              <Input
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder={locale === "am" ? "ምሳሌ፡ ጡረተኛ፣ ነጋዴ..." : "e.g. Retired, Trader..."}
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold uppercase text-slate-500 block mb-2">
              {locale === "am" ? "የመኖሪያ አድራሻ" : "Address Information"}
            </span>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="text-slate-600 font-bold block mb-1">
                  {locale === "am" ? "ክፍለ ከተማ" : "Sub-City"}
                </label>
                <Input
                  value={subCity}
                  onChange={(e) => setSubCity(e.target.value)}
                  placeholder={locale === "am" ? "ምሳሌ፡ ቂርቆስ" : "e.g. Kirkos"}
                  className="h-8 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-slate-600 font-bold block mb-1">
                  {locale === "am" ? "ወረዳ" : "Woreda"}
                </label>
                <Input
                  value={woreda}
                  onChange={(e) => setWoreda(e.target.value)}
                  placeholder={locale === "am" ? "ምሳሌ፡ ወረዳ 07" : "e.g. Woreda 07"}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-slate-600 font-bold block mb-1">
                  {locale === "am" ? "ቀጠና" : "Ketena"}
                </label>
                <Input
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  placeholder={locale === "am" ? "ምሳሌ፡ 02" : "e.g. 02"}
                  className="h-8 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-slate-600 font-bold block mb-1">
                  {locale === "am" ? "ብሎክ" : "Block"}
                </label>
                <Input
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  placeholder={locale === "am" ? "ምሳሌ፡ 14" : "e.g. 14"}
                  className="h-8 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-slate-600 font-bold block mb-1">
                  {locale === "am" ? "የቤት ቁጥር" : "House Number"}
                </label>
                <Input
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                  placeholder={locale === "am" ? "ምሳሌ፡ 124" : "e.g. 124"}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-[#E3E7EB] pt-3 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
            className="h-8 text-xs font-mono rounded-xs"
          >
            {locale === "am" ? "ሰርዝ" : "Cancel"}
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={updateBeneficiary.isPending}
            className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white"
          >
            {updateBeneficiary.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
            {locale === "am" ? "መረጃውን መዝግብ" : "Save Profile"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditWorkOrTrainingDialog({ client }: { client: Beneficiary }) {
  const [open, setOpen] = useState(false);
  const updateBeneficiary = useUpdateBeneficiary(client.id);
  const locale = useLocale() === "en" ? "en" : "am";

  const isElderly = client.clientCategory === "ELDERLY" || Boolean(client.ElderlyProfile);
  const initialProfile = client.ElderlyProfile || client.DisabilityProfile;

  // Vocational/Work fields
  const [workplace, setWorkplace] = useState<string>(initialProfile?.workplaceCondition || "");
  const [pref1, setPref1] = useState<string>(initialProfile?.preferredTraining1 || "");
  const [pref2, setPref2] = useState<string>(initialProfile?.preferredTraining2 || "");
  const [pref3, setPref3] = useState<string>(initialProfile?.preferredTraining3 || "");
  const [profession, setProfession] = useState<string>(initialProfile?.previousProfession || "");
  const [assistiveDevice, setAssistiveDevice] = useState<string>(
    client.DisabilityProfile?.requiredAssistiveDevice || ""
  );
  const [support, setSupport] = useState<string>(
    isElderly
      ? client.ElderlyProfile?.requiredSupportType || ""
      : client.DisabilityProfile?.otherSupportRequirements || ""
  );

  const handleSave = () => {
    updateBeneficiary.mutate(
      {
        workplaceCondition: (workplace as any) || undefined,
        preferredTraining1: (pref1 as any) || undefined,
        preferredTraining2: (pref2 as any) || undefined,
        preferredTraining3: (pref3 as any) || undefined,
        previousProfession: profession || undefined,
        previousTraining: Boolean(profession),
        requiredSupportType: isElderly ? support || undefined : undefined,
        otherSupportRequirements: !isElderly ? support || undefined : undefined,
        requiredAssistiveDevice: !isElderly ? assistiveDevice || undefined : undefined,
      },
      {
        onSuccess: () => {
          toast.success(
            isElderly
              ? (locale === "am"
                  ? "የሥራ እና የድጋፍ መረጃ በተሳካ ሁኔታ ተዘምኗል"
                  : "Work & Support profile updated successfully")
              : (locale === "am"
                  ? "የሙያ ስልጠና እና የድጋፍ መረጃ በተሳካ ሁኔታ ተዘምኗል"
                  : "Vocational training profile updated successfully")
          );
          setOpen(false);
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message ||
              (locale === "am"
                ? "መረጃውን ማዘመን አልተቻለም"
                : "Failed to update profile")
          );
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2.5 text-xs font-mono uppercase tracking-wider rounded-xs border-[#E3E7EB] hover:bg-slate-100 gap-1 text-[#1769AA]"
        >
          <Pencil className="w-3 h-3" />
          <span>{locale === "am" ? "መረጃውን አስተካክል" : "Edit Profile"}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto rounded-xs bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-sm font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#1769AA]" />
            <span>
              {isElderly
                ? (locale === "am"
                    ? "የሥራ እና የድጋፍ ሁኔታ ማስተካከያ"
                    : "Edit Work & Support Profile")
                : (locale === "am"
                    ? "የሙያ ስልጠና እና የድጋፍ ሁኔታ ማስተካከያ"
                    : "Edit Vocational Training Profile")}
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-3 text-xs font-mono">
          {/* Work / Training Details */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-slate-600 font-bold">
                {locale === "am" ? "የመስሪያ ቦታ ሁኔታ" : "Workplace Status"}
              </label>
              <select
                value={workplace}
                onChange={(e) => setWorkplace(e.target.value)}
                className="w-full h-8 px-2 border border-slate-200 rounded-xs bg-white text-xs font-mono"
              >
                <option value="">{locale === "am" ? "— የመስሪያ ቦታ ሁኔታ ይምረጡ —" : "— Select Workplace Status —"}</option>
                <option value="OWN_PRIVATE">{locale === "am" ? "የግል" : "Private / Owned"}</option>
                <option value="KEBELE_PUBLIC">{locale === "am" ? "የቀበሌ" : "Kebele / Public"}</option>
                <option value="RENTED">{locale === "am" ? "የተከራዩት" : "Rented"}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-600 font-bold">
                {isElderly
                  ? (locale === "am" ? "1ኛ የሚፈልጉት የሥራ መስክ" : "1st Desired Work Field")
                  : (locale === "am" ? "1ኛ የሚፈልጉት የሙያ ስልጠና" : "1st Desired Training")}
              </label>
              <Input
                value={pref1}
                onChange={(e) => setPref1(e.target.value)}
                placeholder={
                  locale === "am"
                    ? "ምሳሌ፡ የከተማ ግብርና፣ ዳቦ መጋገሪያ፣ ንግድ..."
                    : "e.g. Urban Agriculture, Bakery, Business..."
                }
                className="h-8 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-600 font-bold">
                {isElderly
                  ? (locale === "am" ? "2ኛ የሚፈልጉት የሥራ መስክ" : "2nd Desired Work Field")
                  : (locale === "am" ? "2ኛ የሚፈልጉት የሙያ ስልጠና" : "2nd Desired Training")}
              </label>
              <Input
                value={pref2}
                onChange={(e) => setPref2(e.target.value)}
                placeholder={
                  locale === "am"
                    ? "ምሳሌ፡ ጨርቃጨርቅና ስፌት፣ አናጺነት..."
                    : "e.g. Textile/Garment, Carpentry..."
                }
                className="h-8 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-600 font-bold">
                {isElderly
                  ? (locale === "am" ? "3ኛ የሚፈልጉት የሥራ መስክ" : "3rd Desired Work Field")
                  : (locale === "am" ? "3ኛ የሚፈልጉት የሙያ ስልጠና" : "3rd Desired Training")}
              </label>
              <Input
                value={pref3}
                onChange={(e) => setPref3(e.target.value)}
                placeholder={
                  locale === "am"
                    ? "ምሳሌ፡ የዶሮ እርባታ፣ አይሲቲ..."
                    : "e.g. Poultry, ICT..."
                }
                className="h-8 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-600 font-bold">
                {isElderly
                  ? (locale === "am"
                      ? "ሊሰሩት የሚችሉት የስራ ዓይነት / የቀድሞ ሙያ"
                      : "Work Ability / Profession")
                  : (locale === "am"
                      ? "ቀደም ሲል የነበራቸው ስልጠና ወይም ሙያ"
                      : "Previous Training / Profession")}
              </label>
              <Input
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder={
                  locale === "am"
                    ? "ምሳሌ፡ አናጺነት፣ ልብስ ስፌት፣ አትክልት እንክብካቤ..."
                    : "e.g. Carpentry, Tailoring, Gardening..."
                }
                className="h-8 text-xs font-mono"
              />
            </div>

            {!isElderly && (
              <div className="space-y-1">
                <label className="text-slate-600 font-bold block text-xs">
                  {locale === "am"
                    ? "የሚፈለግ ድጋፍ መሳሪያ"
                    : "Required Assistive Device"}
                </label>
                <AssistiveDeviceSelect
                  value={assistiveDevice}
                  onChange={setAssistiveDevice}
                  locale={locale}
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-slate-600 font-bold">
                {isElderly
                  ? (locale === "am"
                      ? "ለሥራው የሚያስፈልግ የድጋፍ ዓይነት"
                      : "Support Needed for Work")
                  : (locale === "am"
                      ? "ቀደም ሲል ስልጠና የወሰዱ ከሆነ የሚያስፈልጋቸው የድጋፍ ዓይነት"
                      : "Support Needed if Previously Trained")}
              </label>
              <Input
                value={support}
                onChange={(e) => setSupport(e.target.value)}
                placeholder={
                  isElderly
                    ? (locale === "am"
                        ? "ምሳሌ፡ የመስሪያ ቦታ፣ መነሻ ካፒታል፣ ቁሳቁስ..."
                        : "e.g. Working Capital, Workspace, Equipment...")
                    : (locale === "am"
                        ? "ምሳሌ፡ የስራ ማስጀመሪያ እቃዎች፣ አጋዥ ቴክኖሎጂ፣ የስራ ቅጥር ድጋፍ..."
                        : "e.g. Starter Tools, Assistive Devices, Placement...")
                }
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-[#E3E7EB] pt-3 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
            className="h-8 text-xs font-mono rounded-xs"
          >
            {locale === "am" ? "ሰርዝ" : "Cancel"}
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={updateBeneficiary.isPending}
            className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white"
          >
            {updateBeneficiary.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
            {locale === "am" ? "መረጃውን መዝግብ" : "Save Profile"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditSocialProtectionDialog({ client }: { client: Beneficiary }) {
  const [open, setOpen] = useState(false);
  const updateBeneficiary = useUpdateBeneficiary(client.id);
  const locale = useLocale() === "en" ? "en" : "am";

  const [isAssociationMember, setIsAssociationMember] = useState<boolean>(
    Boolean(client.ElderlyProfile?.isAssociationMember)
  );
  const [associationName, setAssociationName] = useState<string>(
    client.ElderlyProfile?.associationName || ""
  );
  const [isDirectSupport, setIsDirectSupport] = useState<boolean>(
    Boolean(client.ElderlyProfile?.isDirectSupport)
  );
  const [hasHealthInsurance, setHasHealthInsurance] = useState<boolean>(
    Boolean(client.ElderlyProfile?.hasHealthInsurance)
  );
  const [cbhiIdNumber, setCbhiIdNumber] = useState<string>(
    client.ElderlyProfile?.cbhiIdNumber || ""
  );
  const [householdRole, setHouseholdRole] = useState<string>(
    client.ElderlyProfile?.householdRole || ""
  );
  const [caretakerStatus, setCaretakerStatus] = useState<string>(
    client.ElderlyProfile?.caretakerStatus || ""
  );
  const [previousSubCity, setPreviousSubCity] = useState<string>(
    client.previousSubCity || ""
  );
  const [previousWoreda, setPreviousWoreda] = useState<string>(
    client.previousWoreda || ""
  );
  const [isDeceased, setIsDeceased] = useState<boolean>(
    Boolean(client.isDeceased)
  );

  const handleSave = () => {
    updateBeneficiary.mutate(
      {
        isAssociationMember,
        associationName: associationName || undefined,
        isDirectSupport,
        hasHealthInsurance,
        cbhiIdNumber: cbhiIdNumber || undefined,
        householdRole: householdRole || undefined,
        caretakerStatus: caretakerStatus || undefined,
        previousSubCity: previousSubCity || undefined,
        previousWoreda: previousWoreda || undefined,
        isDeceased,
      },
      {
        onSuccess: () => {
          toast.success(
            locale === "am"
              ? "የማህበራዊ ጥበቃ እና መርሃ-ግብሮች መረጃ በተሳካ ሁኔታ ተዘምኗል"
              : "Social protection profile updated successfully"
          );
          setOpen(false);
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message ||
              (locale === "am" ? "መረጃውን ማዘመን አልተቻለም" : "Failed to update profile")
          );
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2.5 text-xs font-mono uppercase tracking-wider rounded-xs border-[#E3E7EB] hover:bg-slate-100 gap-1 text-[#1769AA]"
        >
          <Pencil className="w-3 h-3" />
          <span>{locale === "am" ? "አስተካክል" : "Edit"}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto rounded-xs bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-sm font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#1769AA]" />
            <span>
              {locale === "am"
                ? "የማህበራዊ ጥበቃ እና መርሃ-ግብሮች ማስተካከያ"
                : "Edit Social Protection & Programs"}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-3 text-xs font-mono">
          {/* Programs Checkboxes */}
          <div className="space-y-2.5 bg-slate-50 p-3 rounded-xs border border-slate-200">
            <div className="flex items-center gap-2">
              <Checkbox
                id="edit-sp-association"
                checked={isAssociationMember}
                onCheckedChange={(c) => setIsAssociationMember(Boolean(c))}
              />
              <label htmlFor="edit-sp-association" className="text-xs font-semibold cursor-pointer">
                {locale === "am" ? "የማህበር አባል" : "Association Member"}
              </label>
            </div>
            {isAssociationMember && (
              <Input
                value={associationName}
                onChange={(e) => setAssociationName(e.target.value)}
                placeholder={locale === "am" ? "የማህበሩ ስም" : "Association Name"}
                className="h-7 text-xs font-mono bg-white ml-6 w-[calc(100%-1.5rem)]"
              />
            )}

            <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
              <Checkbox
                id="edit-sp-direct"
                checked={isDirectSupport}
                onCheckedChange={(c) => setIsDirectSupport(Boolean(c))}
              />
              <label htmlFor="edit-sp-direct" className="text-xs font-semibold cursor-pointer">
                {locale === "am" ? "የቀጥታ ድጋፍ (ቀ.ድ) ተጠቃሚ" : "Direct Support Beneficiary"}
              </label>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
              <Checkbox
                id="edit-sp-cbhi"
                checked={hasHealthInsurance}
                onCheckedChange={(c) => setHasHealthInsurance(Boolean(c))}
              />
              <label htmlFor="edit-sp-cbhi" className="text-xs font-semibold cursor-pointer">
                {locale === "am" ? "የማህበረሰብ አቀፍ የጤና መድህን" : "Health Insurance (CBHI)"}
              </label>
            </div>
            {hasHealthInsurance && (
              <Input
                value={cbhiIdNumber}
                onChange={(e) => setCbhiIdNumber(e.target.value)}
                placeholder={locale === "am" ? "የመድህን ቁጥር" : "CBHI Card Number"}
                className="h-7 text-xs font-mono bg-white ml-6 w-[calc(100%-1.5rem)]"
              />
            )}
          </div>

          {/* Household Role & Caretaker */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-600 font-bold block mb-1">
                {locale === "am" ? "የቤተሰብ ሀላፊነት" : "Household Role"}
              </label>
              <select
                value={householdRole}
                onChange={(e) => setHouseholdRole(e.target.value)}
                className="w-full h-8 text-xs font-mono border border-slate-200 rounded-xs px-2 bg-white"
              >
                <option value="">— {locale === "am" ? "ይምረጡ" : "Select"} —</option>
                <option value="አባወራ">{locale === "am" ? "አባወራ" : "Male Head"}</option>
                <option value="እማወራ">{locale === "am" ? "እማወራ" : "Female Head"}</option>
                <option value="ጥገኛ">{locale === "am" ? "ጥገኛ" : "Dependent"}</option>
                <option value="ብቸኛ">{locale === "am" ? "ብቸኛ" : "Living Alone"}</option>
              </select>
            </div>

            <div>
              <label className="text-slate-600 font-bold block mb-1">
                {locale === "am" ? "የረዳት ሁኔታ" : "Caretaker Status"}
              </label>
              <select
                value={caretakerStatus}
                onChange={(e) => setCaretakerStatus(e.target.value)}
                className="w-full h-8 text-xs font-mono border border-slate-200 rounded-xs px-2 bg-white"
              >
                <option value="">— {locale === "am" ? "ይምረጡ" : "Select"} —</option>
                <option value="ያለው">{locale === "am" ? "ረዳት አላቸው" : "Has Caretaker"}</option>
                <option value="የሌለው">{locale === "am" ? "ረዳት የላቸውም" : "No Caretaker"}</option>
              </select>
            </div>
          </div>

          {/* Relocation */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-600 font-bold block mb-1">
                {locale === "am" ? "የቀድሞ ክፍለ ከተማ" : "Relocated Sub-City"}
              </label>
              <Input
                value={previousSubCity}
                onChange={(e) => setPreviousSubCity(e.target.value)}
                placeholder={locale === "am" ? "ምሳሌ፡ ቂርቆስ" : "e.g. Kirkos"}
                className="h-8 text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 font-bold block mb-1">
                {locale === "am" ? "የቀድሞ ወረዳ" : "Relocated Woreda"}
              </label>
              <Input
                value={previousWoreda}
                onChange={(e) => setPreviousWoreda(e.target.value)}
                placeholder={locale === "am" ? "ምሳሌ፡ ወረዳ 07" : "e.g. Woreda 07"}
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>

          {/* Deceased Archive */}
          <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xs">
            <Checkbox
              id="edit-sp-deceased"
              checked={isDeceased}
              onCheckedChange={(c) => setIsDeceased(Boolean(c))}
            />
            <label htmlFor="edit-sp-deceased" className="text-xs font-semibold text-rose-700 cursor-pointer">
              {locale === "am" ? "በሞት የተለዩ" : "Deceased (Archived)"}
            </label>
          </div>
        </div>

        <DialogFooter className="border-t border-[#E3E7EB] pt-3 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
            className="h-8 text-xs font-mono rounded-xs"
          >
            {locale === "am" ? "ሰርዝ" : "Cancel"}
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={updateBeneficiary.isPending}
            className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white"
          >
            {updateBeneficiary.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
            {locale === "am" ? "መረጃውን መዝግብ" : "Save Profile"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function formatSex(val: string | null | undefined, locale: "am" | "en") {
  if (!val) return "—";
  if (val === "MALE" || val === "ወንድ") return locale === "am" ? "ወንድ" : "Male";
  if (val === "FEMALE" || val === "ሴት") return locale === "am" ? "ሴት" : "Female";
  return val;
}

function formatMarital(val: string | null | undefined, locale: "am" | "en") {
  if (!val) return "—";
  if (val === "MARRIED" || val === "ባለትዳር") return locale === "am" ? "ባለትዳር" : "Married";
  if (val === "SINGLE" || val === "UNMARRIED" || val === "ያላገባ") return locale === "am" ? "ያላገባ/ች" : "Single";
  if (val === "WIDOWED" || val === "በሞት የተለየ" || val === "በሞት የተለየች") return locale === "am" ? "በሞት የተለየ/ች" : "Widowed";
  if (val === "DIVORCED" || val === "የተፋታ" || val === "የተፋታች") return locale === "am" ? "የተፋታ/ች" : "Divorced";
  return val;
}

function formatEmployment(val: string | null | undefined, locale: "am" | "en") {
  if (!val) return "—";
  if (val === "EMPLOYED" || val === "ተቀጣሪ") return locale === "am" ? "ተቀጣሪ" : "Employed";
  if (val === "SELF_EMPLOYED" || val === "በግል") return locale === "am" ? "የግል ስራ" : "Self-Employed";
  if (val === "UNEMPLOYED" || val === "ስራ አጥ") return locale === "am" ? "ስራ አጥ" : "Unemployed";
  return val;
}

function formatWorkplace(val: string | null | undefined, locale: "am" | "en") {
  if (!val) return "—";
  if (val === "OWN_PRIVATE") return locale === "am" ? "የግል" : "Private / Owned";
  if (val === "KEBELE_PUBLIC") return locale === "am" ? "የቀበሌ" : "Kebele / Public";
  if (val === "RENTED") return locale === "am" ? "የተከራዩት" : "Rented";
  return val;
}

function formatHouseholdRole(val: string | null | undefined, locale: "am" | "en") {
  if (!val) return "—";
  if (val === "አባወራ") return locale === "am" ? "አባወራ" : "Male Head of Household";
  if (val === "እማወራ") return locale === "am" ? "እማወራ" : "Female Head of Household";
  if (val === "ጥገኛ") return locale === "am" ? "ጥገኛ" : "Dependent";
  if (val === "ብቸኛ") return locale === "am" ? "ብቸኛ" : "Living Alone";
  return val;
}

function formatCaretaker(val: string | null | undefined, locale: "am" | "en") {
  if (!val) return "—";
  if (val === "ያለው" || val === "አለ" || val === "ልጅ") return locale === "am" ? "ረዳት አላቸው" : "Has Caretaker";
  if (val === "የሌለው" || val === "የለም") return locale === "am" ? "ረዳት የላቸውም" : "No Caretaker";
  return val;
}

function Overview({ client }: { client: Beneficiary }) {
  const locale = useLocale() === "en" ? "en" : "am";
  const fullName = [client.firstName, client.lastName, client.grandfatherName]
    .filter(Boolean)
    .join(" ");

  const isElderly = client.clientCategory === "ELDERLY" || Boolean(client.ElderlyProfile);
  const workplaceVal = client.ElderlyProfile?.workplaceCondition || client.DisabilityProfile?.workplaceCondition;
  const workplaceLabel = formatWorkplace(workplaceVal, locale);

  return (
    <div className="space-y-4">
      {/* 1. Personal Information Card */}
      <Card className="rounded-xs border-[#E3E7EB] bg-white shadow-2xs overflow-hidden">
        <CardHeader className="border-b border-[#E3E7EB] bg-slate-50/50 py-3 px-5 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-[#1769AA]" />
            <span>{locale === "am" ? "የግል መረጃ" : "Personal Information"}</span>
          </CardTitle>
          <EditPersonalInfoDialog client={client} />
        </CardHeader>
        <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-xs">
          <Field label={locale === "am" ? "ሙሉ ስም" : "Full Name"} value={fullName || "—"} />
          <Field label={locale === "am" ? "ስልክ ቁጥር" : "Phone"} value={client.phoneNumber ?? "—"} />
          <Field label={locale === "am" ? "እድሜ" : "Age"} value={client.age?.toString() ?? "—"} />
          <Field label={locale === "am" ? "ፆታ" : "Sex"} value={formatSex(client.sex, locale)} />
          <Field label={locale === "am" ? "ክፍለ ከተማ" : "Sub-City"} value={client.subCity ?? "—"} />
          <Field label={locale === "am" ? "ወረዳ" : "Woreda"} value={client.woreda ?? "—"} />
          <Field label={locale === "am" ? "ቀጠና" : "Ketena"} value={client.zone ?? "—"} />
          <Field label={locale === "am" ? "ብሎክ" : "Block"} value={client.block ?? "—"} />
          <Field label={locale === "am" ? "የቤት ቁጥር" : "House Number"} value={client.houseNumber ?? "—"} />
          <Field label={locale === "am" ? "የትምህርት ደረጃ" : "Education"} value={client.educationLevel ?? "—"} />
          <Field label={locale === "am" ? "ሙያ" : "Occupation"} value={client.occupation ?? "—"} />
          <Field label={locale === "am" ? "የሥራ ሁኔታ" : "Employment"} value={formatEmployment(client.employmentStatus, locale)} />
          <Field label={locale === "am" ? "የጋብቻ ሁኔታ" : "Marital Status"} value={formatMarital(client.maritalStatus, locale)} />
          {client.DisabilityProfile?.documentName && (
            <div className="col-span-full pt-3 border-t border-[#E3E7EB] mt-1">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-500">
                {locale === "am" ? "የህክምና ማስረጃ / ደጋፊ ሰነድ" : "Supporting Document / Medical Evidence"}
              </div>
              <div className="font-mono text-xs text-slate-800 flex items-center gap-1.5 mt-1 bg-slate-50 px-3 py-2 rounded-xs border border-[#E3E7EB] w-fit">
                <FileText className="w-4 h-4 text-[#1769AA]" />
                <span>{client.DisabilityProfile.documentName}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Contextual Work (Elderly) vs Vocational Training (Disability) Card */}
      <Card className="rounded-xs border-[#E3E7EB] bg-white shadow-2xs overflow-hidden">
        <CardHeader className="border-b border-[#E3E7EB] bg-slate-50/50 py-3 px-5 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5 text-[#1769AA]" />
            <span>
              {isElderly
                ? (locale === "am" ? "የሥራ እና የድጋፍ ሁኔታ" : "Work & Support Profile")
                : (locale === "am" ? "የሙያ ስልጠና እና የድጋፍ ሁኔታ" : "Vocational Training Profile")}
            </span>
          </CardTitle>
          <EditWorkOrTrainingDialog client={client} />
        </CardHeader>
        <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-xs">
          {isElderly ? (
            <>
              <Field label={locale === "am" ? "የመስሪያ ቦታ ሁኔታ" : "Workplace Status"} value={workplaceLabel} />
              <Field
                label={locale === "am" ? "1ኛ የሚፈልጉት የሥራ መስክ" : "1st Desired Work Field"}
                value={client.ElderlyProfile?.preferredTraining1 || "—"}
              />
              <Field
                label={locale === "am" ? "2ኛ የሚፈልጉት የሥራ መስክ" : "2nd Desired Work Field"}
                value={client.ElderlyProfile?.preferredTraining2 || "—"}
              />
              <Field
                label={locale === "am" ? "3ኛ የሚፈልጉት የሥራ መስክ" : "3rd Desired Work Field"}
                value={client.ElderlyProfile?.preferredTraining3 || "—"}
              />
              <Field
                label={locale === "am" ? "ሊሰሩት የሚችሉት የስራ ዓይነት" : "Work Ability / Profession"}
                value={client.ElderlyProfile?.previousProfession || "—"}
              />
              <Field
                label={locale === "am" ? "ለሥራው የሚያስፈልግ የድጋፍ ዓይነት" : "Support Needed for Work"}
                value={client.ElderlyProfile?.requiredSupportType || "—"}
              />
            </>
          ) : (
            <>
              <Field
                label={locale === "am" ? "የጉዳት ዓይነት" : "Disability Type"}
                value={client.DisabilityProfile?.disabilityType || "—"}
              />
              <Field label={locale === "am" ? "የመስሪያ ቦታ ሁኔታ" : "Workplace Status"} value={workplaceLabel} />
              <Field
                label={locale === "am" ? "1ኛ የሚፈልጉት የሙያ ስልጠና" : "1st Desired Training"}
                value={client.DisabilityProfile?.preferredTraining1 || "—"}
              />
              <Field
                label={locale === "am" ? "2ኛ የሚፈልጉት የሙያ ስልጠና" : "2nd Desired Training"}
                value={client.DisabilityProfile?.preferredTraining2 || "—"}
              />
              <Field
                label={locale === "am" ? "3ኛ የሚፈልጉት የሙያ ስልጠና" : "3rd Desired Training"}
                value={client.DisabilityProfile?.preferredTraining3 || "—"}
              />
              <Field
                label={locale === "am" ? "ቀደም ሲል ስልጠና/ሙያ" : "Previous Training / Profession"}
                value={client.DisabilityProfile?.previousProfession || "—"}
              />
              <Field
                label={locale === "am" ? "የሚፈለግ ድጋፍ መሳሪያ" : "Required Assistive Device"}
                value={client.DisabilityProfile?.requiredAssistiveDevice || "—"}
              />
              <Field
                label={locale === "am" ? "የመሳሪያ ድጋፍ ሁኔታ" : "Device Support Status"}
                value={
                  client.DisabilityProfile?.supportConfirmed
                    ? (locale === "am" ? "✓ ድጋፍ አግኝተዋል" : "✓ Received / Confirmed")
                    : client.DisabilityProfile?.requiredAssistiveDevice
                      ? (locale === "am" ? "⏳ በመጠባበቅ ላይ" : "⏳ Pending Request")
                      : "—"
                }
              />
              <Field
                label={locale === "am" ? "የሚያስፈልግ ድጋፍ" : "Support Needed"}
                value={client.DisabilityProfile?.otherSupportRequirements || "—"}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* 3. Social Protection & Cohort Programs Card */}
      {isElderly && (
        <Card className="rounded-xs border-[#E3E7EB] bg-white shadow-2xs overflow-hidden">
          <CardHeader className="border-b border-[#E3E7EB] bg-slate-50/50 py-3 px-5 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-[#1769AA]" />
              <span>{locale === "am" ? "የማህበራዊ ጥበቃ እና መርሃ-ግብሮች" : "Social Protection & Programs"}</span>
            </CardTitle>
            <EditSocialProtectionDialog client={client} />
          </CardHeader>
          <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-xs">
            <Field
              label={locale === "am" ? "የማህበር አባልነት" : "Association Membership"}
              value={
                client.ElderlyProfile?.isAssociationMember
                  ? (locale === "am"
                      ? `✓ አዎ (${client.ElderlyProfile.associationName || "የወረዳ ማህበር"})`
                      : `✓ Yes (${client.ElderlyProfile.associationName || "Woreda Association"})`)
                  : (locale === "am" ? "— አልተመዘገቡም" : "— Not Enrolled")
              }
            />
            <Field
              label={locale === "am" ? "ቀጥታ ድጋፍ (ቀ.ድ)" : "Direct Support (PSNP)"}
              value={
                client.ElderlyProfile?.isDirectSupport
                  ? (locale === "am" ? "✓ ተጠቃሚ ናቸው" : "✓ Beneficiary")
                  : (locale === "am" ? "— ተጠቃሚ አይደሉም" : "— Not Enrolled")
              }
            />
            <Field
              label={locale === "am" ? "የጤና መድህን" : "Health Insurance (CBHI)"}
              value={
                client.ElderlyProfile?.hasHealthInsurance
                  ? (locale === "am"
                      ? `✓ አላቸው (${client.ElderlyProfile.cbhiIdNumber || "የነቃ መድህን"})`
                      : `✓ Active (${client.ElderlyProfile.cbhiIdNumber || "CBHI Active"})`)
                  : (locale === "am" ? "— የላቸውም" : "— None")
              }
            />
            <Field
              label={locale === "am" ? "የቤተሰብ ሀላፊነት" : "Household Role"}
              value={formatHouseholdRole(client.ElderlyProfile?.householdRole, locale)}
            />
            <Field
              label={locale === "am" ? "የረዳት ሁኔታ" : "Caretaker Status"}
              value={formatCaretaker(client.ElderlyProfile?.caretakerStatus, locale)}
            />
            <Field
              label={locale === "am" ? "የዝውውር ሁኔታ" : "Relocation Status"}
              value={
                client.previousSubCity
                  ? (locale === "am"
                      ? `ከ${client.previousSubCity} ${client.previousWoreda || ""} የመጡ`
                      : `Relocated from ${client.previousSubCity} ${client.previousWoreda || ""}`)
                  : "—"
              }
            />
            <Field
              label={locale === "am" ? "የህልውና ሁኔታ" : "Vital Status"}
              value={
                client.isDeceased
                  ? (locale === "am"
                      ? `በሞት የተለዩ (${client.deceasedDate ? new Date(client.deceasedDate).toLocaleDateString() : "የተመዘገበ"})`
                      : `Deceased (${client.deceasedDate ? new Date(client.deceasedDate).toLocaleDateString() : "Archived"})`)
                  : (locale === "am" ? "በህይወት ያሉ" : "Living / Active")
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
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

interface TimelineMeta {
  title: string;
  category: string;
  categoryColor: string;
  icon: React.ElementType;
  dotColor: string;
  description: string;
  metaBadge?: string;
}

function getTimelineMeta(
  entry: { kind: string; date: string | Date; payload: any },
  locale: "am" | "en"
): TimelineMeta {
  const p = entry.payload || {};
  const isAm = locale === "am";

  if (entry.kind === "AUDIT") {
    const action = p.action || "";
    if (action === "REGISTER_BENEFICIARY") {
      const cat = p.newValue?.category;
      const catLabel =
        cat === "ELDERLY"
          ? isAm
            ? "አረጋውያን"
            : "Elderly"
          : isAm
          ? "አካል ጉዳተኞች"
          : "Disability";
      return {
        title: isAm ? "የተጠቃሚ መገለጫ ተመዘገበ" : "Beneficiary Profile Registered",
        category: isAm ? "ምዝገባ" : "Registration",
        categoryColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: UserCheck,
        dotColor: "bg-emerald-500",
        description: isAm
          ? `ተጠቃሚው በ${catLabel} ማህበራዊ ድጋፍ መዝገብ ውስጥ ተመዝግቧል`
          : `Citizen registered in the ${catLabel} social assistance registry`,
        metaBadge: p.entityId ? `#${p.entityId}` : undefined,
      };
    }
    if (action.includes("UPDATE")) {
      return {
        title: isAm ? "የመገለጫ መረጃ ተሻሽሏል" : "Profile Information Updated",
        category: isAm ? "ዝማኔ" : "Update",
        categoryColor: "bg-blue-50 text-blue-700 border-blue-200",
        icon: Edit3,
        dotColor: "bg-blue-500",
        description: isAm
          ? "የተጠቃሚው ማህደር መረጃ በስርዓቱ ላይ ተሻሽሏል"
          : "Beneficiary profile records were updated in the system",
        metaBadge: p.entityId ? `#${p.entityId}` : undefined,
      };
    }
    const friendlyAction = action.replace(/_/g, " ").toLowerCase();
    return {
      title: isAm ? "የማህደር እንቅስቃሴ" : action ? action.replace(/_/g, " ") : "System Activity",
      category: isAm ? "ስርዓት" : "Audit",
      categoryColor: "bg-slate-100 text-slate-700 border-slate-200",
      icon: Activity,
      dotColor: "bg-slate-400",
      description: isAm
        ? `${p.entityType || "ማህደር"} ላይ ክንውን ተመዝግቧል`
        : `Action ${friendlyAction} recorded on ${p.entityType || "profile"}`,
    };
  }

  if (entry.kind === "SERVICE_REQUEST") {
    return {
      title: isAm ? "የድጋፍ አገልግሎት ጥያቄ" : "Support Service Request",
      category: isAm ? "አገልግሎት" : "Service",
      categoryColor: "bg-sky-50 text-sky-700 border-sky-200",
      icon: ShieldCheck,
      dotColor: "bg-sky-500",
      description: [p.serviceType, p.status].filter(Boolean).join(" • "),
      metaBadge: p.responsibleOffice,
    };
  }

  if (entry.kind === "ELIGIBILITY") {
    return {
      title: isAm ? "የብቁነት ምዘና ውሳኔ" : "Eligibility Assessment Decision",
      category: isAm ? "ብቁነት" : "Eligibility",
      categoryColor: "bg-violet-50 text-violet-700 border-violet-200",
      icon: CheckCircle2,
      dotColor: "bg-violet-500",
      description: isAm
        ? `የተሰጠ ውሳኔ: ${p.decision || "በመጠባበቅ ላይ"}`
        : `Decision: ${p.decision || "Pending"}${p.decisionNotes ? ` — ${p.decisionNotes}` : ""}`,
    };
  }

  if (entry.kind === "TRAINING") {
    return {
      title: isAm ? "የሙያ ስልጠና ምዝገባ" : "Vocational Training Enrollment",
      category: isAm ? "ስልጠና" : "Training",
      categoryColor: "bg-amber-50 text-amber-700 border-amber-200",
      icon: GraduationCap,
      dotColor: "bg-amber-500",
      description: [p.trainingType, p.provider ? `@ ${p.provider}` : ""].filter(Boolean).join(" "),
    };
  }

  if (entry.kind === "JOB") {
    return {
      title: isAm ? "የሥራ ስምሪት መዝገብ" : "Job Placement Recorded",
      category: isAm ? "ሥራ" : "Job Placement",
      categoryColor: "bg-teal-50 text-teal-700 border-teal-200",
      icon: Briefcase,
      dotColor: "bg-teal-500",
      description: [p.jobTitle, p.companyIdNumber ? `@ ${p.companyIdNumber}` : ""].filter(Boolean).join(" "),
    };
  }

  if (entry.kind === "SUPPORT") {
    return {
      title: isAm ? "ድጋፍ / እርዳታ ተሰጠ" : "Support / Aid Provided",
      category: isAm ? "ድጋፍ" : "Support",
      categoryColor: "bg-rose-50 text-rose-700 border-rose-200",
      icon: HandHeart,
      dotColor: "bg-rose-500",
      description: [p.amountOrQuantity, p.provider ? `(${p.provider})` : ""].filter(Boolean).join(" "),
    };
  }

  if (entry.kind === "NOTE") {
    return {
      title: isAm ? "የማህደር ማስታወሻ" : "Case Worker Note",
      category: isAm ? "ማስታወሻ" : "Case Note",
      categoryColor: "bg-slate-100 text-slate-700 border-slate-200",
      icon: StickyNote,
      dotColor: "bg-slate-500",
      description: p.note || "",
    };
  }

  return {
    title: entry.kind,
    category: "General",
    categoryColor: "bg-slate-100 text-slate-700 border-slate-200",
    icon: Activity,
    dotColor: "bg-slate-400",
    description: summarize(entry.kind, p),
  };
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
