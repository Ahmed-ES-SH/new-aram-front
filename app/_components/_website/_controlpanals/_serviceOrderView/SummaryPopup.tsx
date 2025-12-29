"use client";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";

interface props {
  setIsSummaryOpen: (value: boolean) => void;
  order: any;
}

export default function SummaryPopup({ setIsSummaryOpen, order }: props) {
  const locale = useLocale();

  // Helper to safely get metadata
  const getMetadata = () => {
    if (Array.isArray(order.metadata)) return order.metadata;
    return (order.metadata as any)?.items?.metadata || [];
  };

  const metadataList = getMetadata();
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsSummaryOpen(false)}
        className="fixed inset-0 bg-black/40 backdrop-blur-md z-99999"
      />
      <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white pointer-events-auto w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 py-4 bg-primary/5 border-b border-primary/10">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  {locale === "ar" ? "ملخص الطلب" : "Order Summary"}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  #{order.invoice?.invoice_number || order.id}
                </p>
              </div>
              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSummaryOpen(false)}
                className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-700 hover:shadow-md transition-all"
              >
                <FiX size={18} />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
            {metadataList.map((item, idx) => (
              <motion.div
                key={`${item.key}-${idx}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-primary/20 hover:bg-primary/5 hover:shadow-sm transition-all"
              >
                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  {item.label || item.key}
                </span>
                <div className="font-semibold text-gray-900">
                  {item.type === "image_upload" ||
                  item.key === "design_file" ? (
                    <a
                      href={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/service-tracking/${item.value}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 text-sm underline decoration-2 underline-offset-2 flex items-center gap-2"
                    >
                      <span className="truncate max-w-[200px]">
                        {item.value}
                      </span>
                      {locale == "ar" ? (
                        <FiChevronLeft size={14} />
                      ) : (
                        <FiChevronRight size={14} />
                      )}
                    </a>
                  ) : (
                    <span className="text-sm">{item.value}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}
