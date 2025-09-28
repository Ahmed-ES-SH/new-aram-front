"use client";

import { LocationType } from "@/app/_components/_dashboard/_organizations/types/organization";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FaMapMarkerAlt } from "react-icons/fa";

interface LocationFilterProps {
  locations: LocationType[];
  selectedLocation: LocationType | null;
  onLocationChange: (location: LocationType | null) => void;
}

export default function LocationFilter({
  locations,
  selectedLocation,
  onLocationChange,
}: LocationFilterProps) {
  const t = useTranslations();

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
        {t("locations")}
      </h3>

      <div className="space-y-2">
        <motion.button
          whileHover={{ x: 2 }}
          onClick={() => onLocationChange(null)}
          className={`flex items-center w-full p-2 rounded-lg text-left transition-colors ${
            selectedLocation === null
              ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <FaMapMarkerAlt className="w-4 h-4 mr-2" />
          <span className="text-sm">{t("all_locations")}</span>
        </motion.button>

        {locations.map((location, index) => (
          <motion.button
            key={index}
            whileHover={{ x: 2 }}
            onClick={() => onLocationChange(location)}
            className={`flex items-center w-full p-2 rounded-lg text-left transition-colors ${
              selectedLocation?.address === location.address
                ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <FaMapMarkerAlt className="w-4 h-4 mr-2" />
            <span className="text-sm truncate">{location.address}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
