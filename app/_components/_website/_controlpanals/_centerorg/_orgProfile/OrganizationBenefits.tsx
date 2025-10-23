"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaEdit, FaCheck, FaPlus, FaTimes } from "react-icons/fa";
import { MdFeaturedPlayList } from "react-icons/md";
import { FiPlusSquare } from "react-icons/fi";
import { AiOutlineControl } from "react-icons/ai";
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

const OrganizationBenefitsSection: React.FC<OrganizationBenefitsProps> = ({
  benefits,
  onChange,
  t,
}) => {
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
    setNewBenefit("");
  };

  return (
    <div className="w-full  p-4 bg-white">
      {/* Header */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 w-full  min-h-32"
      >
        <AiOutlineControl className="lg:size-20 size-12" />
        {t("benefits")}
      </button>

      {/* Popup (Modal) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[99] backdrop-blur-md flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl w-[98%] mx-auto max-w-5xl lg:p-6 p-2 space-y-4 relative"
            >
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                <FaTimes size={18} />
              </button>

              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MdFeaturedPlayList className="text-primary" />
                {t("benefits")}
              </h2>

              {/* Benefits list */}
              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                <AnimatePresence>
                  {items.map((benefit) => (
                    <motion.div
                      key={benefit.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm"
                    >
                      {editingId === benefit.id ? (
                        <div className="flex items-center gap-1 max-md:flex-col max-md:items-start w-full">
                          <FormTextarea
                            field={{
                              name: "title",
                              value: benefit.title,
                              label: "",
                              icon: <MdFeaturedPlayList />,
                              placeholder: t("editBenefit"),
                            }}
                            error={""}
                            handleChange={(
                              e: React.ChangeEvent<HTMLTextAreaElement>
                            ) => handleEdit(benefit.id!, e.target.value)}
                          />
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-2 self-end bg-green-500 text-white rounded-lg hover:bg-green-600"
                          >
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="flex-1 text-gray-700">
                            {benefit.title}
                          </span>
                          <button
                            onClick={() => setEditingId(benefit.id!)}
                            className="p-2 text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(benefit.id!)}
                            className="p-2 text-red-600 hover:text-red-800"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Add new benefit */}
              <div className="flex items-center w-full gap-2 mt-4">
                <FormTextarea
                  field={{
                    name: "newBenefit",
                    value: newBenefit,
                    label: "",
                    icon: <FiPlusSquare />,
                    placeholder: t("addNewBenefit"),
                  }}
                  error={""}
                  handleChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNewBenefit(e.target.value)
                  }
                />
                <button
                  onClick={handleAdd}
                  className="p-2 h-full bg-primary text-white rounded-lg hover:bg-orange-600"
                >
                  <FaPlus />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrganizationBenefitsSection;
