// components/MembershipCard/MembershipDetails.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaIdCard } from "react-icons/fa";
import { useTranslations } from "next-intl";

interface MembershipDetailsProps {
  memberId: string;
  memberLevel: string;
  joinDate: string;
  expiryDate: string;
  levelIcon: React.ReactNode;
}

const MembershipDetails: React.FC<MembershipDetailsProps> = ({
  memberId,
  memberLevel,
  joinDate,
  expiryDate,
  levelIcon,
}) => {
  const t = useTranslations();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const details = [
    {
      label: t("membership_card.member_id"),
      value: memberId,
      icon: <FaIdCard className="text-blue-400" />,
    },
    {
      label: t("membership_card.member_level"),
      value: memberLevel,
      icon: levelIcon,
    },
    {
      label: t("membership_card.join_date"),
      value: formatDate(joinDate),
      icon: <FaCalendarAlt className="text-green-400" />,
    },
    {
      label: t("membership_card.expiry_date"),
      value: formatDate(expiryDate),
      icon: <FaCalendarAlt className="text-amber-400" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="grid grid-cols-2 gap-4 py-4"
    >
      {details.map((detail, index) => (
        <div
          key={detail.label}
          className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl border border-gray-700/50"
        >
          <div className="shrink-0">{detail.icon}</div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">{detail.label}</span>
            <span className="text-sm font-medium text-white">
              {detail.value}
            </span>
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default MembershipDetails;
