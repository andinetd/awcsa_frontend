"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  AlertCircle,
  Building2,
  ExternalLink,
  Heart,
  Loader2,
  Plus,
  ShieldAlert,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useAddSiblingToGroup,
  useCreateSiblingGroup,
} from "@/hooks/adoption/useChildDetails";
import { Child } from "@/types/child-matching-types";

interface SiblingGroupSectionProps {
  child: Child;
}

export const SiblingGroupSection: React.FC<SiblingGroupSectionProps> = ({ child }) => {
  const siblingGroup = child.siblingGroup;
  const siblings = siblingGroup?.children?.filter((s) => s.id !== child.id) || [];

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [siblingChildId, setSiblingChildId] = useState("");
  const [notes, setNotes] = useState("");

  const createGroupMutation = useCreateSiblingGroup(child.id);
  const addSiblingMutation = useAddSiblingToGroup(child.id);

  const handleCreateGroup = async () => {
    const id = parseInt(siblingChildId.trim());
    if (isNaN(id) || id <= 0) return;

    await createGroupMutation.mutateAsync({
      childIds: [child.id, id],
      notes: notes.trim() || undefined,
    });
    setIsCreateModalOpen(false);
    setSiblingChildId("");
    setNotes("");
  };

  const handleAddSibling = async () => {
    const id = parseInt(siblingChildId.trim());
    if (!siblingGroup || isNaN(id) || id <= 0) return;

    await addSiblingMutation.mutateAsync({
      groupId: siblingGroup.id,
      targetChildId: id,
    });
    setIsAddModalOpen(false);
    setSiblingChildId("");
  };

  return (
    <>
      <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
        <CardHeader className="bg-[#F7F8FA] border-b border-[#E3E7EB] py-3 px-4 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A] flex items-center gap-2 font-mono">
            <Users className="size-3.5 text-[#1769AA]" />
            Sibling Group (Non-Separation Family Protection)
          </CardTitle>
          <div>
            {siblingGroup ? (
              <Button
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                className="h-7 text-xs bg-[#0B1F3A] hover:bg-[#122D52] text-white rounded-xs font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Sibling
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
                className="h-7 text-xs bg-[#0B1F3A] hover:bg-[#122D52] text-white rounded-xs font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Link Siblings
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-3 px-4 pb-4">
          {siblingGroup ? (
            <div className="space-y-3">
              {/* Sibling Group Banner */}
              <div className="bg-[#E8F2FA] border border-[#BCD5EA] p-3 rounded-xs flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#1769AA] shrink-0" />
                  <div>
                    <span className="font-bold text-[#0B1F3A]">
                      Group Code: {siblingGroup.groupCode}
                    </span>
                    <span className="text-slate-500 ml-2">
                      ({siblings.length + 1} biological siblings linked)
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 bg-white text-[#1769AA] rounded-xs border border-[#BCD5EA]">
                  Joint Placement Protected
                </span>
              </div>

              {/* Sibling Members Grid */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-slate-500 uppercase font-bold block">
                  Linked Brothers & Sisters
                </span>
                {siblings.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {siblings.map((sib) => {
                      const sibClient = sib.serviceData?.client;
                      return (
                        <div
                          key={sib.id}
                          className="bg-[#F7F8FA] border border-[#E3E7EB] hover:border-[#BCD5EA] p-2.5 rounded-xs flex items-center justify-between gap-2 text-xs transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0 text-slate-600 font-bold text-xs">
                              {sibClient?.firstName?.[0] || <User className="w-4 h-4" />}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-[#0B1F3A] truncate">
                                {sibClient
                                  ? `${sibClient.firstName} ${sibClient.lastName}`
                                  : `Child #${sib.id}`}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                                <Building2 className="w-3 h-3 text-slate-400" />
                                {sib.childCareFacility?.name || "Care Facility"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-xs bg-slate-200 text-slate-700">
                              {sib.currentStatus}
                            </span>
                            <Link href={`/adoption/children/${sib.id}`}>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-[#1769AA] hover:bg-white rounded-xs"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic py-2">
                    Only this child is currently recorded in this group. Link additional siblings using the button above.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400">
              <Users className="w-8 h-8 mx-auto mb-1 opacity-40 text-slate-300" />
              <p className="text-xs font-medium text-slate-600">
                Child is not registered in a sibling group.
              </p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto">
                If this child has biological siblings in welfare custody or other care facilities, link them together to enforce non-separation placement safeguards.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Dialog: Create Sibling Group ────────────────────────────────────── */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-xs">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-[#0B1F3A] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#1769AA]" />
              Link Sibling Unit
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Group this child with a biological brother or sister by entering the sibling's Child ID.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs font-semibold">Sibling Child Registration ID *</Label>
              <Input
                type="number"
                placeholder="e.g. 14"
                value={siblingChildId}
                onChange={(e) => setSiblingChildId(e.target.value)}
                className="text-xs rounded-xs mt-1 h-8"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Relationship Notes</Label>
              <Input
                placeholder="Found together; biological older brother..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="text-xs rounded-xs mt-1 h-8"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
              className="text-xs rounded-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!siblingChildId.trim() || createGroupMutation.isPending}
              onClick={handleCreateGroup}
              className="text-xs bg-[#0B1F3A] hover:bg-[#122D52] text-white rounded-xs font-semibold"
            >
              {createGroupMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
              )}
              Create Sibling Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Add Sibling to Existing Group ───────────────────────────── */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-xs">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-[#0B1F3A] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#1769AA]" />
              Add Sibling to Group ({siblingGroup?.groupCode})
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Enter the Child Registration ID of the newly identified brother or sister.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs font-semibold">Sibling Child Registration ID *</Label>
              <Input
                type="number"
                placeholder="e.g. 25"
                value={siblingChildId}
                onChange={(e) => setSiblingChildId(e.target.value)}
                className="text-xs rounded-xs mt-1 h-8"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
              className="text-xs rounded-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!siblingChildId.trim() || addSiblingMutation.isPending}
              onClick={handleAddSibling}
              className="text-xs bg-[#0B1F3A] hover:bg-[#122D52] text-white rounded-xs font-semibold"
            >
              {addSiblingMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
              )}
              Add to Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
