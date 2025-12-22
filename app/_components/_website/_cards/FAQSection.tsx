"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { RootState } from "@/app/Store/store";
import { useSelector } from "react-redux";
import { directionMap } from "@/app/constants/_website/global";
import { useTranslations } from "next-intl";
import FAQItem from "./FAQItem";

export interface faqType {
  id: number;
  answer: string;
  question: string;
}

interface props {
  faqs: faqType[];
}

export default function FAQSection({ faqs }: props) {
  const { locale } = useSelector((state: RootState) => state.variables);
  const t = useTranslations("faqSection");

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <section dir={directionMap[locale]} className="py-16 bg-white">
      <div className="c-container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-xl text-gray-600">{t("description")}</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isOpen={openFAQ === faq.id}
              onToggle={() => handleToggle(faq.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
