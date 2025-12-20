import { useState, useRef } from "react";
import {
  FiPaperclip,
  FiUploadCloud,
  FiFile,
  FiX,
  FiImage,
  FiTrash2,
} from "react-icons/fi";
import { FieldDefinition } from "./types";
import { useLocale } from "next-intl";
import Image from "next/image";

interface FieldRendererProps {
  field: FieldDefinition;
  value: any;
  error?: string[];
  onChange: (key: string, value: any) => void;
  submitting: boolean;
}

const FileUploadField = ({
  field,
  value,
  onChange,
  isError,
  submitting,
  locale,
}: {
  field: FieldDefinition;
  value: any;
  onChange: (key: string, value: any) => void;
  isError: boolean;
  submitting: boolean;
  locale: string;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(field.key, e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(field.key, e.target.files[0]);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onChange(field.key, null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const isImage =
    field.type === "image_upload" ||
    (value instanceof File && value.type.startsWith("image/"));

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        onChange={handleChange}
        className="hidden"
        id={`file-${field.key}`}
        accept={field.validation?.mime_types?.join(",")}
        disabled={submitting}
      />

      {!value ? (
        <label
          htmlFor={`file-${field.key}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative group flex flex-col items-center justify-center w-full h-32 md:h-40 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden ${
            isError
              ? "border-red-300 bg-red-50"
              : isDragging
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-gray-200 bg-gray-50/50 hover:bg-white hover:border-primary/50"
          }`}
        >
          <div className="flex flex-col items-center gap-3 text-center transition-transform duration-300 group-hover:-translate-y-1">
            <div
              className={`p-3 rounded-full ${
                isDragging
                  ? "bg-primary/10 text-primary"
                  : "bg-white text-gray-400 shadow-sm"
              }`}
            >
              <FiUploadCloud size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">
                {field.placeholder ||
                  (locale === "ar"
                    ? "انقر أو اسحب للتحميل"
                    : "Click or drag to upload")}
              </p>
              <p className="text-xs text-gray-400">
                {field.type === "image_upload"
                  ? locale === "ar"
                    ? "PNG, JPG, WEBP"
                    : "PNG, JPG, WEBP"
                  : locale === "ar"
                  ? "جميع الملفات مسموحة"
                  : "All files supported"}
              </p>
            </div>
          </div>
        </label>
      ) : (
        <div
          className={`relative flex items-center p-4 rounded-xl border transition-all duration-300 ${
            isError
              ? "border-red-200 bg-red-50"
              : "border-primary/20 bg-primary/5"
          }`}
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {isImage && value instanceof File ? (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                <Image
                  src={URL.createObjectURL(value)}
                  alt="Preview"
                  fill
                  className="object-cover"
                  onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                />
              </div>
            ) : (
              <div className="p-3 bg-white rounded-lg shadow-sm text-primary">
                <FiFile size={20} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {value instanceof File ? value.name : "Selected File"}
              </p>
              <p className="text-xs text-gray-500">
                {value instanceof File
                  ? `${(value.size / (1024 * 1024)).toFixed(2)} MB`
                  : ""}
              </p>
            </div>
          </div>

          <button
            onClick={removeFile}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title={locale === "ar" ? "إزالة" : "Remove"}
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export const FieldRenderer = ({
  field,
  value,
  error,
  onChange,
  submitting,
}: FieldRendererProps) => {
  const locale = useLocale();
  const isError = error && error.length > 0;
  const safeValue = value ?? "";

  const baseInputClass = `w-full px-4 py-3 rounded-xl border transition-all duration-200 outline-none ${
    isError
      ? "border-red-300 bg-red-50 focus:border-red-500"
      : "border-gray-200 bg-gray-50/50 hover:bg-white focus:border-primary"
  }`;

  switch (field.type) {
    case "long_text":
      return (
        <textarea
          name={field.key}
          rows={4}
          value={safeValue}
          onChange={(e) => onChange(field.key, e.target.value)}
          placeholder={field.placeholder}
          className={baseInputClass}
          disabled={submitting}
        />
      );

    case "dropdown":
      return (
        <div className="relative">
          <select
            name={field.key}
            value={safeValue}
            onChange={(e) => onChange(field.key, e.target.value)}
            className={`${baseInputClass} appearance-none`}
            disabled={submitting}
          >
            <option value="">{field.placeholder || "-"}</option>
            {field.options?.choices.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
        </div>
      );

    case "radio":
      return (
        <div className="flex flex-col gap-2">
          {field.options?.choices.map((choice) => (
            <label
              key={choice.value}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                safeValue === String(choice.value)
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name={field.key}
                value={choice.value}
                checked={safeValue === String(choice.value)}
                onChange={(e) => onChange(field.key, e.target.value)}
                disabled={submitting}
                className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
              />
              <span className="text-gray-700 font-medium">{choice.label}</span>
            </label>
          ))}
        </div>
      );

    case "checkbox":
      return (
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              name={field.key}
              checked={!!safeValue}
              onChange={(e) => onChange(field.key, e.target.checked)}
              className="peer w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary transition-all duration-200 cursor-pointer"
              disabled={submitting}
            />
          </div>
          <span className="text-gray-700 font-medium group-hover:text-primary transition-colors">
            {field.label}
          </span>
        </label>
      );

    case "multi_select":
      const currentValues = Array.isArray(safeValue) ? safeValue : [];
      return (
        <div className="grid grid-cols-1 gap-2">
          {field.options?.choices.map((choice) => (
            <label
              key={choice.value}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                currentValues.includes(String(choice.value))
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                value={choice.value}
                checked={currentValues.includes(String(choice.value))}
                onChange={(e) => {
                  const val = String(choice.value);
                  const newVals = e.target.checked
                    ? [...currentValues, val]
                    : currentValues.filter((v: string) => v !== val);
                  onChange(field.key, newVals);
                }}
                disabled={submitting}
                className="w-4 h-4 text-primary border-gray-300 focus:ring-primary rounded"
              />
              <span className="text-gray-700 font-medium">{choice.label}</span>
            </label>
          ))}
        </div>
      );

    case "file_upload":
    case "image_upload":
      return (
        <FileUploadField
          field={field}
          value={value}
          onChange={onChange}
          isError={isError || false}
          submitting={submitting}
          locale={locale}
        />
      );

    case "date":
      return (
        <input
          type="date"
          value={safeValue}
          onChange={(e) => onChange(field.key, e.target.value)}
          className={baseInputClass}
          disabled={submitting}
        />
      );

    default:
      return (
        <input
          type={
            field.type === "url"
              ? "url"
              : field.type === "email"
              ? "email"
              : field.type === "number"
              ? "number"
              : "text"
          }
          value={safeValue}
          onChange={(e) => onChange(field.key, e.target.value)}
          placeholder={field.placeholder}
          className={baseInputClass}
          disabled={submitting}
        />
      );
  }
};
