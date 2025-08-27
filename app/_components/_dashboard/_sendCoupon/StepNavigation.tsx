"use client";
import { motion } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiCheck } from "react-icons/fi";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  isNextDisabled?: boolean;
  nextLabel?: string;
  prevLabel?: string;
  handleSend: () => void;
}

export default function StepNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  isNextDisabled = false,
  nextLabel = "التالي",
  prevLabel = "رجوع",
  handleSend,
}: StepNavigationProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex justify-between items-center pt-6 border-t border-gray-100">
      {/* Previous button */}
      <motion.button
        onClick={onPrev}
        disabled={isFirstStep}
        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
          isFirstStep
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md"
        }`}
        whileHover={!isFirstStep ? { scale: 1.02 } : {}}
        whileTap={!isFirstStep ? { scale: 0.98 } : {}}
      >
        <FiArrowLeft className="w-4 h-4" />
        <span>{prevLabel}</span>
      </motion.button>

      {/* Next / Finish button */}
      <motion.button
        onClick={isLastStep ? handleSend : onNext}
        disabled={isNextDisabled}
        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
          isNextDisabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
        }`}
        whileHover={!isNextDisabled ? { scale: 1.02 } : {}}
        whileTap={!isNextDisabled ? { scale: 0.98 } : {}}
      >
        <span>{isLastStep ? "إنهاء" : nextLabel}</span>
        {isLastStep ? (
          <FiCheck className="w-4 h-4" />
        ) : (
          <FiArrowRight className="w-4 h-4" />
        )}
      </motion.button>
    </div>
  );
}
