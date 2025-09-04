"use client";
import React from "react";
import { FiStar, FiMapPin, FiCalendar } from "react-icons/fi";
import { motion } from "framer-motion";
import { Organization } from "../../_dashboard/_organizations/types/organization";
import Img from "../_global/Img";
import { useLocale, useTranslations } from "next-intl";
import { BiSolidMessageRoundedDots } from "react-icons/bi";
import { LuClock7 } from "react-icons/lu";
import LocaleLink from "../_global/LocaleLink";
import { formatTitle } from "@/app/_helpers/helpers";

interface props {
  organization: Organization;
  index: number;
}

export default function OrganizationCard({ organization, index }: props) {
  const t = useTranslations("organizations");
  const locale = useLocale();

  return (
    <>
      <motion.div
        key={organization.id}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white h-full rounded-xl group shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-3 duration-300"
      >
        <div className="relative">
          <Img
            src={organization.image || "/placeholder.png"}
            alt={organization.title}
            className="w-full h-48 object-cover"
          />

          <div className="absolute bottom-4 left-4">
            <Img
              src={organization.logo ?? "/logo.png"}
              errorSrc="/logo.png"
              alt={`${organization.title} logo`}
              className="w-12 h-12 rounded-full bg-white p-1 shadow-md"
            />
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <LocaleLink
              href={`/organizations/${formatTitle(
                organization.title
              )}?organizationId=${organization.id}`}
              className="text-xl font-bold text-gray-900 text-balance group-hover:text-sky-500  group-hover:underline duration-200"
            >
              {organization.title}
            </LocaleLink>
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
              <FiStar className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-yellow-700">
                {organization.rating}
              </span>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {organization.description.length > 100
              ? organization.description.substring(0, 100) + "..."
              : organization.description}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FiMapPin className="w-4 h-4" />
              <span>{organization.location.address}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FiCalendar className="w-4 h-4" />
              <span>
                {organization.number_of_reservations} {t("reservations")}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div
              className="px-3 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: organization.category.bg_color }}
            >
              {locale == "ar"
                ? organization.category.title_ar
                : organization.category.title_en}
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {organization.keywords.slice(0, 2).map((keyword) => (
              <span
                key={keyword.id}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
              >
                {keyword.title}
              </span>
            ))}
          </div>

          <div className="flex gap-2 cursor-pointer">
            <div className="flex-1 bg-primary hover:bg-orange-500 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1">
              <BiSolidMessageRoundedDots className="w-3 h-3" />
              {t("contact")}
            </div>
            <div className="flex-1 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1">
              <LuClock7 className="w-3 h-3" />
              {t("book")}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
