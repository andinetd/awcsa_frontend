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
        >
          <RefreshCw className="w-4 h-4" />
          {renewMutation.isPending ? t("buttons.renaming") : t("buttons.renew")}
        </Button>
      )}

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            disabled={isCancelled || cancelMutation.isPending}
          >
            <Ban className="w-4 h-4" />
            {t("buttons.cancel")}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("buttons.confirmCancel")}</DialogTitle>
            <DialogDescription>{council.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("detail.cancellationReason")}
              </label>
              <Select
                value={reason}
                onValueChange={(value) =>
                  setReason(value as EdirCancellationReason)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("detail.cancellationReason")} />
                </SelectTrigger>
                <SelectContent>
                  {CANCEL_REASONS.map((reasonKey) => (
                    <SelectItem key={reasonKey} value={reasonKey}>
                      {t(`detail.cancellationReasons.${reasonKey}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Textarea
              placeholder={t("form.placeholders.address")}
              value={reasonDescription}
              onChange={(e) => setReasonDescription(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelOpen(false)}
            >
              {t("buttons.dismiss")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={!reason || cancelMutation.isPending}
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