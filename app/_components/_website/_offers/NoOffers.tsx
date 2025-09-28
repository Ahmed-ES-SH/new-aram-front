"use client";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { CiNoWaitingSign } from "react-icons/ci";
import { FiRefreshCw } from "react-icons/fi";

export default function NoOffers() {
  const locale = useLocale();
  const router = useRouter();

  const handleRefresh = () => {
    router.push(`/${locale}/offers`);
  };

  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center text-center space-y-6 p-10 rounded-2xl border border-gray-200 shadow-md bg-gradient-to-br from-gray-50 to-white"
      >
        {/* Icon */}
        <motion.div
          initial={{ rotate: -10, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CiNoWaitingSign className="text-red-400 size-32 drop-shadow-sm" />
        </motion.div>

        {/* Text */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            No Offers Available
          </h3>
          <p className="mt-2 text-sm text-gray-500 max-w-sm">
            It looks like there are no offers at the moment. Please check back
            later or refresh the page.
          </p>
        </div>

        {/* Action button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-white font-medium shadow hover:bg-primary/90 transition"
          onClick={() => handleRefresh()}
        >
          <FiRefreshCw className="text-lg" />
          Refresh
        </motion.button>
      </motion.div>
    </div>
  );
}
