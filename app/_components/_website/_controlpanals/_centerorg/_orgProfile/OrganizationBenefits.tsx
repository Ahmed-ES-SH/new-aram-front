"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaEdit, FaCheck, FaPlus, FaTimes } from "react-icons/fa";
import { MdFeaturedPlayList } from "react-icons/md";
import { FiPlusSquare } from "react-icons/fi";
import FormTextarea from "./FormTextarea";

interface Benefit {
  id?: number;
  title: string;
  organization_id?: number;
  created_at?: string;
  updated_at?: string;
}

interface OrganizationBenefitsProps {
  benefits: Benefit[] | undefined;
  onChange: (updatedBenefits: Benefit[]) => void;
  t: (key: string) => string;
}

export default function OrganizationBenefitsSection({
  benefits,
  onChange,
  t,
}: OrganizationBenefitsProps) {
  const [items, setItems] = useState<Benefit[]>(benefits ?? []);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newBenefit, setNewBenefit] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const handleEdit = (id: number, value: string) => {
    const updated = items.map((b) =>
      b.id === id ? { ...b, title: value } : b
    );
    setItems(updated);
    onChange(updated);
  };

  const handleDelete = (id: number) => {
    const updated = items.filter((b) => b.id !== id);
    setItems(updated);
    onChange(updated);
  };

  const handleAdd = () => {
    if (!newBenefit.trim()) return;
    const newItem = { id: Date.now(), title: newBenefit };
    const updated = [...items, newItem];
    setItems(updated);
    onChange(updated);
    setNewBenefit("benefits.");
  };

  return (
    <div className="w-full">
      {/* Trigger Button - Modern Card Style */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="w-full bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:border-primary hover:shadow-md transition-all group min-h-[160px]"
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <MdFeaturedPlayList className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800">
            {t("benefits.benefits")}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {items.length} {t("benefits.added_benefits")}
          </p>
        </div>
      </motion.button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MdFeaturedPlayList className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {t("benefits.benefits")}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {t("benefits.manage_benefits_desc")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {/* Body - Scrollable List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                <AnimatePresence mode="popLayout">
                  {items.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 flex flex-col items-center justify-center text-gray-400"
                    >
                      <MdFeaturedPlayList className="w-12 h-12 mb-3 opacity-20" />
                      <p>{t("benefits.no_benefits_yet")}</p>
                    </motion.div>
                  ) : (
                    items.map((benefit) => (
                      <motion.div
                        key={benefit.id}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className={`group rounded-xl border transition-all ${
                          editingId === benefit.id
                            ? "border-primary ring-1 ring-primary bg-primary/5"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                        }`}
                      >
                        {editingId === benefit.id ? (
                          <div className="p-3">
                            <FormTextarea
                              field={{
                                name: "title",
                                value: benefit.title,
                                label: "",
                                icon: <MdFeaturedPlayList />,
                                placeholder: t("benefits.editBenefit"),
                              }}
                              error={""}
                              handleChange={(
                                e: React.ChangeEvent<HTMLTextAreaElement>
                              ) => handleEdit(benefit.id!, e.target.value)}
                            />
                            <div className="flex justify-end mt-2">
                              <button
                                onClick={() => setEditingId(null)}
                                className="flex items-center gap-2 px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                              >
                                <FaCheck size={12} /> {t("benefits.save")}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-4 gap-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                              <span className="text-gray-700 font-medium wrap-break-words leading-relaxed text-sm">
                                {benefit.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => setEditingId(benefit.id!)}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title={t("benefits.edit")}
                              >
                                <FaEdit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(benefit.id!)}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title={t("benefits.delete")}
                              >
                                <FaTrash size={16} />
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Footer - Add New */}
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block px-1">
                  {t("benefits.add_new_benefit")}
                </label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <FormTextarea
                      field={{
                        name: "newBenefit",
                        value: newBenefit,
                        label: "",
                        icon: <FiPlusSquare />,
                        placeholder: t("benefits.type_benefit_here"),
                      }}
                      error={""}
                      handleChange={(
                        e: React.ChangeEvent<HTMLTextAreaElement>
                      ) => setNewBenefit(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleAdd}
                    disabled={!newBenefit.trim()}
                    className="self-start mt-0.5 p-3.5 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg shrink-0"
                  >
                    <FaPlus size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
