"use client";
import React, { useMemo } from "react";
import { FiX, FiRefreshCw, FiCheck, FiAlertCircle } from "react-icons/fi";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileArchive,
  FaFileAlt,
} from "react-icons/fa";

// File upload status types
export type FileUploadStatus = "pending" | "uploading" | "success" | "failed";

export type FileType =
  | "image"
  | "pdf"
  | "word"
  | "excel"
  | "powerpoint"
  | "archive"
  | "other";

// State for each file in upload queue
export interface FileUploadState {
  id: string;
  file: File;
  status: FileUploadStatus;
  progress: number;
  uploadedFileId?: number | string; // ID returned from backend after successful upload
  error?: string;
}

interface FilePreviewItemProps {
  fileState: FileUploadState;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
}

// Helper function to determine file type
export const getFileType = (file: File): FileType => {
  const mimeType = file.type.toLowerCase();
  const extension = file.name.split(".").pop()?.toLowerCase() || "";

  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "application/pdf" || extension === "pdf") return "pdf";
  if (
    mimeType === "application/msword" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    ["doc", "docx"].includes(extension)
  )
    return "word";
  if (
    mimeType === "application/vnd.ms-excel" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    ["xls", "xlsx"].includes(extension)
  )
    return "excel";
  if (
    mimeType === "application/vnd.ms-powerpoint" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    ["ppt", "pptx"].includes(extension)
  )
    return "powerpoint";
  if (
    mimeType === "application/zip" ||
    mimeType === "application/x-rar-compressed" ||
    mimeType === "application/x-7z-compressed" ||
    ["zip", "rar", "7z", "tar", "gz"].includes(extension)
  )
    return "archive";

  return "other";
};

// Get icon for file type
export const getFileIcon = (type: FileType, size: number = 32) => {
  switch (type) {
    case "pdf":
      return <FaFilePdf className="text-red-500" size={size} />;
    case "word":
      return <FaFileWord className="text-blue-600" size={size} />;
    case "excel":
      return <FaFileExcel className="text-green-600" size={size} />;
    case "powerpoint":
      return <FaFilePowerpoint className="text-orange-500" size={size} />;
    case "archive":
      return <FaFileArchive className="text-yellow-600" size={size} />;
    default:
      return <FaFileAlt className="text-gray-500" size={size} />;
  }
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Generate unique ID for files
export const generateFileId = (): string => {
  return `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export default function FilePreviewItem({
  fileState,
  onRemove,
  onRetry,
}: FilePreviewItemProps) {
  const { file, status, progress, error } = fileState;

  const fileType = useMemo(() => getFileType(file), [file]);
  const preview = useMemo(() => {
    if (fileType === "image") {
      return URL.createObjectURL(file);
    }
    return null;
  }, [file, fileType]);

  // Cleanup object URL
  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Get status styles
  const getStatusStyles = () => {
    switch (status) {
      case "uploading":
        return "border-primary/30 bg-primary/5";
      case "success":
        return "border-green-300 bg-green-50";
      case "failed":
        return "border-red-300 bg-red-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  // Get progress bar color
  const getProgressBarColor = () => {
    switch (status) {
      case "success":
        return "bg-green-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-primary";
    }
  };

  return (
    <div
      className={`relative rounded-xl border p-3 group transition-all ${getStatusStyles()}`}
    >
      <div className="flex items-start gap-3">
        {/* Preview/Icon */}
        <div className="shrink-0 w-14 h-14 rounded-lg bg-white border border-gray-100 flex items-center justify-center overflow-hidden relative">
          {fileType === "image" && preview ? (
            <img
              src={preview}
              alt={file.name}
              className="w-full h-full object-cover"
            />
          ) : (
            getFileIcon(fileType)
          )}

          {/* Status Overlay */}
          {status === "success" && (
            <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center">
              <FiCheck className="text-white" size={24} />
            </div>
          )}
          {status === "failed" && (
            <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center">
              <FiAlertCircle className="text-white" size={24} />
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-medium text-gray-800 truncate"
            title={file.name}
          >
            {file.name}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {formatFileSize(file.size)}
          </p>

          {/* Status Text */}
          <div className="mt-1">
            {status === "pending" && (
              <span className="text-xs text-gray-400">في انتظار الرفع</span>
            )}
            {status === "uploading" && (
              <span className="text-xs text-primary">
                جاري الرفع... {progress}%
              </span>
            )}
            {status === "success" && (
              <span className="text-xs text-green-600">تم الرفع بنجاح</span>
            )}
            {status === "failed" && (
              <span className="text-xs text-red-600">
                {error || "فشل الرفع"}
              </span>
            )}
          </div>

          {/* Progress Bar */}
          {(status === "uploading" || status === "success") && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ease-out ${getProgressBarColor()}`}
                  style={{ width: `${status === "success" ? 100 : progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="shrink-0 flex items-center gap-1">
          {/* Retry Button (only for failed) */}
          {status === "failed" && (
            <button
              type="button"
              onClick={() => onRetry(fileState.id)}
              className="p-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all"
              title="إعادة المحاولة"
            >
              <FiRefreshCw size={14} />
            </button>
          )}

          {/* Remove Button (not during upload) */}
          {status !== "uploading" && (
            <button
              type="button"
              onClick={() => onRemove(fileState.id)}
              className={`p-1.5 rounded-full transition-all ${
                status === "pending"
                  ? "bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-100"
                  : "bg-red-50 text-red-500 hover:bg-red-100"
              }`}
              title="إزالة الملف"
            >
              <FiX size={14} />
            </button>
          )}

          {/* Loading indicator during upload */}
          {status === "uploading" && (
            <div className="p-1.5">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
