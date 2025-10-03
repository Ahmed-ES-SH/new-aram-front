"use client";

import type React from "react";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCloudUploadAlt,
  FaImage,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";
import Img from "../../../_global/Img";

interface ImageUploaderProps {
  label: string;
  hint: string;
  value: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
}

export function ImageUploader({
  label,
  hint,
  value,
  onChange,
  accept = "image/*",
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | File | null>(value);

  const handleFileChange = (file: File | null) => {
    if (file) {
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      onChange(null);
      setPreview(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
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

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileChange(files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleFileChange(null);
  };

  return (
    <div className="space-y-2 flex-1 max-md:w-full">
      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        className="hidden"
      />

      <motion.div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: preview ? 1 : 1.01 }}
        className={`
          relative cursor-pointer rounded-lg border-2 border-dashed
          transition-all duration-200 overflow-hidden
          ${
            isDragging
              ? "border-primary bg-primary/5 scale-[1.02]"
              : preview
              ? "border-border"
              : "border-input"
          }
          ${!preview ? "hover:border-primary hover:bg-primary/5" : ""}
        `}
      >
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative lg:h-[350px] h-[220px] w-full"
            >
              <Img
                src={(preview as string) || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="flex items-center gap-4">
                  <motion.button
                    type="button"
                    onClick={handleRemove}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 rounded-full bg-destructive text-destructive-foreground"
                  >
                    <FaTimes className="w-5 h-5" />
                  </motion.button>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="p-3 rounded-full bg-primary text-primary-foreground"
                  >
                    <FaCheckCircle className="w-5 h-5" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:h-[350px] h-[220px] w-full flex flex-col items-center justify-center p-8 text-center"
            >
              <motion.div
                animate={{
                  y: isDragging ? -10 : 0,
                  scale: isDragging ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {isDragging ? (
                  <FaCloudUploadAlt className="w-16 h-16 text-primary mb-4" />
                ) : (
                  <FaImage className="w-16 h-16 text-muted-foreground mb-4" />
                )}
              </motion.div>

              <p className="text-sm font-medium text-foreground mb-1">{hint}</p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF up to 10MB
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
