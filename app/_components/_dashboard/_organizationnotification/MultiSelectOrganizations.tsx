"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Organization } from "./types";
import SelectionStep from "./SelectionStep";
import NotificationStep from "./NotificationStep";
import Pagination from "../../PaginationComponent";

// المكون الرئيسي
interface MultiSelectOrganizationsProps {
  organizations: Organization[];
  last_page: number;
}

export default function MultiSelectOrganizations({
  organizations: data,
  last_page,
}: MultiSelectOrganizationsProps) {
  const [organizations, setOrganizations] = useState<Organization[]>(
    data ?? []
  );
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState<"selection" | "notification">(
    "selection"
  );

  const onBack = () => {
    setCurrentStep("selection");
    setSelectedIds([]);
  };

  return (
    <div className="bg-white my-8 rounded-2xl shadow-xl p-6 max-w-6xl border border-gray-200 mx-auto">
      {/* مؤشر الخطوات */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-medium transition-all duration-300 ${
              currentStep === "selection"
                ? "border-blue-500 bg-blue-500 text-white"
                : "border-blue-500 bg-white text-blue-500"
            }`}
          >
            1
          </div>
          <div
            className={`h-1 w-20 transition-all duration-300 ${
              currentStep === "selection" ? "bg-gray-200" : "bg-blue-500"
            }`}
          />
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-medium transition-all duration-300 ${
              currentStep === "notification"
                ? "border-blue-500 bg-blue-500 text-white"
                : currentStep === "selection"
                ? "border-gray-300 bg-white text-gray-400"
                : "border-blue-500 bg-white text-blue-500"
            }`}
          >
            2
          </div>
        </div>
      </div>

      {/* الخطوات */}
      <AnimatePresence mode="wait">
        {currentStep === "selection" ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <SelectionStep
              organizations={organizations}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              last_page={last_page}
              onNextStep={() => setCurrentStep("notification")}
            />
          </motion.div>
        ) : (
          <motion.div
            key="notification"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <NotificationStep
              selectedIds={selectedIds}
              organizations={organizations}
              onBack={onBack}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
