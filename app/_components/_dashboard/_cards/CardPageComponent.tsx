"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaTrash,
  FaPlus,
  FaImage,
  FaVideo,
  FaCheck,
} from "react-icons/fa";
import Img from "../../_website/_global/Img";
import KeywordSelector from "../../_website/_global/KeywordSelector";

// Types
interface Benefit {
  id: number;
  title: string;
}

interface Keyword {
  id: number;
  title: string;
}

interface Category {
  id: number;
  title_en: string;
  title_ar: string;
  bg_color: string;
  icon_name: string;
}

interface CardData {
  id: number;
  title: string;
  description: string;
  duration: string;
  price: string;
  price_before_discount: string;
  number_of_promotional_purchases: number;
  services_count: number;
  image: string;
  active: number;
  category: Category;
  benefits: Benefit[];
  keywords: Keyword[];
}

// Mock Data
const initialCardData: CardData = {
  id: 2,
  title: "بطاقة الشعار الأساسية",
  description: "خدمة تصميم شعار بسيط وأنيق للشركات الناشئة.",
  duration: "18 شهر",
  price: "59.00",
  price_before_discount: "109.00",
  number_of_promotional_purchases: 95,
  services_count: 4,
  image: "http://127.0.0.1:8000/images/cards/card_1.jpg",
  active: 0,
  category: {
    id: 18,
    title_en: "Media",
    title_ar: "الإعلام",
    bg_color: "#13B95F",
    icon_name: "FaVideo",
  },
  benefits: [
    { id: 6, title: "توصيل سريع" },
    { id: 7, title: "دعم 24/7" },
    { id: 8, title: "جودة عالية" },
    { id: 9, title: "قابل للتخصيص" },
    { id: 10, title: "صديق للبيئة" },
  ],
  keywords: [
    { id: 193, title: "القانون التجاري" },
    { id: 263, title: "إدارة الموارد البشرية" },
  ],
};

// Image Uploader Component
const ImageUploader: React.FC<{
  currentImage: string;
  onImageChange: (newImage: string) => void;
  isEditMode: boolean;
}> = ({ currentImage, onImageChange, isEditMode }) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      className="relative group"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Img
        src={currentImage}
        alt="صورة البطاقة"
        className="w-full h-64 object-cover rounded-xl shadow-lg"
      />

      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center"
          >
            <label className="cursor-pointer bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4 hover:bg-opacity-30 transition-all duration-300">
              <FaImage className="text-white text-2xl" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Card Info Component
