"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import FormInput from "./FormInput";
import {
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaAlignLeft,
  FaLock,
} from "react-icons/fa";
import FormTextarea from "./FormTextarea";
import LocationInput from "../../LocationInput";
import dynamic from "next/dynamic";
import OrganizationBenefits from "./OrganizationBenefits";
import KeywordSelector, { Keyword } from "../../../_global/KeywordSelector";
import { Organization } from "@/app/_components/_dashboard/_organizations/types/organization";
import ImageUpload from "./ImageUpload";
import ProfileImageUpload from "./ProfileImageUpload";

const MapSelector = dynamic(
  () => import("@/app/_components/_maps/MapSelector"),
  { ssr: false }
);

interface OrganizationInfoProps {
  formData: Partial<Organization>;
  setFormData: Dispatch<SetStateAction<Partial<Organization>>>;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>, columnName: string) => void;
  onBenfitChange: (items) => void;
}

export default function OrganizationInfo({
  formData,
  setFormData,
  onChange,
  onBenfitChange,
  onFileChange,
}: OrganizationInfoProps) {
  const t = useTranslations("organizationProfile.organizationInfo");
  const locale = useLocale() as "en" | "ar";

  const [mapOpen, setMapOpen] = useState(false);
  const [location, setLocation] = useState<any>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<Keyword[]>([]);

  // Animation variants for form fields
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // fields
  const organizationTitleField = {
    name: "title",
    value: formData.title,
    label: t("organizationTitle"),
    type: "text",
    icon: <FaBuilding />,
    placeholder: "organizationTitle",
  };

  const emailField = {
    name: "email",
    value: formData.email,
    label: t("email"),
    type: "email",
    icon: <FaEnvelope />,
    placeholder: "email",
  };

  const passwordField = {
    name: "password",
    value: formData.password,
    label: t("password"),
    type: "password",
    icon: <FaLock />,
    placeholder: "password....",
  };

  const phoneNumberField = {
    name: "phone_number",
    value: formData.phone_number,
    label: t("phoneNumber"),
    type: "tel",
    icon: <FaPhone />,
    placeholder: "phoneNumber",
  };

  const urlField = {
    name: "url",
    value: formData.url,
    label: t("url"),
    type: "url",
    icon: <FaGlobe />,
    placeholder: "url",
  };

  const descriptionField = {
    name: "description",
    value: formData.description,
    label: t("description"),
    icon: <FaAlignLeft />,
    placeholder: "description",
  };

  useEffect(() => {
    if (formData.location) {
      setLocation(formData.location);
    }

    if (formData.keywords && formData.keywords.length > 0) {
      setSelectedKeywords(formData.keywords);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (location) {
      setFormData((prev) => ({ ...prev, location }));
    }
  }, [location, setFormData]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, keywords: selectedKeywords }));
  }, [selectedKeywords, setFormData]);

  return (
    <motion.div
      className="space-y-6 lg:p-6 p-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* media section */}
      <div className="flex items-center justify-between max-md:flex-col gap-3 w-full relative">
        {/* Image Uploader */}
        <ImageUpload
          label={t("image")}
          hint={t("fields.image.hint")}
          src={formData.image as any}
          name="image"
          onChange={(e: any) => onFileChange(e, "image")}
          isRemovable={false}
        />

        <div className=" absolute bottom-1 left-2">
          <ProfileImageUpload
            src={formData.logo as any}
            name="logo"
            onChange={(e: any) => onFileChange(e, "logo")}
            isRemovable={false}
          />
        </div>
      </div>

      {/* Basic Information */}
      <FormInput
        field={organizationTitleField}
        error={""}
        handleChange={onChange}
      />

      <div className="flex items-center max-md:flex-col max-md:items-start gap-3 justify-between w-full">
        <FormInput field={emailField} error={""} handleChange={onChange} />
        <FormInput
          field={phoneNumberField}
          error={""}
          handleChange={onChange}
        />
      </div>

      <FormInput
        field={passwordField as any}
        error={""}
        handleChange={onChange}
      />

      <FormInput field={urlField} error={""} handleChange={onChange} />

      {/* Description */}
      <FormTextarea field={descriptionField} handleChange={onChange} error="" />

      <LocationInput location={location} setOpenMap={setMapOpen} error="" />

      <KeywordSelector
        selectedKeywords={selectedKeywords}
        setSelectedKeywords={setSelectedKeywords}
      />

      {/* Benefits */}
      <div className="flex items-center justify-between gap-2 w-full">
        <OrganizationBenefits
          benefits={formData.benefits}
          onChange={onBenfitChange}
          t={t}
        />
      </div>

      {/* map selector */}
      <MapSelector
        onClose={() => setMapOpen(false)}
        locale={locale}
        showMap={mapOpen}
        initialLocation={formData?.location}
        setLocation={setLocation}
      />
    </motion.div>
  );
}
