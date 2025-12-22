"use client";
import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExchangeAlt, FaImage, FaTimes } from "react-icons/fa";
import Img from "../../../_global/Img";

interface ImageUploadProps {
  src?: any;
  hint?: string;
  label?: string;
  name: string;
  height?: number;
  onChange: (e, columnName) => void;
  handleRemove?: () => void;
  isRemovable: boolean;
}

export default function ImageUpload({
  src,
  hint,
  label,
  name,
  onChange,
  handleRemove,
  isRemovable,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const preview = src instanceof File ? URL.createObjectURL(src) : src;

  return (
    <div className="space-y-2 flex-1 max-md:w-full">
      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>

      <input
        ref={fileInputRef}
        type="file"
        name={name}
        accept="image/png, image/jpeg, image/jpg, image/gif"
        onChange={(e) => onChange(e, name)}
        className="hidden"
      />

      <motion.div
        whileHover={{ scale: src ? 1 : 1.01 }}
        className={`
          relative cursor-pointer rounded-lg border-2 border-dashed
          transition-all duration-200 overflow-hidden
          ${src ? "border-border" : "border-input"}
          ${!src ? "hover:border-primary hover:bg-primary/5" : ""}
        `}
      >
        <AnimatePresence mode="wait">
          {src ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative lg:h-[350px] h-[220px] w-full"
            >
              <Img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="flex items-center gap-4">
                  {isRemovable && (
                    <motion.button
                      type="button"
                      onClick={handleRemove}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 rounded-full bg-destructive text-destructive-foreground"
                    >
                      <FaTimes className="w-5 h-5" />
                    </motion.button>
                  )}
                  <motion.div
                    onClick={handleClick}
                    whileHover={{ scale: 1.1 }}
                    className="p-3 rounded-full bg-green-400 text-primary-foreground"
                  >
                    <FaExchangeAlt className="w-5 h-5" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              onClick={handleClick}
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:h-[350px] h-[220px] w-full flex flex-col items-center justify-center p-8 text-center"
            >
              <motion.div
                initial={{
                  y: -10,
                  scale: 1.1,
                }}
                animate={{
                  y: 0,
                  scale: 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <FaImage className="w-16 h-16 text-muted-foreground mb-4" />
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
