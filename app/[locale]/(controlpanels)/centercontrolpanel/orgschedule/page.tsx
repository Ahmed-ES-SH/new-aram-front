"use client";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/app/Store/hooks";
import { useLocale } from "next-intl";
import { instance } from "@/app/_helpers/axios";
import Calender from "@/app/_components/_website/_controlpanals/_centerorg/_centerSchedule/Calender";
import TimeSelector from "@/app/_components/_website/_controlpanals/_centerorg/_centerSchedule/TimeSelector";
import { toast } from "sonner";
import SpinLoading from "@/app/_components/_website/_global/SpinLoading";

export default function CenterSchedule() {
  const { user } = useAppSelector((state) => state.user);
  const locale = useLocale();
  const orgId = user && user.id;
  const [bookedAppointments, setBookedAppointments] = useState<any>([]);
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [stepError, setStepError] = useState<any>({ ar: "", en: "" });
  const steps = ["Day", "Time", "Finishe"];

  const successMessage =
    locale == "en"
      ? "Appointments have been successfully suspended."
      : "تم تعليق المواعيد المحددة بنجاح ";

  useEffect(() => {
    const getBookedAppointments = async () => {
      try {
        const response = await instance.get(`/all-times/${orgId}`);
        if (response.status === 200) {
          const data = response.data.data;
          setBookedAppointments(data.data);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    getBookedAppointments();
  }, [orgId]);

  const handleStepError = (messageAr: string, messageEn: string) => {
    setStepError({ ar: messageAr, en: messageEn });
  };

  const handleNextStep = () => {
    if (step < steps.length) {
      if (step === 1) {
        if (selectedDay) {
          setStep(step + 1);
          handleStepError("", ""); // إزالة الأخطاء
        } else {
          handleStepError("يرجى اختيار يوم.", "Please select a day.");
        }
      } else if (step === 2) {
        if (selectedTimes.length > 0) {
          setStep(step + 1);
          handleStepError("", ""); // إزالة الأخطاء
        } else {
          handleStepError("يرجى اختيار وقت.", "Please select a time.");
        }
      }
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setStepError({ ar: "", en: "" });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }

    try {
      if (selectedTimes.length === 0) {
        handleStepError("يرجى اختيار وقت.", "Please select a time.");
        return;
      }

      setLoading(true);

      // دالة لإضافة دقائق إلى الوقت المحدد
      const addMinutesToDateTime = (date: Date, minutes: number) => {
        const newDate = new Date(date);
        newDate.setMinutes(newDate.getMinutes() + minutes);
        return newDate;
      };

      // دالة لتنسيق التاريخ والوقت إلى الشكل المطلوب YYYY-MM-DD HH:mm:ss
      const formatDateTime = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = "00";
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      };

      // بناء المصفوفة دفعة واحدة
      const appointments = selectedTimes.map((time: string) => {
        const [hourStr, minuteStr] = time.split(":");
        const hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);

        // إنشاء تاريخ كامل بناءً على اليوم والوقت
        const startDate = new Date(selectedDay);
        startDate.setHours(hour, minute, 0, 0);

        const endDate = addMinutesToDateTime(startDate, 30); // نهاية الموعد بعد 30 دقيقة

        return {
          start_time: formatDateTime(startDate),
          end_time: formatDateTime(endDate),
          additional_notes: "",
          organization_id: orgId,
        };
      });

      // إرسال الطلب مرة واحدة فقط
      const response = await instance.post(`/pending-appointments/${orgId}`, {
        appointments,
      });

      if (response.status === 200) {
        const { data } = await instance.get(`/all-times/${orgId}`);
        setBookedAppointments(data.data.data);
        setSelectedDay(null);
        setSelectedTimes([]);
        setStep(1);
        toast.success(successMessage);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-[90vh]  w-full flex items-center justify-center">
        <SpinLoading />
      </div>
    );
  return (
    <>
      <div className="w-full p-4 min-h-[95vh] relative mt-4 pt-10">
        {step == 1 && (
          <Calender
            orgId={orgId as number}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            bookedAppointments={bookedAppointments}
          />
        )}
        {step === 2 && (
          <TimeSelector
            openAt={user && user.open_at}
            closeAt={user && user.close_at}
            selectedDay={selectedDay}
            selectedTimes={selectedTimes}
            setSelectedTimes={setSelectedTimes}
            bookedAppointments={bookedAppointments}
          />
        )}
        <p className="my-4 text-red-400 text-lg w-fit mx-auto pb-2 border-b border-red-400">
          {stepError && locale == "en" ? stepError.en : stepError.ar}
        </p>
        <div className="flex max-md:flex-col-reverse max-md:gap-4   items-center justify-between border-t border-primary w-[90%] mx-auto max-md:w-[97%] pt-8 my-4 ml-auto">
          <button
            onClick={handlePrevStep}
            className="min-w-[200px] max-md:w-[90%] mx-auto bg-gray-400   py-4 rounded-md  text-white text-center shadow-md "
          >
            {locale == "en" ? "Back" : "عودة"}
          </button>
          <button
            onClick={step == 2 ? handleSubmit : handleNextStep}
            disabled={!selectedDay}
            className="min-w-[200px] max-md:w-[90%] mx-auto disabled:bg-gray-400  bg-primary  py-4 rounded-md  text-white text-center shadow-md "
          >
            {step == 2
              ? locale == "en"
                ? "Suspend"
                : "تعليق"
              : locale == "en"
              ? "Next"
              : "التالى"}
          </button>
        </div>
      </div>
    </>
  );
}
