"use client";
import { StatItem } from "./types";
import EditableField from "./EditableField";
import { FiBarChart2, FiPlus, FiTrash2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface StatsSectionEditorProps {
  data: StatItem[];
  onChange: (data: StatItem[], field: string) => void;
}

export default function StatsSectionEditor({
  data,
  onChange,
}: StatsSectionEditorProps) {
  const updateStat = (index: number, field: keyof StatItem, value: string) => {
    const newStats = [...data];
    newStats[index] = { ...newStats[index], [field]: value };
    onChange(newStats, "stats");
  };

  const addStat = () => {
    onChange(
      [...data, { id: Date.now(), number: "", label_ar: "", label_en: "" }],
      "stats"
    );
  };

  const removeStat = (index: number) => {
    const newStats = data.filter((_, i) => i !== index);
    onChange(newStats, "stats");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <FiBarChart2 className="text-purple-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">الإحصائيات</h3>
            <p className="text-sm text-gray-500">تعديل الأرقام والإحصائيات</p>
          </div>
        </div>
        <button
          type="button"
          onClick={addStat}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          <FiPlus size={16} />
          إضافة إحصائية
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2   gap-4">
        <AnimatePresence>
          {data.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative p-4 bg-linear-to-br from-purple-50 to-white rounded-xl border border-purple-100"
            >
              <button
                type="button"
                onClick={() => removeStat(index)}
                className="absolute top-2 left-2 p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FiTrash2 size={14} />
              </button>

              <div className="space-y-3 mt-4">
                <EditableField
                  label="الرقم"
                  value={stat.number}
                  onChange={(v) => updateStat(index, "number", v)}
                  placeholder="Example: 100+"
                />
                <EditableField
                  label="الوصف (إنجليزي)"
                  value={stat.label_en || ""}
                  onChange={(v) => updateStat(index, "label_en", v)}
                  placeholder="Example: Happy Customer"
                />
                <EditableField
                  label="الوصف (عربي)"
                  value={stat.label_ar || ""}
                  onChange={(v) => updateStat(index, "label_ar", v)}
                  placeholder="مثال: عميل سعيد"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {data.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <FiBarChart2 className="mx-auto text-gray-300" size={48} />
          <p className="mt-4 text-gray-500">لا توجد إحصائيات مضافة</p>
          <button
            type="button"
            onClick={addStat}
            className="mt-4 text-purple-500 hover:underline"
          >
            إضافة إحصائية جديدة
          </button>
        </div>
      )}
    </div>
  );
}
