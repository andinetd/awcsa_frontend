"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  useGetEdirsForCouncilSelectionQuery,
  useAddEdirsToCouncilMutation,
} from "@/hooks/social-affairs";
import { EdirCouncil } from "@/api/social-affairs/edir";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus, Check } from "lucide-react";

interface Props {
  council: EdirCouncil;
}

export default function AddMemberDialog({ council }: Props) {
  const t = useTranslations("social-affairs.edir.councils");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  const { data: candidates, isLoading } = useGetEdirsForCouncilSelectionQuery(
    council.level
  );
  const addMutation = useAddEdirsToCouncilMutation();

  const existingIds = new Set(council.memberEdirs.map((m) => m.id));
  const available = (candidates || []).filter((edir) => {
    return edir.id !== undefined && !existingIds.has(edir.id);
  });

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAdd = async () => {
    if (selected.length === 0) return;
    try {
      await addMutation.mutateAsync({
        councilId: council.id,
        associationIds: selected,
      });
      toast.success(t("buttons.addMember"));
      setOpen(false);
      setSelected([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) setSelected([]);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-slate-50"
        >
          <UserPlus className="w-3.5 h-3.5 mr-1.5" />
          {t("buttons.addMember")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto max-w-2xl rounded-xs border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-base font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
            {t("buttons.addMember")}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-mono">
            {council.name}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-xs font-mono uppercase tracking-wider text-slate-400">
              {t("list.loading")}
            </div>
          </div>
        ) : available.length === 0 ? (
          <div className="rounded-xs border border-dashed border-[#E3E7EB] bg-slate-50/50 p-8 text-center text-slate-400 font-mono text-xs uppercase tracking-wider">
            {t("detail.noMembers")}
          </div>
        ) : (
          <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
            {available.map((edir) => {
              const isSelected = selected.includes(edir.id as number);
              return (
                <button
                  key={edir.id}
                  type="button"
                  onClick={() => toggle(edir.id as number)}
                  className={`w-full flex items-center justify-between border rounded-xs p-3 text-left transition-colors ${
                    isSelected
                      ? "border-[#BCD5EA] bg-[#E8F2FA]/50"
                      : "border-[#E3E7EB] bg-white hover:bg-slate-50/70"
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-[#0B1F3A]">{edir.name}</p>
                    <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                      {edir.registrationNumber || t("detail.notAvailable")}
                      {" • "}
                      {edir.subCity}
                    </p>
                  </div>
                  <span
                    className={`h-4 w-4 rounded-xs border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-[#1769AA] border-[#1769AA] text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <Check className="h-3 w-3 stroke-[3]" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <DialogFooter className="pt-3 border-t border-[#E3E7EB]">
          <Button
            variant="outline"
            className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            {t("buttons.dismiss")}
          </Button>
          <Button
            onClick={handleAdd}
            disabled={selected.length === 0 || addMutation.isPending}
            className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs"
          >
            {addMutation.isPending
              ? t("buttons.addingMembers")
              : t("buttons.addMember")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}