"use client";

import type React from "react";
import { motion } from "framer-motion";
import { Card } from "../../_dashboard/_cards/types";
import { directionMap } from "@/app/constants/_website/global";
import CreditCard from "../_global/CreditCard";
import LocaleLink from "../_global/LocaleLink";
import { formatTitle } from "@/app/_helpers/helpers";
import { useLocale, useTranslations } from "next-intl";

interface CardsSectionProps {
  cards: Card[];
}

export default function CardsSection({ cards }: CardsSectionProps) {
  const locale = useLocale();
  const t = useTranslations("homeCards");

  if (!cards) return null;

  return (
    <section
      dir={directionMap[locale]}
      className="py-16 px-4 c-container bg-white"
    >
      <div className="">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`text-center mb-12 ${
            locale === "ar" ? "text-right" : "text-left"
          }`}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-balance">
            {t("title")}
          </h2>
          <p className="text-xl text-gray-600 ltr:ml-6 rtl:mr-6 text-pretty">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="grid max-md:grid-cols-1 grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
          {cards.map((card, index) => (
            <LocaleLink
              key={`${card.id}-${index}-card.id`}
              href={`/cards/${formatTitle(card.title)}?cardId=${card.id}`}
              className="hover:-translate-y-4 duration-200"
            >
              <CreditCard
                // هنا ربطنا بيانات Card بخصائص CreditCard
                title={card.title} // ممكن يكون اسم الخدمة أو البنك
                description={card.description} // الوصف كاسم عربي مؤقت
                cardNumber={`**** **** ****`} // صياغة رقم وهمي
                cardHolder={`ID-${card.id}`} // صاحب البطاقة (تقدر تستخدم بيانات من user لاحقًا)
                expiry={card.duration || "12/30"} // مدة الخدمة كصلاحية
                image={card.image}
                brand="Aram" // ممكن تحددها حسب بيانات إضافية
                type="Platinum"
              />
            </LocaleLink>
          ))}
        </div>
      </div>
      <LocaleLink
        href="/cards"
        className="px-6 py-3 w-fit rtl:mr-auto ltr:ml-auto mt-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold text-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-200"
      >
        {t("allCards")}
      </LocaleLink>
    </section>
  );
}
