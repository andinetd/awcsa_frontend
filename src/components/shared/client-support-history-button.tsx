"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { History, DollarSign, Package, CheckCircle2, Building, Calendar, Loader2 } from "lucide-react";
import { getClientActiveSupports, ActiveSupportsResponse } from "@/api/clients";
import { toast } from "sonner";

interface ClientSupportHistoryButtonProps {
  clientId: number;
  beneficiaryName?: string;
}

export function ClientSupportHistoryButton({
  clientId,
  beneficiaryName,
}: ClientSupportHistoryButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ActiveSupportsResponse | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await getClientActiveSupports(clientId);
      setData(res);
      setOpen(true);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load support history");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={fetchHistory}
        disabled={loading}
        className="h-7 text-xs font-mono gap-1.5 border-slate-300 hover:bg-slate-100"
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <History className="w-3.5 h-3.5 text-blue-600" />}
        Aid History
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto rounded-xs border border-slate-200 bg-white p-6 shadow-xl">
          <DialogHeader className="border-b border-slate-200 pb-3">
            <DialogTitle className="text-base font-bold font-mono tracking-wide uppercase text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-[#1769AA]" />
              Government Assistance History
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-mono">
              Beneficiary: {data?.beneficiaryName || beneficiaryName} (ID #{clientId})
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 space-y-3">
            {data?.activeSupports.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-slate-500 bg-slate-50 rounded-xs border border-slate-200">
                No past government assistance recorded for this citizen.
              </div>
            ) : (
              data?.activeSupports.map((item) => (
                <div
                  key={`${item.sourceModule}-${item.id}`}
                  className="p-3.5 rounded-xs border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors space-y-2 text-xs font-mono"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      {item.category === "FINANCIAL" ? (
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Package className="w-4 h-4 text-blue-600" />
                      )}
                      <span>{item.serviceName}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-200 text-slate-700">
                      {item.category}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-[#1769AA] pl-6">
                    {item.exactDetails.amountOrQuantity}
                    {item.exactDetails.periodCovered ? ` • ${item.exactDetails.periodCovered}` : ""}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pl-6 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Building className="w-3 h-3 text-slate-400" />
                      <span>{item.disbursedBy.office}</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{item.disbursedBy.dateProvided} ({item.disbursedBy.daysAgo}d ago)</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
