"use client";
import { AnimatePresence, motion } from "framer-motion";
import { FiLoader } from "react-icons/fi";
import { DynamicServiceFormProps } from "./types";
import { useDynamicServiceForm } from "./useDynamicServiceForm";
import { StepForm } from "./StepForm";
import { StepSummary } from "./StepSummary";
import { SuccessMessage } from "./SuccessMessage";

export default function DynamicServiceForm(props: DynamicServiceFormProps) {
  const {
    loading,
    schema,
    formData,
    errors,
    submitting,
    submitSuccess,
    globalError,
    step,
    handleChange,
    checkVisibility,
    handleSubmit,
    setSubmitSuccess,
    handleNext,
    handleBack,
  } = useDynamicServiceForm(props);

  if (loading)
    return (
      <div className="text-center p-8">
        <FiLoader className="animate-spin inline-block" />
      </div>
    );

  if (!schema) return null;

  if (submitSuccess) {
    return <SuccessMessage onReset={() => setSubmitSuccess(false)} />;
  }

  return (
    <div className={props.className || ""}>
      {/* Steps Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              step >= 1 ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
            }`}
          >
            1
          </div>
          <div
            className={`w-16 h-1 rounded-full ${
              step >= 2 ? "bg-primary" : "bg-gray-100"
            }`}
          ></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              step >= 2 ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
            }`}
          >
            2
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <StepForm
            key="step1"
            schema={schema}
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            submitting={submitting}
            handleNext={handleNext}
            checkVisibility={checkVisibility}
            globalError={globalError}
          />
        ) : (
          <StepSummary
            key="step2"
            schema={schema}
            formData={formData}
            submitting={submitting}
            handleBack={handleBack}
            handleSubmit={handleSubmit}
            price={props.price}
            price_before_discount={props.price_before_discount}
            checkVisibility={checkVisibility}
            globalError={globalError}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
