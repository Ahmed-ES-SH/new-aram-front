"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUpload, FiX, FiFile, FiImage, FiAlertCircle } from "react-icons/fi";
import { BaseFieldProps, LocalizedText } from "../types";
import Img from "../../_website/_global/Img";

function getLocalizedText(
  text: LocalizedText | string | undefined,
  locale: "ar" | "en"
): string {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[locale] || text.ar || text.en || "";
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function FileUploadField({
  field,
  value,
  error,
  touched,
  disabled,
  locale,
  onChange,
  onBlur,
}: BaseFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasError = touched && error;

  const isImageField = field.type === "image";
  const acceptTypes = field.accept || (isImageField ? "image/*" : "*");

  // Handle file selection
  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      if (field.multiple) {
        const existingFiles = Array.isArray(value) ? value : [];
        const newFiles = Array.from(files);
        onChange([...existingFiles, ...newFiles]);
      } else {
        onChange(files[0]);
      }
    },
    [field.multiple, value, onChange]
  );

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (!disabled) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [disabled, handleFiles]
  );

  // Remove file
  const removeFile = (index?: number) => {
    if (field.multiple && Array.isArray(value) && typeof index === "number") {
      const newFiles = value.filter((_, i) => i !== index);
      onChange(newFiles.length > 0 ? newFiles : null);
    } else {
      onChange(null);
    }
  };

  // Get file preview
  const getFilePreview = (file: File): string | null => {
    if (file.type.startsWith("image/")) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const files: File[] = field.multiple
    ? Array.isArray(value)
      ? value
      : []
    : value instanceof File
    ? [value]
    : [];

  return (
    <div className={`w-full ${field.width === "half" ? "md:w-1/2" : ""}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {getLocalizedText(field.label, locale)}
        {field.required && <span className="text-red-500 mr-1">*</span>}
      </label>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer
          ${
            disabled
              ? "opacity-50 cursor-not-allowed bg-gray-50"
              : "hover:bg-gray-50"
          }
          ${
            isDragging
              ? "border-primary bg-primary/5"
              : hasError
              ? "border-red-300 bg-red-50/50"
              : "border-gray-300"
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptTypes}
          multiple={field.multiple}
          onChange={(e) => handleFiles(e.target.files)}
          onBlur={onBlur}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isDragging ? "bg-primary/10" : "bg-gray-100"
            }`}
          >
            {isImageField ? (
              <FiImage
                className={isDragging ? "text-primary" : "text-gray-400"}
                size={24}
              />
            ) : (
              <FiUpload
                className={isDragging ? "text-primary" : "text-gray-400"}
                size={24}
              />
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {locale === "ar"
                ? "اسحب الملفات هنا أو اضغط للاختيار"
                : "Drag files here or click to select"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {acceptTypes.replace(/,/g, ", ")}
            </p>
          </div>
        </div>
      </div>

      {/* File Previews */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 space-y-2"
          >
            {files.map((file, index) => {
              const preview = getFilePreview(file);
              return (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  {preview ? (
                    <Img
                      src={preview}
                      alt={file.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                      <FiFile className="text-gray-500" size={20} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(field.multiple ? index : undefined);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiX size={16} />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Description */}
      {field.description && !hasError && (
        <p className="mt-2 text-xs text-gray-500">
          {getLocalizedText(field.description, locale)}
        </p>
      )}

      {/* Error Message */}
      {hasError && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-500 flex items-center gap-1"
        >
          <FiAlertCircle size={14} />
          {error}
        </motion.p>
      )}
    </div>
  );
}
