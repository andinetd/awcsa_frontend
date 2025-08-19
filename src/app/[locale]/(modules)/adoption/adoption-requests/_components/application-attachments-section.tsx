import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Eye } from "lucide-react";
import { AttachmentDialog } from "./attachment-dialog";

interface AttachmentField {
  label: string;
  url: string;
  fileName: string;
  showComment: boolean;
  comment?: string;
}

interface ApplicationAttachmentsSectionProps {
  attachments: AttachmentField[];
  status: string;
  onToggle: (idx: number) => void;
  onComment: (idx: number, value: string) => void;
  onView: (fileName: string, fileUrl: string) => void;
}

export const ApplicationAttachmentsSection: React.FC<
  ApplicationAttachmentsSectionProps
> = ({ attachments, status, onToggle, onComment, onView }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Attachments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {attachments.map((file, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium w-32 inline-block">
                  {file.label}:
                </span>
                <div
                  className="py-1 px-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg text-blue-500 text-sm font-bold flex items-center gap-2 cursor-pointer hover:shadow-sm"
                  onClick={() => onView(file.fileName, file.url)}
                >
                  <Eye className="text-sm" /> View
                </div>
                {status === "pending" && (
                  <>
                    <Checkbox
                      checked={file.showComment}
                      onCheckedChange={() => onToggle(i)}
                      className="ml-4"
                    />
                    <span className="text-xs text-muted-foreground">
                      Feedback?
                    </span>
                  </>
                )}
              </div>
              {file.showComment && status === "pending" && (
                <div className="mt-2">
                  <Textarea
                    value={file.comment}
                    onChange={(e) => onComment(i, e.target.value)}
                    placeholder={`Comment on ${file.label}`}
                    className="w-full min-h-[60px]"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
