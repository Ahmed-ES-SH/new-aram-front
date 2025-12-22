// Organizations Section
"use client";
import { useState } from "react";
import { instance } from "@/app/_helpers/axios";
import { toast } from "sonner";
import SectionCard from "./SectionCard";
import StatEditCard from "./StatEditCard";
import EditTextPopup from "../../_popups/EditTextPopup";
import EditableText from "./EditableText";

export interface OrganizationsHeaderType {
  column_4: TextType;
  column_2: TextType;
  column_3: TextType;
  column_1: StatItem[];
}

interface props {
  data: OrganizationsHeaderType;
}

export default function OrganizationsEditSection({ data }: props) {
  const [loading, setLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedText, setSelectedText] = useState<TextType>({
    en: "",
    ar: "",
  });
  // Mock data matching SectionContainer.tsx (Organizations section)
  const [badge, setBadge] = useState<TextType>({
    en: data.column_2.en,
    ar: data.column_2.ar,
  });
  const [title, setTitle] = useState<TextType>({
    en: data.column_3.en,
    ar: data.column_3.ar,
  });
  const [subtitle, setSubtitle] = useState<TextType>({
    en: data.column_4.en,
    ar: data.column_4.ar,
  });
  const [fieldType, setFieldType] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [stats, setStats] = useState<StatItem[]>(data.column_1 ?? []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("column_2", JSON.stringify(badge));
      formData.append("column_3", JSON.stringify(title));
      formData.append("column_4", JSON.stringify(subtitle));
      formData.append("column_1", JSON.stringify(stats));
      await instance.post(`/update-variable-data?id=2&limit=5`, formData);
      toast.success("تم حفظ قسم المراكز بنجاح");
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
    if (fieldType === "value") {
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
      case "value":
        if (editingIndex !== null) {
          setStats((prev) => {
            const updated = [...prev];
            updated[editingIndex].value = selectedText.en;
            return updated;
          });
        }
        break;
      case "label":
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

  const inputs =
    fieldType === "value"
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
        title="قسم المراكز (Organizations Section)"
        onSave={handleSave}
        loading={loading}
      >
        <div className="space-y-4 pb-4">
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
            label="الوصف"
            value={subtitle.ar}
            onClick={() => handleSelectText("subtitle", subtitle)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <StatEditCard
              key={index}
              stat={stat}
              onEditValue={() =>
                handleSelectText(
                  "value",
                  { en: stat.value, ar: stat.value },
                  index
                )
              }
              onEditLabel={() => handleSelectText("label", stat.label, index)}
            />
          ))}
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
    </>
  );
}
