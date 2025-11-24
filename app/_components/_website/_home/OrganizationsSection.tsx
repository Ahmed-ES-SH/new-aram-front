"use client";

import type React from "react";
import { motion } from "framer-motion";
import { Organization } from "../../_dashboard/_organizations/types/organization";
import { directionMap } from "@/app/constants/_website/global";
import OrganizationCard from "../_organizations/OrganizationCard";
import { useLocale, useTranslations } from "next-intl";
// import LocaleLink from "../_global/LocaleLink";

interface OrganizationsSectionProps {
  organizations: Organization[];
}

export default function OrganizationsSection({
  organizations,
}: OrganizationsSectionProps) {
  const locale = useLocale();
  const t = useTranslations("organizations");

  return (
    <section dir={directionMap[locale]} className="py-16 px-4 c-container">
      <div className="">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`text-center mb-12 rtl:text-right ltr:text-left`}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-balance">
            {t("title")}
          </h2>
          <p className="text-xl text-gray-600 ltr:ml-6 rtl:mr-6 text-pretty">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 max-xl:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
          {organizations.map((org, index) => (
            <OrganizationCard
              organization={org}
              index={index}
              key={`${org.id}+org--${index}`}
              isAble={true}
            />
          ))}
        </div>
      </div>
      {/* <LocaleLink
        href="/organizations"
        className="px-6 py-3 w-fit mx-auto mt-6 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold text-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-200"
      >
        {t("allOrganizations")}
      </LocaleLink> */}
    </section>
  );
}
