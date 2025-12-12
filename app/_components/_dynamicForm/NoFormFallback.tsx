"use client";

import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMessageSquare } from "react-icons/fi";
import { LocalizedText } from "./types";

interface NoFormFallbackProps {
  serviceName?: LocalizedText | string;
  serviceDescription?: LocalizedText | string;
  contactEmail?: string;
  contactPhone?: string;
  locale?: "ar" | "en";
}

function getLocalizedText(
  text: LocalizedText | string | undefined,
  locale: "ar" | "en"
): string {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[locale] || text.ar || text.en || "";
}

export default function NoFormFallback({
  serviceName,
  serviceDescription,
  contactEmail = "info@example.com",
  contactPhone = "+968 1234 5678",
  locale = "ar",
}: NoFormFallbackProps) {
  const content = {
    ar: {
      title: "هذه الخدمة لا تتطلب نموذج طلب",
      subtitle: "يمكنك التواصل معنا مباشرة للحصول على هذه الخدمة",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      whatsapp: "واتساب",
    },
    en: {
      title: "This service doesn't require an order form",
      subtitle: "You can contact us directly to get this service",
      email: "Email",
      phone: "Phone",
      whatsapp: "WhatsApp",
    },
  };

  const t = content[locale];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
    >
      {/* Service Info */}
      {serviceName && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {getLocalizedText(serviceName, locale)}
          </h2>
          {serviceDescription && (
            <p className="text-gray-500">
              {getLocalizedText(serviceDescription, locale)}
            </p>
          )}
        </div>
      )}

      {/* Message */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiMessageSquare className="text-primary" size={28} />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{t.title}</h3>
        <p className="text-gray-500">{t.subtitle}</p>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Email */}
        <motion.a
          href={`mailto:${contactEmail}`}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl hover:bg-primary/5 transition-colors"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
            <FiMail className="text-primary" size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500">{t.email}</p>
            <p className="text-sm font-medium text-gray-800">{contactEmail}</p>
          </div>
        </motion.a>

        {/* Phone */}
        <motion.a
          href={`tel:${contactPhone.replace(/\s/g, "")}`}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl hover:bg-primary/5 transition-colors"
        >
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
            <FiPhone className="text-green-600" size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500">{t.phone}</p>
            <p className="text-sm font-medium text-gray-800" dir="ltr">
              {contactPhone}
            </p>
          </div>
        </motion.a>

        {/* WhatsApp */}
        <motion.a
          href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl hover:bg-green-50 transition-colors"
        >
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shrink-0">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500">{t.whatsapp}</p>
            <p className="text-sm font-medium text-gray-800">
              {locale === "ar" ? "تواصل معنا" : "Contact Us"}
            </p>
          </div>
        </motion.a>
      </div>
    </motion.div>
  );
}
