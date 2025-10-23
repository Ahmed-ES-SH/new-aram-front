"use client";
import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCamera, FaExchangeAlt, FaTimes } from "react-icons/fa";
import Img from "../../../_global/Img";

interface ProfileImageUploadProps {
  src?: any;
  name: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    columnName: string
  ) => void;
  handleRemove?: () => void;
  isRemovable: boolean;
}

export default function ProfileImageUpload({
  src,
  name,
  onChange,
  handleRemove,
  isRemovable,
}: ProfileImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const preview = src instanceof File ? URL.createObjectURL(src) : src;

  const handleClick = () => fileInputRef.current?.click();

  return (
    <div className="flex flex-col items-center space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        name={name}
        accept="image/png, image/jpeg, image/jpg, image/gif"
        onChange={(e) => onChange(e, name)}
        className="hidden"
      />

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative cursor-pointer rounded-full border-2 border-dashed border-input 
        hover:border-primary transition-all duration-200 overflow-hidden 
        w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center bg-muted"
      >
        <AnimatePresence mode="wait">
          {src ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-full rounded-full overflow-hidden"
            >
              <Img
                src={preview}
                alt="Profile preview"
                className="w-full h-full object-cover rounded-full"
              />

              {/* Overlay when hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 rounded-full">
                {isRemovable && handleRemove && (
                  <motion.button
                    type="button"
                    onClick={handleRemove}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-destructive text-destructive-foreground"
                  >
                    <FaTimes className="size-3" />
                  </motion.button>
                )}

                <motion.button
                  type="button"
                  onClick={handleClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full bg-primary text-primary-foreground"
                >
                  <FaExchangeAlt className="size-3" />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              onClick={handleClick}
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-center"
            >
              <FaCamera className="size-6 text-muted-foreground mb-1" />
              <p className="text-xs text-muted-foreground">Upload Photo</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
