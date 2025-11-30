"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FiShield, FiHeadphones, FiLock, FiZap } from "react-icons/fi";

// Feature data with icons
const features = [
  { key: "quality", icon: FiShield },
  { key: "support", icon: FiHeadphones },
  { key: "secure", icon: FiLock },
  { key: "fast", icon: FiZap },
];

// Why choose us section with animated feature cards
export default function WhyChooseUs() {
  const t = useTranslations("servicesPage.whyChoose");

  return (
    <section className="py-20 px-4 bg-linear-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t("subtitle")}</p>
        </motion.div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white p-6 rounded-2xl shadow-lg shadow-gray-100 border border-gray-100 text-center group"
              >
                {/* Icon container */}
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4"
                >
                  <Icon className="w-7 h-7 text-teal-600" />
                </motion.div>

                {/* Feature title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t(`features.${feature.key}.title`)}
                </h3>

                {/* Feature description */}
                <p className="text-sm text-gray-500 leading-relaxed">
                  {t(`features.${feature.key}.description`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
