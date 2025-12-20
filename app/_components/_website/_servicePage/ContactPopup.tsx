"use client";
import { instance } from "@/app/_helpers/axios";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { VscLoading } from "react-icons/vsc";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface ContactPopupProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string | number;
}

interface FormType {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface ErrorType {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export default function ContactPopup({
  isOpen,
  onClose,
  serviceId,
}: ContactPopupProps) {
  const t = useTranslations("contact");

  const t_errors = useTranslations("contact.contactErrors");

  const [form, setForm] = useState<FormType>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<ErrorType>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof ErrorType]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: ErrorType = {};

    if (!form.name.trim()) {
      newErrors.name = t_errors("name_required");
    }
    if (!form.email.trim()) {
      newErrors.email = t_errors("email_required");
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = t_errors("email_invalid");
    }
    if (!form.phone.trim()) {
      newErrors.phone = t_errors("phone_required");
    }
    if (!form.message.trim()) {
      newErrors.message = t_errors("message_required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t_errors("form_invalid"));
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("message", form.message);
      if (serviceId) formData.append("service_page_id", serviceId.toString());

      const response = await instance.post("/add-service-message", formData);

      if (response.status === 201) {
        toast.success(t("success_message"));
        setForm({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
        onClose();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(t_errors("server_error"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setForm({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
    setErrors({});
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">{t("title")}</h3>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("form.name")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={t("form.name")}
                    className={`w-full rounded-xl border ${
                      errors.name ? "border-red-500" : "border-gray-200"
                    } px-4 py-3 outline-none focus:border-primary transition-colors`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t("form.email")}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder={t("form.email_placeholder")}
                      className={`w-full rounded-xl border ${
                        errors.email ? "border-red-500" : "border-gray-200"
                      } px-4 py-3 outline-none focus:border-primary transition-colors`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t("form.phone")}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder={t("form.phone_placeholder")}
                      className={`w-full rounded-xl border ${
                        errors.phone ? "border-red-500" : "border-gray-200"
                      } px-4 py-3 outline-none focus:border-primary transition-colors`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("form.message")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder={t("form.message")}
                    rows={4}
                    className={`w-full rounded-xl border ${
                      errors.message ? "border-red-500" : "border-gray-200"
                    } px-4 py-3 outline-none focus:border-primary transition-colors resize-none`}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <VscLoading className="animate-spin text-xl" />
                    ) : (
                      t("form.submit")
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
