/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaCheck,
  FaUserClock,
  FaMoneyBillWave,
} from "react-icons/fa";
import { instance } from "@/app/_helpers/axios";
import { toast } from "sonner";
import { VscLoading } from "react-icons/vsc";

// API Response Interfaces
interface TimeSlot {
  time: string;
  status: "available" | "booked";
}

interface BookedDate {
  date: string;
  booked_count: number;
}

interface OrganizationTimesResponse {
  all_times: TimeSlot[];
  booked_dates: BookedDate[];
}

interface OrganizationWorkTimeResponse {
  open_at: string;
  close_at: string;
  booking_status: number;
  confirmation_status: number;
  booking_price?: number;
}

interface BookingSummary {
  date: string;
  time: string;
  price?: number;
}

// Component Props Interface
interface SelectTimePopupProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string | number;
}

// Main Component
const SelectTimePopup: React.FC<SelectTimePopupProps> = ({
  isOpen,
  onClose,
  organizationId,
}) => {
  const t = useTranslations("selectTime");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([]);
  const [bookedDates, setBookedDates] = useState<BookedDate[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [organizationWorkTime, setOrganizationWorkTime] =
    useState<OrganizationWorkTimeResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submiting, setSubmiting] = useState(false);
  const [error, setError] = useState<string>("");

  // Fetch available times and booked dates when popup opens
  useEffect(() => {
    if (isOpen) {
      fetchOrganizationData();
      resetForm();
    }
  }, [isOpen, organizationId]);

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedDate("");
    setSelectedTime("");
    setOrganizationWorkTime(null);
    setError("");
  };

  const fetchOrganizationData = async () => {
    setIsLoading(true);
    try {
      const response = await instance.get(
        `/organizations/${organizationId}/all-times`
      );

      const data: OrganizationTimesResponse = await response.data.data;
      setAvailableTimes(data.all_times);
      setBookedDates(data.booked_dates || []);
    } catch (err) {
      console.log(err);
      setError(t("errors.fetchData"));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookingStatus = async () => {
    setIsLoading(true);
    try {
      const response = await instance.get(
        `/organization-time-work/${organizationId}`
      );

      const data: OrganizationWorkTimeResponse = await response.data.data;
      setOrganizationWorkTime(data);
    } catch (err) {
      console.log(err);
      setError(t("errors.fetchBookingStatus"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setCurrentStep(2);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setCurrentStep(3);
    fetchBookingStatus();
  };

  const confirmWithPay = async (bookingSummary) => {
    try {
      setSubmiting(true);
      const response = await instance.post(`/`, bookingSummary);
      if (response.status == 200) {
        toast.success("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmiting(false);
    }
  };

  const confirmWithoutPay = async (bookingSummary) => {
    try {
      setSubmiting(true);
      const response = await instance.post(`/`, bookingSummary);
      if (response.status == 200) {
        toast.success("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmiting(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (organizationWorkTime?.confirmation_status === 1) {
      const bookingSummary: BookingSummary = {
        date: selectedDate,
        time: selectedTime,
        price: organizationWorkTime?.booking_price,
      };
      await confirmWithPay(bookingSummary);
    } else {
      const bookingSummary: BookingSummary = {
        date: selectedDate,
        time: selectedTime,
        price: organizationWorkTime?.booking_price,
      };
      await confirmWithoutPay(bookingSummary);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // Generate dates for the next 30 days
  const generateDates = () => {
    const dates: any = [];
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

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -50 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 50 },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-[999]"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">
                {t("title")}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                aria-label={t("close")}
              >
                <FaTimes className="text-gray-500 text-lg" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Step Indicator */}
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep >= step
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step}
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-12 h-1 mx-2 ${
                          currentStep > step ? "bg-blue-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <AnimatePresence mode="wait">
                {/* Step 1: Date Selection */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-500" />
                      {t("chooseDate")}
                    </h3>

                    {isLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-7 gap-3">
                        {dates.map((date) => (
                          <button
                            key={date.date}
                            onClick={() => handleDateSelect(date.date)}
                            className={`p-3 rounded-lg text-center transition-all duration-200 border-2 ${
                              selectedDate === date.date
                                ? "border-blue-500 bg-blue-50 text-blue-600"
                                : date.isBooked
                                ? "border-orange-200 bg-orange-50 text-gray-700"
                                : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                            }`}
                          >
                            <div className="text-xs text-gray-500 mb-1">
                              {date.dayName}
                            </div>
                            <div className="text-lg font-semibold">
                              {date.dayNumber}
                            </div>
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

                    {/* Legend */}
                    <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 border-2 border-gray-200 rounded"></div>
                        <span>{t("available")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 border-2 border-orange-200 bg-orange-50 rounded"></div>
                        <span>{t("hasBookings")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 border-2 border-blue-500 bg-blue-50 rounded"></div>
                        <span>{t("selected")}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Time Selection */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                      <FaClock className="text-blue-500" />
                      {t("chooseTime")} -{" "}
                      {new Date(selectedDate).toLocaleDateString()}
                    </h3>

                    <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-3 max-h-60 overflow-y-auto p-1">
                        {availableTimes.map((timeSlot) => (
                          <button
                            key={timeSlot.time}
                            onClick={() =>
                              timeSlot.status === "available" &&
                              handleTimeSelect(timeSlot.time)
                            }
                            disabled={timeSlot.status !== "available"}
                            className={`p-4 rounded-lg text-center transition-all duration-200 ${
                              timeSlot.status === "available"
                                ? "bg-white border border-gray-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 text-gray-700 cursor-pointer"
                                : "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed line-through"
                            } ${
                              selectedTime === timeSlot.time
                                ? "border-blue-500 bg-blue-50 text-blue-600"
                                : ""
                            }`}
                          >
                            {timeSlot.time}
                            {timeSlot.status === "booked" && (
                              <div className="text-xs text-red-500 mt-1">
                                {t("booked")}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={handleBack}
                          className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          {t("back")}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Confirmation or Payment */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    {isLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    ) : organizationWorkTime ? (
                      <div className="space-y-6">
                        {/* Booking Summary */}
                        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                          <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                            <FaCheck className="text-green-500" />
                            {t("bookingSummary")}
                          </h3>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">
                                {t("date")}
                              </p>
                              <p className="font-semibold text-gray-800">
                                {new Date(selectedDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                {t("time")}
                              </p>
                              <p className="font-semibold text-gray-800">
                                {selectedTime}
                              </p>
                            </div>
                            {organizationWorkTime.booking_price && (
                              <div>
                                <p className="text-sm text-gray-600">
                                  {t("price")}
                                </p>
                                <p className="font-semibold text-gray-800">
                                  {organizationWorkTime.booking_price}{" "}
                                  {t("currency")}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Payment Form or Confirmation Button */}
                        {organizationWorkTime.booking_status === 1 ? (
                          <div className="space-y-4 border-t border-gray-300 pt-6">
                            {/* Payment Form Placeholder */}
                            <div className="space-y-4">
                              <button
                                onClick={handleConfirmBooking}
                                className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
                              >
                                {submiting ? (
                                  <VscLoading className="animate-spin" />
                                ) : (
                                  <div className="flex items-center gap-1">
                                    <FaMoneyBillWave />
                                    {t("proceedToPayment")}
                                  </div>
                                )}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4 border-t border-gray-300 pt-6">
                            <div className="text-md font-medium text-gray-800 flex items-center justify-center gap-2">
                              {submiting ? (
                                <VscLoading className="animate-spin" />
                              ) : (
                                <div className="flex items-center gap-1">
                                  <FaUserClock className="text-blue-500" />
                                  {t("confirmBooking")}
                                </div>
                              )}
                            </div>

                            <p className="text-gray-600 text-sm">
                              {t("confirmationMessage")}
                            </p>

                            <button
                              onClick={handleConfirmBooking}
                              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
                            >
                              <FaCheck />
                              {t("confirmBookingButton")}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">
                          {t("bookingNotAvailable")}
                        </p>
                        <button
                          onClick={resetForm}
                          className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                        >
                          {t("tryAgain")}
                        </button>
                      </div>
                    )}

                    <button
                      onClick={handleBack}
                      className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      {t("back")}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SelectTimePopup;
