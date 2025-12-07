import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import MapSelector from "@/app/_components/_maps/MapSelector";
import { FormValues } from "../schema";

interface LocationSectionProps {
  formData: FormValues;
  setFormData: React.Dispatch<React.SetStateAction<FormValues>>;
  showMap: boolean;
  setShowMap: (show: boolean) => void;
}

export default function LocationSection({
  formData,
  setFormData,
  showMap,
  setShowMap,
}: LocationSectionProps) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">الموقع والعنوان</h2>
          <p className="text-gray-500 text-sm mt-1">
            تحديد موقع المركز على الخريطة
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowMap(true)}
          className="px-5 py-2.5 bg-sky-50 text-sky-600 font-medium rounded-xl hover:bg-sky-100 transition-colors flex items-center gap-2 active:scale-95"
        >
          <FaMapMarkerAlt />
          <span>تحديد الموقع</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            العنوان النصي
          </label>
          <div className="relative">
            <input
              value={formData.location.address}
              className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none"
              placeholder="سيتم تعبئته تلقائياً عند تحديد الموقع"
              readOnly
            />
            <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              خط العرض (Lat)
            </label>
            <input
              value={formData.location.coordinates.lat}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 focus:outline-none text-left"
              readOnly
              dir="ltr"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              خط الطول (Lng)
            </label>
            <input
              value={formData.location.coordinates.lng}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 focus:outline-none text-left"
              readOnly
              dir="ltr"
            />
          </div>
        </div>
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
