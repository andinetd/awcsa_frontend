"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  useUpdateMemberMutation,
  useMoveMemberMutation,
  useGetAssociationGroupsQuery,
  useCheckMemberDuplicateMutation,
} from "@/hooks/womens";
import { WomenAssociationMemberListItem } from "@/api/womens/associations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface MemberEditDialogProps {
  member: WomenAssociationMemberListItem | null;
  open: boolean;
  onClose: () => void;
}

const ROWS_PER_GROUP = 10;

export default function MemberEditDialog({
  member,
  open,
  onClose,
}: MemberEditDialogProps) {
  const t = useTranslations("women.members");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [groupId, setGroupId] = useState<string>("");
  const [serialNumber, setSerialNumber] = useState<string>("1");

  const [pendingSubmit, setPendingSubmit] = useState<{
    fullName: string;
    phoneNumber: string;
    toGroupId: number;
    toSerialNumber: number;
  } | null>(null);

  const updateMutation = useUpdateMemberMutation();
  const moveMutation = useMoveMemberMutation();
  const duplicateMutation = useCheckMemberDuplicateMutation();

  const { data: groupsResponse } = useGetAssociationGroupsQuery(
    member?.associationId ?? 0
  );
  const groups = groupsResponse?.data ?? [];

  useEffect(() => {
    if (member) {
      setFullName(member.fullName);
      setPhone(member.phoneNumber ?? "");
      setGroupId(member.groupId ? String(member.groupId) : "");
      setSerialNumber(String(member.serialNumber));
    }
  }, [member]);

  if (!member) return null;

  const reset = () => {
    setFullName("");
    setPhone("");
    setGroupId("");
    setSerialNumber("1");
    setPendingSubmit(null);
  };

  const close = () => {
    reset();
    onClose();
  };

  const handleSave = async () => {
    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim();
    if (!trimmedName) {
      toast.error(t("form.errors.nameRequired"));
      return;
    }
    const targetGroupId = Number(groupId);
    const targetSerial = Number(serialNumber);
    if (!targetGroupId || !Number.isFinite(targetSerial) || targetSerial < 1) {
      toast.error(t("form.errors.groupRequired"));
      return;
    }

    const movePayload = {
      toGroupId: targetGroupId,
      toSerialNumber: targetSerial,
    };

    // Only check for duplicates when a phone is present and the member is moving
    // out of their current slot (which would create a "new" entry in the target).
    const isMoving =
      member.groupId !== targetGroupId ||
      member.serialNumber !== targetSerial;

    if (trimmedPhone) {
      try {
        const dup = await duplicateMutation.mutateAsync({
          phone: trimmedPhone,
          associationId: member.associationId,
          excludeMemberId: member.id,
        });
        if (dup.data.exists) {
          setPendingSubmit({
            fullName: trimmedName,
            phoneNumber: trimmedPhone,
            ...movePayload,
          });
          return;
        }
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message || t("form.errors.duplicateCheckFailed")
        );
        return;
      }
    }

    await applyChanges(trimmedName, trimmedPhone, movePayload, isMoving);
  };

  const applyChanges = async (
    trimmedName: string,
    trimmedPhone: string,
    movePayload: { toGroupId: number; toSerialNumber: number },
    isMoving: boolean
  ) => {
    try {
      await updateMutation.mutateAsync({
        id: member.id,
        fullName: trimmedName,
        phoneNumber: trimmedPhone || undefined,
      });
      if (isMoving) {
        await moveMutation.mutateAsync({ id: member.id, ...movePayload });
      }
      toast.success(t("form.messages.saved"));
      setPendingSubmit(null);
      close();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || t("form.messages.error")
      );
    }
  };

  const isPending =
    updateMutation.isPending ||
    moveMutation.isPending ||
    duplicateMutation.isPending;

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !o && close()}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{t("form.title")}</DialogTitle>
            <DialogDescription>{t("form.description")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>{t("form.fields.fullName")}</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t("form.placeholders.fullName")}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("form.fields.phone")}</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("form.placeholders.phone")}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>{t("form.fields.group")}</Label>
                <Select value={groupId} onValueChange={setGroupId}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("form.placeholders.group")} />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((g) => (
                      <SelectItem key={g.id} value={String(g.id)}>
                        {t("form.groupOption", { number: g.groupNumber })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("form.fields.serial")}</Label>
                <Select value={serialNumber} onValueChange={setSerialNumber}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("form.placeholders.serial")} />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: ROWS_PER_GROUP }, (_, i) => i + 1).map(
                      (n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={close}>
              {t("form.buttons.cancel")}
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t("form.buttons.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!pendingSubmit}
        onOpenChange={(o) => !o && setPendingSubmit(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("duplicate.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("duplicate.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingSubmit(null)}>
              {t("duplicate.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!pendingSubmit) return;
                const isMoving =
                  member.groupId !== pendingSubmit.toGroupId ||
                  member.serialNumber !== pendingSubmit.toSerialNumber;
                applyChanges(
                  pendingSubmit.fullName,
                  pendingSubmit.phoneNumber,
                  {
                    toGroupId: pendingSubmit.toGroupId,
                    toSerialNumber: pendingSubmit.toSerialNumber,
                  },
                  isMoving
                );
              }}
            >
              {t("duplicate.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
