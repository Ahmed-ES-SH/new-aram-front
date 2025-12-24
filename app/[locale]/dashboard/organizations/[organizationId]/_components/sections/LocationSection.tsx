"use client";
import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FormValues } from "../schema";
import dynamic from "next/dynamic";

const MapSelector = dynamic(
  () => import("@/app/_components/_maps/MapSelector"),
  { ssr: false }
);

interface LocationSectionProps {
  formData: FormValues;
  setFormData: React.Dispatch<React.SetStateAction<FormValues>>;
  showMap: boolean;
  setShowMap: (show: boolean) => void;
  errors: Record<string, string>;
}

export default function LocationSection({
  formData,
  setFormData,
  showMap,
  setShowMap,
  errors,
}: LocationSectionProps) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <div className="flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">الموقع والعنوان</h2>
          <p className="text-gray-500 text-sm mt-1">
            تحديد موقع المركز على الخريطة
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowMap(true)}
          className="px-5 py-2.5 max-md:px-4 max-md:py-2 max-md:self-end bg-sky-50 text-sky-600 font-medium rounded-xl hover:bg-sky-100 transition-colors flex items-center gap-2 active:scale-95"
        >
          <FaMapMarkerAlt />
          <span>تحديد الموقع</span>
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          العنوان النصي
        </label>
        <div className="relative">
          <input
            value={formData.location.address}
            className={`w-full px-4 py-3 pr-10 rounded-xl border bg-gray-50 focus:outline-none ${
              errors["location.address"] ? "border-red-300" : "border-gray-200"
            }`}
            placeholder="سيتم تعبئته تلقائياً عند تحديد الموقع"
            readOnly
          />
          <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        {errors.location && (
          <p className="text-red-500 text-xs mt-1">{errors.location}</p>
        )}
        {errors["location.address"] && (
          <p className="text-red-500 text-xs mt-1">
            {errors["location.address"]}
          </p>
        )}
      </div>

      <MapSelector
        initialLocation={formData.location}
        setLocation={(loc) => {
          setFormData({ ...formData, location: loc });
          setShowMap(false);
        }}
        showMap={showMap}
        onClose={() => setShowMap(false)}
        locale="ar"
      />
    </div>
  );
}
