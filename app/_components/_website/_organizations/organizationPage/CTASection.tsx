// CTASection.tsx - Alternative Minimal Design
"use client";
import React from "react";
import { Organization } from "@/app/_components/_dashboard/_organizations/types/organization";
import { SlNotebook } from "react-icons/sl";
import { TbMessageDots } from "react-icons/tb";
import { VscLoading } from "react-icons/vsc";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";

interface Props {
  handleStartConversation: () => void;
  handleBook: () => void;
  organization: Organization;
  loadingConversation: boolean;
}

export default function CTASection({
  organization,
  loadingConversation,
  handleStartConversation,
  handleBook,
}: Props) {
  const locale = useLocale();

  const isBookable = organization.booking_status == 1;

  return (
    <div className="w-full ml-auto">
      {/* Main CTA Buttons */}
      <div className="flex max-sm:flex-col flex-row lg:flex-col 2xl:flex-row gap-3">
        {/* Contact Button - Primary */}
        <motion.button
          disabled={loadingConversation}
          onClick={handleStartConversation}
          className={`flex-1 lg:w-full whitespace-nowrap bg-sky-500 text-white rounded-xl py-4 px-6 font-semibold flex items-center justify-center gap-3 transition-all ${
            loadingConversation
              ? "opacity-60 cursor-not-allowed"
              : "hover:bg-sky-600 hover:shadow-lg active:scale-95"
          }`}
          whileHover={!loadingConversation ? { scale: 1.02 } : {}}
          whileTap={!loadingConversation ? { scale: 0.98 } : {}}
        >
          {loadingConversation ? (
            <VscLoading className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <TbMessageDots className="w-5 h-5" />
              <span>
                {locale === "ar" ? "تواصل مع المركز" : "Contact Center"}
              </span>
            </>
          )}
        </motion.button>

        {/* Book Button - Secondary */}
        {isBookable && (
          <motion.button
            onClick={handleBook}
            className="flex-1 whitespace-nowrap border-2 border-primary  bg-primary text-white  rounded-xl py-4 px-6 font-semibold flex items-center justify-center gap-3 transition-all hover:shadow-lg active:scale-95"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SlNotebook className="w-5 h-5" />
            <span>{locale === "ar" ? "حجز موعد" : "Book Appointment"}</span>
          </motion.button>
        )}
      </div>
    </div>
  );
}
