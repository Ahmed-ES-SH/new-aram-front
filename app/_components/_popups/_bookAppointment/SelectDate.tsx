"use client";
import { motion } from "framer-motion";
import { FaCalendarAlt } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { BookedDate } from "./types";

interface SelectDateProps {
  bookedDates: BookedDate[];
  selectedDate: string;
  onSelect: (date: string) => void;
  isLoading: boolean;
  tNamespace: string;
}

export default function SelectDate({
  bookedDates,
  selectedDate,
  onSelect,
  isLoading,
  tNamespace,
}: SelectDateProps) {
  const t = useTranslations(tNamespace);

  const generateDates = () => {
    const dates: any[] = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split("T")[0];
      const dayNumber = date.getDate();
      const dayName = date.toLocaleDateString("en", { weekday: "short" });
      const bookedDate = bookedDates.find((d) => d.date === dateString);

      dates.push({
        date: dateString,
        dayNumber,
        dayName,
        isBooked: !!bookedDate,
        bookedCount: bookedDate?.booked_count || 0,
      });
    }
    return dates;
  };

  const dates = generateDates();

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
        <FaCalendarAlt className="text-primary" />
        {t("chooseDate")}
      </h3>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid xl:grid-cols-7 lg:grid-cols-5 md:grid-cols-4 grid-cols-3 hidden-scrollbar lg:max-h-[440px] max-h-[380px] overflow-y-auto gap-3">
          {dates.map((date) => (
            <button
              key={date.date}
              onClick={() => onSelect(date.date)}
              className={`p-3 rounded-lg text-center transition-all duration-200 border-2 ${
                selectedDate === date.date
                  ? "border-primary bg-primary text-white"
                  : date.isBooked
                  ? "border-orange-200 bg-orange-50 text-gray-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-primary"
              }`}
            >
              <div className="text-xs text-gray-500 mb-1">{date.dayName}</div>
              <div className="text-lg font-semibold">{date.dayNumber}</div>
              {date.isBooked && (
                <div className="flex justify-center mt-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  {date.bookedCount > 1 && (
                    <span className="text-xs text-orange-600 ml-1">
                      {date.bookedCount}
                    </span>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
