"use client";

import { motion } from "framer-motion";
import { FaUser, FaBuilding } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import LocaleLink from "../../_global/LocaleLink";

type CardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const Card: React.FC<CardProps> = ({ icon, title, description }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className="w-full bg-white border border-gray-200 rounded-2xl shadow-md lg:p-8 p-4 cursor-pointer transition-all hover:shadow-xl hover:border-primary"
    >
      <div className="flex items-center max-md:flex-col max-md:items-start gap-4 mb-4">
        <div className="lg:p-4 p-2 bg-primary/10 text-primary rounded-full text-2xl">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600 text-base leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default function AccountSelection() {
  const t = useTranslations("accountSelection");
  const router = useRouter();
  const locale = useLocale();

  return (
    <div className="flex items-center justify-center min-h-screen max-lg:mt-20">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-[98%] lg:max-w-3xl bg-white rounded-3xl lg:shadow-xl lg:border border-gray-200 lg:p-12 p-4 space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="lg:text-3xl text-xl font-bold text-gray-900">
            {t("title")}
          </h2>
          <p className="text-gray-500  lg:text-base">
            {locale === "ar"
              ? "ابدأ الآن واختر الطريقة الأنسب للانضمام إلى منصتنا"
              : "Get started by choosing the best way to join our platform"}
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-6">
          <LocaleLink href="/registeruser?type=user">
            <Card
              icon={<FaUser />}
              title={t("user.title")}
              description={t("user.description")}
            />
          </LocaleLink>
          <LocaleLink href="/registerorganization?type=organization">
            <Card
              icon={<FaBuilding />}
              title={t("organization.title")}
              description={t("organization.description")}
            />
          </LocaleLink>
        </div>
      </motion.div>
    </div>
  );
}
