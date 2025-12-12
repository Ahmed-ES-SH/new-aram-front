"use client";
import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { instance } from "@/app/_helpers/axios";

export default function Whatsappbtn() {
  const [whatsappNumber, setWhatsappNumber] = useState(""); // حالة لتخزين رقم الواتساب

  // جلب رقم الواتساب من الـ API
  const fetchContactInfo = async () => {
    try {
      const response = await instance.get("/get-whatsapp-number");
      const data = response.data.data;
      setWhatsappNumber(data.whatsapp_number);
    } catch (error) {
      console.error("Error fetching contact info:", error);
    }
  };

  // فتح رابط الواتساب
  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${whatsappNumber}`;
    window.open(whatsappUrl, "_blank");
  };

  useEffect(() => {
    fetchContactInfo();
  }, []);

  return (
    <button
      onClick={handleWhatsAppClick}
      className="flex items-center justify-center opacity-50 hover:opacity-100  p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-300"
    >
      <FaWhatsapp size={24} />
    </button>
  );
}
