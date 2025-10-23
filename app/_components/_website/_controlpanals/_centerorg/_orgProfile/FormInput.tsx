"use client";
import React, { ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "next-intl";
import { MdErrorOutline } from "react-icons/md";

type fieldType = {
  label: string;
  icon: any;
  value: string | undefined;
  name: string;
  type: string;
  placeholder: string;
};

interface props {
  field: fieldType;
  error: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function FormInput({ field, error, handleChange }: props) {
  const locale = useLocale();
  return (
    <>
      <div className="space-y-2 w-full">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-foreground"
        >
          {field.label}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {field.icon}
          </div>
          <input
            type={field.type}
            name={field.name}
            value={field.value}
            onChange={handleChange}
            placeholder={field.placeholder}
            required
            className={`
                      w-full pl-12 pr-4 py-3 rounded-lg border border-input
                      bg-background text-foreground
                      focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                      transition-all duration-200
                      placeholder:text-muted-foreground/40
                      ${
                        error
                          ? "border-red-400 focus:outline-red-400"
                          : "border-gray-200 focus:outline-primary"
                      }
                    `}
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
