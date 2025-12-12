"use client";

import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import { FormStep, LocalizedText } from "./types";

interface FormStepIndicatorProps {
  steps: FormStep[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  locale: "ar" | "en";
  completedSteps?: number[];
}

function getLocalizedText(
  text: LocalizedText | string | undefined,
  locale: "ar" | "en"
): string {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[locale] || text.ar || text.en || "";
}

export default function FormStepIndicator({
  steps,
  currentStep,
  onStepClick,
  locale,
  completedSteps = [],
}: FormStepIndicatorProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line Background */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" />

        {/* Progress Line Active */}
        <motion.div
          initial={{ width: "0%" }}
          animate={{
            width: `${
              steps.length > 1
                ? ((currentStep - 1) / (steps.length - 1)) * 100
                : 0
            }%`,
          }}
          transition={{ duration: 0.3 }}
          className="absolute top-5 left-0 h-0.5 bg-primary z-0"
          style={locale === "ar" ? { right: 0, left: "auto" } : {}}
        />

        {steps.map((step, index) => {
          const stepNumber = step.id;
          const isActive = currentStep === stepNumber;
          const isCompleted =
            completedSteps.includes(stepNumber) || currentStep > stepNumber;
          const isClickable =
            onStepClick && (isCompleted || stepNumber <= currentStep + 1);

          return (
            <div
              key={step.id}
              className="flex flex-col items-center z-10 relative"
            >
              {/* Step Circle */}
              <motion.button
                type="button"
                onClick={() => isClickable && onStepClick?.(stepNumber)}
                disabled={!isClickable}
                whileHover={isClickable ? { scale: 1.1 } : {}}
                whileTap={isClickable ? { scale: 0.95 } : {}}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300
                  ${isClickable ? "cursor-pointer" : "cursor-default"}
                  ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : isCompleted
                      ? "bg-primary text-white"
                      : "bg-white text-gray-400 border-2 border-gray-200"
                  }
                `}
              >
                {isCompleted && !isActive ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <FiCheck size={18} />
                  </motion.div>
                ) : (
                  stepNumber
                )}
              </motion.button>

              {/* Step Label */}
              <div className="mt-2 text-center">
                <p
                  className={`text-xs font-medium transition-colors duration-300 ${
                    isActive
                      ? "text-primary"
                      : isCompleted
                      ? "text-gray-700"
                      : "text-gray-400"
                  }`}
                >
                  {getLocalizedText(step.title, locale)}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-400 mt-0.5 max-w-[100px]">
                    {getLocalizedText(step.description, locale)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
