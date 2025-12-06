// components/layouts/SectionContainer.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

interface SectionContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
  className?: string;
  showFeaturedBadge?: boolean;
}

const SectionContainer: React.FC<SectionContainerProps> = ({
  children,
  title,
  subtitle,
  description,
  className = "",
  showFeaturedBadge = false,
}) => {
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <section
      className={`relative py-6 px-4 md:px-8 lg:px-16 overflow-hidden ${className}`}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Animated linear orbs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.3, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="absolute top-1/4 -left-32 w-96 h-96 bg-linear-to-r from-blue-200 to-purple-200 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.2, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-linear-to-r from-green-200 to-cyan-200 rounded-full blur-3xl"
        />

        {/* Geometric pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-0.5 h-full bg-linear-to-b from-transparent via-gray-300 to-transparent opacity-20" />
          <div className="absolute top-0 left-3/4 w-0.5 h-full bg-linear-to-b from-transparent via-gray-300 to-transparent opacity-20" />
          <div className="absolute top-1/3 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-gray-300 to-transparent opacity-20" />
          <div className="absolute top-2/3 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-gray-300 to-transparent opacity-20" />
        </div>
      </div>

      <div className="c-container">
        {/* Header Section */}
        {(title || subtitle || description) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`text-center mb-16 relative ${isRTL ? "rtl" : "ltr"}`}
          >
            {/* Featured Badge */}
            {showFeaturedBadge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, type: "spring" }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary 
                         text-white rounded-full mb-6 shadow-lg"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                <span className="text-sm font-semibold">
                  {useTranslations("Common")("featured")}
                </span>
              </motion.div>
            )}

            {/* Subtitle with decorative line */}
            {subtitle && (
              <motion.div
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`flex items-center justify-center gap-4 mb-4 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1 h-px bg-primary opacity-50" />
                <span className="text-primary font-medium tracking-wider uppercase text-sm">
                  {subtitle}
                </span>
                <div className="flex-1 h-px bg-primary opacity-50" />
              </motion.div>
            )}

            {/* Main Title with Gradient */}
            {title && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative mb-6"
              >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                  <span className="bg-primary bg-clip-text text-transparent">
                    {title}
                  </span>
                </h2>

                {/* Animated underline */}
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "200px" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-1 bg-primary mx-auto rounded-full"
                />
              </motion.div>
            )}

            {/* Description with decorative icons */}
            {description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-3xl mx-auto relative"
              >
                <div
                  className={`flex items-start gap-6 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  {/* Decorative start icon */}
                  <motion.div
                    initial={{ rotate: 0 }}
                    whileInView={{ rotate: 360 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="hidden md:block mt-2"
                  >
                    <div
                      className="w-8 h-8 rounded-full bg-linear-to-r from-blue-100 to-purple-100 
                                  border-2 border-blue-200 flex items-center justify-center"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                  </motion.div>

                  <p className="text-lg text-gray-600 leading-relaxed flex-1">
                    {description}
                  </p>

                  {/* Decorative end icon */}
                  <motion.div
                    initial={{ rotate: 0 }}
                    whileInView={{ rotate: -360 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="hidden md:block mt-2"
                  >
                    <div
                      className="w-8 h-8 rounded-full bg-linear-to-r from-green-100 to-cyan-100 
                                  border-2 border-green-200 flex items-center justify-center"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Stats Counter - Showing platform achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-2xl mx-auto"
            >
              {[
                { label: "Active Centers", value: "150+" },
                { label: "Categories", value: "25+" },
                { label: "Monthly Visitors", value: "10K+" },
                { label: "Satisfaction Rate", value: "98%" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-2xl 
                           border border-gray-200 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="text-2xl md:text-3xl font-bold bg-primary bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    {useTranslations("Common")(
                      stat.label.toLowerCase().replace(" ", "_")
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
};

export default SectionContainer;
