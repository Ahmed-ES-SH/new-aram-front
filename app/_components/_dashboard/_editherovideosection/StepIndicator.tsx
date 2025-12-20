"use client";
import { motion } from "framer-motion";

interface StepIndicatorProps {
  currentStep: number;
  steps: { label: string }[];
}
export default function StepIndicator({
  currentStep,
  steps,
}: StepIndicatorProps) {
  return (
    <div className="relative mb-8 w-[90%] mx-auto">
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2 -z-10" />
      <motion.div
        className="absolute top-1/2 left-0 h-1 bg-primary transform -translate-y-1/2 -z-10"
        initial={{ width: "0%" }}
        animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        transition={{ duration: 0.3 }}
      />

      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <motion.div
              className={`
              w-8 h-8 rounded-full flex items-center justify-center
              border-2 text-sm font-medium
              ${
                currentStep >= index
                  ? "bg-primary border-primary text-white"
                  : "bg-white border-gray-300 text-gray-400"
              }
            `}
              whileHover={{ scale: 1.1 }}
            >
              {index + 1}
            </motion.div>
            <span className="text-xs mt-1 text-gray-600">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
