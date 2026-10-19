"use client";

import React, { useState } from "react";
import {
  Building2,
  Users,
  ClipboardCheck,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Percent,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  useFacilityCapacityOverview,
  useConductFacilityCensusAudit,
} from "@/hooks/adoption/useChildDetails";
import { useTranslations } from "next-intl";

interface FacilityCensusDialogProps {
  facilityId: number | null;
  facilityName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FacilityCensusDialog({
  facilityId,
  facilityName,
  open,
  onOpenChange,
}: FacilityCensusDialogProps) {
  const t = useTranslations("adoption");
  const { data: capacityData, isLoading } = useFacilityCapacityOverview(
    facilityId ?? undefined
  );
  const auditMutation = useConductFacilityCensusAudit(facilityId ?? undefined);

  const [physicalCount, setPhysicalCount] = useState("");
  const [auditNotes, setAuditNotes] = useState("");
  const [unregisteredCount, setUnregisteredCount] = useState("0");
  const [isAuditing, setIsAuditing] = useState(false);

  if (!facilityId) return null;

  const handleSaveAudit = async () => {
    if (!physicalCount) return;
    await auditMutation.mutateAsync({
      physicalHeadcount: Number(physicalCount),
      notes: auditNotes || undefined,
      findings: {
        unregisteredChildrenCount: Number(unregisteredCount) || 0,
      },
    });
    setIsAuditing(false);
    setPhysicalCount("");
    setAuditNotes("");
    setUnregisteredCount("0");
  };

  const occupancy = capacityData?.occupancyRate ?? 0;
  const isOverCapacity = occupancy > 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xs bg-[#1769AA]/10 text-[#1769AA] flex items-center justify-center">
              <Building2 className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-[#0B1F3A]">
                Facility Capacity & Census Auditing
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                {facilityName || capacityData?.facilityName || `Facility #${facilityId}`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Capacity Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-[#F7F8FA] border border-[#E3E7EB] rounded-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                Licensed Capacity
              </span>
              <p className="text-sm font-bold text-[#0B1F3A]">
                {capacityData?.licensedCapacity ?? "—"}
              </p>
              <span className="text-[10px] text-slate-400">Approved limit</span>
            </div>

            <div className="p-3 bg-[#F7F8FA] border border-[#E3E7EB] rounded-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                Active System Roster
              </span>
              <p className="text-sm font-bold text-[#0B1F3A]">
                {capacityData?.activeChildrenCount ?? 0}
              </p>
              <span className="text-[10px] text-slate-400">Registered children</span>
            </div>

            <div className="p-3 bg-[#F7F8FA] border border-[#E3E7EB] rounded-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                Occupancy Rate
              </span>
              <div className="flex items-center gap-1">
                <p
                  className={`text-sm font-bold ${
                    isOverCapacity ? "text-rose-600" : "text-emerald-600"
                  }`}
                >
                  {occupancy}%
                </p>
                {isOverCapacity && (
                  <Badge variant="destructive" className="text-[9px] py-0 px-1">
                    OVERCAPACITY
                  </Badge>
                )}
              </div>
              <span className="text-[10px] text-slate-400">Live census load</span>
            </div>
          </div>

          {/* Latest Audit Overview */}
          {capacityData?.latestAudit ? (
            <div className="p-3 bg-[#F7F8FA] border border-[#E3E7EB] rounded-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#0B1F3A] uppercase font-mono">
                  Latest Physical Headcount Audit
                </span>
                <Badge
                  variant="outline"
                  className={
                    capacityData.latestAudit.discrepancyCount === 0
                      ? "text-emerald-700 bg-emerald-50 border-emerald-300 text-[10px]"
                      : "text-amber-700 bg-amber-50 border-amber-300 text-[10px]"
                  }
                >
                  {capacityData.latestAudit.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-xs border border-slate-200">
                <div>
                  <strong>Physical Headcount:</strong>{" "}
                  {capacityData.latestAudit.physicalHeadcount} children
                </div>
                <div>
                  <strong>Discrepancy:</strong>{" "}
                  {capacityData.latestAudit.discrepancyCount > 0 ? (
                    <span className="text-rose-600 font-bold">
                      {capacityData.latestAudit.discrepancyCount} discrepancy
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-semibold">0 (Reconciled)</span>
                  )}
                </div>
              </div>

              {capacityData.latestAudit.notes && (
                <p className="text-[11px] text-slate-600 bg-white p-2 rounded-xs border border-slate-200">
                  {capacityData.latestAudit.notes}
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-slate-400 bg-[#F7F8FA] border border-dashed border-[#E3E7EB] rounded-xs">
              <ClipboardCheck className="size-5 mx-auto mb-1 opacity-40 text-slate-400" />
              <p className="text-[11px]">No formal physical audit conducted for this facility yet.</p>
            </div>
          )}

          {/* New Audit Form */}
          {!isAuditing ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAuditing(true)}
              className="w-full h-8 text-xs font-semibold rounded-xs border-[#BCD5EA] text-[#1769AA] hover:bg-[#E8F2FA] gap-1.5 cursor-pointer"
            >
              <Plus className="size-3.5" />
              Conduct New Physical Headcount Audit
            </Button>
          ) : (
            <div className="p-3.5 bg-white border border-[#BCD5EA] rounded-xs space-y-3">
              <h5 className="font-bold text-xs text-[#0B1F3A] uppercase font-mono">
                Log Headcount & Roster Reconciliation
              </h5>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Physical Headcount *</Label>
                  <Input
                    type="number"
                    placeholder="Physical children present"
                    value={physicalCount}
                    onChange={(e) => setPhysicalCount(e.target.value)}
                    className="h-8 text-xs rounded-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Unregistered Children Count</Label>
                  <Input
                    type="number"
                    value={unregisteredCount}
                    onChange={(e) => setUnregisteredCount(e.target.value)}
                    className="h-8 text-xs rounded-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Audit Remarks / Discrepancy Cause</Label>
                <Textarea
                  placeholder="Observations during inspection, absent children on medical leave, etc."
                  value={auditNotes}
                  onChange={(e) => setAuditNotes(e.target.value)}
                  className="text-xs rounded-xs h-16"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsAuditing(false)}
                  className="h-7 text-xs rounded-xs"
                >
                  {t("careCenters.census.cancel")}
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveAudit}
                  disabled={auditMutation.isPending || !physicalCount}
                  className="h-7 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white"
                >
                  {auditMutation.isPending
                    ? t("careCenters.census.submitting")
                    : t("careCenters.census.submit")}
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="rounded-xs text-xs bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 h-8 font-semibold shadow-2xs cursor-pointer"
          >
            {t("careCenters.census.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
