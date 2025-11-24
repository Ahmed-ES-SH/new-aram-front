"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiUserX,
  FiBriefcase,
} from "react-icons/fi";

type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "rejected"
  | "cancelled_by_user"
  | "cancelled_by_org";

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus;
}

const statusConfig = {
  pending: {
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: FiClock,
    label: {
      en: "Pending",
      ar: "قيد الانتظار",
    },
  },
  confirmed: {
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: FiCheckCircle,
    label: {
      en: "Confirmed",
      ar: "تم التأكيد",
    },
  },
  rejected: {
    color: "bg-rose-100 text-rose-700 border-rose-200",
    icon: FiXCircle,
    label: {
      en: "Rejected",
      ar: "مرفوض",
    },
  },
  cancelled_by_user: {
    color: "bg-slate-100 text-slate-700 border-slate-200",
    icon: FiUserX,
    label: {
      en: "Cancelled by User",
      ar: "ألغاه المستخدم",
    },
  },
  cancelled_by_org: {
    color: "bg-slate-100 text-slate-700 border-slate-200",
    icon: FiBriefcase,
    label: {
      en: "Cancelled by Center",
      ar: "ألغاه المركز",
    },
  },
  done: {
    color: "bg-green-100 text-green-700 border-green-200",
    icon: FiCheckCircle,
    label: {
      en: "Completed",
      ar: "تم بنجاح",
    },
  },
};

export function AppointmentStatusBadge({
  status,
}: AppointmentStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const locale = useLocale();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${config.color}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label[locale]}</span>
    </motion.div>
  );
}
