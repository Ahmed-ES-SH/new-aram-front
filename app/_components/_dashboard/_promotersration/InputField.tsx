"use client";
import React from "react";
import { motion } from "framer-motion";

interface Props {
  label: string;
  name: string;
  value: number;
  disabled: boolean;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<Props> = ({
  label,
  name,
  value,
  disabled,
  error,
  onChange,
}) => {
  return (
    <div className="my-6">
      <label className="block text-right mb-2 text-gray-700 font-medium">
        {label}
      </label>

      <div>
        <input
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          min="0"
          step="0.01"
          className={`
            w-full px-4 py-3 border rounded-lg text-right
            transition-all duration-200
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            }
            ${disabled ? "bg-gray-50 text-gray-500" : "bg-white text-gray-900"}
            disabled:cursor-not-allowed
          `}
        />
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-right mt-1 text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default InputField;
