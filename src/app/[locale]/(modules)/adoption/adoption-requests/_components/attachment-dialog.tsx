import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { RPProvider, RPDefaultLayout, RPPages, RPConfig } from '@pdf-viewer/react'


interface AttachmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileName: string;
  fileUrl: string;
}

export const AttachmentDialog: React.FC<AttachmentDialogProps> = ({
  open,
  onOpenChange,
  fileName,
  fileUrl,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-[90vw] max-h-[90vh]">
      <DialogHeader>
        <DialogTitle>{fileName}</DialogTitle>
      </DialogHeader>
      <div className="mt-2">
        {/* If the provided fileUrl is a PDF, use the PDF viewer; otherwise render an image/iframe fallback */}
        {fileUrl.toLowerCase().endsWith(".pdf") ? (
          <RPConfig>
            <RPProvider src={fileUrl}>
              <RPDefaultLayout>
                <RPPages />
              </RPDefaultLayout>
            </RPProvider>
          </RPConfig>
        ) : (
          <div className="w-full h-[70vh] flex items-center justify-center">
            {/* basic fallback for images or other embeddable types */}
            <iframe src={fileUrl} className="w-full h-full border-0" title={fileName} />
          </div>
        )}
      </div>
    </DialogContent>
  </Dialog>
);
