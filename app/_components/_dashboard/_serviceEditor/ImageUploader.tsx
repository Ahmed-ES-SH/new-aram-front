"use client";
import { useState, useRef } from "react";
import { FiUpload, FiX, FiImage } from "react-icons/fi";

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onFileSelect?: (file: File) => void;
}

export default function ImageUploader({
  label,
  value,
  onChange,
  onFileSelect,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    onFileSelect?.(file);
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <FiImage className="text-gray-400" size={14} />
        {label}
      </label>

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-gray-200">
          <img src={value} alt={label} className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <FiUpload size={20} />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-3 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
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
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
