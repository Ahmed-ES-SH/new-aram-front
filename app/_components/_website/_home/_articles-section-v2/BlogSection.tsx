"use client";

import type React from "react";
import { motion } from "framer-motion";
import { ArticleType } from "@/app/types/_dashboard/GlobalTypes";
import { directionMap } from "@/app/constants/_website/global";
import { useLocale } from "next-intl";
import dynamic from "next/dynamic";
import BlogHeader from "./BlogHeader";

// Dynamic import for Swiper to avoid SSR issues
const SwiperComponent = dynamic(() => import("./SwiperComponent"), {
  ssr: false,
});

interface BlogSectionProps {
  articles: ArticleType[];
}

export default function BlogSection({ articles }: BlogSectionProps) {
  const locale = useLocale();

  return (
    <section
      id="blog-section"
      dir={directionMap[locale]}
      className="py-16 px-4 c-container bg-linear-to-b from-white to-yellow-50/30"
    >
      <div className="w-full">
        {/* استخدام مكون الرأس المميز */}
        <BlogHeader />

        {/* منطقة السلايدر */}
        <div id="articles-slider" className="mt-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <SwiperComponent articles={articles.slice(0, 8)} />
          </motion.div>
        </div>

        {/* مؤشر التمرير */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex items-center justify-center gap-2 text-gray-500"
        >
          <div className="w-2 h-2 rounded-full bg-yellow-300" />
          <span className="text-sm font-medium">
            {locale === "ar" ? "اسحب لعرض المزيد" : "Swipe to see more"}
          </span>
          <div className="w-2 h-2 rounded-full bg-yellow-300" />
        </motion.div>
      </div>
    </section>
  );
}
