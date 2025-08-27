"use client";

import type React from "react";
import { motion } from "framer-motion";
import { Organization } from "../../_dashboard/_organizations/types/organization";
import { directionMap } from "@/app/constants/_website/global";
import OrganizationCard from "../_organizations/OrganizationCard";

interface OrganizationsSectionProps {
  title: string;
  subtitle: string;
  organizations: Organization[];
  locale?: string;
}

export default function OrganizationsSection({
  title,
  subtitle,
  organizations,
  locale = "en",
}: OrganizationsSectionProps) {
  return (
    <section
      dir={directionMap[locale]}
      className="py-16 px-4 c-container bg-gray-50"
    >
      <div className="">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`text-center mb-12 rtl:text-right ltr:text-left`}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-balance">
            {title}
          </h2>
          <p className="text-xl text-gray-600 ltr:ml-6 rtl:mr-6 text-pretty">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 max-xl:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
          {organizations.map((org, index) => (
            <OrganizationCard
              organization={org}
              index={index}
              key={`${org.id}+org`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
