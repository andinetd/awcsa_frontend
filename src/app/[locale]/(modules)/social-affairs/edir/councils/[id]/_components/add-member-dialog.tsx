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
        <Button variant="outline">
          <UserPlus className="w-4 h-4" />
          {t("buttons.addMember")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("buttons.addMember")}</DialogTitle>
          <DialogDescription>{council.name}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">
            {t("list.loading")}
          </div>
        ) : available.length === 0 ? (
          <div className="text-center text-gray-500 py-8 text-sm">
            {t("detail.noMembers")}
          </div>
        ) : (
          <div className="space-y-2">
            {available.map((edir) => (
              <button
                key={edir.id}
                type="button"
                onClick={() => toggle(edir.id as number)}
                className="w-full flex items-center justify-between border rounded-lg p-3 text-left hover:bg-muted transition-colors"
              >
                <div>
                  <p className="font-medium">{edir.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {edir.registrationNumber || t("detail.notAvailable")}
                    {" • "}
                    {edir.subCity}
                  </p>
                </div>
                <span
                  className={`h-5 w-5 rounded border flex items-center justify-center ${
                    selected.includes(edir.id as number)
                      ? "bg-primary border-primary text-white"
                      : "border-muted-foreground"
                  }`}
                >
                  {selected.includes(edir.id as number) && (
                    <Check className="h-3.5 w-3.5" />
                  )}
                </span>
              </button>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("buttons.dismiss")}
          </Button>
          <Button
            onClick={handleAdd}
            disabled={selected.length === 0 || addMutation.isPending}
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