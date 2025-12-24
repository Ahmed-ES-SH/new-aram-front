import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaCheck } from "react-icons/fa";

interface Option {
  id?: string | number;
  name?: string;
  value?: string | number;
  title_ar?: string;
  title_en?: string;
  label?: string;
  [key: string]: any;
}

interface CustomSelectProps {
  name: string;
  value?: string | number;
  onChange: (e: { target: { name: string; value: string | number } }) => void;
  label: string;
  placeholder?: string;
  options: Option[];
  error?: string;
  readOnly?: boolean;
}

export default function CustomSelect({
  name,
  value,
  onChange,
  label,
  placeholder,
  options = [],
  error,
  readOnly,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option: Option) => {
    if (readOnly) return;
    // Prefer value, then name, then id
    const selectedValue = option.value ?? option.name ?? option.id;
    onChange({
      target: {
        name: name,
        value: selectedValue!,
      },
    });
    setIsOpen(false);
  };

  // Robust finding of selected option
  const selectedOption = options.find((opt) => {
    if (value === undefined || value === null || value === "") return false;

    // 1. Try matching by ID (loose equality for string/number)
    if (opt.id != null && opt.id == value) return true;

    // 2. Try matching by value prop
    if (opt.value != null && opt.value == value) return true;

    // 3. Try matching by name
    if (opt.name != null && opt.name == value) return true;

    // 4. Fallback for strict Number conversion (user request compatibility)
    if (opt.id != null && Number(opt.id) === Number(value)) return true;

    return false;
  });

  const displayValue = selectedOption
    ? selectedOption.name ||
      selectedOption.title_ar ||
      selectedOption.title_en ||
      selectedOption.label
    : "";

  return (
    <div className="w-full group relative" ref={containerRef}>
      <label
        className={`block text-sm font-semibold mb-2 transition-colors duration-200 ${
          error
            ? "text-red-500"
            : isOpen
            ? "text-primary"
            : "text-gray-700 group-hover:text-primary"
        }`}
      >
        {label}
      </label>

      <div
        onClick={() => !readOnly && setIsOpen(!isOpen)}
        className={`relative w-full rounded-xl border px-4 py-3 text-gray-800 outline-none transition-all duration-300 cursor-pointer flex items-center justify-between
          ${
            readOnly
              ? "bg-gray-100/50 border-gray-200 cursor-default"
              : "bg-gray-50/30 hover:bg-gray-50"
          }
          ${
            error
              ? "border-red-500 focus:ring-red-500/10"
              : isOpen
              ? "border-primary bg-white ring-4 ring-primary/10 shadow-sm"
              : "border-gray-200"
          }
        `}
      >
        <span
          className={`${
            !displayValue ? "text-gray-400" : "text-gray-800"
          } truncate`}
        >
          {displayValue || placeholder || "اختر..."}
        </span>

        <FaChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </div>

      {/* Dropdown Menu */}
      <div
        className={`absolute z-50 left-0 right-0 top-[calc(100%+8px)] bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden transition-all duration-300 origin-top
          ${
            isOpen
              ? "opacity-100 translate-y-0 visible"
              : "opacity-0 -translate-y-2 invisible pointer-events-none"
          }
        `}
      >
        <div className="max-h-60 overflow-y-auto custom-scrollbar p-1.5">
          {options.length > 0 ? (
            options.map((option, idx) => {
              const optionValue = option.value ?? option.name ?? option.id;

              // Determine if selected for UI highlighting
              let isSelected = false;
              if (selectedOption) {
                isSelected = option === selectedOption;
              } else {
                isSelected = optionValue == value;
              }

              const optionLabel =
                option.name ||
                option.title_ar ||
                option.title_en ||
                option.label;

              return (
                <div
                  key={idx}
                  onClick={() => handleSelect(option)}
                  className={`relative flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-200 mb-0.5 last:mb-0
                    ${
                      isSelected
                        ? "bg-primary/5 text-primary font-medium"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <span className="truncate mr-2">{optionLabel}</span>
                  {isSelected && <FaCheck className="w-3.5 h-3.5" />}
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-gray-400 text-sm">
              لا توجد خيارات متاحة
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
          {error}
        </p>
      )}
    </div>
  );
}
