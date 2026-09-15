"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BeneficiaryType } from "@/api/beneficiaries/types";
import { BeneficiaryFormBody } from "./beneficiary-form-body";

interface RegistrationFormProps {
  type: BeneficiaryType;
}

export default function RegistrationForm({ type }: RegistrationFormProps) {
  const t = useTranslations("social-affairs.elderlyAndDisabled.registration");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          {t("registerNew")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto rounded-xs border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-base font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
            {t("title", {
              type: type === "DISABLED" ? t("disabled") : t("elderly"),
            })}
          </DialogTitle>
        </DialogHeader>
        <BeneficiaryFormBody
          type={type}
          key={type}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
