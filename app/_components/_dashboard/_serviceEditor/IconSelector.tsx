"use client";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import * as FaIcons from "react-icons/fa";
import IconPicker from "../IconPicker";

interface IconSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function IconSelector({
  label,
  value,
  onChange,
}: IconSelectorProps) {
  const [showPicker, setShowPicker] = useState(false);

  // Safely get the icon component or fallback to FaStar
  const SelectedIcon = (FaIcons as any)[value] || FaIcons.FaStar;

  return (
    <div className="space-y-2 relative">
      <label className="text-sm font-medium text-gray-700">{label}</label>

      <button
        type="button"
        onClick={() => setShowPicker(true)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 flex items-center justify-between hover:border-primary transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <SelectedIcon className="text-primary text-xl" />
          </div>
          <span className="text-gray-700">{value || "اختر أيقونة"}</span>
        </div>
        <FiChevronDown className="text-gray-400" />
      </button>

      <IconPicker
        selectedIcon={value}
        onChange={(icon) => {
          onChange(icon);
          setShowPicker(false);
        }}
        show={showPicker}
        onClose={() => setShowPicker(false)}
      />
    </div>
  );
}
