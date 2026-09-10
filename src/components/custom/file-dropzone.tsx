"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, FileText, Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

type FileMode = "create" | "edit" | "update" | "view";

interface FileDragAndDropProps {
  value: File[];
  onChange: (files: File[]) => void;
  error?: string;
  required?: boolean;
  mode?: FileMode;
  className?: string;
  maxSize?: number; // in bytes
  maxFiles?: number; // maximum number of files allowed (optional - unlimited if not passed)
  acceptedFileTypes?: string[];
}

interface FileItem {
  file: File;
  name: string;
  size: number;
}

export function FileDragAndDrop({
  value,
  onChange,
  error,
  mode = "create",
  className = "",
  maxSize = 50 * 1024 * 1024, // 50MB default
  maxFiles, // optional - unlimited if not passed
  acceptedFileTypes = ["*/*"], // Accept all files by default
}: FileDragAndDropProps) {
  const t = useTranslations("components.fileDropzone");
  const [files, setFiles] = useState<FileItem[]>([]);

  // Sync internal files state with value prop
  useEffect(() => {
    if (value && value.length > 0) {
      // Convert File objects to FileItem objects, filtering out undefined files
      const fileItems = value
        .filter((file) => file && file.name) // Filter out undefined/null files
        .map((file) => ({
          file,
          name: file.name,
          size: file.size,
        }));
      setFiles(fileItems);
    } else {
      setFiles([]);
    }
  }, [value]);

  // Determine if the component should be disabled based on mode or file limit
  const isViewMode = mode === "view";
  const isFileLimitReached = maxFiles ? files.length >= maxFiles : false;
  const isDisabled = isViewMode || isFileLimitReached;

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      // Check if adding these files would exceed the limit (only if maxFiles is set)
      if (maxFiles) {
        const totalFilesAfterUpload = files.length + acceptedFiles.length;
        if (totalFilesAfterUpload > maxFiles) {
          console.error(
            `You can only upload up to ${maxFiles} files. Please remove some files first.`,
          );
          return;
        }
      }

      // Convert accepted files to FileItem objects
      const newFileItems = acceptedFiles.map((file) => ({
        file,
        name: file.name,
        size: file.size,
      }));

      const updatedFileItems = [...files, ...newFileItems];
      setFiles(updatedFileItems);

      // Pass File objects to parent via onChange
      onChange(updatedFileItems.map((item) => item.file));
    }
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce(
      (acc, type) => {
        acc[type] = [];
        return acc;
      },
      {} as Record<string, string[]>,
    ),
    maxFiles: maxFiles ? maxFiles - files.length : undefined, // Dynamic max files based on remaining slots, or unlimited
    maxSize,
    disabled: isDisabled,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return `0 ${t("units.bytes")}`;
    const k = 1024;
    const sizes = [
      t("units.bytes"),
      t("units.kb"),
      t("units.mb"),
      t("units.gb"),
    ];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onChange(updatedFiles.map((item) => item.file));
  };

  const renderFileCards = () => {
    if (files.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          {isFileLimitReached && (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
              {t("limitReached")}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {files.map((fileItem, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 bg-primary/5 border border-primary/20 rounded-lg min-w-0 w-full sm:max-w-xs"
            >
              <FileText className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {fileItem.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(fileItem.size)}
                </p>
              </div>

              {!isViewMode && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-500 flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderUploadArea = () => {
    if (isFileLimitReached) {
      return (
        <div className="border-2 border-dashed rounded-lg p-4 sm:p-8 bg-gray-50 border-gray-200">
          <div className="flex flex-col items-center space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center">
              {/* <img src="/icons/images.svg" alt="Images" /> */}
              <Upload className="text-primary" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm text-gray-600">
                {t("uploadLimit", {
                  current: files.length,
                  max: maxFiles ?? 0,
                })}
              </p>
              <p className="text-xs text-gray-500">{t("removeToUpload")}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-4 sm:p-8 cursor-pointer transition-colors py-6 sm:py-10",
          isDragActive && !isDragReject
            ? "border-primary bg-primary/5"
            : isDragReject
              ? "border-red-400 bg-red-50"
              : "border-primary/50 hover:border-primary",
          isViewMode && "opacity-50 cursor-not-allowed",
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          {/* File Icon - Using the provided SVG */}
          <div className="flex items-center justify-center">
            {/* <img src= "/icons/images.svg" alt="Images" /> */}
            <Upload className="text-primary" />
          </div>

          {/* Text Content */}
          <div className="text-center space-y-1">
            {isDragActive ? (
              isDragReject ? (
                <p className="text-sm text-red-600">{t("invalidFileType")}</p>
              ) : (
                <p className="text-sm text-primary">{t("dropHere")}</p>
              )
            ) : (
              <>
                <p className="text-sm text-gray-700">
                  {t.rich("dropOrBrowse", {
                    browse: (chunks) => (
                      <span className="text-primary font-medium">{chunks}</span>
                    ),
                  })}
                </p>
                <p className="text-xs text-gray-500">
                  {t("maxSize", { size: formatFileSize(maxSize) })}
                  {maxFiles &&
                    ` • ${t("filesRemaining", {
                      count: maxFiles - files.length,
                    })}`}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-4">
        {/* Drag and Drop Area */}
        {renderUploadArea()}

        {/* File Cards */}
        {renderFileCards()}
      </div>

      {/* Display file rejection errors */}
      {fileRejections.length > 0 && (
        <div className="text-red-500 text-sm">
          {fileRejections[0].errors.map((error: any) => (
            <p key={error.code} className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {error.code === "file-too-large"
                ? t("errorTooLarge", { size: formatFileSize(maxSize) })
                : error.code === "file-invalid-type"
                  ? t("errorInvalidType")
                  : error.message}
            </p>
          ))}
        </div>
      )}

      {/* Display form validation errors */}
      {error && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
}
