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

export default function ImportEdirDialog() {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { mutate, isPending } = useImportEdirAssociationsMutation();

  const handleImport = () => {
    if (files.length === 0) return;

    mutate(files[0], {
      onSuccess: () => {
        toast.success("Edir associations imported successfully");
        setOpen(false);
        setFiles([]);
      },
      onError: (error) => {
        toast.error("Failed to import Edir associations");
        console.error(error);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="w-4 h-4" />
          Import Edir Associations
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Edir Associations</DialogTitle>
          <DialogDescription>
            Upload an Excel file to import multiple Edir associations at once.
          </DialogDescription>
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
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={files.length === 0 || isPending}
          >
            {isPending ? "Importing..." : "Import"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
