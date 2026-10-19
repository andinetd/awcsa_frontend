"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Fingerprint,
  Camera,
  Search,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  useChildBiometrics,
  useRegisterChildBiometrics,
  useCheckChildDuplicates,
} from "@/hooks/adoption/useChildDetails";
import {
  Child,
  IdentifyingMark,
  DuplicateCheckResult,
} from "@/types/child-matching-types";

interface BiometricsSectionProps {
  child: Child;
}

export function BiometricsSection({ child }: BiometricsSectionProps) {
  const t = useTranslations("adoption.biometrics");
  const childId = child.id;
  const { data: biometricData, isLoading } = useChildBiometrics(childId);
  const registerMutation = useRegisterChildBiometrics(childId);
  const duplicateCheckMutation = useCheckChildDuplicates();

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoHash, setPhotoHash] = useState("");
  const [marks, setMarks] = useState<IdentifyingMark[]>([]);
  const [newMarkType, setNewMarkType] = useState<"SCAR" | "BIRTHMARK" | "TATTOO" | "OTHER">("BIRTHMARK");
  const [newMarkLocation, setNewMarkLocation] = useState("");
  const [newMarkDesc, setNewMarkDesc] = useState("");

  const [dupResult, setDupResult] = useState<DuplicateCheckResult | null>(null);
  const [isCheckRunning, setIsCheckRunning] = useState(false);

  const currentRecord = biometricData || child.biometricRecord;

  const handleAddMark = () => {
    if (!newMarkLocation || !newMarkDesc) return;
    setMarks((prev) => [
      ...prev,
      {
        type: newMarkType,
        location: newMarkLocation,
        description: newMarkDesc,
      },
    ]);
    setNewMarkLocation("");
    setNewMarkDesc("");
  };

  const handleRemoveMark = (idx: number) => {
    setMarks((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveBiometrics = async () => {
    if (!photoUrl) return;
    await registerMutation.mutateAsync({
      facialPhotoUrl: photoUrl,
      photoHash: photoHash.trim() || undefined,
      identifyingMarks: marks,
      biometricConsent: true,
    });
    setIsRegisterOpen(false);
  };

  const handleRunDuplicateCheck = async () => {
    setIsCheckRunning(true);
    try {
      const res = await duplicateCheckMutation.mutateAsync({
        photoHash: currentRecord?.photoHash || undefined,
        firstName: child.serviceData?.client?.firstName,
      });
      setDupResult(res);
    } finally {
      setIsCheckRunning(false);
    }
  };

  return (
    <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
      <CardHeader className="bg-[#F7F8FA] border-b border-[#E3E7EB] py-3.5 px-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xs bg-[#1769AA]/10 text-[#1769AA] flex items-center justify-center">
              <Fingerprint className="size-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wide font-mono">
                {t("title")}
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                {t("subtitle")}
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleRunDuplicateCheck}
              disabled={isCheckRunning}
              className="h-8 text-xs font-semibold rounded-xs border-[#BCD5EA] text-[#1769AA] hover:bg-[#E8F2FA] gap-1.5 cursor-pointer"
            >
              {isCheckRunning ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Search className="size-3.5" />
              )}
              {t("buttons.runScan")}
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setPhotoUrl(currentRecord?.facialPhotoUrl || "");
                setPhotoHash(currentRecord?.photoHash || "");
                setMarks(currentRecord?.identifyingMarks || []);
                setIsRegisterOpen(true);
              }}
              className="h-8 text-xs font-semibold rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white gap-1.5 cursor-pointer shadow-2xs"
            >
              <Camera className="size-3.5" />
              {currentRecord?.facialPhotoUrl ? t("buttons.update") : t("buttons.register")}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        {/* Duplicate Scan Result Alert if performed */}
        {dupResult && (
          <div
            className={`p-4 rounded-xs border text-xs ${
              dupResult.isLikelyDuplicate
                ? "bg-amber-50 border-amber-200 text-amber-900"
                : "bg-emerald-50 border-emerald-200 text-emerald-900"
            }`}
          >
            <div className="flex items-start gap-3">
              {dupResult.isLikelyDuplicate ? (
                <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1.5 flex-1">
                <p className="font-bold text-sm">
                  {dupResult.isLikelyDuplicate
                    ? t("scanResult.dupWarning", { count: dupResult.potentialDuplicateCount })
                    : t("scanResult.zeroDuplicates")}
                </p>
                <p className="text-slate-600">
                  {dupResult.isLikelyDuplicate
                    ? t("scanResult.dupWarningDesc")
                    : t("scanResult.zeroDuplicatesDesc")}
                </p>

                {dupResult.candidates && dupResult.candidates.length > 0 && (
                  <div className="mt-3 space-y-2 pt-2 border-t border-amber-200/80">
                    {dupResult.candidates.map((cand) => (
                      <div
                        key={cand.childId}
                        className="bg-white/80 p-2.5 rounded-xs border border-amber-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-900">{cand.name}</span>{" "}
                          <span className="text-slate-500 font-mono text-[11px]">(ID: #{cand.childId})</span>
                          <p className="text-[11px] text-slate-500">
                            Facility: {cand.facilityName || t("scanResult.unassigned")} | Reason: {cand.matchReason}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-amber-700 bg-amber-100/60 border-amber-300">
                          {t("scanResult.confidence", { confidence: cand.confidence })}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Biometrics Summary Profile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Portrait & Biometric Hash */}
          <div className="flex flex-col items-center justify-center p-4 bg-[#F7F8FA] rounded-xs border border-[#E3E7EB] text-center">
            {currentRecord?.facialPhotoUrl ? (
              <img
                src={currentRecord.facialPhotoUrl}
                alt="Child Biometric Portrait"
                className="w-32 h-32 object-cover rounded-xs border border-slate-300 shadow-2xs mb-3"
              />
            ) : (
              <div className="w-32 h-32 bg-slate-200 rounded-xs flex flex-col items-center justify-center text-slate-400 mb-3 border border-dashed border-slate-300">
                <Camera className="size-8 mb-1" />
                <span className="text-[11px]">{t("profile.noPhoto")}</span>
              </div>
            )}
            <div className="space-y-1 w-full">
              <p className="text-xs font-bold text-[#0B1F3A]">{t("profile.perceptualHash")}</p>
              <p className="font-mono text-[11px] bg-white border border-[#E3E7EB] px-2 py-1 rounded-xs text-slate-600 truncate">
                {currentRecord?.photoHash || t("profile.pendingRegistration")}
              </p>
              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="size-3 text-emerald-600" />
                <span>{t("profile.consentVerified")}</span>
              </div>
            </div>
          </div>

          {/* Identifying Marks & Physical Scars */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center justify-between border-b border-[#E3E7EB] pb-2">
              <h4 className="text-xs font-bold text-[#0B1F3A] uppercase font-mono tracking-wide">
                {t("marks.title")} ({currentRecord?.identifyingMarks?.length || 0})
              </h4>
            </div>

            {currentRecord?.identifyingMarks && currentRecord.identifyingMarks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentRecord.identifyingMarks.map((mark: IdentifyingMark, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#F7F8FA] border border-[#E3E7EB] rounded-xs text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px] uppercase font-mono bg-white">
                        {t(`marks.types.${mark.type}` as any)}
                      </Badge>
                      <span className="text-[11px] font-semibold text-slate-700">{mark.location}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed pt-1">
                      {mark.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 bg-[#F7F8FA] border border-dashed border-[#E3E7EB] rounded-xs">
                <Fingerprint className="size-6 mx-auto mb-1 opacity-40 text-slate-400" />
                <p className="text-xs">{t("marks.empty")}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Register/Update Biometrics Dialog */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#0B1F3A]">
              {t("dialog.title")}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {t("dialog.desc")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t("dialog.photoUrlLabel")}</Label>
              <Input
                placeholder="https://storage.example.com/portraits/child_123.jpg"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="h-8 text-xs rounded-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t("dialog.photoHashLabel")}</Label>
              <Input
                placeholder="phash_a89bc4410f..."
                value={photoHash}
                onChange={(e) => setPhotoHash(e.target.value)}
                className="h-8 text-xs rounded-xs font-mono"
              />
              <p className="text-[11px] text-slate-400">
                {t("dialog.photoHashHint")}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#E3E7EB]">
              <Label className="text-xs font-semibold">{t("dialog.addMarkLabel")}</Label>
              <div className="grid grid-cols-3 gap-2">
                <Select
                  value={newMarkType}
                  onValueChange={(v: any) => setNewMarkType(v)}
                >
                  <SelectTrigger className="h-8 text-xs rounded-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BIRTHMARK">{t("marks.types.BIRTHMARK")}</SelectItem>
                    <SelectItem value="SCAR">{t("marks.types.SCAR")}</SelectItem>
                    <SelectItem value="TATTOO">{t("marks.types.TATTOO")}</SelectItem>
                    <SelectItem value="OTHER">{t("marks.types.OTHER")}</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder={t("dialog.locationPlaceholder")}
                  value={newMarkLocation}
                  onChange={(e) => setNewMarkLocation(e.target.value)}
                  className="h-8 text-xs rounded-xs col-span-2"
                />
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder={t("dialog.descPlaceholder")}
                  value={newMarkDesc}
                  onChange={(e) => setNewMarkDesc(e.target.value)}
                  className="h-8 text-xs rounded-xs flex-1"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddMark}
                  className="h-8 text-xs rounded-xs gap-1 border-[#BCD5EA] text-[#1769AA]"
                >
                  <Plus className="size-3.5" />
                  {t("buttons.addMark")}
                </Button>
              </div>

              {/* Added marks list */}
              {marks.length > 0 && (
                <div className="space-y-1 pt-2">
                  {marks.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-1.5 px-2 bg-slate-50 border border-slate-200 rounded-xs text-[11px]"
                    >
                      <span>
                        <strong>[{t(`marks.types.${m.type}` as any)}]</strong> {m.location}: {m.description}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMark(idx)}
                        className="h-5 text-rose-600 hover:text-rose-700 text-[10px] p-0"
                      >
                        {t("buttons.removeMark")}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRegisterOpen(false)}
              className="h-8 text-xs rounded-xs"
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              size="sm"
              onClick={handleSaveBiometrics}
              disabled={registerMutation.isPending || !photoUrl}
              className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white"
            >
              {registerMutation.isPending ? t("buttons.saving") : t("buttons.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
