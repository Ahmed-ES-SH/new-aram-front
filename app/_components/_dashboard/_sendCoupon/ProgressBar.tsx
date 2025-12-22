"use client";
import { motion } from "framer-motion";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export default function ProgressBar({
  currentStep,
  totalSteps,
  stepLabels,
}: ProgressBarProps) {
  return (
    <div className="w-full space-y-4">
      {/* Step Labels */}
      <div className="flex justify-between items-center">
        {stepLabels.map((label, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 ${
                index + 1 <= currentStep
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
              animate={{
                scale: index + 1 === currentStep ? 1.1 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {index + 1}
            </motion.div>
            <span
              className={`text-xs font-medium ${
                index + 1 <= currentStep ? "text-blue-600" : "text-gray-400"
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="relative w-full bg-gray-200 h-3 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
