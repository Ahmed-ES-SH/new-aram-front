// Services Section
"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { instance } from "@/app/_helpers/axios";
import SectionCard from "./SectionCard";
import EditableText from "./EditableText";
import EditTextPopup from "../../_popups/EditTextPopup";
import { getIconComponent } from "@/app/_helpers/helpers";
import IconPicker from "../IconPicker";

export interface servicesHeaderType {
  column_1: TextType;
  column_2: TextType;
  column_3: TextType;
  column_4: TextType;
  column_5: ServicesStat[];
}

interface props {
  data: servicesHeaderType;
}

export default function ServicesEditSection({ data }: props) {
  const [loading, setLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedText, setSelectedText] = useState<TextType>({
    en: "",
    ar: "",
  });
  const [showIconPicker, setShowIconPicker] = useState(false);
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
  const [titleHighlight, setTitleHighlight] = useState<TextType>({
    en: data.column_3.en,
    ar: data.column_3.ar,
  });
  const [subtitle, setSubtitle] = useState<TextType>({
    en: data.column_4.en,
    ar: data.column_4.ar,
  });

  const [stats, setStats] = useState<ServicesStat[]>(data.column_5 ?? []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("column_1", JSON.stringify(badge));
      formData.append("column_2", JSON.stringify(title));
      formData.append("column_3", JSON.stringify(titleHighlight));
      formData.append("column_4", JSON.stringify(subtitle));
      formData.append("column_5", JSON.stringify(stats));
      const response = await instance.post(
        `/update-variable-data?id=3&limit=5`,
        formData
      );
      if (response.status == 200) {
        toast.success("تم حفظ قسم الخدمات بنجاح");
      }
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
      case "title_highlight":
        setTitleHighlight(selectedText);
        break;
      case "subtitle":
        setSubtitle(selectedText);
        break;
      case "stat_value":
        if (editingIndex !== null) {
          setStats((prev) => {
            const updated = [...prev];
            updated[editingIndex].value = selectedText.en;
            return updated;
          });
        }
        break;
      case "stat_label":
        if (editingIndex !== null) {
          setStats((prev) => {
            const updated = [...prev];
            updated[editingIndex].label = selectedText;
            return updated;
          });
        }
        break;
    }
    setIsPopupOpen(false);
  };

  const handleEditIcon = (index: number) => {
    setEditingIndex(index);
    setShowIconPicker(true);
  };

  const handleIconChange = (iconName: string) => {
    if (editingIndex !== null) {
      setStats((prev) => {
        const updated = [...prev];
        updated[editingIndex].icon_name = iconName;
        return updated;
      });
    }
    setShowIconPicker(false);
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
        title="قسم الخدمات (Services Section)"
        onSave={handleSave}
        loading={loading}
      >
        <div className="space-y-4">
          <EditableText
            label="الشارة (Badge)"
            value={`${badge.ar} / ${badge.en}`}
            onClick={() => handleSelectText("badge", badge)}
          />
          <EditableText
            label="العنوان"
            value={`${title.ar} / ${title.en}`}
            onClick={() => handleSelectText("title", title)}
          />
          <EditableText
            label="العنوان المميز"
            value={`${titleHighlight.ar} / ${titleHighlight.en}`}
            onClick={() => handleSelectText("title_highlight", titleHighlight)}
          />
          <EditableText
            label="الوصف"
            value={subtitle.ar}
            onClick={() => handleSelectText("subtitle", subtitle)}
          />

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              إحصائيات الخدمات
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.map((stat, index) => {
                const IconComponent = getIconComponent(stat.icon_name);
                return (
                  <div
                    key={index}
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
                          {stat.icon_name}
                        </span>
                      </div>
                    </div>
                    <div
                      onClick={() =>
                        handleSelectText(
                          "stat_value",
                          { en: stat.value, ar: stat.value },
                          index
                        )
                      }
                      className="cursor-pointer hover:bg-white p-2 rounded-lg transition-all"
                    >
                      <span className="text-xs text-gray-500 block">
                        القيمة
                      </span>
                      <span className="text-xl font-bold text-primary">
                        {stat.value}
                      </span>
                    </div>
                    <div
                      onClick={() =>
                        handleSelectText("stat_label", stat.label, index)
                      }
                      className="cursor-pointer hover:bg-white p-2 rounded-lg transition-all mt-2"
                    >
                      <span className="text-xs text-gray-500 block">
                        التسمية
                      </span>
                      <span className="text-sm text-gray-700">
                        {stat.label.ar} / {stat.label.en}
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
          editingIndex !== null ? stats[editingIndex]?.icon_name : ""
        }
        onChange={handleIconChange}
      />
    </>
  );
}
