// Cards Header Section
"use client";
import { useState } from "react";
import { toast } from "sonner";
import SectionCard from "./SectionCard";
import EditableText from "./EditableText";
import { instance } from "@/app/_helpers/axios";
import FeatureEditCard from "./FeatureEditCard";
import EditTextPopup from "../../_popups/EditTextPopup";
import IconPicker from "../IconPicker";

export interface cardsHeaderType {
  column_1: TextType;
  column_2: TextType;
  column_3: TextType;
  column_4: CardsFeature[];
}

interface props {
  data: cardsHeaderType;
}

export default function CardsHeaderSection({ data }: props) {
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
  const [features, setFeatures] = useState<CardsFeature[]>(data.column_4 ?? []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("column_1", JSON.stringify(badge));
      formData.append("column_2", JSON.stringify(title));
      formData.append("column_3", JSON.stringify(subtitle));
      formData.append("column_4", JSON.stringify(features));
      await instance.post(`/update-variable-data?id=1&limit=5`, formData);
      toast.success("تم حفظ قسم البطاقات بنجاح");
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
    const lang = name.endsWith("_en") ? "en" : "ar";
    setSelectedText((prev) => ({ ...prev, [lang]: String(value) }));
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
      case "feature_text":
        if (editingIndex !== null) {
          setFeatures((prev) => {
            const updated = [...prev];
            updated[editingIndex].text = selectedText;
            return updated;
          });
        }
        break;
    }
    setIsPopupOpen(false);
  };

  const handleIconChange = (iconName: string) => {
    if (editingIndex !== null) {
      setFeatures((prev) => {
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

  const inputs = [
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
        title="قسم البطاقات (Cards Header Section)"
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
            label="الوصف"
            value={subtitle.ar}
            onClick={() => handleSelectText("subtitle", subtitle)}
          />

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              المميزات
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <FeatureEditCard
                  key={index}
                  feature={feature}
                  onEditText={() =>
                    handleSelectText("feature_text", feature.text, index)
                  }
                  onEditIcon={() => handleEditIcon(index)}
                />
              ))}
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
          editingIndex !== null ? features[editingIndex]?.icon_name : ""
        }
        onChange={handleIconChange}
      />
    </>
  );
}
