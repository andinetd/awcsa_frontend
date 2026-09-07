"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useBeneficiaryRegisterStore,
  BeneficiaryCategory,
} from "@/stores/beneficiary-register-store";
import { BeneficiaryFormBody } from "./beneficiary-form-body";

export function BeneficiaryRegisterDialog() {
  const t = useTranslations("social-affairs.elderlyAndDisabled.registration");
  const tSrs = useTranslations("social-affairs.elderlyAndDisabled.srs");
  const open = useBeneficiaryRegisterStore((s) => s.open);
  const category = useBeneficiaryRegisterStore((s) => s.category);
  const closeDialog = useBeneficiaryRegisterStore((s) => s.closeDialog);
  const setCategory = useBeneficiaryRegisterStore((s) => s.setCategory);

  const handleCategoryChange = (next: BeneficiaryCategory) => {
    if (next !== category) {
      setCategory(next);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) closeDialog();
      }}
    >
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-lexend">
            {t("title", {
              type: category === "DISABLED" ? t("disabled") : t("elderly"),
            })}
          </DialogTitle>
          <DialogDescription>{tSrs("switchCategoryHint")}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 p-1 rounded-lg bg-slate-100 w-fit">
          <CategoryPill
            active={category === "DISABLED"}
            onClick={() => handleCategoryChange("DISABLED")}
            icon={<UserPlus className="size-4" />}
            label={t("disabled")}
          />
          <CategoryPill
            active={category === "ELDERLY"}
            onClick={() => handleCategoryChange("ELDERLY")}
            icon={<Users className="size-4" />}
            label={t("elderly")}
          />
        </div>

        <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
          <Info className="size-4 mt-0.5 shrink-0" />
          <span>{tSrs("switchResetsForm")}</span>
        </div>

        <BeneficiaryFormBody
          type={category}
          key={category}
          onSuccess={closeDialog}
        />
      </DialogContent>
    </Dialog>
  );
}

function CategoryPill({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        "gap-2 rounded-md transition-colors",
        active
          ? "bg-white text-slate-900 shadow-sm"
          : "text-slate-500 hover:text-slate-900",
      )}
    >
      {icon}
      {label}
    </Button>
  );
}
