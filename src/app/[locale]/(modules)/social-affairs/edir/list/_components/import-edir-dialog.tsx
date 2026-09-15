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
        <Button variant="outline" className="h-8 text-xs font-semibold rounded-xs border-[#E3E7EB] hover:bg-[#F7F8FA] shadow-2xs gap-1.5">
          <Upload className="w-3.5 h-3.5" />
          {t("buttons.import")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px] rounded-xs border border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider font-mono flex items-center gap-2">
            <Upload className="w-4 h-4 text-[#1769AA]" />
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-mono mt-0.5">{t("description")}</DialogDescription>
        </DialogHeader>
        <div className="py-3">
          <div className="rounded-xs border border-[#E3E7EB] p-2 bg-slate-50/20">
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
        </div>
        <div className="flex justify-end gap-2 pt-3 border-t border-[#E3E7EB]">
          <Button
            variant="outline"
            className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-[#F7F8FA]"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            {t("buttons.cancel")}
          </Button>
          <Button
            onClick={handleImport}
            disabled={files.length === 0 || isPending}
            className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold shadow-2xs"
          >
            {isPending ? t("buttons.importing") : t("buttons.import")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
