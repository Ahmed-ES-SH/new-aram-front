import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiPackage } from "react-icons/fi";
import { PurchaseItem } from "./types";

interface ItemsPopupProps {
  items: PurchaseItem[];
  onClose: () => void;
}

export default function ItemsPopup({ items, onClose }: ItemsPopupProps) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden relative"
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FiPackage className="text-purple-500" />
              تفاصيل العناصر ({items?.length || 0})
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="إغلاق"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 max-h-[60vh] overflow-y-auto">
            {!items || items.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                لا توجد عناصر لعرضها
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-3 rounded-lg border border-gray-100 hover:border-purple-100 hover:bg-purple-50/30 transition-colors"
                  >
                    {/* Image Placeholder or Real Image */}
                    <div className="w-16 h-16 bg-gray-100 rounded-md shrink-0 overflow-hidden flex items-center justify-center text-gray-400">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiPackage className="w-6 h-6" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {item.title}
                      </h4>
                      <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-600">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                          الكمية: {item.quantity}
                        </span>
                        <span className="font-semibold text-purple-600">
                          {item.price} ر.ع
                        </span>
                        {item.duration && (
                          <span className="text-xs text-gray-500">
                            المدة: {item.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors text-sm font-medium"
            >
              إغلاق
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
