"use client";
import { motion } from "framer-motion";
import { FiInbox } from "react-icons/fi";
import { useAppSelector } from "@/app/Store/hooks";

interface EmptyStateProps {
  filter: "all" | "unread" | "read";
}

export default function EmptyState({ filter }: EmptyStateProps) {
  const { locale } = useAppSelector((state) => state.variables);

  const messages = {
    en: {
      unread: {
        title: "No unread notifications",
        subtitle: "All caught up! Check back later for new updates.",
      },
      read: {
        title: "No read notifications",
        subtitle: "Notifications you've read will appear here.",
      },
      all: {
        title: "No notifications yet",
        subtitle:
          "You'll see your notifications here once you start receiving them.",
      },
    },
    ar: {
      unread: {
        title: "لا توجد إشعارات غير مقروءة",
        subtitle: "أنت على اطلاع كامل! تحقق لاحقًا لمزيد من التحديثات.",
      },
      read: {
        title: "لا توجد إشعارات مقروءة",
        subtitle: "الإشعارات التي قرأتها ستظهر هنا.",
      },
      all: {
        title: "لا توجد إشعارات بعد",
        subtitle: "ستظهر إشعاراتك هنا بمجرد البدء في استقبالها.",
      },
    },
  };

  const { title, subtitle } = messages[locale as "en" | "ar"][filter];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-6"
    >
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <FiInbox className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center max-w-md">{subtitle}</p>
    </motion.div>
  );
}
