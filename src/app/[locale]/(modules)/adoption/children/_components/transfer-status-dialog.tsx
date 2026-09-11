"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRightLeft,
  ShieldCheck,
  ShieldAlert,
  Building2,
  Users,
  Home,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  HeartHandshake,
  UserCheck,
  Phone,
} from "lucide-react";
import {
  Child,
  ChildStatus,
  ALLOWED_CHILD_TRANSITIONS,
} from "@/types/child-matching-types";
import { useTransferChildStatus } from "@/hooks/adoption/useChildDetails";
import { useAuthStore } from "@/stores/auth-store";
import { useGetCareCentersQuery } from "@/hooks/adoption/care-center";

interface TransferStatusDialogProps {
  child: Child | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const STATUS_META: Record<
  ChildStatus,
  {
    label: string;
    amharicLabel: string;
    color: string;
    icon: React.ElementType;
    description: string;
    amharicDescription: string;
  }
> = {
  FOUND: {
    label: "Found / Abandoned",
    amharicLabel: "የተገኘ / የተተወ",
    color: "bg-amber-100 text-amber-800 border-amber-300",
    icon: Clock,
    description: "Child was located or abandoned and awaiting institutional intake.",
    amharicDescription: "ሕፃኑ የተገኘ ወይም የተተወ ሲሆን ወደ ተቋም ለመግባት በመጠባበቅ ላይ ነው።",
  },
  IN_CARE: {
    label: "In Care (Facility Placement)",
    amharicLabel: "በእንክብካቤ ማዕከል",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    icon: Building2,
    description: "Child is admitted to a licensed care center and eligible for adoption matching.",
    amharicDescription: "ሕፃኑ በሕጋዊ የእንክብካቤ ማዕከል ውስጥ ያለ እና ለማዛመድ ብቁ ነው።",
  },
  IN_ADERA: {
    label: "In Adera (Foster / Custody)",
    amharicLabel: "በአደራ / በሞግዚት",
    color: "bg-purple-100 text-purple-800 border-purple-300",
    icon: HeartHandshake,
    description: "Temporary entrustment / foster custody pending case review or tracing.",
    amharicDescription: "ጉዳዩ እስኪጣራ ድረስ በጊዜያዊ አደራ ወይም በሞግዚት ጥበቃ ላይ ያለ።",
  },
  WITH_BLOOD_RELATIVE: {
    label: "With Blood Relative (Kinship)",
    amharicLabel: "ከደም ዘመድ ጋር",
    color: "bg-indigo-100 text-indigo-800 border-indigo-300",
    icon: Users,
    description: "Child is placed under the formal care of extended family or blood relatives.",
    amharicDescription: "ሕፃኑ ከቅርብ የደም ዘመዶቹ ወይም ከቤተሰቡ ጋር እንዲኖር የተደረገ።",
  },
  ADOPTED: {
    label: "Adopted (Legally Placed)",
    amharicLabel: "የተደጎመ / በጉዲፈቻ የተሰጠ",
    color: "bg-emerald-100 text-emerald-800 border-emerald-300",
    icon: CheckCircle2,
    description: "Child is officially matched and placed with approved adoptive parents.",
    amharicDescription: "ሕፃኑ በይፋ ተዛምዶ ለአሳዳጊ ቤተሰብ የተሰጠ።",
  },
  RETURNED: {
    label: "Returned (Reunified)",
    amharicLabel: "የተመለሰ (ከወላጆች ጋር የተዋሃደ)",
    color: "bg-rose-100 text-rose-800 border-rose-300",
    icon: RotateCcw,
    description: "Child has been reunified with biological parents or family of origin.",
    amharicDescription: "ሕፃኑ ከሥነ-ሕይወታዊ ወላጆቹ ወይም ከቤተሰቡ ጋር የተዋሃደ።",
  },
};

export const TransferStatusDialog: React.FC<TransferStatusDialogProps> = ({
  child,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const t = useTranslations("adoption");
  const { userPermissions, userRole } = useAuthStore();

  const canManageFacilityChildren =
    userRole === "Super_Admin" ||
    Boolean(userPermissions?.includes("manage_facility_children"));

  const { data: careCentersData, isLoading: isLoadingFacilities } =
    useGetCareCentersQuery();
  const careCenters: any[] = Array.isArray(careCentersData)
    ? careCentersData
    : [];

  const [newStatus, setNewStatus] = useState<ChildStatus | "">("");
  const [reason, setReason] = useState("");
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>("");
  const [facilityChildId, setFacilityChildId] = useState<string>("");
  const [custodianName, setCustodianName] = useState<string>("");
  const [custodianPhone, setCustodianPhone] = useState<string>("");
  const [custodianRelationship, setCustodianRelationship] =
    useState<string>("");
  const [custodianCityId, setCustodianCityId] = useState<string>("");
  const [custodianAddress, setCustodianAddress] = useState<string>("");

  const transferMutation = useTransferChildStatus(child?.id);

  if (!child) return null;

  const currentStatus = (child.currentStatus as ChildStatus) || "FOUND";
  const currentMeta = STATUS_META[currentStatus] || {
    label: currentStatus,
    amharicLabel: currentStatus,
    color: "bg-slate-100 text-slate-800 border-slate-300",
    icon: Clock,
    description: "",
    amharicDescription: "",
  };

  const allowedTransitions = ALLOWED_CHILD_TRANSITIONS[currentStatus] || [];

  const resetForm = () => {
    setNewStatus("");
    setReason("");
    setSelectedFacilityId("");
    setFacilityChildId("");
    setCustodianName("");
    setCustodianPhone("");
    setCustodianRelationship("");
    setCustodianCityId("");
    setCustodianAddress("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
      onClose();
    }
  };

  const handleConfirm = async () => {
    if (!newStatus) return;
    if (newStatus === "IN_CARE" && !canManageFacilityChildren) return;
    if (newStatus === "IN_CARE" && !selectedFacilityId) return;

    const payload: any = {
      newStatus,
      reasonForTransfer: reason.trim() || undefined,
    };

    if (newStatus === "IN_CARE") {
      payload.childCareFacilityId = Number(selectedFacilityId);
      if (facilityChildId.trim()) {
        payload.childIdFromFacility = facilityChildId.trim();
      }
    } else if (
      newStatus === "IN_ADERA" ||
      newStatus === "WITH_BLOOD_RELATIVE"
    ) {
      if (custodianName.trim() || custodianPhone.trim()) {
        payload.custodianDetails = {
          fullName: custodianName.trim(),
          phoneNumber: custodianPhone.trim(),
          relationship:
            custodianRelationship.trim() ||
            (newStatus === "WITH_BLOOD_RELATIVE"
              ? "Blood Relative"
              : "Foster Guardian"),
          cityIdNumber: custodianCityId.trim() || undefined,
          address: custodianAddress.trim() || undefined,
        };
      }
    }

    transferMutation.mutate(payload, {
      onSuccess: () => {
        resetForm();
        onSuccess?.();
        onClose();
      },
    });
  };

  const childName = `${
    child.serviceData?.formData?.firstName ||
    child.serviceData?.client?.firstName ||
    "Child"
  } ${
    child.serviceData?.formData?.lastName ||
    child.serviceData?.client?.lastName ||
    ""
  }`.trim();

  const isSubmitDisabled =
    !newStatus ||
    transferMutation.isPending ||
    (newStatus === "IN_CARE" &&
      (!canManageFacilityChildren || !selectedFacilityId));

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg shrink-0">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900">
                {t("children.transferStatus.dialogTitle") ||
                  "Transfer Child Status & Placement"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                {t("children.transferStatus.dialogDesc") ||
                  "Transition this child record to a new institutional or care placement with verified audit records."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Child Identity Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                {t("children.transferStatus.childLabel") || "Child Record"}
              </p>
              <h4 className="text-sm font-bold text-slate-900">{childName}</h4>
              {child.childIdFromFacility && (
                <p className="text-xs text-indigo-600 font-mono font-medium">
                  {child.childIdFromFacility}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-[11px] text-slate-400 mb-1">
                {t("children.transferStatus.currentStatusLabel") ||
                  "Current Status"}
              </p>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${currentMeta.color}`}
              >
                <currentMeta.icon className="w-3.5 h-3.5" />
                {currentMeta.label}
              </span>
            </div>
          </div>

          {/* If No Transitions Allowed (Terminal state e.g. ADOPTED) */}
          {allowedTransitions.length === 0 ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-emerald-950">
                {t("children.transferStatus.terminalTitle") ||
                  "Terminal Workflow Status"}
              </h4>
              <p className="text-xs text-emerald-700 mt-1">
                {t("children.transferStatus.terminalDesc") ||
                  "This child has been officially placed in an adoptive family. Formal status updates can only be modified through court decrees or biological family reunification."}
              </p>
            </div>
          ) : (
            <>
              {/* Target Status Selector */}
              <div>
                <Label
                  htmlFor="new-status"
                  className="text-xs font-semibold text-slate-700 mb-1.5 block"
                >
                  {t("children.transferStatus.selectNewStatus") ||
                    "Select Next Placement / Status"}{" "}
                  <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={newStatus}
                  onValueChange={(val) => {
                    setNewStatus(val as ChildStatus);
                    setSelectedFacilityId("");
                    setFacilityChildId("");
                  }}
                >
                  <SelectTrigger
                    id="new-status"
                    className="w-full bg-white border-slate-300 h-10 text-sm"
                  >
                    <SelectValue
                      placeholder={
                        t("children.transferStatus.placeholder") ||
                        "Choose target status..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {allowedTransitions.map((status) => {
                      const meta = STATUS_META[status];
                      const Icon = meta.icon;
                      return (
                        <SelectItem
                          key={status}
                          value={status}
                          className="py-2"
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-slate-500" />
                            <span className="font-semibold text-xs">
                              {meta.label}
                            </span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                {/* Selected Status Explanation */}
                {newStatus && STATUS_META[newStatus] && (
                  <div className="mt-2 bg-indigo-50/70 border border-indigo-200 rounded-lg p-2.5 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-indigo-900 leading-relaxed">
                      {STATUS_META[newStatus].description}
                    </p>
                  </div>
                )}
              </div>

              {/* Dynamic Placement Section: IN_CARE */}
              {newStatus === "IN_CARE" && (
                <div className="space-y-3 p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl">
                  <div className="flex items-center gap-2 text-blue-900 font-semibold text-xs border-b border-blue-200 pb-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>
                      {t("children.transferStatus.careCenterDetails") ||
                        "Care Center Placement Details"}
                    </span>
                  </div>

                  {!canManageFacilityChildren ? (
                    <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 flex items-start gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-rose-900">
                          {t("children.transferStatus.permissionDeniedTitle") ||
                            "Permission Required"}
                        </p>
                        <p className="text-xs text-rose-700 leading-relaxed">
                          {t("children.transferStatus.permissionDeniedDesc") ||
                            "You do not possess the required privilege ('manage_facility_children') to admit or transfer children into Care Centers. Please contact an authorized officer or Super Admin."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <Label
                          htmlFor="care-facility"
                          className="text-xs font-semibold text-slate-700 mb-1 block"
                        >
                          {t("children.transferStatus.targetFacilityLabel") ||
                            "Target Care Center"}{" "}
                          <span className="text-rose-500">*</span>
                        </Label>
                        <Select
                          value={selectedFacilityId}
                          onValueChange={setSelectedFacilityId}
                          disabled={isLoadingFacilities}
                        >
                          <SelectTrigger
                            id="care-facility"
                            className="w-full bg-white border-slate-300 h-9 text-xs"
                          >
                            <SelectValue
                              placeholder={
                                isLoadingFacilities
                                  ? t("children.transferStatus.loadingCenters") ||
                                    "Loading care centers..."
                                  : t(
                                      "children.transferStatus.selectFacilityPlaceholder"
                                    ) || "Select receiving care center..."
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {careCenters.map((facility: any) => (
                              <SelectItem
                                key={facility.id}
                                value={String(facility.id)}
                                className="text-xs"
                              >
                                {facility.name}{" "}
                                {facility.place ? `(${facility.place})` : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label
                          htmlFor="facility-child-id"
                          className="text-xs font-semibold text-slate-700 mb-1 block"
                        >
                          {t("children.transferStatus.facilityChildIdLabel") ||
                            "Facility Assigned Child ID"}{" "}
                          <span className="text-slate-400 font-normal">
                            (
                            {t("children.transferStatus.autoGeneratedNote") ||
                              "leave empty to auto-generate"}
                            )
                          </span>
                        </Label>
                        <Input
                          id="facility-child-id"
                          placeholder="e.g. FAC-001 or KMC-089"
                          value={facilityChildId}
                          onChange={(e) => setFacilityChildId(e.target.value)}
                          className="h-9 text-xs bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Dynamic Placement Section: IN_ADERA or WITH_BLOOD_RELATIVE */}
              {(newStatus === "IN_ADERA" ||
                newStatus === "WITH_BLOOD_RELATIVE") && (
                <div className="space-y-3 p-3.5 bg-purple-50/60 border border-purple-200 rounded-xl">
                  <div className="flex items-center gap-2 text-purple-900 font-semibold text-xs border-b border-purple-200 pb-2">
                    <UserCheck className="w-4 h-4 text-purple-600" />
                    <span>
                      {newStatus === "WITH_BLOOD_RELATIVE"
                        ? t("children.transferStatus.relativeDetails") ||
                          "Kinship / Relative Information"
                        : t("children.transferStatus.custodianDetails") ||
                          "Foster / Custodian Information"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label
                        htmlFor="custodian-name"
                        className="text-xs font-medium text-slate-700 mb-1 block"
                      >
                        {t("children.transferStatus.fullNameLabel") ||
                          "Caregiver / Relative Name"}
                      </Label>
                      <Input
                        id="custodian-name"
                        placeholder="e.g. Abebech Tadesse"
                        value={custodianName}
                        onChange={(e) => setCustodianName(e.target.value)}
                        className="h-9 text-xs bg-white"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="custodian-phone"
                        className="text-xs font-medium text-slate-700 mb-1 block"
                      >
                        {t("children.transferStatus.phoneLabel") ||
                          "Phone Number"}
                      </Label>
                      <Input
                        id="custodian-phone"
                        placeholder="e.g. +251 91 123 4567"
                        value={custodianPhone}
                        onChange={(e) => setCustodianPhone(e.target.value)}
                        className="h-9 text-xs bg-white"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="custodian-rel"
                        className="text-xs font-medium text-slate-700 mb-1 block"
                      >
                        {t("children.transferStatus.relationshipLabel") ||
                          "Relationship to Child"}
                      </Label>
                      <Input
                        id="custodian-rel"
                        placeholder={
                          newStatus === "WITH_BLOOD_RELATIVE"
                            ? "e.g. Maternal Aunt, Grandfather"
                            : "e.g. Foster Guardian, Community Caregiver"
                        }
                        value={custodianRelationship}
                        onChange={(e) =>
                          setCustodianRelationship(e.target.value)
                        }
                        className="h-9 text-xs bg-white"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="custodian-cityid"
                        className="text-xs font-medium text-slate-700 mb-1 block"
                      >
                        {t("children.transferStatus.cityIdLabel") ||
                          "National ID / Kebele ID"}
                      </Label>
                      <Input
                        id="custodian-cityid"
                        placeholder="e.g. AA-04-12984"
                        value={custodianCityId}
                        onChange={(e) => setCustodianCityId(e.target.value)}
                        className="h-9 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="custodian-addr"
                      className="text-xs font-medium text-slate-700 mb-1 block"
                    >
                      {t("children.transferStatus.addressLabel") ||
                        "Residence Address"}
                    </Label>
                    <Input
                      id="custodian-addr"
                      placeholder="e.g. Addis Ababa, Bole Subcity, Woreda 03, House 412"
                      value={custodianAddress}
                      onChange={(e) => setCustodianAddress(e.target.value)}
                      className="h-9 text-xs bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Transfer Reason & Case Notes */}
              <div>
                <Label
                  htmlFor="reason"
                  className="text-xs font-semibold text-slate-700 mb-1.5 block"
                >
                  {t("children.transferStatus.reasonLabel") ||
                    "Reason for Transfer / Case Notes"}{" "}
                  <span className="text-slate-400 font-normal">
                    ({t("children.transferStatus.recommended") || "recommended"})
                  </span>
                </Label>
                <Textarea
                  id="reason"
                  rows={3}
                  placeholder={
                    t("children.transferStatus.reasonPlaceholder") ||
                    "e.g. Admitted to Kidane Mehret Care Center under official social worker order #412..."
                  }
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="text-xs bg-white"
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-slate-100">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={transferMutation.isPending}
          >
            {t("children.transferStatus.cancel") || "Cancel"}
          </Button>
          {allowedTransitions.length > 0 && (
            <Button
              onClick={handleConfirm}
              disabled={isSubmitDisabled}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              {transferMutation.isPending
                ? t("children.transferStatus.updating") || "Updating Status..."
                : t("children.transferStatus.confirm") || "Confirm Status Change"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
