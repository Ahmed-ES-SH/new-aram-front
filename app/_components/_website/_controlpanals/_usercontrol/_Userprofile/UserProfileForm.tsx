"use client";
import countries from "@/app/constants/_website/countries";
import { useLocale } from "next-intl";
import React, { ChangeEvent } from "react";
import { FiUser, FiMail, FiPhone, FiGlobe, FiCalendar } from "react-icons/fi";
import { MdPassword } from "react-icons/md";
import { useTranslations } from "use-intl";
import LocationInput from "../../LocationInput";
import { FormInput } from "./FormInput";

export default function UserProfileForm({
  setFormData,
  formData,
  location,
  setOpenMap,
  errors,
}) {
  const locale = useLocale();
  const t = useTranslations("userProfile");

  const formFields = [
    {
      key: "name",
      label: t("fields.name"),
      icon: FiUser,
      value: formData.name,
      placeholder: t("placeholders.name"),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, name: e.target.value }),
      className: "md:col-span-2",
    },
    {
      key: "email",
      label: t("fields.email"),
      icon: FiMail,
      type: "email",
      value: formData.email,
      disabled: !!formData.email_verified_at,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, email: e.target.value }),
      placeholder: t("placeholders.email"),
      className: "md:col-span-2",
    },
    {
      key: "password",
      label: t("fields.password"),
      icon: MdPassword,
      type: "password",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, password: e.target.value }),
      placeholder: t("placeholders.password"),
      className: "md:col-span-2",
    },
    {
      key: "location",
    },
    {
      key: "phone",
      label: t("fields.phone"),
      icon: FiPhone,
      type: "tel",
      value: formData.phone,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, phone: e.target.value }),
      placeholder: t("placeholders.phone"),
    },
    {
      key: "gender",
      label: t("fields.gender"),
      icon: FiUser,
      value: formData.gender,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, gender: e.target.value }),
      options: [
        { code: "male", name: t("gender.male"), name_en: t("gender.male") },
        {
          code: "female",
          name: t("gender.female"),
          name_en: t("gender.female"),
        },
      ],
    },
    {
      key: "birth_date",
      label: t("fields.birthDate"),
      icon: FiCalendar,
      type: "date",
      value: formData.birth_date as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, birth_date: e.target.value }),
    },
    {
      key: "country",
      label: t("fields.country"),
      icon: FiGlobe,
      value: formData.country,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, country: e.target.value }),
      options: countries,
    },
  ];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ أضف return لعرض العناصر
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {formFields.map((input) => {
        if (input.key === "location") {
          return (
            <LocationInput
              key="locationInput"
              location={location}
              setOpenMap={setOpenMap}
              error={
                (errors &&
                  errors["location"] &&
                  errors["location"][0] &&
                  errors["location"][0][locale]) ??
                ""
              }
            />
          );
        }

        return (
          <FormInput
            key={input.key}
            className={input.className}
            name={input.key}
            value={formData[input.key] ?? ""}
            label={input.label as string}
            options={input.options && input.options}
            placeholder={input.placeholder}
            onChange={handleChange}
            icon={input.icon}
            type={input.type}
            disabled={input.disabled}
            error={
              (errors &&
                errors[input.key] &&
                errors[input.key][0] &&
                errors[input.key][0][locale]) ??
              ""
            }
          />
        );
      })}
    </div>
  );
}
