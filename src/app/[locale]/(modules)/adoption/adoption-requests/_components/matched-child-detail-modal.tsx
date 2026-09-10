import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";
import { Button } from "@/components/ui/button";
import {
  X,
  User,
  Calendar,
  Tag,
  ShieldCheck,
  MapPin,
  Briefcase,
  GraduationCap,
  DollarSign,
  Phone,
  Mail,
  AlertCircle,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { PostMatchNotesSection } from "./post-match-notes-section";
import { FollowUpReportsSection } from "./follow-up-reports-section";
import { PostPlacementVisitsSection } from "./post-placement-visits-section";

export interface MatchedChildInfo {
  child: {
    id: number;
    cityIdNumber: string | null;
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
    address: string | null;
    dateOfBirth: string;
    clientCategory: string;
    educationLevel: string;
    occupation: string | null;
    monthlyIncome: number | null;
    spouseCityIdNumber: string | null;
    familyMembersCount: number | null;
    contactInfo?: {
      sex?: string;
      additionalInfo?: string;
    } | null;
    activeStatus: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
  adopter: {
    id: number;
    cityIdNumber: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    dateOfBirth: string;
    clientCategory: string;
    educationLevel: string;
    occupation: string;
    monthlyIncome: number;
    spouseCityIdNumber: string;
    familyMembersCount: number | null;
    contactInfo?: {
      email?: string;
      phoneNumber?: string;
    } | null;
    activeStatus: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
  matchedAt: string;
  facilityChildId: string;
  status: string;
  matchId?: number | null;
  matchStatus?: string;
}

interface MatchedChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: MatchedChildInfo | null;
  isLoading?: boolean;
}

const DetailRow = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: string | null;
  icon?: any;
}) => (
  <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
    <div className="flex items-center text-slate-500 text-sm">
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {label}
    </div>
    <div className="font-medium text-slate-900 text-sm text-right">
      {value || "—"}
    </div>
  </div>
);

