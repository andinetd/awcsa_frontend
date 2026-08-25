"use client";

import { useTranslations } from "next-intl";
import { AlertTriangle, Clock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import type { WarningReason } from "@/hooks/use-session-warning";

interface SessionWarningModalProps {
  open: boolean;
  reason: WarningReason;
  secondsLeft: number;
  onExtend: () => void;
  onDismiss: () => void;
}

export function SessionWarningModal({
  open,
  reason,
  secondsLeft,
  onExtend,
  onDismiss,
}: SessionWarningModalProps) {
  const t = useTranslations("components.session");

  const title =
    reason === "inactivity"
      ? t("inactivityWarningTitle")
      : t("warningTitle");

  const description =
    reason === "inactivity"
      ? t("inactivityWarningDescription", { seconds: secondsLeft })
      : t("warningDescription", { seconds: secondsLeft });

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {reason === "inactivity" ? (
              <Clock className="size-5 text-amber-500" />
            ) : (
              <AlertTriangle className="size-5 text-amber-500" />
            )}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        {/* Countdown indicator */}
        <div className="flex items-center justify-center">
          <div className="relative flex size-20 items-center justify-center">
            {/* Circular progress ring */}
            <svg className="size-20 -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-muted"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={2 * Math.PI * 36}
                strokeDashoffset={
                  2 * Math.PI * 36 * (1 - secondsLeft / 120)
                }
                strokeLinecap="round"
                className="text-amber-500 transition-all duration-1000 ease-linear"
              />
            </svg>
            <span className="absolute text-2xl font-bold tabular-nums text-foreground">
              {secondsLeft}
            </span>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onDismiss}>
            {t("signOut")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onExtend}>
            {t("staySignedIn")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
