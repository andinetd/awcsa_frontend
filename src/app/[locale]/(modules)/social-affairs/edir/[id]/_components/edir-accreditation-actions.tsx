"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  useRenewEdirMutation,
  useCancelEdirMutation,
  useReissueEdirCertificateMutation,
} from "@/hooks/social-affairs";
import {
  Edir,
  EdirCancellationReason,
} from "@/api/social-affairs/edir";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Ban, FileCheck2 } from "lucide-react";

const CANCEL_REASONS: EdirCancellationReason[] = [
  "DISSOLVED",
  "MEMBER_MAJORITY_REQUEST",
  "LAWS_VIOLATION",
  "LICENSE_MISUSE",
  "FALSE_DOCUMENTS",
];

interface Props {
  edir: Edir;
}

export default function EdirAccreditationActions({ edir }: Props) {
  const t = useTranslations("social-affairs.edir.edir-details.actions");
  const renewMutation = useRenewEdirMutation();
  const cancelMutation = useCancelEdirMutation();
  const reissueMutation = useReissueEdirCertificateMutation();

  const [cancelOpen, setCancelOpen] = useState(false);
  const [reason, setReason] = useState<EdirCancellationReason | "">("");
  const [reasonDescription, setReasonDescription] = useState("");

  const isCanceled = edir.status === "CANCELLED";
  const pending = renewMutation.isPending || cancelMutation.isPending || reissueMutation.isPending;

  const handleRenew = () =>
    renewMutation.mutate(
      { id: edir.id! },
      { onSuccess: () => toast.success(t("renew.success")) }
    );

  const handleCancel = () => {
    if (!reason) {
      toast.error(t("cancel.needReason"));
      return;
    }
    cancelMutation.mutate(
      { id: edir.id!, data: { reason, reasonDescription } },
      {
        onSuccess: () => {
          setCancelOpen(false);
          setReason("");
          setReasonDescription("");
          toast.success(t("cancel.success"));
        },
      }
    );
  };

  const handleReissue = () =>
    reissueMutation.mutate(edir.id!, {
      onSuccess: () => toast.success(t("reissue.success")),
    });

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        className="h-8 text-xs font-semibold rounded-xs border-[#E3E7EB] hover:bg-[#F7F8FA] shadow-2xs gap-1.5"
        onClick={handleRenew}
        disabled={pending || isCanceled}
      >
        <RefreshCw className="w-3.5 h-3.5" />
        {t("renew.label")}
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-8 text-xs font-semibold rounded-xs border-[#E3E7EB] hover:bg-[#F7F8FA] shadow-2xs gap-1.5"
        onClick={handleReissue}
        disabled={pending || isCanceled}
      >
        <FileCheck2 className="w-3.5 h-3.5" />
        {t("reissue.label")}
      </Button>
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="destructive"
            className="h-8 text-xs font-semibold rounded-xs bg-rose-600 hover:bg-rose-700 text-white shadow-2xs gap-1.5"
            disabled={isCanceled}
          >
            <Ban className="w-3.5 h-3.5" />
            {t("cancel.label")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[480px] rounded-xs border border-[#E3E7EB] bg-white p-6 shadow-lg">
          <DialogHeader className="border-b border-[#E3E7EB] pb-3">
            <DialogTitle className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider font-mono flex items-center gap-2">
              <Ban className="w-4 h-4 text-rose-600" />
              {t("cancel.title")}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-mono mt-0.5">{t("cancel.description")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                {t("cancel.reasonLabel")}
              </label>
              <Select value={reason || undefined} onValueChange={(v) => setReason(v as EdirCancellationReason)}>
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white">
                  <SelectValue placeholder={t("cancel.reasonPlaceholder")} />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  {CANCEL_REASONS.map((r) => (
                    <SelectItem key={r} value={r} className="text-xs rounded-xs">
                      {t(`cancel.reasons.${r}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                {t("cancel.descriptionLabel")}
              </label>
              <Textarea
                className="text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white min-h-[70px]"
                value={reasonDescription}
                onChange={(e) => setReasonDescription(e.target.value)}
                placeholder={t("cancel.descriptionPlaceholder")}
              />
            </div>
          </div>
          <DialogFooter className="pt-3 border-t border-[#E3E7EB]">
            <Button
              variant="outline"
              className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-[#F7F8FA]"
              onClick={() => setCancelOpen(false)}
              disabled={pending}
            >
              {t("cancel.dismiss")}
            </Button>
            <Button
              variant="destructive"
              className="h-8 text-xs rounded-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-2xs"
              onClick={handleCancel}
              disabled={pending}
            >
              {pending ? t("cancel.cancelling") : t("cancel.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}