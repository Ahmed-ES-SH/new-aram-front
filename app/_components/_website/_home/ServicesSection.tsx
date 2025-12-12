"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useLocale } from "next-intl";

import { directionMap } from "@/app/constants/_website/global";
import { instance } from "@/app/_helpers/axios";
import ServicePageUserCard, {
  ServicePageData,
} from "../_services/ServicePageUserCard";
import { ServicesHeader } from "./_services_v2/ServicesHeader";
import { servicesHeaderType } from "../../_dashboard/_statictexts/ServicesEditSection";
import LocaleLink from "../_global/LocaleLink";

interface ServicesSectionProps {
  staticData: servicesHeaderType;
  initialServices?: ServicePageData[];
}

export default function ServicesSection({
  staticData,
  initialServices,
}: ServicesSectionProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const scrollRef = useRef<HTMLDivElement>(null);

  const [services, setServices] = useState<ServicePageData[]>(
    initialServices || []
  );
  const [loading, setLoading] = useState(!initialServices);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Fetch services if not provided
  useEffect(() => {
    const fetchServices = async () => {
      if (initialServices) return;

      setLoading(true);
      try {
        const response = await instance.get("/service-pages", {
          params: {
            per_page: 8,
            is_active: true,
            sort_by: "order",
            sort_order: "asc",
          },
        });
        if (response.status === 200) {
          setServices(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [initialServices]);

  // Check scroll position
  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    if (isRTL) {
      setCanScrollRight(scrollLeft < 0);
      setCanScrollLeft(Math.abs(scrollLeft) < scrollWidth - clientWidth - 10);
    } else {
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const scrollEl = scrollRef.current;
    scrollEl?.addEventListener("scroll", checkScroll);
    return () => scrollEl?.removeEventListener("scroll", checkScroll);
  }, [services, isRTL]);

  // Scroll handlers
  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 400;
    const currentScroll = scrollRef.current.scrollLeft;
    const newScroll =
      direction === "left"
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount;
    scrollRef.current.scrollTo({ left: newScroll, behavior: "smooth" });
  };

  // Loading skeleton
  if (loading) {
    return (
      <section
        dir={directionMap[locale]}
        className="py-20 px-4 c-container bg-linear-to-b from-gray-50 to-white"
      >
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded-lg w-1/3 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-3xl h-72" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      dir={directionMap[locale]}
      className="py-20 px-4 c-container bg-linear-to-b from-gray-50/50 to-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative">
        {/* Header */}
        <ServicesHeader data={staticData} />

        {/* Services Carousel */}
        <div className="relative mt-12">
          {/* Scroll Buttons */}
          {services.length > 4 && (
            <>
              {/* Left/Prev Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: canScrollLeft ? 1 : 0.3 }}
                whileHover={{ scale: canScrollLeft ? 1.1 : 1 }}
                onClick={() => scroll(isRTL ? "right" : "left")}
                disabled={!canScrollLeft}
                className={`absolute ${
                  isRTL ? "-right-4" : "-left-4"
                } top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-xl border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 disabled:cursor-not-allowed`}
              >
                {isRTL ? (
                  <FiChevronRight size={20} />
                ) : (
                  <FiChevronLeft size={20} />
                )}
              </motion.button>

              {/* Right/Next Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: canScrollRight ? 1 : 0.3 }}
                whileHover={{ scale: canScrollRight ? 1.1 : 1 }}
                onClick={() => scroll(isRTL ? "left" : "right")}
                disabled={!canScrollRight}
                className={`absolute ${
                  isRTL ? "-left-4" : "-right-4"
                } top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-xl border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 disabled:cursor-not-allowed`}
              >
                {isRTL ? (
                  <FiChevronLeft size={20} />
                ) : (
                  <FiChevronRight size={20} />
                )}
              </motion.button>
            </>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="min-w-[300px] md:min-w-[340px] snap-start"
              >
                <ServicePageUserCard
                  service={service}
                  variant={index === 0 ? "featured" : "default"}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <LocaleLink
            href="/services"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gray-900 hover:bg-primary text-white rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/25"
          >
            <span>عرض جميع الخدمات</span>
            {isRTL ? (
              <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            ) : (
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            )}
          </LocaleLink>
        </motion.div>
      </div>
    </section>
  );
}
