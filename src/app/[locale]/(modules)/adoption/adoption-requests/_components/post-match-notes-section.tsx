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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  FileText,
  Calendar,
  User,
  ShieldCheck,
  AlertCircle,
  Activity,
  GraduationCap,
  Scale,
  Sparkles,
  Clock,
  RotateCcw,
} from "lucide-react";
import {
  useGetMatchNotes,
  useAddPostMatchNote,
} from "@/hooks/adoption/useMatches";
import { PostMatchNoteCategory, PostMatchNote } from "@/api/adoption/matches";
import { toast } from "sonner";
import { ReunificationDialog } from "./reunification-dialog";

interface PostMatchNotesSectionProps {
  matchId?: number | null;
  currentStatus?: string;
  onStatusUpdated?: () => void;
}

const CATEGORY_ICONS: Record<PostMatchNoteCategory, any> = {
  GENERAL: FileText,
  PLACEMENT_PROGRESS: Sparkles,
  HEALTH: Activity,
  EDUCATION: GraduationCap,
  LEGAL_NOTE: Scale,
  CONCERN_OR_INCIDENT: AlertCircle,
  OFFICIAL_REMARK: ShieldCheck,
};

const CATEGORY_COLORS: Record<PostMatchNoteCategory, string> = {
  GENERAL: "bg-slate-100 text-slate-700 border-slate-200",
  PLACEMENT_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200",
  HEALTH: "bg-emerald-100 text-emerald-800 border-emerald-200",
  EDUCATION: "bg-amber-100 text-amber-800 border-amber-200",
  LEGAL_NOTE: "bg-purple-100 text-purple-800 border-purple-200",
  CONCERN_OR_INCIDENT: "bg-rose-100 text-rose-800 border-rose-200",
  OFFICIAL_REMARK: "bg-indigo-100 text-indigo-800 border-indigo-200",
};

