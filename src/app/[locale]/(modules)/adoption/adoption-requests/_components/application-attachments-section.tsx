import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
}

export const ApplicationAttachmentsSection: React.FC<
  ApplicationAttachmentsSectionProps
> = ({ attachments, status, onToggle, onComment }) => (
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
              <a
                href={file.url}
                download
                className="text-blue-600 underline hover:text-blue-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                {file.fileName}
              </a>
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