export const MatchedChildDetail: React.FC<MatchedChildModalProps> = ({
  isOpen,
  onClose,
  data,
  isLoading = false,
}) => {
  const t = useTranslations("adoption");
  const [activeTab, setActiveTab] = useState<"notes" | "followup" | "visits">("notes");

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="text-slate-600 font-medium text-sm">
            {t("adoptionDetail.status.loading") || "Loading matched child details..."}
          </p>
        </div>
      </div>
    );
  }

  if (!data || !data.child) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-amber-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No Matched Child Details Found
          </h3>
          <p className="text-slate-500 text-sm">
            There is no active child matched with this application yet, or the matching details could not be retrieved.
          </p>
          <Button onClick={onClose} variant="outline" className="w-full">
            Close
          </Button>
        </div>
      </div>
    );
  }

  const childDob = data.child.dateOfBirth ? new Date(data.child.dateOfBirth) : null;
  const childAge =
    childDob && !isNaN(childDob.getTime())
      ? new Date().getFullYear() - childDob.getFullYear()
      : "—";

  const formatDate = (d?: string | null) => {
    if (!d) return "—";
    const date = new Date(d);
    return isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
  };

  const adopterPhone =
    data.adopter?.phoneNumber ||
    (typeof data.adopter?.contactInfo === "object" && data.adopter?.contactInfo
      ? (data.adopter.contactInfo as any)?.phoneNumber
      : null) ||
    "—";

  const adopterEmail =
    (typeof data.adopter?.contactInfo === "object" && data.adopter?.contactInfo
      ? (data.adopter.contactInfo as any)?.email
      : null) ||
    "—";

  const childSex =
    data.child?.contactInfo?.sex || (data.child as any)?.sex || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-slate-900">
              {t("adoptionDetail.matched.title")}
            </h1>
            <div className="px-2.5 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-bold border border-green-200 uppercase tracking-wide">
              {data.status
                ? t(`statuses.${data.status.toLowerCase().replace(/ /g, "_")}`)
                : "—"}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {/* Main Status Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2 text-blue-200 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />{" "}
                  {t("adoptionDetail.matched.officialMatch")}
                </div>
                <h2 className="text-3xl font-bold mb-1">
                  {data.child?.firstName} {data.child?.lastName}
                </h2>
                <p className="text-blue-100 text-sm opacity-90 mt-1">
                  {t("adoptionDetail.matched.matchedOn", {
                    date: formatDate(data.matchedAt),
                  })}{" "}
                  • {t("adoptionDetail.matched.facilityId")}:{" "}
                  {data.facilityChildId || "—"}
                </p>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20 min-w-[120px]">
                <span className="block text-3xl font-bold">{childAge}</span>
                <span className="text-[10px] uppercase font-medium opacity-80">
                  {childAge !== "—"
                    ? t("adoptionDetail.matching.yearsOld", { count: Number(childAge) })
                    : "Age Unknown"}
                </span>
              </div>
            </div>
          </div>

          {/* Terminated / Returned Banner */}
          {(data.matchStatus === "TERMINATED" || data.status === "RETURNED") && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3 text-amber-900 shadow-sm">
              <div className="p-2 bg-amber-100 rounded-lg shrink-0">
                <RotateCcw className="w-5 h-5 text-amber-700" />
              </div>
              <div className="min-w-0 flex-1 text-sm">
                <h4 className="font-bold text-amber-950 text-base mb-1">
                  Match Terminated — Biological Family Reunification
                </h4>
                <p className="text-amber-800 text-xs leading-relaxed">
                  This adoption placement was formally terminated following reunification with the child's biological family. Custody has been returned and the child record status is <strong>RETURNED</strong>. The adoptive parent application has been restored to <strong>APPROVED</strong> for new matching.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Child Details */}
            <Card>
              <CardHeader className="bg-slate-50 border-b border-slate-100 py-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="w-4 h-4 text-blue-600" />
                  {t("adoptionDetail.matched.childInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <DetailRow
                  label={t("adoptionDetail.fields.firstName")}
                  value={data.child?.firstName}
                />
                <DetailRow
                  label={t("adoptionDetail.fields.lastName")}
                  value={data.child?.lastName}
                />
                <DetailRow
                  label={t("adoptionDetail.fields.sex")}
                  value={
                    childSex
                      ? t(`enums.sex.${childSex}`)
                      : null
                  }
                />
                <DetailRow
                  label={t("adoptionDetail.fields.dateOfBirth")}
                  value={formatDate(data.child?.dateOfBirth)}
                  icon={Calendar}
                />
                <DetailRow
                  label={t("adoptionDetail.fields.idNumber")}
                  value={data.child?.cityIdNumber}
                  icon={Tag}
                />
                <DetailRow
                  label={t("adoptionDetail.fields.category")}
                  value={
                    data.child?.clientCategory
                      ? t(`enums.category.${data.child.clientCategory}`)
                      : null
                  }
                />
                <DetailRow
                  label={t("adoptionDetail.matching.additionalInfo")}
                  value={data.child?.contactInfo?.additionalInfo}
                />
                <DetailRow
                  label={t("adoptionDetail.matched.recordCreated")}
                  value={formatDate(data.child?.createdAt)}
                />
              </CardContent>
            </Card>

            {/* Adopter Details */}
            <Card>
              <CardHeader className="bg-slate-50 border-b border-slate-100 py-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="w-4 h-4 text-green-600" />
                  {t("adoptionDetail.matched.adopterInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <DetailRow
                  label={t("adoptionDetail.matched.fullName")}
                  value={`${data.adopter?.firstName || ""} ${data.adopter?.lastName || ""}`.trim() || "—"}
                />
                <DetailRow
                  label={t("adoptionDetail.matched.adopterId")}
                  value={data.adopter?.id ? String(data.adopter.id) : "—"}
                />
                <DetailRow
                  label={t("adoptionDetail.fields.idNumber")}
                  value={data.adopter?.cityIdNumber}
                  icon={Tag}
                />
                <DetailRow
                  label={t("adoptionDetail.fields.phoneNumber")}
                  value={adopterPhone}
                  icon={Phone}
                />
                <DetailRow
                  label={t("adoptionDetail.fields.email")}
                  value={adopterEmail}
                  icon={Mail}
                />
                <DetailRow
                  label={t("adoptionDetail.fields.address")}
                  value={data.adopter?.address}
                  icon={MapPin}
                />
                <DetailRow
                  label={t("adoptionDetail.fields.occupation")}
                  value={data.adopter?.occupation}
                  icon={Briefcase}
                />
                <DetailRow
                  label={t("adoptionDetail.fields.monthlyIncome")}
                  value={
                    data.adopter?.monthlyIncome
                      ? t("adoptionDetail.matched.etb", {
                          amount: data.adopter.monthlyIncome?.toLocaleString(),
                        })
                      : "—"
                  }
                  icon={DollarSign}
                />
                <DetailRow
                  label={t("adoptionDetail.fields.education")}
                  value={data.adopter?.educationLevel}
                  icon={GraduationCap}
                />
                <DetailRow
                  label={t("adoptionDetail.fields.dateOfBirth")}
                  value={formatDate(data.adopter?.dateOfBirth)}
                  icon={Calendar}
                />
              </CardContent>
            </Card>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("notes")}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all duration-150 ${
                activeTab === "notes"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Case Notes
            </button>
            <button
              onClick={() => setActiveTab("followup")}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all duration-150 ${
                activeTab === "followup"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Follow-Up Reports
            </button>
            <button
              onClick={() => setActiveTab("visits")}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all duration-150 ${
                activeTab === "visits"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Home Visits
            </button>
          </div>

          {/* Tab content */}
          {activeTab === "notes" && (
            <PostMatchNotesSection
              matchId={data?.matchId}
              currentStatus={data?.matchStatus || data?.status}
            />
          )}
          {activeTab === "followup" && (
            <FollowUpReportsSection
              matchId={data?.matchId}
              matchStatus={data?.matchStatus || data?.status}
              isOfficer={true}
            />
          )}
          {activeTab === "visits" && (
            <PostPlacementVisitsSection
              matchId={data?.matchId}
              matchStatus={data?.matchStatus || data?.status}
              isOfficer={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};
