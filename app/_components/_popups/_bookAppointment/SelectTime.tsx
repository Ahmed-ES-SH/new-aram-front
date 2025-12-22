"use client";
import { motion } from "framer-motion";
import { FaClock } from "react-icons/fa";
import { useLocale, useTranslations } from "next-intl";
import { TimeSlot } from "./types";
import SpinLoading from "../../_website/_global/SpinLoading";

interface SelectTimeProps {
  selectedDate: string;
  selectedTime: string;
  availableTimes: TimeSlot[];
  onSelect: (time: string) => void;
  onBack: () => void;
  tNamespace: string;
  loading: boolean;
}

export default function SelectTime({
  selectedDate,
  selectedTime,
  availableTimes,
  onSelect,
  onBack,
  tNamespace,
  loading,
}: SelectTimeProps) {
  const t = useTranslations(tNamespace);
  const locale = useLocale();

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
        <FaClock className="text-primary" />
        {t("chooseTime")} -{" "}
        {new Date(selectedDate).toLocaleDateString(
          locale === "ar" ? "ar-EG" : "en-GB"
        )}
      </h3>

      <div
        className={`grid lg:grid-cols-4 grid-cols-3 gap-3 ${
          loading ? "hidden-scrollbar" : ""
        } lg:max-h-[400px] h-[380px] hidden-scrollbar overflow-y-auto p-1`}
      >
        {loading ? (
          <div className="lg:h-[400px]  h-[380px] w-full flex items-center col-span-12  justify-center">
            <SpinLoading />
          </div>
        ) : (
          availableTimes.map((slot) => (
            <button
              key={slot.time}
              style={{
                cursor: slot.status !== "available" ? "not-allowed" : "pointer",
              }}
              onClick={() => slot.status === "available" && onSelect(slot.time)}
              disabled={slot.status !== "available"}
              className={`p-4 rounded-lg text-center transition-all duration-200 ${
                slot.status === "available"
                  ? "bg-white border border-gray-200 hover:border-primary hover:bg-orange-50 hover:text-primary text-gray-700"
                  : "bg-red-200 text-white border border-gray-200  line-through"
              } ${
                selectedTime === slot.time
                  ? "border-primary bg-orange-50 text-orange-600"
                  : ""
              }`}
            >
              {slot.time}
            </button>
          ))
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          {t("back")}
        </button>
      </div>
    </motion.div>
  );
}
