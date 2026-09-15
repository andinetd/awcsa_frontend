"use client";

import React, { useState } from "react";
import { CMSContent, CMSContentType } from "@/types/cms";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ContentDialog from "@/app/[locale]/(modules)/super-admin/landing-page/_components/content-dialog";
import { useDeleteCMSContent } from "@/hooks/cms";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ContentListManagerProps {
  type: CMSContentType;
  items: CMSContent[];
  onSuccess: () => void;
}

export default function ContentListManager({
  type,
  items,
  onSuccess,
}: ContentListManagerProps) {
  const t = useTranslations("super-admin.cms");
  const locale = useLocale();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CMSContent | undefined>();
  const deleteContent = useDeleteCMSContent();

  const handleAdd = () => {
    setSelectedItem(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (item: CMSContent) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteContent.mutate(id, {
      onSuccess: () => onSuccess(),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={handleAdd}
          className="h-8 rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white text-xs font-semibold shadow-2xs gap-1.5 px-3"
        >
          <Plus className="h-3.5 w-3.5" />
          {t("actions.add")}
        </Button>
      </div>

      <div className="border border-[#E3E7EB] rounded-xs bg-white shadow-2xs overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 border-b border-[#E3E7EB]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[100px] text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-600 h-9">{t("fields.order")}</TableHead>
              <TableHead className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-600 h-9">{t("fields.title")}</TableHead>
              <TableHead className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-600 h-9">{t("actions.visibility")}</TableHead>
              <TableHead className="text-right text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-600 h-9">{t("actions.edit")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-[#E3E7EB]">
            {(Array.isArray(items) ? [...items] : [])
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <TableCell className="font-mono text-xs text-slate-500 py-3">{item.order}</TableCell>
                  <TableCell className="font-semibold text-xs text-[#0B1F3A] py-3">
                    {item.title?.[locale as "en" | "am"] ||
                      item.title?.en ||
                      item.title?.am ||
                      "No Title"}
                  </TableCell>
                  <TableCell className="py-3">
                    {item.isVisible ? (
                      <Badge
                        variant="outline"
                        className="gap-1 rounded-xs font-mono text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 border border-emerald-200 bg-emerald-50 text-emerald-700"
                      >
                        <Eye className="h-3 w-3" />
                        Visible
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="gap-1 rounded-xs font-mono text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 border border-[#E3E7EB] bg-slate-100 text-slate-600"
                      >
                        <EyeOff className="h-3 w-3" />
                        Hidden
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-1 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      className="h-7 w-7 p-0 rounded-xs border border-transparent hover:border-[#E3E7EB] hover:bg-slate-100"
                    >
                      <Edit className="h-3.5 w-3.5 text-slate-500" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 rounded-xs border border-transparent hover:border-rose-200 hover:bg-rose-50 text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-md rounded-xs border border-[#E3E7EB] bg-white p-6 shadow-lg">
                        <AlertDialogHeader className="border-b border-[#E3E7EB] pb-3 mb-2">
                          <AlertDialogTitle className="text-base font-bold font-mono text-[#0B1F3A] uppercase tracking-wide">
                            Are you sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-xs text-slate-500">
                            This action cannot be undone. This will permanently
                            delete the item.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="pt-3 border-t border-[#E3E7EB] flex items-center justify-end gap-2">
                          <AlertDialogCancel className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-slate-50">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(item.id!)}
                            className="h-8 text-xs rounded-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-2xs gap-1.5 px-3"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            {(!Array.isArray(items) || items.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-10 text-slate-500 text-xs font-mono"
                >
                  No items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ContentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        type={type}
        item={selectedItem}
        onSuccess={() => {
          setDialogOpen(false);
          onSuccess();
        }}
      />
    </div>
  );
}
