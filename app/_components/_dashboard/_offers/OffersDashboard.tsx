"use client";

import { motion } from "framer-motion";
import OfferDashCard from "./OfferDashCard";
import { Offer } from "./types";
import { BiSolidOffer } from "react-icons/bi";
import { FaBars } from "react-icons/fa";
import { setOffersFilterSidebar } from "@/app/Store/variablesSlice";
import { useAppDispatch } from "@/app/Store/hooks";
import { Dispatch, SetStateAction } from "react";

interface OffersDashboardProps {
  offers: Offer[];
  setOffers: Dispatch<SetStateAction<Offer[]>>;
  loading: boolean;
}

export default function OffersDashboard({
  offers,
  setOffers,
  loading,
}: OffersDashboardProps) {
  const dispatch = useAppDispatch();

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="flex flex-col gap-4">
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <BiSolidOffer className="size-32 text-sky-400" />
          </motion.div>
          <p>تحميل العروض .....</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex-1 bg-gray-50 py-8" dir="rtl">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              لوحة العروض
            </h1>
          </div>

          <button
            onClick={() => dispatch(setOffersFilterSidebar(true))}
            className="lg:hidden bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaBars />
          </button>
        </div>

        {/* Offers Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <OfferDashCard setOffers={setOffers} offer={offer} />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {offers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center w-full min-h-[80vh] flex items-center justify-center"
          >
            <div className="">
              <div className="text-6xl text-gray-300 mb-4">🎁</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                لا توجد عروض متاحة حالياً
              </h3>
              <p className="text-gray-600">
                تحقق مرة أخرى لاحقاً للحصول على أحدث العروض
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
