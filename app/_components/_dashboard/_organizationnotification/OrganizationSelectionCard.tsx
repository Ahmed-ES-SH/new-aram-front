"use client";
import { FiCheck, FiChevronRight, FiInfo, FiUsers } from "react-icons/fi";
import { OrganizationSelection } from "./types";
import { motion } from "framer-motion";
import Img from "../../_website/_global/Img";

// مكون بطاقة المركز
interface OrganizationSelectionCardProps {
  organization: OrganizationSelection;
  onToggle: (id: number) => void;
}

export default function OrganizationSelectionCard({
  organization,
  onToggle,
}: OrganizationSelectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 w-[98%] mx-auto cursor-pointer ${
        organization.selected
          ? "border-blue-500 bg-blue-50 shadow-md"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
      onClick={() => onToggle(organization.id)}
    >
      {/* صورة المركز */}
      <div className="relative shrink-0">
        <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-gray-100">
          <Img
            src={organization.logo ?? "/logo.png"}
            alt={organization.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* زر الاختيار */}
        <div
          className={`absolute -top-1 -right-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            organization.selected
              ? "bg-blue-500 border-blue-500"
              : "bg-white border-gray-300"
          }`}
        >
          {organization.selected && <FiCheck className="w-3 h-3 text-white" />}
        </div>
      </div>

      {/* معلومات المركز */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">
          {organization.title}
        </h3>

        <div className="flex items-center gap-4 mt-1">
          <span className="text-sm text-gray-600 flex items-center gap-1">
            <FiInfo className="w-3 h-3" />
            {organization.status === "active" ? "نشط" : "قيد المراجعة"}
          </span>

          <span className="text-sm text-gray-600 flex items-center gap-1">
            <FiUsers className="w-3 h-3" />
            {organization.number_of_reservations} حجز
          </span>
        </div>

        <p className="text-xs text-gray-500 mt-2 truncate">
          {organization.email}
        </p>
      </div>

      {/* أيقونة السهم */}
      <FiChevronRight
        className={`w-5 h-5 transition-colors duration-200 ${
          organization.selected ? "text-blue-500" : "text-gray-400"
        }`}
      />
    </motion.div>
  );
}
