"use client";
import { motion } from "framer-motion";
import { Card } from "../../_dashboard/_cards/types";
import { directionMap } from "@/app/constants/_website/global";
import { useLocale, useTranslations } from "next-intl";
import { useRef } from "react";
import { MembershipCard } from "../_global/_memberShipCard-v2";
import CardsHeader from "./_cardSection/CardsHeader";
import { cardsHeaderType } from "../../_dashboard/_statictexts/CardsHeaderSection";

interface CardsSectionProps {
  cards: Card[];
  staticData: cardsHeaderType;
}

export default function CardsSection({ cards, staticData }: CardsSectionProps) {
  const locale = useLocale();

  const containerRef = useRef<HTMLDivElement>(null);

  if (!cards) return null;

  return (
    <section
      dir={directionMap[locale]}
      ref={containerRef}
      className="relative py-24 px-4  overflow-hidden"
    >
      <div className="relative z-10 c-container mx-auto">
        {/* Premium Header */}
        <CardsHeader containerRef={containerRef} staticData={staticData} />
        {/* Cards Grid */}
        <div className="relative">
          {/* Decorative line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-linear-to-r from-transparent via-gray-300/50 to-transparent /50 -translate-y-1/2" />

          {/* Animated cards container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 relative z-10"
          >
            {cards.map((card, index) => (
              <motion.div
                key={`${card.id}-${index}-card.id`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, type: "spring" }}
                whileHover={{
                  y: -10,
                  transition: { type: "spring", stiffness: 300 },
                }}
                className="group relative"
              >
                {/* Card glow effect on hover */}
                <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Card content */}
                <div className="relative transform transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/10">
                  <MembershipCard data={card} />
                </div>

                {/* Hover indicator */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-1 bg-primary rounded-full" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
