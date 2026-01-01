"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { instance } from "@/app/_helpers/axios";
import { toast } from "sonner";
import { useAppSelector } from "@/app/Store/hooks";
import { useTranslations } from "next-intl";
import CheckCurrentUserPopup from "../../_website/_global/CheckCurrentUserPopup";
import {
  TimeSlot,
  BookedDate,
  OrganizationWorkTimeResponse,
  OrganizationTimesResponse,
  BookingSummary,
  SelectTimePopupProps,
} from "./types";
import SelectDate from "./SelectDate";
import SelectTime from "./SelectTime";
import ConfirmBooking from "./ConfirmBooking";

export default function SelectTimePopup({
  isOpen,
  onClose,
  organizationId,
  organizationTitle,
}: SelectTimePopupProps) {
  const { user } = useAppSelector((state) => state.user);
  const t = useTranslations("selectTime");
  const isMounted = useRef(true);

  const [currentStep, setCurrentStep] = useState(1);
  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([]);
  const [bookedDates, setBookedDates] = useState<BookedDate[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [organizationWorkTime, setOrganizationWorkTime] =
    useState<OrganizationWorkTimeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submiting, setSubmiting] = useState(false);
  const [checkCurrentuser, setCheckCurrentuser] = useState(false);
  const [error, setError] = useState("");

  // Fetch Data when open
  useEffect(() => {
    if (isOpen) {
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

  const fetchOrganizationData = useCallback(
    async (date?: string) => {
      setIsLoading(true);
      try {
        const targetDate = date ?? selectedDate;
        if (!targetDate) {
          // إذا لم يوجد تاريخ لا تجلب
          setIsLoading(false);
          return;
        }

        const res = await instance.get(
          `/organizations/${organizationId}/all-times?date=${encodeURIComponent(
            targetDate
          )}`
        );
        const data: OrganizationTimesResponse = res.data.data;

        if (!isMounted.current) return;

        setAvailableTimes(data.all_times);
        setBookedDates(data.booked_dates || []);
      } catch (err) {
        console.error(err);
        if (!isMounted.current) return;
        setError(t("errors.fetchData"));
      } finally {
        if (isMounted.current) setIsLoading(false);
      }
    },
    [organizationId, selectedDate, t]
  ); // ضع المتغيرات الصحيحة هنا

  const fetchBookingStatus = async () => {
    setIsLoading(true);
    try {
      const res = await instance.get(
        `/organization-time-work/${organizationId}`
      );
      const data: OrganizationWorkTimeResponse = res.data.data;
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

  const handleBack = () => setCurrentStep((prev) => Math.max(1, prev - 1));

  const confirmWithPay = async (bookingSummary: BookingSummary) => {
    try {
      if (!user) {
        setCheckCurrentuser(true);
        return;
      }
      setSubmiting(true);
      const formdata = new FormData();
      if (user) formdata.append("account_type", user.account_type);
      if (user) formdata.append("user_id", user.id.toString());
      formdata.append("is_paid", "1");
      formdata.append("data_type", "book");
      formdata.append("total_invoice", bookingSummary.price?.toString() || "");
      formdata.append("bookDetailes", JSON.stringify(bookingSummary));
      formdata.append("invoice_type", "book");
      formdata.append("payment_method", "thawani");

      const res = await instance.post(`/payment/create-session`, formdata);
      if (res.status === 200) {
        toast.loading(t("redirectingToPayment"));
        const sessionId = res.data.data.session_id;
        const checkoutUrl = `https://uatcheckout.thawani.om/pay/${sessionId}?key=${process.env.NEXT_PUBLIC_THAWANI_PUBLISHABLE_KEY}`;
        window.location.href = checkoutUrl;
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSubmiting(false);
    }
  };

  const confirmWithoutPay = async (bookingSummary: BookingSummary) => {
    try {
      setSubmiting(true);
      const formData = new FormData();

      if (bookingSummary.userId)
        formData.append("user_id", bookingSummary?.userId.toString());
      formData.append("start_time", bookingSummary.formatDate);
      formData.append("user_notes", bookingSummary.notes);
      formData.append("is_paid", "1");
      formData.append("data_type", "book");
      const res = await instance.post(
        `/organizations/${organizationId}/appointments`,
        formData
      );
      if (res.status === 201) {
        toast.success(t("bookingSuccess"));
        onClose();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSubmiting(false);
    }
  };

  const handleConfirmBooking = async () => {
    const bookingSummary: BookingSummary = {
      date: selectedDate,
      time: selectedTime,
      price: organizationWorkTime?.confirmation_price,
      orgTitle: organizationTitle,
      userId: user?.id || null,
      orgId: organizationId,
      is_paid: organizationWorkTime?.confirmation_status ? "1" : "0",
      formatDate: `${selectedDate} ${selectedTime}`,
      endTime: "",
      notes: "",
    };

    if (organizationWorkTime?.confirmation_status === 1) {
      await confirmWithPay(bookingSummary);
    } else {
      await confirmWithoutPay(bookingSummary);
    }
  };

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

  useEffect(() => {
    if (!isOpen) return;
    if (!selectedDate) return;

    fetchOrganizationData(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedDate]);

  return (
    <>
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
              className="bg-white rounded-2xl shadow-xl w-full max-w-5xl lg:h-[70vh] h-full hidden-scrollbar overflow-y-auto"
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

              <div className="p-6">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <SelectDate
                      bookedDates={bookedDates}
                      selectedDate={selectedDate}
                      onSelect={handleDateSelect}
                      isLoading={isLoading}
                      tNamespace="selectTime"
                    />
                  )}

                  {currentStep === 2 && (
                    <SelectTime
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      availableTimes={availableTimes}
                      onSelect={handleTimeSelect}
                      onBack={handleBack}
                      tNamespace="selectTime"
                      loading={isLoading}
                    />
                  )}

                  {currentStep === 3 && (
                    <ConfirmBooking
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      organizationTitle={organizationTitle}
                      organizationWorkTime={organizationWorkTime}
                      submiting={submiting}
                      isLoading={isLoading}
                      onConfirm={handleConfirmBooking}
                      onBack={handleBack}
                      onRetry={resetForm}
                      tNamespace="selectTime"
                    />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CheckCurrentUserPopup
        isOpen={checkCurrentuser}
        onClose={() => setCheckCurrentuser(false)}
      />
    </>
  );
}
