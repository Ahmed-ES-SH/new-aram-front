// Editable Text Component
"use client";
import { FiEdit2 } from "react-icons/fi";

export default function EditableText({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all border border-gray-200 hover:border-primary"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <span className="text-sm text-gray-500 block mb-1">{label}</span>
          <p className="text-gray-800 font-medium">{value || "اضغط للتعديل"}</p>
        </div>
        <FiEdit2 className="text-gray-400 group-hover:text-primary transition-colors" />
      </div>
    </div>
  );
}
