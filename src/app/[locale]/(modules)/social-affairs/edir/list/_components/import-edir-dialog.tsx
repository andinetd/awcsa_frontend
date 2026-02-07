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
import { FileDragAndDrop } from "@/components/custom/file-dropzone";
import { useImportEdirAssociationsMutation } from "@/hooks/social-affairs";
import { toast } from "sonner";
import { Upload } from "lucide-react";

import { useTranslations } from "next-intl";

export default function ImportEdirDialog() {
  const t = useTranslations("social-affairs.edir.edir.import");
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { mutate, isPending } = useImportEdirAssociationsMutation();

  const handleImport = () => {
    if (files.length === 0) return;

    mutate(files[0], {
      onSuccess: () => {
        toast.success(t("success"));
        setOpen(false);
        setFiles([]);
      },
      onError: (error) => {
        toast.error(t("error"));
        console.error(error);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="w-4 h-4" />
          {t("buttons.import")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <FileDragAndDrop
            value={files}
            onChange={setFiles}
            maxFiles={1}
            acceptedFileTypes={[
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              "application/vnd.ms-excel",
            ]}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            {t("buttons.cancel")}
          </Button>
          <Button
            onClick={handleImport}
            disabled={files.length === 0 || isPending}
          >
            {isPending ? t("buttons.importing") : t("buttons.import")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
