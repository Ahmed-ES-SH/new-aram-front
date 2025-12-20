"use client";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { activeSectionType, SECTION_LABELS, SectionType } from "./types";
import {
  FiLayout,
  FiImage,
  FiAlertCircle,
  FiCheckCircle,
  FiBarChart2,
  FiMessageSquare,
  FiZap,
  FiPlus,
  FiSettings,
} from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { setIsServiceSidebarOpen } from "@/app/Store/variablesSlice";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

// Section icons mapping
const SECTION_ICONS: Record<
  SectionType | "settings" | "form",
  React.ComponentType<{ className?: string; size?: number }>
> = {
  hero_section: FiLayout,
  gallery_images: FiImage,
  problem_section: FiAlertCircle,
  solution_section: FiCheckCircle,
  stats: FiBarChart2,
  testimonials: FiMessageSquare,
  cta: FiZap,
  settings: FiSettings,
  form: FiPlus,
  contact_messages: FiMessageSquare,
};

// Section colors mapping
const SECTION_COLORS: Record<SectionType | "settings" | "form", string> = {
  hero_section: "bg-primary/10 text-primary",
  gallery_images: "bg-green-100 text-green-600",
  problem_section: "bg-red-100 text-red-600",
  solution_section: "bg-emerald-100 text-emerald-600",
  stats: "bg-purple-100 text-purple-600",
  testimonials: "bg-yellow-100 text-yellow-600",
  cta: "bg-orange-100 text-orange-600",
  settings: "bg-gray-100 text-gray-600",
  form: "bg-blue-100 text-blue-600",
  contact_messages: "bg-orange-100 text-orange-600",
};

interface ServiceSidebarNavigationProps {
  mode: "create" | "edit";
  activeSection: activeSectionType;
  setActiveSection: Dispatch<SetStateAction<activeSectionType>>;
}

export default function ServiceSidebarNavigation({
  mode,
  activeSection,
  setActiveSection,
}: ServiceSidebarNavigationProps) {
  const dispatch = useAppDispatch();
  const { width, isServiceSidebarOpen } = useAppSelector(
    (state) => state.variables
  );

  // Sections list - include settings only for create mode
  const sections: (SectionType | "settings" | "form")[] =
    mode === "create"
      ? [
          "settings",
          "hero_section",
          "gallery_images",
          "problem_section",
          "solution_section",
          "stats",
          "testimonials",
          "cta",
          "form",
        ]
      : [
          "settings",
          "hero_section",
          "gallery_images",
          "problem_section",
          "solution_section",
          "stats",
          "testimonials",
          "cta",
          "form",
          "contact_messages",
        ];

  useEffect(() => {
    if (width > 1024) {
      dispatch(setIsServiceSidebarOpen(true));
    }
  }, [width]);

  return (
    <AnimatePresence>
      {isServiceSidebarOpen && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
          className="lg:w-64 lg:h-fit md:w-1/2 w-3/4 h-screen max-lg:fixed max-lg:top-0 max-lg:right-0 max-lg:z-99999 shrink-0"
        >
          <div
            className="w-full h-screen bg-black/50 fixed top-0 right-0 z-99 lg:hidden"
            onClick={() => dispatch(setIsServiceSidebarOpen(false))}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white lg:rounded-2xl p-4 shadow-sm border border-gray-100 sticky top-24 max-lg:z-9999"
          >
            <h3 className="text-sm font-medium text-gray-500 mb-4 px-2 hidden lg:block">
              أقسام الصفحة
            </h3>
            <FaTimes
              onClick={() => dispatch(setIsServiceSidebarOpen(false))}
              className="text-red-400 cursor-pointer lg:hidden"
            />
            <nav className="space-y-1 max-lg:h-screen overflow-y-auto">
              {sections.map((section) => {
                const Icon = SECTION_ICONS[section];
                const isActive = activeSection === section;
                const label =
                  section === "settings"
                    ? { ar: "الإعدادات الأساسية", en: "Basic Settings" }
                    : section === "form"
                    ? { ar: "نموذج الطلب", en: "Order Form" }
                    : SECTION_LABELS[section as SectionType];

                return (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right transition-all ${
                      isActive
                        ? "bg-primary text-white shadow-lg shadow-primary/25"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isActive ? "bg-white/20" : SECTION_COLORS[section]
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <span className="font-medium">{label.ar}</span>
                  </button>
                );
              })}
            </nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
