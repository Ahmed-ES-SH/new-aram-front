"use client";
import React, { useState } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

interface props {
  orgId: number;
  bookedAppointments: any;
  setSelectedDay: any;
  selectedDay: any;
}

export default function Calender({
  setSelectedDay,
  selectedDay,
  bookedAppointments,
}: props) {
  const [bookDay, setBookDay] = useState(new Date());
  const currentDate = new Date(); // الحصول على التاريخ الحالي
  const daysInMonth = Array.from(
    {
      length: new Date(
        bookDay.getFullYear(),
        bookDay.getMonth() + 1,
        0
      ).getDate(),
    },
    (_, i) => new Date(bookDay.getFullYear(), bookDay.getMonth(), i + 1)
  );

  const handleNextMonth = () => {
    setBookDay(new Date(bookDay.getFullYear(), bookDay.getMonth() + 1, 1));
  };

  const handlePrevMonth = () => {
    setBookDay(new Date(bookDay.getFullYear(), bookDay.getMonth() - 1, 1));
  };

  const isDayBooked = (day: Date) => {
    const dayString = day.toLocaleDateString("en-CA"); // تنسيق YYYY-MM-DD باستخدام التوقيت المحلي
    return (
      bookedAppointments.some(
        (appointment: any) => appointment.book_day === dayString
      ) ?? false
    );
  };

  const isPastDay = (day: any) => {
    // التحقق إذا كان اليوم قد مضى عن اليوم الحالي
    return day < currentDate.setHours(0, 0, 0, 0); // التحقق من الأيام السابقة فقط
  };

  return (
    <>
      <div className="w-[90%]  mx-auto max-md:w-[97%] ">
        <div className="flex items-center justify-between pb-4 border-b border-primary mb-4">
          <button
            onClick={handlePrevMonth}
            className="text-gray-600  border-primary -400 border rounded-full p-3 hover:bg-primary hover:text-white cursor-pointer duration-200 hover:scale-110 "
          >
            <AiOutlineLeft size={24} />
          </button>
          <p className="text-gray-700  font-semibold">
            {bookDay.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <button
            onClick={handleNextMonth}
            className="text-gray-600  border-primary -400 border rounded-full p-3 hover:bg-primary hover:text-white cursor-pointer duration-200 hover:scale-110"
          >
            <AiOutlineRight size={24} />
          </button>
        </div>

        {/* Days of the week */}
        <div className="grid grid-cols-7 gap-2 text-center text-gray-700 font-medium">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (day, index) => (
              <div
                key={index}
                className="border bg-primary text-white text-center rounded-md shadow-md py-1"
              >
                {day}
              </div>
            )
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-7 h-3/4 max-md:h-fit mt-4 gap-y-8 gap-x-3">
          {daysInMonth.map((day) => (
            <button
              key={day.toISOString()}
              onClick={() => !isPastDay(day) && setSelectedDay(day)} // لا يمكن اختيار الأيام السابقة
              className={`py-6 px-4 max-md:py-4 max-md:px-2 text-center rounded-lg ${
                selectedDay?.toDateString() === day.toDateString()
                  ? "bg-primary text-white"
                  : isPastDay(day)
                  ? "bg-gray-500 text-white cursor-not-allowed" // لون الأيام التي تسبق اليوم
                  : isDayBooked(day)
                  ? "bg-red-300 text-white"
                  : "bg-gray-200 text-gray-700"
              } hover:bg-orange-400 duration-150 hover:text-white`}
              disabled={isPastDay(day)} // تعطيل الأيام السابقة
            >
              {day.getDate()}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