export const PostMatchNotesSection: React.FC<PostMatchNotesSectionProps> = ({
  matchId,
  currentStatus,
  onStatusUpdated,
}) => {
  const t = useTranslations("adoption");

  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isReunificationOpen, setIsReunificationOpen] = useState(false);

  // Form states for adding note
  const [noteCategory, setNoteCategory] =
    useState<PostMatchNoteCategory>("GENERAL");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  const { data: notes = [], isLoading } = useGetMatchNotes(
    matchId,
    selectedCategory === "ALL" ? undefined : selectedCategory,
  );

  const addNoteMutation = useAddPostMatchNote(matchId);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) {
      toast.error("Please fill in both title and content");
      return;
    }

    try {
      await addNoteMutation.mutateAsync({
        category: noteCategory,
        title: noteTitle.trim(),
        content: noteContent.trim(),
      });
      setNoteTitle("");
      setNoteContent("");
      setNoteCategory("GENERAL");
      setIsAddNoteOpen(false);
    } catch {
      // Handled by hook toast
    }
  };

  const categories: { label: string; value: string }[] = [
    { label: t("adoptionDetail.postMatch.filterAll"), value: "ALL" },
    {
      label: t("adoptionDetail.postMatch.categories.PLACEMENT_PROGRESS"),
      value: "PLACEMENT_PROGRESS",
    },
    {
      label: t("adoptionDetail.postMatch.categories.HEALTH"),
      value: "HEALTH",
    },
    {
      label: t("adoptionDetail.postMatch.categories.EDUCATION"),
      value: "EDUCATION",
    },
    {
      label: t("adoptionDetail.postMatch.categories.LEGAL_NOTE"),
      value: "LEGAL_NOTE",
    },
    {
      label: t("adoptionDetail.postMatch.categories.CONCERN_OR_INCIDENT"),
      value: "CONCERN_OR_INCIDENT",
    },
    {
      label: t("adoptionDetail.postMatch.categories.OFFICIAL_REMARK"),
      value: "OFFICIAL_REMARK",
    },
    {
      label: t("adoptionDetail.postMatch.categories.GENERAL"),
      value: "GENERAL",
    },
  ];

  if (!matchId) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-slate-500 text-sm">
        {t("adoptionDetail.postMatch.noNotes")}
      </div>
    );
  }

  const isTerminated = currentStatus === "TERMINATED";

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-lg">
                {t("adoptionDetail.postMatch.title")}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                {notes.length}
              </span>
              {currentStatus && (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${
                    isTerminated
                      ? "bg-rose-100 text-rose-800 border-rose-200"
                      : "bg-blue-100 text-blue-800 border-blue-200"
                  }`}
                >
                  {t(
                    `adoptionDetail.postMatch.statuses.${currentStatus}` as any,
                    { defaultValue: currentStatus },
                  )}
                </span>
              )}
            </div>
            <p className="text-slate-500 text-xs mt-1">
              {t("adoptionDetail.postMatch.subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isTerminated && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReunificationOpen(true)}
                className="text-amber-700 border-amber-300 hover:bg-amber-50 text-xs cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 mr-1 text-amber-600" />
                Biological Parents Reunification
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => setIsAddNoteOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1" />
              {t("adoptionDetail.postMatch.addNote")}
            </Button>
          </div>
        </div>

        {/* Category Filter Dropdown */}
        <div className="flex items-center justify-between gap-3 pt-4 mt-4 border-t border-slate-100 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
              Filter:
            </span>
            <Select
              value={selectedCategory}
              onValueChange={(val) => setSelectedCategory(val)}
            >
              <SelectTrigger className="h-8 w-56 text-xs bg-white border-slate-200">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => {
                  const Icon =
                    cat.value === "ALL"
                      ? FileText
                      : CATEGORY_ICONS[cat.value as PostMatchNoteCategory];
                  return (
                    <SelectItem
                      key={cat.value}
                      value={cat.value}
                      className="text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {Icon && (
                          <Icon className="w-3.5 h-3.5 text-slate-500" />
                        )}
                        <span>{cat.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          {selectedCategory !== "ALL" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCategory("ALL")}
              className="h-7 text-xs text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              Reset filter
            </Button>
          )}
        </div>
      </div>

      {/* Notes Timeline */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            Loading post-match notes...
          </div>
        ) : notes.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-medium text-slate-600 text-sm">
              {t("adoptionDetail.postMatch.noNotes")}
            </p>
            <p className="text-slate-400 text-xs mt-1">
              Click &quot;{t("adoptionDetail.postMatch.addNote")}&quot; above to log the first record.
            </p>
          </div>
        ) : (
          notes.map((note: PostMatchNote) => {
            const Icon = CATEGORY_ICONS[note.category] || FileText;
            const badgeColor =
              CATEGORY_COLORS[note.category] || CATEGORY_COLORS.GENERAL;

            return (
              <div
                key={note.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-slate-300 transition-all space-y-2"
              >
                {/* Note Top Bar */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeColor}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {t(
                        `adoptionDetail.postMatch.categories.${note.category}` as any,
                        { defaultValue: note.category },
                      )}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {note.title}
                    </h4>
                  </div>
                  <div className="flex items-center text-slate-400 text-xs gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(note.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* Note Content */}
                <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </p>

                {/* Note Author Footer */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Recorded by:{" "}
                      <span className="font-medium text-slate-800">
                        {note.author.firstName} {note.author.lastName}
                      </span>
                      {note.author.employeeRole && (
                        <span className="text-slate-400 ml-1">
                          ({note.author.employeeRole.replace(/_/g, " ")})
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Dialog: Add Post-Match Information */}
      <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleAddNote}>
            <DialogHeader>
              <DialogTitle>
                {t("adoptionDetail.postMatch.addNoteTitle")}
              </DialogTitle>
              <DialogDescription>
                {t("adoptionDetail.postMatch.addNoteDescription")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Category Selector */}
              <div>
                <Label
                  htmlFor="category"
                  className="text-xs font-semibold text-slate-700 mb-1.5 block"
                >
                  {t("adoptionDetail.postMatch.category")}
                </Label>
                <Select
                  value={noteCategory}
                  onValueChange={(val) =>
                    setNoteCategory(val as PostMatchNoteCategory)
                  }
                >
                  <SelectTrigger
                    id="category"
                    className="w-full bg-white border-slate-300 h-9 text-sm"
                  >
                    <SelectValue placeholder="Select note category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((c) => c.value !== "ALL")
                      .map((cat) => {
                        const Icon =
                          CATEGORY_ICONS[cat.value as PostMatchNoteCategory];
                        return (
                          <SelectItem
                            key={cat.value}
                            value={cat.value}
                            className="text-xs"
                          >
                            <div className="flex items-center gap-2">
                              {Icon && (
                                <Icon className="w-4 h-4 text-slate-500" />
                              )}
                              <span>{cat.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
              </div>

              {/* Title Input */}
              <div>
                <Label htmlFor="title">
                  {t("adoptionDetail.postMatch.noteTitle")}
                </Label>
                <Input
                  id="title"
                  placeholder={t(
                    "adoptionDetail.postMatch.noteTitlePlaceholder",
                  )}
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="mt-1.5"
                  required
                />
              </div>

              {/* Content Textarea */}
              <div>
                <Label htmlFor="content">
                  {t("adoptionDetail.postMatch.content")}
                </Label>
                <Textarea
                  id="content"
                  placeholder={t(
                    "adoptionDetail.postMatch.contentPlaceholder",
                  )}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={4}
                  className="mt-1.5 resize-none"
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAddNoteOpen(false)}
                className="cursor-pointer"
              >
                {t("adoptionDetail.postMatch.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={addNoteMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                {addNoteMutation.isPending
                  ? t("adoptionDetail.postMatch.saving")
                  : t("adoptionDetail.postMatch.saveNote")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>


      <ReunificationDialog
        isOpen={isReunificationOpen}
        onClose={() => setIsReunificationOpen(false)}
        matchId={matchId}
      />
    </div>
  );
};
