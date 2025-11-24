"use client";
import React from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";

export default function TimeSelector({
  openAt,
  closeAt,
  selectedTimes,
  setSelectedTimes,
  selectedDay,
  bookedAppointments,
}: any) {
  const locale = useLocale();

  // Generate time slots between open and close (30-min steps)
  const generateTimeSlots = (openAt: string, closeAt: string) => {
    const slots: string[] = [];
    const [openHour, openMinute] = openAt.split(":").map(Number);
    const [closeHour, closeMinute] = closeAt.split(":").map(Number);

    const current = new Date();
    current.setHours(openHour, openMinute, 0, 0);

    const end = new Date();
    end.setHours(closeHour, closeMinute, 0, 0);

    while (current <= end) {
      slots.push(
        current.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // 24h format
        })
      );
      current.setMinutes(current.getMinutes() + 30);
    }

    return slots;
  };

  // Generate all time slots
  const timeSlots = generateTimeSlots(openAt, closeAt);

  // Get all booked times for the selected day
  const getBookedTimesForSelectedDay = (selectedDay: Date) => {
    const selectedDateString = selectedDay.toLocaleDateString("en-CA"); // YYYY-MM-DD
    const appointment = bookedAppointments.find(
      (a: any) => a.book_day === selectedDateString
    );

    if (!appointment || !appointment.times) return [];
    return appointment.times.map((t: any) => t.time);
  };

  // Check if a time slot is already booked
  const isBooked = (time: string) => {
    const bookedTimes = getBookedTimesForSelectedDay(selectedDay);
    // normalize both to HH:MM
    return bookedTimes.some(
      (booked) => booked.trim().slice(0, 5) === time.trim().slice(0, 5)
    );
  };

  // Handle select/unselect
  const toggleTime = (time: string) => {
    if (isBooked(time)) return; // Prevent selecting booked time

    const updatedTimes = selectedTimes || [];
    if (updatedTimes.includes(time)) {
      setSelectedTimes(updatedTimes.filter((t: string) => t !== time));
    } else {
      setSelectedTimes([...updatedTimes, time]);
    }
  };

  return (
    <>
      <h2 className="text-xl max-md:text-md w-fit mx-auto text-center my-4 pb-3 border-b border-primary">
        {locale === "en"
          ? "Setting pending appointments"
          : "تحديد المواعيد المعلقة"}
      </h2>

      <div className="relative overflow-y-auto overflow-x-hidden p-4 h-[60vh]">
        {timeSlots.map((time, index) => {
          const booked = isBooked(time);
          const isSelected = (selectedTimes || []).includes(time);

          return (
            <motion.div
              key={index}
              whileHover={{ scale: booked ? 1 : 1.05 }}
              whileTap={{ scale: booked ? 1 : 0.95 }}
              onClick={() => toggleTime(time)}
              style={{ cursor: booked ? "not-allowed" : "pointer" }}
              className={`p-4 my-4 text-center rounded-lg cursor-pointer select-none transition duration-150
                ${
                  booked
                    ? "bg-red-200 text-red-700 "
                    : isSelected
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-orange-300 hover:text-white"
                }`}
            >
              {time}
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
