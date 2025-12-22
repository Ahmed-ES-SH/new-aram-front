"use client";
import React from "react";
import { motion } from "framer-motion";

interface props {
  status: boolean | number | undefined;
  label: string;
  name: string;
  enabledText: string;
  disabledText: string;
  onUpdate: (fieldName, value) => void;
}

export default function FormToggle({
  status,
  name,
  onUpdate,
  label,
  enabledText,
  disabledText,
}: props) {
  return (
    <>
      <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
        <div className="flex-1">
          <label
            htmlFor="confirmation_status"
            className="block text-sm font-medium text-foreground"
          >
            {label}
          </label>
          <p className="text-xs text-muted-foreground mt-1">
            {status ? enabledText : disabledText}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          name={name}
          aria-checked={status as boolean}
          onClick={() => onUpdate(name, !status)}
          className={`
                  relative inline-flex h-6 w-11 items-center rounded-full
                  transition-colors duration-200 focus:outline-none
                  ${status ? "bg-primary" : "bg-input"}
                `}
        >
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`
                    inline-block h-4 w-4 transform rounded-full bg-white shadow-lg
                    ${
                      status
                        ? "ltr:translate-x-6 rtl:-translate-x-6"
                        : "ltr:translate-x-1 rtl:-translate-x-1"
                    }
                  `}
          />
        </button>
      </div>
    </>
  );
}
