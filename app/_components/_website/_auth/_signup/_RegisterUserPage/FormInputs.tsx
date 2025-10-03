"use client";
import React from "react";
import PasswordInput from "../PasswordInput";
import InputComponent from "../InputComponent";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import LocaleLink from "../../../_global/LocaleLink";
import { VscLoading } from "react-icons/vsc";

export interface inputType {
  id: string;
  name: string;
  type?: string;
  label?: string;
  placeholder?: string;
}

export default function FormInputs({ form, setForm, errors, loading }) {
  const locale = useLocale();
  const t = useTranslations("registerUserPage");

  const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleGenderChange = (gender: string) => {
    setForm((prev) => ({ ...prev, gender: gender }));
  };

  // Array of inputs
  const formInputs: inputType[] = [
    {
      id: "id_number",
      name: "id_number",
      type: "text",
      label: t("id_name"),
      placeholder: t("id_placeholder"),
    },
    {
      id: "Name",
      name: "name",
      type: "text",
      label: t("name_label"),
      placeholder: t("name_placeholder"),
    },
    {
      id: "Email",
      name: "email",
      type: "email",
      label: t("email_label"),
      placeholder: t("email_placeholder"),
    },
    {
      id: "phone",
      name: "phone",
      type: "text",
      label: t("phone_label"),
      placeholder: t("phone_placeholder"),
    },

    {
      id: "Password",
      name: "password",
    },

    {
      id: "PasswordConfirmation",
      name: "password_confirmation",
      type: "password",
      label: t("confirm_password_label"),
      placeholder: "",
    },
    {
      id: "birthDate",
      name: "birth_date",
      type: "date",
      label: t("birthdate_label"),
      placeholder: t("name_label"),
    },
  ];

  const genders = [
    {
      value: "male",
      label: t("male"),
    },
    {
      value: "female",
      label: t("female"),
    },
  ];

  return (
    <>
      {formInputs.map((input) => {
        switch (input.name) {
          case "password":
            return (
              <div
                key="password-row"
                className="col-span-6 flex flex-col sm:flex-row gap-6"
              >
                <div className="sm:w-1/2">
                  <PasswordInput
                    key="password"
                    value={form.password}
                    handlechange={handlechange}
                    errorpassword={
                      errors?.["password"]?.[0]?.[locale] ||
                      errors?.["password"]
                    }
                  />
                </div>

                <div className="sm:w-1/2">
                  <InputComponent
                    key="password_confirmation"
                    input={
                      formInputs.find(
                        (f) => f.name === "password_confirmation"
                      )!
                    }
                    value={form["password_confirmation"]}
                    onChange={handlechange}
                    error={
                      errors?.["password_confirmation"]?.[0]?.[locale] ||
                      errors?.["password_confirmation"]
                    }
                  />
                </div>
              </div>
            );

          case "password_confirmation":
            // skip rendering this one (already handled in "password" case)
            return null;

          default:
            return (
              <InputComponent
                key={input.id}
                input={input}
                value={form[input.name]}
                onChange={handlechange}
                error={
                  errors?.[input.name]?.[0]?.[locale] || errors?.[input.name]
                }
              />
            );
        }
      })}

      <motion.div
        className="col-span-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <label className="block text-sm font-medium text-gray-700">
          {t("gender_label")}
        </label>
        <div className="mt-2 flex gap-4">
          {genders.map((option) => {
            const isActive = form.gender == option.value;
            return (
              <div
                key={option.value}
                className={`flex items-center cursor-pointer px-4 py-2 border rounded-md shadow-sm text-sm font-medium 
            ${
              isActive
                ? "bg-primary text-white"
                : "bg-white  text-gray-700  border-gray-200"
            }`}
                onClick={() => handleGenderChange(option.value)}
              >
                <input
                  type="radio"
                  id={option.value}
                  name="gender"
                  value={option.value}
                  checked={form.gender === option.value}
                  onChange={() => handleGenderChange(option.value)}
                  className="hidden"
                />
                <span>{option.label}</span>
              </div>
            );
          })}
        </div>
        {errors && errors["gender"] && (
          <p className="text-red-400 my-3">{errors["gender"][0][locale]}</p>
        )}
      </motion.div>

      <motion.div
        className="col-span-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <label htmlFor="MarketingAccept" className="flex gap-4">
          <input
            type="checkbox"
            id="MarketingAccept"
            name="marketing_accept"
            className="size-5 rounded-md border-gray-200 bg-white shadow-sm"
          />
          <span className="text-sm text-gray-700 -300">
            {t("marketing_accept")}
          </span>
        </label>
      </motion.div>

      <motion.div
        className="col-span-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-sm text-gray-500 flex flex-wrap items-center gap-1">
          {t("terms_text")}
          <LocaleLink
            href="/termsconditionsusers"
            className="text-gray-700 whitespace-nowrap underline"
          >
            {t("terms_link")}
          </LocaleLink>{" "}
          {t("and")}
          <LocaleLink
            href="/privacypolicyusers"
            className="text-gray-700 whitespace-nowrap underline"
          >
            {t("privacy_link")}
          </LocaleLink>
          .
        </div>
      </motion.div>

      <motion.div
        className="col-span-6 sm:flex sm:items-center sm:gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <button
          disabled={loading}
          type="submit"
          className="flex items-center disabled:bg-orange-200 disabled:border-orange-200 justify-center shrink-0 rounded-md border border-primary bg-primary px-12 py-3 text-sm font-medium text-white transition duration-200 hover:scale-105 focus:outline-none focus:ring active:text-orange-500"
        >
          {loading ? (
            <VscLoading className="size-6 animate-spin" />
          ) : (
            t("create_account")
          )}
        </button>

        <div className="mt-4 text-sm text-gray-500 sm:mt-0 flex items-center gap-1">
          {t("already_account")}
          <LocaleLink href="/login" className="text-gray-700 -300 underline">
            {t("sign_in")}
          </LocaleLink>
        </div>
      </motion.div>
    </>
  );
}
