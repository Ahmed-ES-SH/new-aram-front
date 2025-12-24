import React from "react";
import { STEPS } from "./stepsConfig";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

interface OrganizationSidebarProps {
  activeStep: string;
  onStepChange: (stepId: string) => void;
  errors: Record<string, string>;
  isSubmitting: boolean;
}

export default function OrganizationSidebar({
  activeStep,
  onStepChange,
  errors,
  isSubmitting,
}: OrganizationSidebarProps) {
  // Calculate global status
  const totalErrors = Object.keys(errors).length;
  const hasErrors = totalErrors > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-4">
      {/* Header / Status */}
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <h3 className="font-bold text-gray-800 text-lg">خطوات التعديل</h3>
        <p className="text-gray-500 text-sm mt-1 mb-4">
          أكمل البيانات المطلوبة أدناه
        </p>

        {/* Global Status Indicator */}
        <div
          className={`flex items-center gap-2 text-sm font-medium p-3 rounded-xl border ${
            hasErrors
              ? "bg-red-50 text-red-600 border-red-100"
              : "bg-emerald-50 text-emerald-600 border-emerald-100"
          }`}
        >
          {hasErrors ? (
            <>
              <FaExclamationCircle className="text-lg" />
              <span>يوجد {totalErrors} أخطاء تحتاج للمراجعة</span>
            </>
          ) : (
            <>
              <FaCheckCircle className="text-lg" />
              <span>نموذج المركز جاهز للحفظ</span>
            </>
          )}
        </div>
      </div>

      {/* Navigation Steps */}
      <nav className="p-4 space-y-1">
        {STEPS.map((step) => {
          const isActive = activeStep === step.id;
          // Check if this step has any errors
          const stepErrors = step.fields.filter((field) => errors[field]);
          const hasStepError = stepErrors.length > 0;

          return (
            <button
              key={step.id}
              onClick={() => onStepChange(step.id)}
              disabled={isSubmitting}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-sky-50 text-sky-700 font-semibold shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-sky-100 text-sky-600"
                      : "bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600"
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <span className="text-sm">{step.label}</span>
              </div>

              {/* Error Badge */}
              {hasStepError && <DivWrapper count={stepErrors.length} />}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// Simple internal wrapper to avoid conditional hook rules or messy returns
const DivWrapper = ({ count }: { count: number }) => (
  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-bold animate-pulse">
    {count}
  </div>
);