const CardInfo: React.FC<{
  cardData: CardData;
  isEditMode: boolean;
  onDataChange: (field: string, value: string) => void;
}> = ({ cardData, isEditMode, onDataChange }) => {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Category Badge */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium"
          style={{ backgroundColor: cardData.category.bg_color }}
        >
          <FaVideo className="text-sm" />
          <span>{cardData.category.title_ar}</span>
        </div>
        <span className="text-gray-500 text-sm">
          {cardData.services_count} خدمات
        </span>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          العنوان
        </label>
        {isEditMode ? (
          <motion.input
            type="text"
            value={cardData.title}
            onChange={(e) => onDataChange("title", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="أدخل العنوان"
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          />
        ) : (
          <motion.h1
            className="text-2xl font-bold text-gray-900"
            whileHover={{ scale: 1.01 }}
          >
            {cardData.title}
          </motion.h1>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          الوصف
        </label>
        {isEditMode ? (
          <motion.textarea
            value={cardData.description}
            onChange={(e) => onDataChange("description", e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            placeholder="أدخل الوصف"
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          />
        ) : (
          <motion.p
            className="text-gray-600 leading-relaxed"
            whileHover={{ scale: 1.005 }}
          >
            {cardData.description}
          </motion.p>
        )}
      </div>

      {/* Duration and Price Grid */}
      <div className="flex flex-col gap-3">
        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            المدة
          </label>
          {isEditMode ? (
            <motion.input
              type="text"
              value={cardData.duration}
              onChange={(e) => onDataChange("duration", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="أدخل المدة"
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            />
          ) : (
            <motion.p
              className="text-lg font-semibold text-gray-900 bg-gray-50 px-4 py-3 rounded-lg"
              whileHover={{ backgroundColor: "#f3f4f6" }}
            >
              {cardData.duration}
            </motion.p>
          )}
        </div>

        {/* Price Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            السعر
          </label>
          <div className="space-y-2">
            {isEditMode ? (
              <>
                <motion.input
                  type="text"
                  value={cardData.price}
                  onChange={(e) => onDataChange("price", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="السعر الحالي"
                  initial={{ scale: 0.98 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السعر قبل الخصم
                </label>
                <motion.input
                  type="text"
                  value={cardData.price_before_discount}
                  onChange={(e) =>
                    onDataChange("price_before_discount", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="السعر قبل الخصم"
                  initial={{ scale: 0.98 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.05 }}
                />
              </>
            ) : (
              <div className="p-2 flex flex-col gap-3">
                <motion.span
                  className="text-2xl font-bold bg-gray-50 px-4 py-3 w-full block rounded-lg text-green-600"
                  whileHover={{ scale: 1.05 }}
                >
                  {cardData.price} $
                </motion.span>
                <div className="">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    السعر قبل الخصم
                  </label>
                  <motion.span
                    className="text-2xl font-bold bg-gray-50 px-4 py-3 w-full block rounded-lg text-green-600"
                    whileHover={{ scale: 1.05 }}
                  >
                    {cardData.price_before_discount} $
                  </motion.span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Benefits List Component
const BenefitsList: React.FC<{
  benefits: Benefit[];
  isEditMode: boolean;
  onBenefitsChange: (benefits: Benefit[]) => void;
}> = ({ benefits, isEditMode, onBenefitsChange }) => {
  const [newBenefit, setNewBenefit] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const addBenefit = () => {
    if (newBenefit.trim()) {
      const newId = Math.max(...benefits.map((b) => b.id), 0) + 1;
      onBenefitsChange([...benefits, { id: newId, title: newBenefit.trim() }]);
      setNewBenefit("");
    }
  };

  const deleteBenefit = (id: number) => {
    onBenefitsChange(benefits.filter((b) => b.id !== id));
  };

  const startEditing = (benefit: Benefit) => {
    setEditingId(benefit.id);
    setEditingValue(benefit.title);
  };

  const saveEditing = () => {
    if (editingValue.trim() && editingId) {
      onBenefitsChange(
        benefits.map((b) =>
          b.id === editingId ? { ...b, title: editingValue.trim() } : b
        )
      );
      setEditingId(null);
      setEditingValue("");
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingValue("");
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between flex-col gap-4">
        <h3 className="text-lg font-semibold text-gray-900 self-start">
          المزايا
        </h3>
        {isEditMode && (
          <motion.div className="flex items-center w-full gap-2">
            <input
              type="text"
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
              placeholder="إضافة ميزة جديدة"
              className="px-3 py-2 outline-none flex-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              onKeyPress={(e) => e.key === "Enter" && addBenefit()}
            />
            <motion.button
              onClick={addBenefit}
              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus className="text-sm" />
            </motion.button>
          </motion.div>
        )}
      </div>

      <div className="flex flex-col  gap-3">
        <AnimatePresence>
          {benefits.map((benefit) => (
            <motion.div
              key={benefit.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg group"
            >
              <FaCheck className="text-green-500 text-sm flex-shrink-0" />

              {editingId === benefit.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === "Enter" && saveEditing()}
                    autoFocus
                  />
                  <motion.button
                    onClick={saveEditing}
                    className="p-1 text-green-600 hover:bg-green-100 rounded"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaCheck className="text-xs" />
                  </motion.button>
                  <motion.button
                    onClick={cancelEditing}
                    className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTimes className="text-xs" />
                  </motion.button>
                </div>
              ) : (
                <>
                  <span className="text-gray-700 text-sm flex-1">
                    {benefit.title}
                  </span>

                  {isEditMode && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <motion.button
                        onClick={() => startEditing(benefit)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaEdit className="text-xs" />
                      </motion.button>
                      <motion.button
                        onClick={() => deleteBenefit(benefit.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaTrash className="text-xs" />
                      </motion.button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const CardDetailsPage: React.FC = () => {
  const [cardData, setCardData] = useState<CardData>(initialCardData);
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalData, setOriginalData] = useState<CardData>(initialCardData);
  const [selectedKeywords, setSelectedKeywords] = useState<Keyword[]>(
    cardData.keywords || []
  );

  // Handlers
  const handleDataChange = (field: string, value: string) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (newImage: string) => {
    setCardData((prev) => ({ ...prev, image: newImage }));
  };

  const handleBenefitsChange = (newBenefits: Benefit[]) => {
    setCardData((prev) => ({ ...prev, benefits: newBenefits }));
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      setOriginalData(cardData);
      console.log("Saving data:", cardData);
    } else {
      setOriginalData(cardData);
    }
    setIsEditMode(!isEditMode);
  };

  const cancelEdit = () => {
    setCardData(originalData);
    setIsEditMode(false);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-8">
      <div className="lg:w-[90%] w-[98%] mx-auto px-4">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">تفاصيل البطاقة</h1>
            <p className="text-gray-600 mt-1">إدارة وتحرير بيانات البطاقة</p>
          </div>

          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              {isEditMode ? (
                <motion.div
                  key="edit-buttons"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3"
                >
                  <motion.button
                    onClick={toggleEditMode}
                    className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-lg"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaSave className="text-sm" />
                    <span>حفظ</span>
                  </motion.button>
                  <motion.button
                    onClick={cancelEdit}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 shadow-lg"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaTimes className="text-sm" />
                    <span>إلغاء</span>
                  </motion.button>
                </motion.div>
              ) : (
                <div className="flex items-center gap-3">
                  <motion.button
                    key="edit-button"
                    onClick={toggleEditMode}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-lg"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaEdit className="text-sm" />
                    <span>تحرير</span>
                  </motion.button>
                  <motion.button
                    key="edit-button"
                    onClick={toggleEditMode}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-lg"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaTrash className="text-sm" />
                    <span>حذف</span>
                  </motion.button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Section */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                صورة البطاقة
              </h2>
              <ImageUploader
                currentImage={cardData.image}
                onImageChange={handleImageChange}
                isEditMode={isEditMode}
              />
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Card Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <CardInfo
                cardData={cardData}
                isEditMode={isEditMode}
                onDataChange={handleDataChange}
              />
            </div>

            {/* Benefits and Keywords */}
            <div className="flex flex-col  gap-6">
              <div className="bg-white rounded-2xl p-6 w-full shadow-lg">
                <BenefitsList
                  benefits={cardData.benefits}
                  isEditMode={isEditMode}
                  onBenefitsChange={handleBenefitsChange}
                />
              </div>
              <div className="bg-white rounded-2xl p-6 w-full shadow-lg">
                <KeywordSelector
                  selectedKeywords={selectedKeywords}
                  setSelectedKeywords={setSelectedKeywords}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsPage;
