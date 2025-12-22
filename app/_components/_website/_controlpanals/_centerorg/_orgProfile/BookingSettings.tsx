"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import FormInput from "./FormInput";
import { FaCheck, FaClock, FaDollarSign } from "react-icons/fa";
import FormToggle from "./FormToggle";
import { Organization } from "@/app/_components/_dashboard/_organizations/types/organization";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import FormTextarea from "./FormTextarea";
import { CiBookmarkRemove } from "react-icons/ci";

interface BookingSettingsProps {
  formData: Partial<Organization>;
  setFormData: Dispatch<SetStateAction<Partial<Organization>>>;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function BookingSettings({
  formData,
  setFormData,
  onChange,
}: BookingSettingsProps) {
  const t = useTranslations("organizationProfile.bookingSettings");

  const openTimeField = {
    name: "open_at",
    value: formData.open_at,
    label: t("openTime"),
    icon: <FaClock />,
    type: "time",
    placeholder: "openTime",
  };

  const closeTimeField = {
    name: "close_at",
    value: formData.close_at,
    label: t("closeTime"),
    icon: <FaClock />,
    type: "time",
    placeholder: "closeTime",
  };

  const confirmationPriceField = {
    name: "confirmation_price",
    value: formData.confirmation_price,
    label: t("confirmationPrice"),
    icon: <FaDollarSign />,
    type: "number",
    placeholder: "confirmation Price ...",
  };

  const accaptableMessageField = {
    name: "accaptable_message",
    value: formData.accaptable_message,
    label: t("acceptableMessage"),
    icon: <FaCheck className="text-green-400" />,
    placeholder: "Accaptable Message ...",
  };

  const unacceptMessageField = {
    name: "unaccaptable_message",
    value: formData.unaccaptable_message,
    label: t("unacceptableMessage"),
    icon: <CiBookmarkRemove className="text-red-400" />,
    placeholder: "Unaccaptable Message ...",
  };

  const handleUpdateStatus = (fieldName, value) => {
    setFormData({ ...formData, [fieldName]: value });
  };

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

  return (
    <motion.div
      className="space-y-6 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-3">
        {/* Open Time */}
        <FormInput field={openTimeField} error={""} handleChange={onChange} />
        <FormInput field={closeTimeField} error={""} handleChange={onChange} />
      </div>
      <FormInput
        field={confirmationPriceField}
        error={""}
        handleChange={onChange}
      />

      <FormTextarea
        field={accaptableMessageField}
        handleChange={onChange}
        error=""
      />

      <FormTextarea
        field={unacceptMessageField}
        handleChange={onChange}
        error=""
      />

      <FormToggle
        status={formData.confirmation_status}
        name="confirmation_status"
        onUpdate={handleUpdateStatus}
        label={t("confirmationStatus")}
        enabledText={t("messages.confirmationStatus_enabled")}
        disabledText={t("messages.confirmationStatus_disabled")}
      />

      <FormToggle
        status={formData.booking_status}
        name="booking_status"
        onUpdate={handleUpdateStatus}
        label={t("bookingStatus")}
        enabledText={t("messages.bookingStatus_enabled")}
        disabledText={t("messages.bookingStatus_disabled")}
      />
    </motion.div>
  );
}
