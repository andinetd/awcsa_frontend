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
        <Button onClick={handleAdd} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          {t("actions.add")}
        </Button>
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">{t("fields.order")}</TableHead>
              <TableHead>{t("fields.title")}</TableHead>
              <TableHead>{t("actions.visibility")}</TableHead>
              <TableHead className="text-right">{t("actions.edit")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(Array.isArray(items) ? [...items] : [])
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.order}</TableCell>
                  <TableCell className="font-medium">
                    {item.title?.[locale as "en" | "am"] ||
                      item.title?.en ||
                      item.title?.am ||
                      "No Title"}
                  </TableCell>
                  <TableCell>
                    {item.isVisible ? (
                      <Badge
                        variant="outline"
                        className="gap-1 bg-emerald-50 text-emerald-700 border-emerald-200"
                      >
                        <Eye className="h-3 w-3" />
                        Visible
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="gap-1 text-muted-foreground"
                      >
                        <EyeOff className="h-3 w-3" />
                        Hidden
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the item.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(item.id!)}
                            className="bg-destructive text-white hover:bg-destructive/90"
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
                  className="text-center py-10 text-muted-foreground"
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
