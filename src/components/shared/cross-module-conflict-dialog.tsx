"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Link2, UserCheck, ShieldCheck } from "lucide-react";

export interface CrossModuleClientData {
  id: number;
  firstName: string;
  lastName: string;
  grandfatherName: string | null;
  cityIdNumber: string | null;
  faydaId: string | null;
  phoneNumber: string | null;
  profiles: {
    hasWomenProfile: boolean;
    hasDisabilityProfile: boolean;
    hasElderlyProfile: boolean;
  };
}

interface CrossModuleConflictDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: CrossModuleClientData | null;
  targetModuleName: string; // e.g. "Women Affairs" or "Disability & Elderly"
  onConfirmLink: () => void;
  isLinking?: boolean;
}

export function CrossModuleConflictDialog({
  open,
  onOpenChange,
  client,
  targetModuleName,
  onConfirmLink,
  isLinking = false,
}: CrossModuleConflictDialogProps) {
  if (!client) return null;

  const existingModules: string[] = [];
  if (client.profiles.hasWomenProfile) existingModules.push("Women Affairs");
  if (client.profiles.hasDisabilityProfile) existingModules.push("Disability Affairs");
  if (client.profiles.hasElderlyProfile) existingModules.push("Elderly Affairs");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] rounded-xs border border-amber-300 bg-white p-6 shadow-xl">
        <DialogHeader className="border-b border-amber-100 pb-3">
          <div className="flex items-center gap-2 text-amber-700">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <DialogTitle className="text-base font-bold font-mono tracking-wide uppercase text-amber-900">
              Citizen Already Registered
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-600 font-sans mt-1">
            This citizen is already registered in the system under another department. 
            To prevent duplicate registration records, you can link their existing profile.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 space-y-3">
          <div className="p-3.5 rounded-xs bg-slate-50 border border-slate-200 text-xs font-mono space-y-2">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500 uppercase">Full Name</span>
              <span className="font-bold text-slate-800">
                {client.firstName} {client.lastName} {client.grandfatherName || ""}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 uppercase">City ID</span>
              <span className="font-semibold text-slate-700">{client.cityIdNumber || "N/A"}</span>
            </div>
            {client.faydaId && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500 uppercase">Fayda ID</span>
                <span className="font-semibold text-slate-700">{client.faydaId}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-slate-500 uppercase">Active Bureau(s)</span>
              <span className="inline-flex items-center gap-1 font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                <ShieldCheck className="w-3 h-3" />
                {existingModules.join(", ") || "General Client"}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xs bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
            <Link2 className="w-4 h-4 mt-0.5 shrink-0 text-blue-600" />
            <p>
              Clicking <strong>&ldquo;Link to {targetModuleName}&rdquo;</strong> will add a {targetModuleName} profile 
              directly to this citizen&rsquo;s existing ID without duplicating their identity or leaking medical records.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isLinking}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onConfirmLink}
            disabled={isLinking}
            className="bg-[#1769AA] hover:bg-[#12568E] text-white text-xs font-semibold gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5" />
            {isLinking ? "Linking..." : `Confirm & Link to ${targetModuleName}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
