"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  FiPlus,
  FiTrash2,
  FiMove,
  FiSettings,
  FiCheck,
  FiX,
  FiEyeOff,
} from "react-icons/fi";

import { AVAILABLE_FORM_FIELDS } from "@/app/_components/_dynamicForm/types";
import {
  ServicePageData,
  FormField,
  LocalizedText,
  LocalizedTextObject,
} from "./types";

interface FormSchemaEditorProps {
  schema: ServicePageData["form"];
  onChange: (schema: ServicePageData["form"]) => void;
}

function getLocalizedText(
  text: LocalizedText | string | undefined,
  locale: "ar" | "en" = "ar"
): string {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[locale] || text.ar || text.en || "";
}

function getFieldTypeLabel(type: string): { ar: string; en: string } {
  const labels: Record<string, { ar: string; en: string }> = {
    text: { ar: "نص قصير", en: "Short Text" },
    textarea: { ar: "نص طويل", en: "Long Text" },
    email: { ar: "بريد إلكتروني", en: "Email" },
    phone: { ar: "رقم هاتف", en: "Phone" },
    number: { ar: "رقم", en: "Number" },
    date: { ar: "تاريخ", en: "Date" },
    time: { ar: "وقت", en: "Time" },
    select: { ar: "قائمة منسدلة", en: "Dropdown" },
    radio: { ar: "اختيار أحادي", en: "Radio" },
    checkbox: { ar: "مربع اختيار", en: "Checkbox" },
    file: { ar: "ملف", en: "File" },
    image: { ar: "صورة", en: "Image" },
    color: { ar: "لون", en: "Color" },
    url: { ar: "رابط", en: "URL" },
  };
  return labels[type] || { ar: type, en: type };
}

