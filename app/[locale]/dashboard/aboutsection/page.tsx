"use client";

import type React from "react";
import { motion } from "framer-motion";
import Img from "@/app/_components/_website/_global/Img";
import EditTextPopup from "@/app/_components/_popups/EditTextPopup";
import { useState, useMemo, useRef, useEffect } from "react";
import IconPicker from "@/app/_components/_dashboard/IconPicker";
import { getIconComponent } from "@/app/_helpers/helpers";
import { IoMdInformationCircle } from "react-icons/io";
import useFetchData from "@/app/_helpers/FetchDataWithAxios";
import { toast } from "sonner";
import LoadingSpin from "@/app/_components/LoadingSpin";
import { instance } from "@/app/_helpers/axios";
import { VscLoading } from "react-icons/vsc";

export interface feature {
  en: string;
  ar: string;
  icon_name: string;
}

export default function AboutSection() {
  const { data, loading } = useFetchData<any>(
    `/get-section/2?limit_number=4`,
    false
  );

  const imageRef = useRef<HTMLInputElement>(null);

  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState<
    number | null
  >(null);
  const [selectedText, setSelectedText] = useState({ en: "", ar: "" });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [updateloading, setUpdateLoading] = useState(false);
  const [filedType, setFiledType] = useState<
    "title" | "subTitle" | "description" | ""
  >("");
  const [mainImage, SetMainImage] = useState<File | string>("");
  const [texts, setTexts] = useState({
    title: { en: "", ar: "" },
    subTitle: { en: "", ar: "" },
    description: { en: "", ar: "" },
  });
  const [features, setFeatures] = useState<feature[]>([]);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState<number | null>(
    null
  );

  const handleShowIconPicker = (index: number) => {
    setActiveFeatureIndex(index);
    setShowIconPicker(true);
  };

  const handleSelectFeature = (feature: feature, index: number) => {
    setSelectedFeature(feature);
    setSelectedFeatureIndex(index);
  };

  // Handle image input
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      SetMainImage(files[0]);
    }
  };

  // 2) inputs للميزة المختارة
  const featureInputs = useMemo(() => {
    if (!selectedFeature) return [];
    return [
      {
        name: "en",
        label: "Feature (EN)",
        value: selectedFeature.en,
        type: "short-text",
      },
      {
        name: "ar",
        label: "الميزة (AR)",
        value: selectedFeature.ar,
        type: "short-text",
      },
    ];
  }, [selectedFeature]);

  // 3) onChange لتحديث قيم الميزة داخل الـ Popup
  const handleFeatureInputChange = (name: string, value: string | number) => {
    if (!selectedFeature) return;
    const v = String(value);
    setSelectedFeature((prev) => {
      if (!prev) return prev;
      if (name == "en") return { ...prev, en: v };
      if (name == "ar") return { ...prev, ar: v };
      return prev;
    });
  };

  // Handle feature icon change
  const handleFeatureIconChange = (iconName: string) => {
    if (activeFeatureIndex !== null) {
      setFeatures((prev) => {
        const updated = [...prev];
        updated[activeFeatureIndex].icon_name = iconName;
        return updated;
      });
    }
    setShowIconPicker(false);
  };

  // Handle text input change inside popup
  const handleInputChange = (name: string, value: string | number) => {
    const lang = name.endsWith("_en") ? "en" : "ar";
    setSelectedText((prev) => ({
      ...prev,
      [lang]: value,
    }));
  };

  // Generate inputs dynamically for EditTextPopup
  const inputs = useMemo(() => {
    const fieldConfig: Record<
      string,
      { label: string; type: "short-text" | "long-text" }
    > = {
      title: { label: "العنوان", type: "short-text" },
      subTitle: { label: "النص الفرعي", type: "short-text" },
      description: { label: "الوصف", type: "long-text" },
    };

    const config = fieldConfig[filedType];
    if (!config) return [];

    return ["en", "ar"].map((lang) => ({
      name: `${filedType}_${lang}`,
      value: selectedText[lang as "en" | "ar"],
      type: config.type,
      label: `${config.label} (${lang.toUpperCase()})`,
    }));
  }, [filedType, selectedText]);

  // When user clicks on a text
  const handleSelectText = (
    type: "title" | "subTitle" | "description",
    text: { en: string; ar: string }
  ) => {
    setSelectedText(text);
    setFiledType(type);
    setIsPopupOpen(true);
  };

  // Save changes to local state
  const handleSaveChanges = () => {
    if (!filedType) return;

    setTexts((prev) => ({
      ...prev,
      [filedType]: {
        en: selectedText.en,
        ar: selectedText.ar,
      },
    }));

    setIsPopupOpen(false);
  };

  // Save changes to local state
  const handleSaveFeature = () => {
    if (!selectedFeature || selectedFeatureIndex === null) return;

    setFeatures((prev) => {
      const copy = [...prev];
      copy[selectedFeatureIndex] = {
        ...selectedFeature, // en + ar + icon_name
      };
      return copy;
    });

    setSelectedFeature(null);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // Check if required fields are empty
      if (
        !texts.title?.en?.trim() ||
        !texts.title?.ar?.trim() ||
        !texts.subTitle?.en?.trim() ||
        !texts.subTitle?.ar?.trim() ||
        !texts.description?.en?.trim() ||
        !texts.description?.ar?.trim() ||
        !Array.isArray(features) ||
        features.length === 0
      ) {
        toast.error("الرجاء ملء جميع الحقول المطلوبة قبل الحفظ");
        return; // stop submit
      }
      setUpdateLoading(true);
      const formData = new FormData();
      formData.append("column_1", JSON.stringify(texts.title));
      formData.append("column_2", JSON.stringify(texts.subTitle));
      formData.append("column_3", JSON.stringify(texts.description));
      formData.append("column_4", JSON.stringify(features));
      if (mainImage instanceof File) {
        formData.append("image", mainImage);
      }
      const response = await instance.post(
        `/update-section/2?limit_number=4`,
        formData
      );

      if (response.status == 200) {
        toast.success("تم تحديث قسم عن الشركة بنجاح .");
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message || "حدث خطأ أثناء إرسال طلب التحديث";
      toast.error(message);
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      setTexts({
        title: data.column_1,
        subTitle: data.column_2,
        description: data.column_3,
      });
      setFeatures(data.column_4);

      SetMainImage(data.image);
    }
  }, [data]);

  if (loading) return <LoadingSpin />;

  return (
    <>
      <section className="py-16 px-4  min-h-[70vh] c-container">
        {/* main image input */}
        <input
          ref={imageRef}
          name="image"
          onChange={handleImageChange}
          type="file"
          hidden
        />
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2
                onClick={() => handleSelectText("title", texts.title)}
                className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-balance select-effect cursor-pointer"
              >
                {texts.title.en || "Click to edit Title"}
              </h2>

              <p
                onClick={() => handleSelectText("subTitle", texts.subTitle)}
                className="text-xl text-gray-600 mb-6 text-pretty select-effect cursor-pointer"
              >
                {texts.subTitle.en || "Click to edit SubTitle"}
              </p>

              <p
                onClick={() =>
                  handleSelectText("description", texts.description)
                }
                className="text-gray-700 mb-8 leading-relaxed text-pretty select-effect cursor-pointer"
              >
                {texts.description.en || "Click to edit Description"}
              </p>

              {/* Features List */}
              <div className="space-y-4">
                {features.map((feature, index) => {
                  const Icon =
                    getIconComponent(feature.icon_name) ||
                    IoMdInformationCircle;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3"
                    >
                      <div
                        className="flex-shrink-0 select-effect w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition"
                        onClick={() => handleShowIconPicker(index)}
                      >
                        <Icon className="w-4 h-4 text-blue-600 " />
                      </div>
                      <span
                        onClick={() => handleSelectFeature(feature, index)}
                        className="text-gray-700 font-medium cursor-pointer select-effect"
                      >
                        {feature.ar}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Right Side Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div
                onClick={() => imageRef.current?.click()}
                className="relative select-effect overflow-hidden  cursor-pointer"
              >
                <Img
                  src={
                    mainImage instanceof File
                      ? URL.createObjectURL(mainImage)
                      : (mainImage as string) || "/about-img.png"
                  }
                  alt="About us"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Popup Component */}
        <EditTextPopup
          loadingState={updateloading}
          operationType={"edit"}
          onSave={handleSaveChanges}
          showPopup={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          inputs={inputs}
          onChange={handleInputChange}
        />

        {/* Popup Component for feature editing */}
        {selectedFeature && selectedFeatureIndex !== null && (
          <EditTextPopup
            loadingState={updateloading}
            showPopup={true}
            operationType={"edit"}
            inputs={featureInputs}
            onChange={handleFeatureInputChange}
            onClose={() => setSelectedFeature(null)}
            onSave={handleSaveFeature}
          />
        )}

        {/* Icon Picker */}
        <IconPicker
          show={showIconPicker}
          onClose={() => setShowIconPicker(false)}
          selectedIcon={features[activeFeatureIndex || 0]?.icon_name}
          onChange={handleFeatureIconChange}
        />
      </section>
      <button
        onClick={handleSubmit}
        className=" max-md:w-1/2 w-3/4 lg:w-1/4 mx-auto flex items-center justify-center p-2 bg-primary rounded-lg text-white text-center hover:bg-orange-500 duration-200"
      >
        {updateloading ? <VscLoading className="animate-spin size-6" /> : "حفظ"}
      </button>
    </>
  );
}
