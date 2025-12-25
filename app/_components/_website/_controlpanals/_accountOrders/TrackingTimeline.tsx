"use client";
import React from "react";
import { ServiceOrder } from "./serviceOrderTypes";
import { useLocale } from "next-intl";
import { FiCheck, FiClock } from "react-icons/fi";
import FileRenderer from "./FileRenderer";

interface TrackingTimelineProps {
  serviceOrder: ServiceOrder;
}

const steps = [
  { key: "initiation", label_en: "Initiation", label_ar: "البدء" },
  { key: "planning", label_en: "Planning", label_ar: "التخطيط" },
  { key: "execution", label_en: "Execution", label_ar: "التنفيذ" },
  { key: "delivery", label_en: "Delivery", label_ar: "التسليم" },
];

export default function TrackingTimeline({
  serviceOrder,
}: TrackingTimelineProps) {
  const locale = useLocale();

  // Helper to get tracking data for a specific phase
  const getPhaseTrackings = (phaseKey: string) => {
    return serviceOrder.trackings.filter((t) => t.phase == phaseKey);
  };

  // Determine current active step index
  const activeStepIndex = steps.reduce((acc, step, index) => {
    const phaseTrackings = getPhaseTrackings(step.key);
    const hasActiveTracking = phaseTrackings.some(
      (t) => t.status === "completed" || t.status === "in_progress"
    );
    if (hasActiveTracking) {
      return index;
    }
    return acc;
  }, 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
      <h3 className="font-bold text-gray-900 mb-8">
        {locale === "ar" ? "تتبع حالة الطلب" : "Track Order Status"}
      </h3>

      <div className="relative pl-8 md:pl-0">
        <div className="space-y-12 relative before:absolute before:inset-y-0 before:left-[15px] before:w-0.5 before:bg-gray-100 md:before:left-[19px]">
          {steps.map((step, index) => {
            const phaseTrackings = getPhaseTrackings(step.key);
            const hasTrackings = phaseTrackings && phaseTrackings.length > 0;

            // If we have trackings, render them all
            if (hasTrackings) {
              return phaseTrackings.map((tracking, trackingIndex) => {
                const isCompleted = tracking.status === "completed";
                const inProgress = tracking.status === "in_progress";
                const isActive = isCompleted || inProgress;
                const isPending = tracking.status === "pending";

                // Status Color Logic
                let statusColor = "bg-gray-200 text-gray-400";
                if (isCompleted)
                  statusColor =
                    "bg-green-500 text-white shadow-green-200 shadow-lg ring-4 ring-green-50";
                else if (inProgress)
                  statusColor =
                    "bg-primary text-white shadow-blue-200 shadow-lg ring-4 ring-blue-50";
                else if (tracking.status === "pending")
                  statusColor =
                    "bg-yellow-100 text-yellow-600 ring-4 ring-yellow-50";

                return (
                  <div
                    key={`${step.key}-${tracking.id}`}
                    className="relative flex gap-6 group"
                  >
                    {/* Icon/Circle */}
                    <div
                      className={`
                             absolute left-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-300
                             ${statusColor}
                          `}
                    >
                      {isCompleted ? (
                        <FiCheck size={18} />
                      ) : inProgress ? (
                        <FiClock size={18} className="animate-pulse" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-current opacity-60"></span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="pl-12 md:pl-16 w-full pt-1">
                      <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                        <h4
                          className={`text-lg font-bold ${
                            isActive ? "text-gray-900" : "text-gray-400"
                          }`}
                        >
                          {locale === "ar" ? step.label_ar : step.label_en}
                        </h4>

                        {isActive && (
                          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                            {tracking.end_time || tracking.start_time
                              ? new Date(
                                  tracking.end_time || tracking.start_time!
                                ).toLocaleDateString()
                              : ""}
                          </span>
                        )}
                      </div>

                      <div
                        className={`mt-3 space-y-4 transition-all duration-500 ${
                          isPending ? "opacity-60 grayscale" : "opacity-100"
                        }`}
                      >
                        {/* Notes */}
                        {tracking.metadata?.notes && (
                          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                            “{tracking.metadata.notes}”
                          </div>
                        )}

                        {/* Files */}
                        {tracking.files && tracking.files.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {tracking.files.map((file) => (
                              <FileRenderer key={file.id} file={file} />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              });
            }

            // If no trackings, check if we need to show "Pending" placeholder
            // Only show pending for steps after the last active step
            if (index > activeStepIndex) {
              return (
                <div key={step.key} className="relative flex gap-6 group">
                  <div className="absolute left-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-300 bg-gray-200 text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-current opacity-60"></span>
                  </div>
                  <div className="pl-12 md:pl-16 w-full pt-1">
                    <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                      <h4 className="text-lg font-bold text-gray-400">
                        {locale === "ar" ? step.label_ar : step.label_en}
                      </h4>
                    </div>
                    <div className="mt-2 text-sm text-gray-400 italic">
                      {locale === "ar" ? "في انتظار البدء" : "Pending start"}
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
}
