"use client";
import React from "react";
import { AdminServiceOrder } from "../types";
import FileRenderer from "../FileRenderer";

interface TrackingOrderSectionProps {
  order: AdminServiceOrder;
}

export default function TrackingOrderSection({
  order,
}: TrackingOrderSectionProps) {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold text-gray-900 mb-6">سجل التتبع</h2>
      {order.trackings && order.trackings.length > 0 ? (
        <div className="space-y-8 relative pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-0.5 before:bg-gray-100">
          {order.trackings.map((tracking) => (
            <div key={tracking.id} className="relative">
              <div
                className={`absolute -left-[29px] w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center
                           ${
                             tracking.status === "completed"
                               ? "bg-green-500 text-white"
                               : tracking.status === "in_progress"
                               ? "bg-primary text-white"
                               : "bg-gray-200 text-gray-500"
                           }
                        `}
              >
                <div className="w-2 h-2 rounded-full bg-current" />
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-900 capitalize">
                    {tracking.current_phase}
                  </h4>
                  <span className="text-xs text-gray-400">
                    {new Date(
                      tracking.start_time as string
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded capitalize ${
                      tracking.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {tracking.status}
                  </span>
                </div>
                {tracking.metadata?.notes && (
                  <p className="text-sm text-gray-600 bg-white p-2 rounded border border-gray-100 mb-3">
                    {tracking.metadata.notes}
                  </p>
                )}

                {tracking.files && tracking.files.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    {tracking.files.map((file) => (
                      <FileRenderer key={file.id} file={file} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-400">
          لا يوجد سجل تتبع حتى الان
        </div>
      )}
    </div>
  );
}
