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
        className="gap-2"
        onClick={handleRenew}
        disabled={pending || isCanceled}
      >
        <RefreshCw className="w-4 h-4" />
        {t("renew.label")}
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="gap-2"
        onClick={handleReissue}
        disabled={pending || isCanceled}
      >
        <FileCheck2 className="w-4 h-4" />
        {t("reissue.label")}
      </Button>
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="destructive"
            className="gap-2"
            disabled={isCanceled}
          >
            <Ban className="w-4 h-4" />
            {t("cancel.label")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{t("cancel.title")}</DialogTitle>
            <DialogDescription>{t("cancel.description")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium block mb-1">
                {t("cancel.reasonLabel")}
              </label>
              <Select value={reason || undefined} onValueChange={(v) => setReason(v as EdirCancellationReason)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("cancel.reasonPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {CANCEL_REASONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {t(`cancel.reasons.${r}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">
                {t("cancel.descriptionLabel")}
              </label>
              <Textarea
                value={reasonDescription}
                onChange={(e) => setReasonDescription(e.target.value)}
                placeholder={t("cancel.descriptionPlaceholder")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)} disabled={pending}>
              {t("cancel.dismiss")}
            </Button>
            <Button variant="destructive" onClick={handleCancel} disabled={pending}>
              {pending ? t("cancel.cancelling") : t("cancel.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}