export default function FormSchemaEditor({
  schema,
  onChange,
}: FormSchemaEditorProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);

  // Add field from available fields
  const addField = useCallback(
    (templateField: Partial<FormField>) => {
      const newField: FormField = {
        ...templateField,
        id: `${templateField.id}_${Date.now()}`, // Ensure unique ID
        name: templateField.name || templateField.id || `field_${Date.now()}`,
        type: templateField.type || "text",
        label: templateField.label || { ar: "حقل جديد", en: "New Field" },
        placeholder: templateField.placeholder || { ar: "", en: "" },
        required: templateField.required || false,
        order: (schema.fields?.length || 0) + 1,
        options: templateField.options || [],
      } as FormField;

      onChange({
        ...schema,
        fields: [...(schema.fields || []), newField],
      });
      setShowAddModal(false);
    },
    [schema, onChange]
  );

  // Remove field
  const removeField = useCallback(
    (fieldId: string) => {
      onChange({
        ...schema,
        fields: schema.fields
          .filter((f) => f.id !== fieldId)
          .map((f, index) => ({ ...f, order: index + 1 })),
      });
    },
    [schema, onChange]
  );

  // Update field
  const updateField = useCallback(
    (fieldId: string, updates: Partial<FormField>) => {
      onChange({
        ...schema,
        fields: schema.fields.map((f) =>
          f.id === fieldId ? { ...f, ...updates } : f
        ),
      });
    },
    [schema, onChange]
  );

  // Reorder fields
  const handleReorder = useCallback(
    (newOrder: FormField[]) => {
      onChange({
        ...schema,
        fields: newOrder.map((f, index) => ({ ...f, order: index + 1 })),
      });
    },
    [schema, onChange]
  );

  // Toggle field required
  const toggleRequired = useCallback(
    (fieldId: string) => {
      const field = schema.fields.find((f) => f.id === fieldId);
      if (field) {
        updateField(fieldId, { required: !field.required });
      }
    },
    [schema.fields, updateField]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-900">منشئ النموذج</h2>
        <p className="text-sm text-gray-500 mt-1">
          قم بإضافة وتخصيص الحقول التي سيقوم العميل بملئها.
        </p>
      </div>

      {/* Add Field Button */}
      <button
        type="button"
        onClick={() => setShowAddModal(true)}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
      >
        <FiPlus size={18} />
        إضافة حقل جديد
      </button>

      {/* Fields List */}
      {schema.fields && schema.fields.length > 0 ? (
        <Reorder.Group
          axis="y"
          values={schema.fields}
          onReorder={handleReorder}
          className="space-y-3"
        >
          {schema.fields.map((field) => (
            <Reorder.Item
              key={field.id}
              value={field}
              className="bg-gray-50 rounded-xl p-4 cursor-move border border-gray-200"
            >
              <div className="flex items-center gap-4">
                {/* Drag Handle */}
                <div className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
                  <FiMove size={18} />
                </div>

                {/* Field Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {getLocalizedText(field.label)}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full">
                      {getFieldTypeLabel(field.type).ar}
                    </span>
                    {field.required && (
                      <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full">
                        مطلوب
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400 bg-gray-100 px-1 rounded">
                      Key: {field.name}
                    </span>
                    {field.placeholder && (
                      <span className="text-xs text-gray-400 truncate max-w-[200px]">
                        {getLocalizedText(field.placeholder)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleRequired(field.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      field.required
                        ? "text-red-600 hover:bg-red-50"
                        : "text-gray-400 hover:bg-gray-100"
                    }`}
                    title={field.required ? "إلغاء الإلزامية" : "جعله إلزامي"}
                  >
                    {field.required ? <FiCheck size={16} /> : <FiX size={16} />}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setEditingField(
                        editingField === field.id ? null : field.id
                      )
                    }
                    className={`p-2 rounded-lg transition-colors ${
                      editingField === field.id
                        ? "text-primary bg-primary/10"
                        : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    }`}
                    title="تعديل"
                  >
                    <FiSettings size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => removeField(field.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="حذف"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Edit Panel */}
              <AnimatePresence>
                {editingField === field.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Label AR */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          العنوان بالعربية
                        </label>
                        <input
                          type="text"
                          value={getLocalizedText(field.label, "ar")}
                          onChange={(e) =>
                            updateField(field.id, {
                              label: {
                                ...((typeof field.label === "object"
                                  ? field.label
                                  : { ar: "", en: "" }) as LocalizedTextObject),
                                ar: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>

                      {/* Label EN */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          العنوان بالإنجليزية
                        </label>
                        <input
                          type="text"
                          value={getLocalizedText(field.label, "en")}
                          onChange={(e) =>
                            updateField(field.id, {
                              label: {
                                ...((typeof field.label === "object"
                                  ? field.label
                                  : { ar: "", en: "" }) as LocalizedTextObject),
                                en: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          dir="ltr"
                        />
                      </div>

                      {/* Placeholder AR */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          نص تلميحي بالعربية
                        </label>
                        <input
                          type="text"
                          value={getLocalizedText(field.placeholder, "ar")}
                          onChange={(e) =>
                            updateField(field.id, {
                              placeholder: {
                                ...((typeof field.placeholder === "object"
                                  ? field.placeholder
                                  : { ar: "", en: "" }) as LocalizedTextObject),
                                ar: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>

                      {/* Placeholder EN */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          نص تلميحي بالإنجليزية
                        </label>
                        <input
                          type="text"
                          value={getLocalizedText(field.placeholder, "en")}
                          onChange={(e) =>
                            updateField(field.id, {
                              placeholder: {
                                ...((typeof field.placeholder === "object"
                                  ? field.placeholder
                                  : { ar: "", en: "" }) as LocalizedTextObject),
                                en: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          dir="ltr"
                        />
                      </div>

                      {/* Options (for select/radio) */}
                      {(field.type === "select" ||
                        field.type === "radio" ||
                        field.type === "checkbox") && (
                        <div className="col-span-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-medium text-gray-700">
                              الخيارات
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                const newOption = {
                                  value: `opt_${Date.now()}`,
                                  label: { ar: "خيار جديد", en: "New Option" },
                                };
                                updateField(field.id, {
                                  options: [
                                    ...(field.options || []),
                                    newOption,
                                  ],
                                });
                              }}
                              className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                              <FiPlus size={12} /> إضافة خيار
                            </button>
                          </div>

                          <div className="space-y-2">
                            {field.options?.map((opt, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="text"
                                  placeholder="قيمة (Value)"
                                  value={opt.value}
                                  onChange={(e) => {
                                    const newOpts = [...(field.options || [])];
                                    newOpts[idx].value = e.target.value;
                                    updateField(field.id, { options: newOpts });
                                  }}
                                  className="w-1/4 px-2 py-1 text-xs border rounded"
                                />
                                <input
                                  type="text"
                                  placeholder="AR Label"
                                  value={getLocalizedText(opt.label, "ar")}
                                  onChange={(e) => {
                                    const newOpts = [...(field.options || [])];
                                    newOpts[idx].label = {
                                      ...((typeof opt.label === "object"
                                        ? opt.label
                                        : {
                                            ar: "",
                                            en: "",
                                          }) as LocalizedTextObject),
                                      ar: e.target.value,
                                    };
                                    updateField(field.id, { options: newOpts });
                                  }}
                                  className="w-1/3 px-2 py-1 text-xs border rounded"
                                />
                                <input
                                  type="text"
                                  placeholder="EN Label"
                                  value={getLocalizedText(opt.label, "en")}
                                  onChange={(e) => {
                                    const newOpts = [...(field.options || [])];
                                    newOpts[idx].label = {
                                      ...((typeof opt.label === "object"
                                        ? opt.label
                                        : {
                                            ar: "",
                                            en: "",
                                          }) as LocalizedTextObject),
                                      en: e.target.value,
                                    };
                                    updateField(field.id, { options: newOpts });
                                  }}
                                  className="w-1/3 px-2 py-1 text-xs border rounded"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newOpts = (
                                      field.options || []
                                    ).filter((_, i) => i !== idx);
                                    updateField(field.id, { options: newOpts });
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <FiX size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      ) : (
        <div className="py-12 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
          <FiEyeOff className="mx-auto mb-3" size={32} />
          <p>لم تتم إضافة أي حقول بعد</p>
          <p className="text-sm mt-1">
            اضغط على "إضافة حقل جديد" لبدء تصميم النموذج
          </p>
        </div>
      )}

      {/* Add Field Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xl z-999999 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">اختر نوع الحقل</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {AVAILABLE_FORM_FIELDS.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => addField(template)}
                    className="p-4 bg-gray-50 hover:bg-primary/5 hover:border-primary border-2 border-transparent rounded-xl text-right transition-all flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="block font-medium text-gray-900">
                        {getLocalizedText(template.label)}
                      </span>
                      {/* Icons could go here */}
                    </div>
                    <span className="block text-xs text-gray-500">
                      {getFieldTypeLabel(template.type || "text").ar}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
