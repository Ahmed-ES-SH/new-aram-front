// Section Card Wrapper
"use client";
import { motion } from "framer-motion";
import { VscLoading } from "react-icons/vsc";

export default function SectionCard({
  title,
  children,
  onSave,
  loading,
}: {
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  loading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">
        {title}
      </h2>
      {children}
      <motion.button
        onClick={onSave}
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-6 w-fit mr-auto px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <VscLoading className="animate-spin text-xl" />
        ) : (
          "حفظ التغييرات"
        )}
      </motion.button>
    </motion.div>
  );
}
