"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import CrossDepartmentHistory from "./cross-department-history";

export interface PersonHistoryDialogProps {
  clientId?: number;
  cityIdNumber?: string;
  faydaId?: string;
  personName?: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function PersonHistoryDialog({
  clientId,
  cityIdNumber,
  faydaId,
  personName,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: PersonHistoryDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange : setInternalOpen;

  const titleText = personName
    ? `Cross-Department Support History: ${personName}`
    : "Cross-Department Support History";

  const identifier = cityIdNumber
    ? `City ID: ${cityIdNumber}`
    : faydaId
      ? `Fayda ID: ${faydaId}`
      : clientId
        ? `Client ID: ${clientId}`
        : "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-600 hover:text-primary"
            title="View Cross-Department Support History"
          >
            <History className="w-4 h-4" />
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-6">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg font-lexend text-slate-900">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              <History className="w-4 h-4" />
            </div>
            <span>{titleText}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Unified record of all services, requests, trainings, and benefits across Women&apos;s Affairs, Disability, Elderly, and Social Support.
            {identifier && <span className="ml-2 font-medium text-slate-700">({identifier})</span>}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <CrossDepartmentHistory
            clientId={clientId}
            cityIdNumber={cityIdNumber}
            faydaId={faydaId}
            personName={personName}
            defaultExpanded={true}
            embedded={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
