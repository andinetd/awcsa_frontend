import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Eye, FileText } from "lucide-react";
// attachment-dialog no longer used here; previews use the filePlaceholder helper instead
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";

interface AttachmentField {
  label: string;
  // stable key (backend field identifier) when available
  fieldKey?: string;
  url: string;
  fileName: string;
  fileType?: string;
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
  const { token } = useAuthStore();

  const [objectUrls, setObjectUrls] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      objectUrls.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch (e) {
          // ignore
        }
      });
    };
  }, [objectUrls]);

  type FileMeta = { url?: string; name?: string; type?: string; size?: number };

  const filePlaceholder = (
    fileOrMeta: File | FileMeta | null | undefined,
    label?: string
  ) => {
    // If there's no metadata or file, show placeholder
    if (!fileOrMeta) {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between"></div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-3 p-3 bg-primary/5 border border-primary/20 rounded-lg min-w-0 flex-1 max-w-xs">
              <FileText className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {label ?? "No file"}
                </p>
                <p className="text-xs text-gray-500">No file uploaded</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const meta = fileOrMeta as FileMeta;
    return (
      <div>
        <div className="flex items-center justify-between"></div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center justify-between width-full p-3 bg-primary/5 border border-primary/20 rounded-lg min-w-0 flex-1">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {formatFieldName(label ?? meta.name ?? "File")}
                </p>
                <p className="text-xs text-gray-500">{meta.name ?? ""}</p>
              </div>
            </div>

            <div className="ml-2">
              <Button
                variant="outline"
                size="sm"
                className="hover:cursor-pointer border-blue-200 rounded-lg text-blue-500 hover:text-blue-600"
                onClick={async () => {
                  try {
                    if (!meta.url) {
                      toast.error("No URL available for preview");
                      return;
                    }

                    // Fetch the file with Authorization header so the bearer token is sent.
                    const headers: Record<string, string> = {};
                    if (token) headers["Authorization"] = `Bearer ${token}`;

                    const res = await fetch(meta.url, {
                      method: "GET",
                      headers,
                    });
                    if (!res.ok) {
                      const text = await res.text().catch(() => null);
                      toast.error(
                        `Unable to fetch file: ${res.status} ${res.statusText}` +
                          (text ? ` - ${text}` : "")
                      );
                      return;
                    }

                    const blob = await res.blob();
                    const blobUrl = URL.createObjectURL(blob);
                    setObjectUrls((s) => [...s, blobUrl]);
                    window.open(blobUrl, "_blank");
                  } catch (err) {
                    console.error("Unable to preview file", err);
                    toast.error("Unable to preview file");
                  }
                }}
              >
                <Eye className="text-sm" /> View
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-400" />
          Attached Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {attachments.map((file, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100"
            >
              <div className="items-start gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    {filePlaceholder(
                      {
                        url: file.url,
                        name: file.fileName,
                        type: file.fileType,
                      },
                      file.label
                    )}
                  </div>
                  {status === "pending" && (
                    <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                      <Checkbox
                        checked={file.showComment}
                        onCheckedChange={() => onToggle(i)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <label className="text-xs text-slate-400 cursor-pointer select-none">
                        Feedback?
                      </label>
                    </div>
                  )}
                </div>
              </div>
              {file.showComment && status === "pending" && (
                <div className="mt-2 animate-fadeIn">
                  <Textarea
                    value={file.comment}
                    onChange={(e) => onComment(i, e.target.value)}
                    placeholder={`Comment on ${file.label}`}
                    className="w-full min-h-[80px] p-3 text-sm rounded-md border border-slate-200 bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 placeholder:text-slate-400 text-slate-800"
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

const formatFieldName = (field: string) => {
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};
