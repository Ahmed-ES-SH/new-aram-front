"use client";
import { useState, useRef, useEffect } from "react";
import { FiUpload, FiX, FiImage } from "react-icons/fi";

interface ImageUploaderProps {
  label: string;
  value: string | File | null; // Can be URL string or File object
  onChange: (value: string | File | null) => void;
  accept?: string;
}

export default function ImageUploader({
  label,
  value,
  onChange,
  accept = "image/*",
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate preview URL from value
  useEffect(() => {
    if (!value) {
      setPreview("");
      return;
    }

    // If value is a File, create object URL for preview
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);

      // Cleanup object URL when component unmounts or value changes
      return () => URL.revokeObjectURL(objectUrl);
    }

    // If value is a string (URL), use it directly
    if (typeof value === "string" && value.length > 0) {
      setPreview(value);
    }
  }, [value]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    // Store the File object directly (not the base64 string)
    onChange(file);
  };

  const handleRemove = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const hasImage = preview && preview.length > 0;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <FiImage className="text-gray-400" size={14} />
        {label}
      </label>

      {hasImage ? (
        <div className="relative group rounded-xl overflow-hidden border border-gray-200">
          <img src={preview} alt={label} className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
              title="تغيير الصورة"
            >
              <FiUpload size={20} />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-3 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
              title="حذف الصورة"
            >
              <FiX size={20} />
            </button>
          </div>
          {/* Show file info if it's a new file */}
          {value instanceof File && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs px-3 py-1">
              {value.name} ({(value.size / 1024).toFixed(1)} KB)
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            w-full h-48 rounded-xl border-2 border-dashed cursor-pointer
            flex flex-col items-center justify-center gap-3 transition-all
            ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-gray-300 hover:border-primary hover:bg-gray-50"
            }
          `}
        >
          <FiUpload className="text-gray-400" size={32} />
          <p className="text-sm text-gray-500">
            اسحب الصورة هنا أو اضغط للاختيار
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
