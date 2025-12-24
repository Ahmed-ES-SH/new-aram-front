// components/centers/CentersSection.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { FiSearch } from "react-icons/fi";
import SectionContainer from "./SectionContainer";
import OrganizationCard from "../../_organizations/OrganizationCard";
import { Organization } from "@/app/_components/_dashboard/_organizations/types/organization";
import { useRouter } from "next/navigation";
import { VscLoading } from "react-icons/vsc";
import { OrganizationsHeaderType } from "@/app/_components/_dashboard/_statictexts/OrganizationsEditSection";

interface CentersSectionProps {
  organizations: Organization[];
  staticData: OrganizationsHeaderType;
}

const CentersSection: React.FC<CentersSectionProps> = ({
  organizations,
  staticData,
}) => {
  const router = useRouter();
  const locale = useLocale();

  const t = useTranslations("Centers");

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(`/${locale}/organizations?step=3&query=${searchQuery}`);
    }, 400);
  };

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <SectionContainer
      data={staticData}
      showFeaturedBadge={true}
      className="relative overflow-hidden"
    >
      {/* البحث والتصفية */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        {/* حقل البحث */}
        <div className="relative max-w-2xl mx-auto mb-6">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm rounded-2xl 
                       border border-gray-200 focus:border-primary focus:ring-1
                       focus:ring-primary outline-none transition-all shadow-sm"
            />
            <motion.button
              onClick={handleSearch}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute flex items-center justify-center right-2 top-1/2 transform -translate-y-1/2 
                       px-4 py-2 bg-primary 
                       text-white rounded-xl font-medium"
            >
              {loading ? (
                <VscLoading className="size-6 animate-spin" />
              ) : (
                t("search")
              )}
            </motion.button>
          </div>
        </div>

        {/* Centers Grid/List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`centers-`}
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={
              "grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8"
            }
          >
            {organizations.map((organization, index) => (
              <OrganizationCard
                key={`organization-${organization.title}`}
                organization={organization}
                isAble={true}
                index={index}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {organizations.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {t("noCentersFound")}
            </h3>
            <p className="text-gray-500">{t("tryDifferentCategory")}</p>
          </motion.div>
        )}
      </motion.div>
    </SectionContainer>
  );
};

export default CentersSection;
