"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Users,
  AlertTriangle,
  FileCheck2,
  Phone,
  MapPin,
  Tag,
  RotateCcw,
} from "lucide-react";
import { useProcessReunification } from "@/hooks/adoption/useMatches";
import { ProcessReunificationPayload } from "@/api/adoption/matches";

interface ReunificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: number;
  childName?: string;
  adopterName?: string;
}

export const ReunificationDialog: React.FC<ReunificationDialogProps> = ({
  isOpen,
  onClose,
  matchId,
  childName,
  adopterName,
}) => {
  const t = useTranslations("adoption");

  const [form, setForm] = useState<ProcessReunificationPayload>({
    reunificationDate: new Date().toISOString().split("T")[0],
    fatherName: "",
    motherName: "",
    contactPhoneNumber: "",
    nationalIdNumber: "",
    currentAddress: "",
    courtOrderNumber: "",
    reunificationReason: "",
    socialWorkerNotes: "",
    reopenApplicationForRematch: true,
    adopterSupportNotes: "",
  });

  const mutation = useProcessReunification(matchId);

  const handleSubmit = () => {
    mutation.mutate(
      {
        ...form,
        reunificationDate: form.reunificationDate
          ? new Date(form.reunificationDate).toISOString()
          : new Date().toISOString(),
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const isFormValid =
    form.contactPhoneNumber.trim() &&
    form.currentAddress.trim() &&
    form.reunificationReason.trim();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-amber-700 mb-1">
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <Users className="w-5 h-5 text-amber-700" />
            </div>
            <DialogTitle className="text-lg">
              {t("adoptionDetail.reunification.title")}
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-600 text-xs leading-relaxed">
            {t("adoptionDetail.reunification.description")}
          </DialogDescription>
        </DialogHeader>

        {/* Warning Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-3 items-start text-xs text-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold mb-0.5">{t("adoptionDetail.reunification.warningTitle")}</p>
            <p>{t("adoptionDetail.reunification.warning")}</p>
          </div>
        </div>

        <div className="space-y-4 py-2">
          {/* Section: Biological Parents Identity */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              {t("adoptionDetail.reunification.biologicalFamilyInfo")}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                  {t("adoptionDetail.reunification.fatherName")}{" "}
                  <span className="text-slate-400 font-normal">
                    {t("adoptionDetail.reunification.optional")}
                  </span>
                </Label>
                <Input
                  placeholder="e.g. Abebe Bekele"
                  value={form.fatherName || ""}
                  onChange={(e) => setForm((f) => ({ ...f, fatherName: e.target.value }))}
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                  {t("adoptionDetail.reunification.motherName")}{" "}
                  <span className="text-slate-400 font-normal">
                    {t("adoptionDetail.reunification.optional")}
                  </span>
                </Label>
                <Input
                  placeholder="e.g. Almaz Tadesse"
                  value={form.motherName || ""}
                  onChange={(e) => setForm((f) => ({ ...f, motherName: e.target.value }))}
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                  {t("adoptionDetail.reunification.contactPhoneNumber")} <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <Input
                    className="pl-9"
                    placeholder="0911000000"
                    value={form.contactPhoneNumber}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, contactPhoneNumber: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                  {t("adoptionDetail.reunification.nationalIdNumber")}{" "}
                  <span className="text-slate-400 font-normal">
                    {t("adoptionDetail.reunification.optional")}
                  </span>
                </Label>
                <div className="relative">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <Input
                    className="pl-9"
                    placeholder="e.g. ET-12345678"
                    value={form.nationalIdNumber || ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, nationalIdNumber: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                {t("adoptionDetail.reunification.currentAddress")} <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <Input
                  className="pl-9"
                  placeholder="Region, Sub-City, Woreda, Kebele, House No..."
                  value={form.currentAddress}
                  onChange={(e) => setForm((f) => ({ ...f, currentAddress: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Section: Official & Legal Documentation */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                  {t("adoptionDetail.reunification.handoverDate")} <span className="text-rose-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={form.reunificationDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, reunificationDate: e.target.value }))
                  }
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                  {t("adoptionDetail.reunification.courtOrderNumber")}{" "}
                  <span className="text-slate-400 font-normal">
                    {t("adoptionDetail.reunification.optional")}
                  </span>
                </Label>
                <div className="relative">
                  <FileCheck2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <Input
                    className="pl-9"
                    placeholder="e.g. CD-2026/894"
                    value={form.courtOrderNumber || ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, courtOrderNumber: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                {t("adoptionDetail.reunification.reunificationReason")} <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                placeholder={t("adoptionDetail.reunification.reasonPlaceholder")}
                rows={3}
                value={form.reunificationReason}
                onChange={(e) =>
                  setForm((f) => ({ ...f, reunificationReason: e.target.value }))
                }
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                {t("adoptionDetail.reunification.socialWorkerNotes")}{" "}
                <span className="text-slate-400 font-normal">
                  {t("adoptionDetail.reunification.optional")}
                </span>
              </Label>
              <Textarea
                placeholder={t("adoptionDetail.reunification.notesPlaceholder")}
                rows={2}
                value={form.socialWorkerNotes || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, socialWorkerNotes: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Section: Adopter Rematch Disposition */}
          <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="reopenCheckbox"
                checked={form.reopenApplicationForRematch}
                onChange={(e) =>
                  setForm((f) => ({ ...f, reopenApplicationForRematch: e.target.checked }))
                }
                className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="reopenCheckbox" className="text-xs text-slate-700 cursor-pointer">
                <span className="font-bold text-slate-900 block text-sm">
                  {t("adoptionDetail.reunification.reopenForRematch")}
                </span>
                {t("adoptionDetail.reunification.reopenDescription")}
              </label>
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                {t("adoptionDetail.reunification.adopterSupportNotes")}{" "}
                <span className="text-slate-400 font-normal">
                  {t("adoptionDetail.reunification.optional")}
                </span>
              </Label>
              <Textarea
                placeholder={t("adoptionDetail.reunification.supportNotesPlaceholder")}
                rows={2}
                value={form.adopterSupportNotes || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, adopterSupportNotes: e.target.value }))
                }
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={mutation.isPending}>
            {t("adoptionDetail.reunification.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || mutation.isPending}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            {mutation.isPending
              ? t("adoptionDetail.reunification.processing")
              : t("adoptionDetail.reunification.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
