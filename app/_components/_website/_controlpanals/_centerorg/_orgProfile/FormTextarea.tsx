"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "next-intl";
import React, { ChangeEvent } from "react";
import { MdErrorOutline } from "react-icons/md";

type fieldType = {
  label: string;
  icon: any;
  value: string | undefined;
  name: string;
  placeholder: string;
};

interface props {
  field: fieldType;
  error: string;
  handleChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function FormTextarea({ field, handleChange, error }: props) {
  const locale = useLocale();
  return (
    <>
      <div className="space-y-2 w-full">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-foreground"
        >
          {field.label}
        </label>
        <div className="relative w-full">
          <div className="absolute top-3 left-0 pl-4 pointer-events-none">
            {field.icon}
          </div>
          <textarea
            value={field.value}
            name={field.name}
            onChange={handleChange}
            placeholder={field.placeholder ?? ""}
            required
            className="
                      w-full min-h-32 pl-12 pr-4 py-3 rounded-lg border border-input
                      bg-background text-foreground
                      focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                      transition-all duration-200
                      placeholder:text-muted-foreground
                      resize-none
                    "
          />
        </div>
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="flex items-center gap-1 text-red-500 text-sm mt-2"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <MdErrorOutline className="size-4" />
              <span>{error ?? error[locale]}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
