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
        <RPConfig>
          <RPProvider src="https://cdn.bookey.app/files/pdf/book/en/dear-theo.pdf">
            <RPDefaultLayout>
              <RPPages />
            </RPDefaultLayout>
          </RPProvider>
        </RPConfig>
      </div>
    </DialogContent>
  </Dialog>
);
