"use client";

import { motion } from "framer-motion";
import {
  FaShare,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";
import { ShareSectionProps } from "./types";

export default function ShareSection({
  locale,
  t,
  onShare,
}: ShareSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
          <FaShare className="text-white text-xl" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{t("share")}</h2>
          <p className="text-sm text-slate-500">
            {locale === "en" ? "Share with your friends" : "شارك مع أصدقائك"}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onShare("facebook")}
          className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-shadow"
        >
          <FaFacebook className="text-xl" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onShare("twitter")}
          className="w-14 h-14 rounded-2xl bg-linear-to-br from-sky-400 to-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-400/30 hover:shadow-xl hover:shadow-sky-400/40 transition-shadow"
        >
          <FaTwitter className="text-xl" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onShare("linkedin")}
          className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-700 to-blue-800 text-white flex items-center justify-center shadow-lg shadow-blue-700/30 hover:shadow-xl hover:shadow-blue-700/40 transition-shadow"
        >
          <FaLinkedin className="text-xl" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onShare("whatsapp")}
          className="w-14 h-14 rounded-2xl bg-linear-to-br from-green-500 to-green-600 text-white flex items-center justify-center shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-shadow"
        >
          <FaWhatsapp className="text-xl" />
        </motion.button>
      </div>
    </motion.div>
  );
}
