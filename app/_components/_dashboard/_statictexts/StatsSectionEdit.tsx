// Stats Section
"use client";
import { useState } from "react";
import { toast } from "sonner";
import SectionCard from "./SectionCard";
import EditableText from "./EditableText";
import { instance } from "@/app/_helpers/axios";
import EditTextPopup from "../../_popups/EditTextPopup";
import IconPicker from "../IconPicker";
import { getIconComponent } from "@/app/_helpers/helpers";

export interface statsHeaderType {
  column_1: TextType;
  column_2: TextType;
  column_3: TextType;
  column_4: StatsItem[];
}

interface props {
  data: statsHeaderType;
}

export default function StatsSectionEdit({ data }: props) {
  const [loading, setLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [selectedText, setSelectedText] = useState<TextType>({
    en: "",
    ar: "",
  });
  const [fieldType, setFieldType] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [badge, setBadge] = useState<TextType>({
    en: data.column_1.en,
    ar: data.column_1.ar,
  });
  const [title, setTitle] = useState<TextType>({
    en: data.column_2.en,
    ar: data.column_2.ar,
  });
  const [subtitle, setSubtitle] = useState<TextType>({
    en: data.column_3.en,
    ar: data.column_3.ar,
  });
  const [items, setItems] = useState<StatsItem[]>(data.column_4 ?? []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("column_1", JSON.stringify(badge));
      formData.append("column_2", JSON.stringify(title));
      formData.append("column_3", JSON.stringify(subtitle));
      formData.append("column_4", JSON.stringify(items));
      await instance.post(`/update-variable-data?id=4&limit=5`, formData);
      toast.success("تم حفظ قسم الإحصائيات بنجاح");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectText = (
    type: string,
    text: TextType,
    index: number | null = null
  ) => {
    setSelectedText(text);
    setFieldType(type);
    setEditingIndex(index);
    setIsPopupOpen(true);
  };

  const handleInputChange = (name: string, value: string | number) => {
    if (fieldType.includes("_value")) {
      setSelectedText((prev) => ({ ...prev, en: String(value) }));
    } else {
      const lang = name.endsWith("_en") ? "en" : "ar";
      setSelectedText((prev) => ({ ...prev, [lang]: String(value) }));
    }
  };

  const handleSaveChanges = () => {
    switch (fieldType) {
      case "badge":
        setBadge(selectedText);
        break;
      case "title":
        setTitle(selectedText);
        break;
      case "subtitle":
        setSubtitle(selectedText);
        break;
      case "item_value":
        if (editingIndex !== null) {
          setItems((prev) => {
            const updated = [...prev];
            updated[editingIndex].value = parseInt(selectedText.en) || 0;
            return updated;
          });
        }
        break;
      case "item_label":
        if (editingIndex !== null) {
          setItems((prev) => {
            const updated = [...prev];
            updated[editingIndex].label = selectedText;
            return updated;
          });
        }
        break;
    }
    setIsPopupOpen(false);
  };

  const handleIconChange = (iconName: string) => {
    if (editingIndex !== null) {
      setItems((prev) => {
        const updated = [...prev];
        updated[editingIndex].icon_name = iconName;
        return updated;
      });
    }
    setShowIconPicker(false);
  };

  const handleEditIcon = (index: number) => {
    setEditingIndex(index);
    setShowIconPicker(true);
  };

  const inputs = fieldType.includes("_value")
    ? [
        {
          name: "value",
          label: "القيمة",
          value: selectedText.en,
          type: "short-text",
        },
      ]
    : [
        {
          name: "text_en",
          label: "النص (EN)",
          value: selectedText.en,
          type: "short-text",
        },
        {
          name: "text_ar",
          label: "النص (AR)",
          value: selectedText.ar,
          type: "short-text",
        },
      ];

  return (
    <>
      <SectionCard
        title="قسم الإحصائيات (Stats Section)"
        onSave={handleSave}
        loading={loading}
      >
        <div className="space-y-4">
          <EditableText
            label="الشارة"
            value={`${badge.ar} / ${badge.en}`}
            onClick={() => handleSelectText("badge", badge)}
          />
          <EditableText
            label="العنوان"
            value={`${title.ar} / ${title.en}`}
            onClick={() => handleSelectText("title", title)}
          />
          <EditableText
            label="الوصف الفرعي"
            value={subtitle.ar}
            onClick={() => handleSelectText("subtitle", subtitle)}
          />

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              عناصر الإحصائيات
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {items.map((item, index) => {
                const IconComponent = getIconComponent(item.icon_name);
                return (
                  <div
                    key={item.key}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                  >
                    {/* Icon Edit */}
                    <div
                      onClick={() => handleEditIcon(index)}
                      className="cursor-pointer hover:bg-white p-2 rounded-lg transition-all group flex items-center gap-3 mb-2"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        {IconComponent && (
                          <IconComponent className="text-xl text-primary" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 block">
                          الأيقونة
                        </span>
                        <span className="text-xs text-gray-600">
                          {item.icon_name}
                        </span>
                      </div>
                    </div>

                    {/* Value Edit */}
                    <div
                      onClick={() =>
                        handleSelectText(
                          "item_value",
                          { en: String(item.value), ar: String(item.value) },
                          index
                        )
                      }
                      className="cursor-pointer hover:bg-white p-2 rounded-lg transition-all"
                    >
                      <span className="text-xs text-gray-500 block">
                        القيمة
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        {item.value}
                        {item.suffix}
                      </span>
                    </div>

                    {/* Label Edit */}
                    <div
                      onClick={() =>
                        handleSelectText("item_label", item.label, index)
                      }
                      className="cursor-pointer hover:bg-white p-2 rounded-lg transition-all mt-2"
                    >
                      <span className="text-xs text-gray-500 block">
                        التسمية
                      </span>
                      <span className="text-sm text-gray-700">
                        {item.label.ar} / {item.label.en}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SectionCard>

      <EditTextPopup
        showPopup={isPopupOpen}
        loadingState={loading}
        operationType="edit"
        inputs={inputs}
        onChange={handleInputChange}
        onClose={() => setIsPopupOpen(false)}
        onSave={handleSaveChanges}
      />

      <IconPicker
        show={showIconPicker}
        onClose={() => setShowIconPicker(false)}
        selectedIcon={
          editingIndex !== null ? items[editingIndex]?.icon_name : ""
        }
        onChange={handleIconChange}
      />
    </>
  );
}
