"use client";
import { AnimatePresence, motion } from "framer-motion";
import { FiLoader, FiPlus, FiSave } from "react-icons/fi";
import { DEFAULT_SERVICE_DATA } from "./constants";

interface BottomPopupProps {
  hasChanges: boolean;
  mode: "create" | "edit";
  setServiceData: (data: any) => void;
  setHasChanges: (hasChanges: boolean) => void;
  handleSave: () => void;
  isSaving: boolean;
}

export const DEFAULT_SETTINGS = {
  slug: "",
  type: "one_time",
  category_id: "",
  price: "",
  price_before_discount: "",
  is_active: true,
};

export default function BottomPopup({
  hasChanges,
  mode,
  setServiceData,
  setHasChanges,
  handleSave,
  isSaving,
}: BottomPopupProps) {
  return (
    <AnimatePresence>
      {hasChanges && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl p-4 z-50"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <p className="text-gray-600 hidden md:block">
              {mode === "create"
                ? "لديك بيانات غير محفوظة"
                : "لديك تغييرات غير محفوظة"}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (mode === "create") {
                    setServiceData(DEFAULT_SERVICE_DATA);
                    setHasChanges(false);
                  } else {
                    window.location.reload();
                  }
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {mode === "create" ? "إعادة تعيين" : "إلغاء التغييرات"}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                {isSaving ? (
                  <FiLoader className="animate-spin" size={16} />
                ) : mode === "create" ? (
                  <FiPlus size={16} />
                ) : (
                  <FiSave size={16} />
                )}
                {mode === "create" ? "إنشاء الصفحة" : "حفظ التغييرات"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
