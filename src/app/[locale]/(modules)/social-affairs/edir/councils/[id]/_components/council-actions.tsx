"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  useRenewEdirCouncilMutation,
  useCancelEdirCouncilMutation,
} from "@/hooks/social-affairs";
import { EdirCouncil, EdirCancellationReason } from "@/api/social-affairs/edir";
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
import { RefreshCw, Ban } from "lucide-react";

const CANCEL_REASONS: EdirCancellationReason[] = [
  "DISSOLVED",
  "MEMBER_MAJORITY_REQUEST",
  "LAWS_VIOLATION",
  "LICENSE_MISUSE",
  "FALSE_DOCUMENTS",
];

interface Props {
  council: EdirCouncil;
}

export default function CouncilActions({ council }: Props) {
  const t = useTranslations("social-affairs.edir.councils");
  const renewMutation = useRenewEdirCouncilMutation();
  const cancelMutation = useCancelEdirCouncilMutation();

  const [cancelOpen, setCancelOpen] = useState(false);
  const [reason, setReason] = useState<EdirCancellationReason | "">("");
  const [reasonDescription, setReasonDescription] = useState("");

  const isCancelled = council.status === "CANCELLED";

  const handleRenew = async () => {
    try {
      await renewMutation.mutateAsync({ councilId: council.id });
      toast.success(t("buttons.renewSuccess"));
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = async () => {
    if (!reason) return;
    try {
      await cancelMutation.mutateAsync({
        councilId: council.id,
        data: {
          reason,
          reasonDescription: reasonDescription || undefined,
        },
      });
      setCancelOpen(false);
      setReason("");
      setReasonDescription("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {!isCancelled && (
        <Button
          onClick={handleRenew}
          disabled={renewMutation.isPending}
          className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          {renewMutation.isPending ? t("buttons.renaming") : t("buttons.renew")}
        </Button>
      )}

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            disabled={isCancelled || cancelMutation.isPending}
            className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs bg-rose-600 hover:bg-rose-700 text-white shadow-2xs"
          >
            <Ban className="w-3.5 h-3.5 mr-1.5" />
            {t("buttons.cancel")}
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-xs border-[#E3E7EB] bg-white p-6 shadow-lg max-w-lg">
          <DialogHeader className="border-b border-[#E3E7EB] pb-3">
            <DialogTitle className="text-base font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
              {t("buttons.confirmCancel")}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-mono">
              {council.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                {t("detail.cancellationReason")}
              </label>
              <Select
                value={reason}
                onValueChange={(value) =>
                  setReason(value as EdirCancellationReason)
                }
              >
                <SelectTrigger className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs">
                  <SelectValue placeholder={t("detail.cancellationReason")} />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  {CANCEL_REASONS.map((reasonKey) => (
                    <SelectItem key={reasonKey} value={reasonKey} className="text-xs font-mono">
                      {t(`detail.cancellationReasons.${reasonKey}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                {t("form.fields.address")}
              </label>
              <Textarea
                placeholder={t("form.placeholders.address")}
                value={reasonDescription}
                onChange={(e) => setReasonDescription(e.target.value)}
                className="text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
              />
            </div>
          </div>
          <DialogFooter className="pt-3 border-t border-[#E3E7EB]">
            <Button
              variant="outline"
              className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-slate-50"
              onClick={() => setCancelOpen(false)}
            >
              {t("buttons.dismiss")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={!reason || cancelMutation.isPending}
              className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs bg-rose-600 hover:bg-rose-700 text-white shadow-2xs"
            >
              {cancelMutation.isPending
                ? t("buttons.cancelling")
                : t("buttons.confirmCancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}