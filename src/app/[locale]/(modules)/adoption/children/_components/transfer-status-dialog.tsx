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
  Building2,
  Users,
  Home,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  HeartHandshake,
} from "lucide-react";
import {
  Child,
  ChildStatus,
  ALLOWED_CHILD_TRANSITIONS,
} from "@/types/child-matching-types";
import { useTransferChildStatus } from "@/hooks/adoption/useChildDetails";

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
  const [newStatus, setNewStatus] = useState<ChildStatus | "">("");
  const [reason, setReason] = useState("");

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

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setNewStatus("");
      setReason("");
      onClose();
    }
  };

  const handleConfirm = async () => {
    if (!newStatus) return;

    transferMutation.mutate(
      {
        newStatus,
        reasonForTransfer: reason.trim() || undefined,
      },
      {
        onSuccess: () => {
          setNewStatus("");
          setReason("");
          onSuccess?.();
          onClose();
        },
      }
    );
  };

  const childName = `${child.serviceData?.formData?.firstName || child.serviceData?.client?.firstName || "Child"} ${
    child.serviceData?.formData?.lastName || child.serviceData?.client?.lastName || ""
  }`.trim();

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg shrink-0">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900">
                {t("children.transferStatus.dialogTitle") || "Transfer Child Status"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                {t("children.transferStatus.dialogDesc") ||
                  "Transition this child record to a new institutional or care status in the official workflow."}
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
                <p className="text-xs text-indigo-600 font-mono">
                  {child.childIdFromFacility}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-[11px] text-slate-400 mb-1">
                {t("children.transferStatus.currentStatusLabel") || "Current Status"}
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
                {t("children.transferStatus.terminalTitle") || "Terminal Workflow Status"}
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
                  {t("children.transferStatus.selectNewStatus") || "Select Next Status"}{" "}
                  <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={newStatus}
                  onValueChange={(val) => setNewStatus(val as ChildStatus)}
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
                        <SelectItem key={status} value={status} className="py-2">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-slate-500" />
                            <span className="font-semibold text-xs">{meta.label}</span>
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
                  className="text-xs"
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
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
              disabled={!newStatus || transferMutation.isPending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
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
