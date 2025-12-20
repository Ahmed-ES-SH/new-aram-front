"use client";
import { useAppDispatch } from "@/app/Store/hooks";
import { setIsServiceSidebarOpen } from "@/app/Store/variablesSlice";
import { useRouter } from "next/navigation";
import {
  FiArrowRight,
  FiLoader,
  FiPlus,
  FiSave,
  FiSettings,
} from "react-icons/fi";

interface ServiceEditorHeaderProps {
  mode: "create" | "edit";
  serviceId?: string | undefined;
  handleSave: () => void;
  isSaving: boolean;
  hasChanges: boolean;
}

export default function ServiceEditorHeader({
  mode,
  serviceId,
  handleSave,
  isSaving,
  hasChanges,
}: ServiceEditorHeaderProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex md:items-center items-start flex-col md:flex-row justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowRight size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {mode === "create"
                  ? "إنشاء صفحة خدمة جديدة"
                  : "تحرير صفحة الخدمة"}
              </h1>
              {mode === "edit" && (
                <p className="text-sm text-gray-500">ID: {serviceId}</p>
              )}
              {mode === "create" && (
                <p className="text-sm text-gray-500">
                  أكمل جميع الأقسام لإنشاء صفحة مميزة
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center self-end gap-3">
            <button>
              <FiSettings
                onClick={() => dispatch(setIsServiceSidebarOpen(true))}
                className="size-7 cursor-pointer hover:rotate-180 transition-all duration-300 text-primary lg:hidden"
              />
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || (!hasChanges && mode === "edit")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                hasChanges || mode === "create"
                  ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isSaving ? (
                <FiLoader className="animate-spin" size={18} />
              ) : mode === "create" ? (
                <FiPlus size={18} />
              ) : (
                <FiSave size={18} />
              )}
              {isSaving
                ? "جاري الحفظ..."
                : mode === "create"
                ? "إنشاء الصفحة"
                : "حفظ التغييرات"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
