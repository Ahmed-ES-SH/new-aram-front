"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { BiSupport } from "react-icons/bi";
import ContactPopup from "./ContactPopup";
import { useLocale } from "next-intl";
import { FaWhatsapp } from "react-icons/fa";

export default function CTAServiceSection({
  t,
  whatsappNumber,
  serviceId,
}: {
  t: any;
  whatsappNumber: string | number;
  serviceId: string | number;
}) {
  const locale = useLocale();
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleRouteToWhatsApp = () => {
    window.open(`https://wa.me/${whatsappNumber}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden"
    >
      <div className="main-gradient rounded-3xl p-12 lg:p-16 text-center relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            {t.ctaTitle}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-lg text-white/90 mb-8 max-w-2xl mx-auto"
          >
            {t.ctaSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
              }}
              onClick={handleRouteToWhatsApp}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 bg-green-400 border-2 border-green-400 text-white rounded-full font-bold shadow-xl hover:shadow-2xl transition-all"
            >
              <FaWhatsapp className="text-xl" />
              <span>{locale == "ar" ? "واتساب" : "WhatsApp"}</span>
            </motion.button>

            <motion.button
              onClick={() => setIsContactOpen(true)}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-lg text-white rounded-full font-bold border-2 border-white/30 shadow-xl hover:bg-white/20 transition-all"
            >
              <BiSupport className="text-xl" />
              <span>{locale == "ar" ? "تواصل معنا" : "Contact Us"}</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
      <ContactPopup
        isOpen={isContactOpen}
        serviceId={serviceId}
        onClose={() => setIsContactOpen(false)}
      />
    </motion.div>
  );
}
