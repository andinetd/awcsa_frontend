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
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto rounded-xs border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-base font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
            {t("title", {
              type: category === "DISABLED" ? t("disabled") : t("elderly"),
            })}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-mono">
            {tSrs("switchCategoryHint")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-1.5 p-0.5 rounded-xs bg-slate-100 border border-[#E3E7EB] w-fit">
          <CategoryPill
            active={category === "DISABLED"}
            onClick={() => handleCategoryChange("DISABLED")}
            icon={<UserPlus className="w-3.5 h-3.5 mr-1" />}
            label={t("disabled")}
          />
          <CategoryPill
            active={category === "ELDERLY"}
            onClick={() => handleCategoryChange("ELDERLY")}
            icon={<Users className="w-3.5 h-3.5 mr-1" />}
            label={t("elderly")}
          />
        </div>

        <div className="flex items-start gap-2 rounded-xs border border-amber-200 bg-amber-50/70 p-2.5 text-xs font-mono text-amber-800">
          <Info className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
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
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-7 px-3 text-xs font-mono uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5",
        active
          ? "bg-[#1769AA] text-white shadow-2xs font-bold"
          : "text-slate-600 hover:text-slate-900",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
