"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import ServiceCard from "./service-card";
import { Service } from "./service";
import { FaLinode } from "react-icons/fa";
import Pagination from "../../PaginationComponent";

interface ServicesListProps {
  services: Service[];
  locale: string;
  loading: boolean;
  lastPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

// Services grid with animated transitions
export default function ServicesList({
  services,
  locale,
  loading,
  lastPage,
  currentPage,
  onPageChange,
}: ServicesListProps) {
  const t = useTranslations("servicesPage");

  const servicesBody = () => {
    if (services.length === 0) {
      return (
        // No results message
        <motion.div
          key="no-results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center min-h-[50vh] flex items-center justify-center py-16"
        >
          <div className="flex flex-col items-center gap-8">
            <FaLinode className="lg:size-60 size-20 text-primary" />
            <p className="text-gray-500 text-lg">{t("noResults")}</p>
          </div>
        </motion.div>
      );
    }

    if (loading) {
      return (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center min-h-[50vh] flex items-center justify-center py-16"
        >
          <div className="flex flex-col items-center gap-8">
            <FaLinode className="lg:size-60 size-20 text-primary" />
            <p className="text-gray-500 text-lg">{t("loading")}</p>
          </div>
        </motion.div>
      );
    }

    if (services.length > 0) {
      return (
        <div>
          <motion.div
            key="services-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                locale={locale}
                index={index}
              />
            ))}
          </motion.div>
          <Pagination
            currentPage={currentPage}
            totalPages={lastPage}
            onPageChange={onPageChange}
          />
        </div>
      );
    }
  };

  return (
    <section className="py-12 px-4">
      <div className="c-container">
        <AnimatePresence mode="wait">{servicesBody()}</AnimatePresence>
      </div>
    </section>
  );
}
