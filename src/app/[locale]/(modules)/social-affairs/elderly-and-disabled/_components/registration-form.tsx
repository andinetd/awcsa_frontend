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
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          {t("registerNew")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-lexend">
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
