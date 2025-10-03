"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react";

interface props {
  checkPromoCode: () => void;
  checkLoading: boolean;
  success: boolean;
  error: boolean;
  promoCode: string;
  setPromoCode: Dispatch<SetStateAction<string>>;
}

export default function PromoCodeBox({
  promoCode,
  setPromoCode,
  checkPromoCode,
  checkLoading,
  success,
  error,
}: props) {
  const t = useTranslations("cartPage.promo");

  return (
    <div className="space-y-4 mt-2 w-full rounded-lg border border-gray-200 bg-gray-100 p-4 shadow-sm  sm:p-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="voucher"
            className="mb-2 block text-sm font-medium text-gray-900 "
          >
            {t("label")}
          </label>
          <input
            name="promo_code"
            type="text"
            id="voucher"
            className="block outline-none w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
            placeholder=""
            value={promoCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPromoCode(e.target.value)
            }
          />
        </div>
        <div className="flex flex-col items-center gap-2 w-full">
          <button
            onClick={checkPromoCode}
            disabled={checkLoading}
            className={`${
              checkLoading ? "bg-orange-500" : "bg-green-500"
            } text-white p-2 rounded-md  transition-all duration-300 hover:bg-green-600 disabled:bg-gray-300`}
          >
            {checkLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.3, repeat: Infinity }}
                className="w-5 h-5 border-4 border-t-transparent border-white rounded-full"
              />
            ) : (
              t("apply_button")
            )}
          </button>

          {/* Success message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-green-500 mt-2 text-sm"
            >
              {t("success")}
            </motion.div>
          )}

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-red-500 mt-2 text-sm"
            >
              {t("error")}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
