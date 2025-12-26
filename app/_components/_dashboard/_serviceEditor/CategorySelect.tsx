"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiChevronDown, FiSearch } from "react-icons/fi";

/**
 * Accessible, RTL-aware replacement for a native <select>
 * - Uses Tailwind for styling
 * - Supports keyboard navigation, search, animations (Framer Motion)
 * - Accepts mixed option shapes (title_ar / title_en / title)
 */

type Option = {
  id: string | number;
  title?: string;
  title_ar?: string;
  title_en?: string;
  [key: string]: any;
};

type Props = {
  value?: string | number | null;
  onChange: (id: string | number | null) => void;
  options: Option[];
  placeholder?: string;
  searchable?: boolean;
  locale?: "ar" | "en";
  labelKey?: string; // optional custom key for display
  className?: string;
  disabled?: boolean;
  name?: string; // optional hidden input name for form submissions
};

export default function CategorySelect({
  value = null,
  onChange,
  options,
  placeholder = "اختر التصنيف",
  searchable = true,
  locale = "ar",
  labelKey,
  className = "",
  disabled = false,
  name,
}: Props) {
  const dir = locale === "ar" ? "rtl" : "ltr";
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(null);
    }
  }, [open]);

  const normalizeLabel = (opt: Option) => {
    if (labelKey && (opt as any)[labelKey])
      return String((opt as any)[labelKey]);
    if (locale === "ar" && opt.title_ar) return String(opt.title_ar);
    if (locale === "en" && opt.title_en) return String(opt.title_en);
    if (opt.title) return String(opt.title);
    // fallback to id
    return String(opt.id);
  };

  console.log(options);

  const selected =
    value != null
      ? options.find((o) => String(o.id) === String(value)) || null
      : null;

  const filtered = options.filter((opt) => {
    if (!query) return true;
    return normalizeLabel(opt).toLowerCase().includes(query.toLowerCase());
  });

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((prev) => {
        const next =
          prev === null ? 0 : Math.min(prev + 1, filtered.length - 1);
        scrollToIndex(next);
        return next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((prev) => {
        const next =
          prev === null ? filtered.length - 1 : Math.max(prev - 1, 0);
        scrollToIndex(next);
        return next;
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (open && activeIndex !== null) {
        const opt = filtered[activeIndex];
        if (opt) selectOption(opt);
      } else {
        setOpen((v) => !v);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const selectOption = (opt: Option | null) => {
    onChange(opt ? opt.id : null);
    setOpen(false);
  };

  const scrollToIndex = (index: number | null) => {
    if (index === null || !listRef.current) return;
    const node = listRef.current.children[index] as HTMLElement | undefined;
    if (node) node.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  return (
    <div
      ref={rootRef}
      dir={dir}
      className={`relative inline-block w-full ${className}`}
    >
      {/* Hidden input for forms */}
      {name && <input type="hidden" name={name} value={value ?? ""} />}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          القسم الخاص بالخدمة
        </label>
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onKeyDown={onKeyDown}
          onClick={() => setOpen((v) => !v)}
          disabled={disabled}
          className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white flex items-center justify-between gap-2 cursor-pointer ${
            disabled ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          <div className="flex items-center gap-3 truncate">
            <div className="flex flex-col truncate">
              <span
                className={`truncate text-sm ${
                  selected ? "text-gray-800" : "text-gray-400"
                }`}
              >
                {selected ? normalizeLabel(selected) : placeholder}
              </span>
              {/* optional secondary line: id or meta */}
            </div>
          </div>

          <div
            className={`flex items-center gap-2 ${
              locale === "ar" ? "flex-row-reverse" : ""
            }`}
          >
            {selected && (
              <span className="text-[13px] px-2 py-1 rounded bg-gray-100 text-gray-700">
                {String(selected.id)}
              </span>
            )}
            <FiChevronDown className="text-lg text-gray-500" />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, translateY: -6 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -6 }}
            transition={{ duration: 0.12 }}
            className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg"
            style={{ maxHeight: 320 }}
          >
            <div className="p-3">
              {searchable && (
                <div className="relative">
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setActiveIndex(0);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setActiveIndex(0);
                        scrollToIndex(0);
                      }
                    }}
                    placeholder={locale === "ar" ? "ابحث..." : "Search..."}
                    className="w-full pl-10 pr-3 py-2 border border-gray-100 rounded-md outline-none"
                  />
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              )}
            </div>

            <ul
              role="listbox"
              aria-activedescendant={
                activeIndex !== null ? `option-${activeIndex}` : undefined
              }
              tabIndex={-1}
              ref={listRef}
              className="max-h-56 overflow-auto divide-y divide-gray-100"
            >
              {filtered.length === 0 && (
                <li className="p-4 text-center text-sm text-gray-400">
                  {locale === "ar" ? "لا توجد نتائج" : "No results"}
                </li>
              )}

              {filtered.map((opt, i) => {
                const isSelected = String(opt.id) === String(value);
                const isActive = i === activeIndex;
                return (
                  <li
                    id={`option-${i}`}
                    key={opt.id}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIndex(i)}
                    onMouseLeave={() => setActiveIndex(null)}
                    onClick={() => selectOption(opt)}
                    className={`flex items-center justify-between gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-all ${
                      isActive ? "bg-gray-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="truncate text-sm">
                        {normalizeLabel(opt)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <span className="flex items-center gap-1 text-green-600">
                          <FiCheck />
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
