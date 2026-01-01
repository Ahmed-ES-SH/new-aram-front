"use client";
import React, { useRef, useState } from "react";
import { FaCloudUploadAlt, FaImage, FaTrash } from "react-icons/fa";
import Img from "@/app/_components/_website/_global/Img";

interface ImageUploadProps {
  label?: string;
  defaultImage?: string;
  onImageChange: (file: File | null) => void;
  className?: string;
}

export default function ImageUpload({
  label = "Upload Image",
  defaultImage,
  onImageChange,
  className,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageChange(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}

      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all
            ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-gray-300 hover:border-primary hover:bg-gray-50"
            }
          `}
        >
          <div className="text-center space-y-2 p-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
              <FaCloudUploadAlt className="text-2xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">
                SVG, PNG, JPG or GIF (max. 800x400px)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-64 rounded-xl border border-gray-200 overflow-hidden group bg-gray-50">
          {preview.startsWith("data:") || preview.startsWith("blob:") ? (
            // Local preview
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            // Existing URL using Img component
            <Img
              src={preview}
              className="w-full h-full object-cover"
              errorSrc="/defaults/noImage.png"
            />
          )}

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-white/90 rounded-full text-gray-700 hover:text-primary hover:scale-110 transition-all shadow-lg"
              title="Change Image"
            >
              <FaImage />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 bg-white/90 rounded-full text-gray-700 hover:text-red-500 hover:scale-110 transition-all shadow-lg"
              title="Remove Image"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
