"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import ProfileHeader from "./ProfileHeader";
import BookingSettings from "./BookingSettings";
import OrganizationInfo from "./OrganizationInfo";
import { instance } from "@/app/_helpers/axios";
import { Organization } from "@/app/_components/_dashboard/_organizations/types/organization";
import { category } from "@/app/types/_dashboard/GlobalTypes";
import OrganizationSecializations from "./OrganizationSecializations";

interface OrganizationProfileProps {
  organization: Organization;
  categories: category[];
  subCategories: category[];
}

export default function OrganizationProfile({
  organization,
  categories,
  subCategories,
}: OrganizationProfileProps) {
  const t = useTranslations("organizationProfile");

  // State management
  const [activeTab, setActiveTab] = useState<
    "booking" | "info" | "subcategories"
  >("booking");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Initialize form data with organization data (excluding non-editable fields)
  const [formData, setFormData] = useState<Partial<Organization>>({
    password: "",
  });

  // Handle field changes
  const handleFieldChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setMessage(null);

      const updatedData = new FormData();
      // Define excluded fields
      const excludedFields = [
        "order",
        "rating",
        "status",
        "verification_code",
        "email_verified",
        "active",
        "is_signed",
        "number_of_reservations",
        "category_id",
      ];

      // Loop through the state and append editable fields
      Object.entries(formData).forEach(([key, value]) => {
        // Skip excluded fields
        if (excludedFields.includes(key)) return;

        // Handle files (logo, image)
        if (key === "logo" || key === "image") {
          if (value instanceof File) {
            updatedData.append(key, value);
          }
          return;
        }

        // Handle array relations: categories, sub_categories, keywords
        if (["categories", "sub_categories", "keywords"].includes(key)) {
          const ids = (value as []).map((item: any) => item.id);
          updatedData.append(key, JSON.stringify(ids));
          return;
        }

        // Handle objects like location
        if (key === "location") {
          updatedData.append(key, JSON.stringify(value));
          return;
        }

        // Handle benefits array
        if (key === "benefits") {
          updatedData.append(key, JSON.stringify(value));
          return;
        }

        // ✅ Handle boolean values (convert true/false → 1/0)
        if (typeof value === "boolean") {
          updatedData.append(key, value ? "1" : "0");
          return;
        }

        // Default case: append primitive value
        if (value !== null && value !== undefined) {
          updatedData.append(key, String(value));
        }
      });

      // Send form updatedData to backend
      const response = await instance.post(
        `/update-organization/${organization.id}`,
        updatedData
      );

      if (response.status === 200) {
        setMessage({
          type: "success",
          text: t("common.success"),
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage({
        type: "error",
        text: t("common.error"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData(organization);
    setMessage(null);
  };

  const handleBenfitChange = (items) => {
    setFormData({ ...formData, benefits: items });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, coulmnName) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData({ ...formData, [coulmnName]: files[0] });
    }
  };

  // Tab content animation variants
  const tabContentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  useEffect(() => {
    if (organization) {
      setFormData(organization);
    }
  }, [organization]);

  return (
    <div className="min-h-screen mt-4 lg:p-4 p-2">
      <div className="w-full">
        {/* Header */}
        <ProfileHeader activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="min-h-[70vh]"
            transition={{ duration: 0.3 }}
          >
            {activeTab === "booking" && (
              <BookingSettings
                setFormData={setFormData}
                formData={formData}
                onChange={handleFieldChange}
              />
            )}

            {activeTab === "info" && (
              <OrganizationInfo
                formData={formData}
                setFormData={setFormData}
                onChange={handleFieldChange}
                onFileChange={handleFileChange}
                onBenfitChange={handleBenfitChange}
              />
            )}

            {activeTab === "subcategories" && (
              <OrganizationSecializations
                formData={formData}
                setFormData={setFormData}
                allSubCategories={subCategories}
                allCategories={categories}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer with Actions */}
        <div className="border-t border-gray-200  px-6 py-4 flex justify-between items-center">
          <div>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`text-sm font-medium ${
                  message.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {message.text}
              </motion.div>
            )}
          </div>

          <div className="flex gap-3">
            <motion.button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {t("common.cancel")}
            </motion.button>
            <motion.button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2 text-white bg-primary rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? t("common.loading") : t("common.save")}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
