"use client";
import { motion } from "framer-motion";
import { FaCheck, FaMoneyBillWave, FaUserClock } from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";
import { useTranslations } from "next-intl";
import { OrganizationWorkTimeResponse } from "./types";

interface ConfirmBookingProps {
  selectedDate: string;
  selectedTime: string;
  organizationTitle: string;
  organizationWorkTime: OrganizationWorkTimeResponse | null;
  submiting: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onBack: () => void;
  onRetry: () => void;
  tNamespace: string;
}

export default function ConfirmBooking({
  selectedDate,
  selectedTime,
  organizationWorkTime,
  submiting,
  isLoading,
  onConfirm,
  onBack,
  onRetry,
  tNamespace,
}: ConfirmBookingProps) {
  const t = useTranslations(tNamespace);

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      {isLoading ? (
        <div className="flex justify-center items-center lg:h-[380px] py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : organizationWorkTime ? (
        <div className="space-y-6">
          {/* Booking Summary */}
          <div className="bg-gray-50 h-[250px] rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
              <FaCheck className="text-green-500" />
              {t("bookingSummary")}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">{t("date")}</p>
                <p className="font-bold text-gray-800">
                  {new Date(selectedDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t("time")}</p>
                <p className="font-bold text-gray-800">{selectedTime}</p>
              </div>
              {organizationWorkTime.confirmation_price && (
                <div>
                  <p className="text-sm text-gray-600">{t("price")}</p>
                  <p className="font-bold text-gray-800">
                    {organizationWorkTime.confirmation_price} OMR
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Payment or Normal Confirmation */}
          {organizationWorkTime.confirmation_status === 1 ? (
            <div className="space-y-4 border-t border-gray-300 pt-6">
              <button
                disabled={submiting}
                onClick={onConfirm}
                className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
              >
                {submiting ? (
                  <VscLoading className="animate-spin" />
                ) : (
                  <>
                    <FaMoneyBillWave />
                    {t("proceedToPayment")}
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4 border-t border-gray-300 pt-6">
              <div className="text-md font-medium text-gray-800 flex items-center justify-center gap-2">
                <FaUserClock className="text-blue-500" />
                {t("confirmBooking")}
              </div>

              <p className="text-gray-600 text-sm">
                {t("confirmationMessage")}
              </p>

              <button
                onClick={onConfirm}
                disabled={submiting}
                className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
              >
                {submiting ? (
                  <VscLoading className="animate-spin lg:size-6 text-white" />
                ) : (
                  <div className="flex items-center gap-2">
                    <FaCheck />
                    {t("confirmBookingButton")}
                  </div>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">{t("bookingNotAvailable")}</p>
          <button
            onClick={onRetry}
            className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            {t("tryAgain")}
          </button>
        </div>
      )}

      {!isLoading && (
        <button
          onClick={onBack}
          className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          {t("back")}
        </button>
      )}
    </motion.div>
  );
}
