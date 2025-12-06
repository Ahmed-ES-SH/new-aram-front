"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiLink,
  FiCopy,
  FiCheck,
  FiEye,
  FiShoppingCart,
  FiTrendingUp,
  FiUserPlus,
} from "react-icons/fi";
import { Promoter } from "./types";

interface ReferralLinkBoxProps {
  promoter: Partial<Promoter>;
}

export default function ReferralLinkBox({ promoter }: ReferralLinkBoxProps) {
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [copiedRegistration, setCopiedRegistration] = useState(false);

  const referralLink = `https://aram-gulf.com?ref=${promoter.referral_code}`;
  const registrationLink = `https://aram-gulf.com/signup?ref=${promoter.referral_code}`;

  const handleCopyReferral = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopiedReferral(true);
      setTimeout(() => setCopiedReferral(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCopyRegistration = async () => {
    try {
      await navigator.clipboard.writeText(registrationLink);
      setCopiedRegistration(true);
      setTimeout(() => setCopiedRegistration(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="space-y-8"
    >
      {/* الجزء الثاني: روابط الإحالة */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* رابط الإحالة */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-linear-to-l from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <FiLink className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-800 text-lg">رابط الزيارة</h3>
          </div>

          <p className="text-gray-600 mb-4 text-sm">
            شارك هذا الرابط لجلب زيارات جديدة وتحقيق عمولات
          </p>

          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white rounded-lg border border-blue-200 px-4 py-3">
              <p className="text-sm font-mono text-gray-700 truncate" dir="ltr">
                {referralLink}
              </p>
            </div>
            <button
              onClick={handleCopyReferral}
              className={`p-3 rounded-lg transition-all ${
                copiedReferral
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {copiedReferral ? (
                <FiCheck className="w-5 h-5" />
              ) : (
                <FiCopy className="w-5 h-5" />
              )}
            </button>
          </div>
        </motion.div>

        {/* رابط تسجيل عضو جديد */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-linear-to-l from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <FiUserPlus className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-gray-800 text-lg">
              رابط تسجيل عضو جديد
            </h3>
          </div>

          <p className="text-gray-600 mb-4 text-sm">
            شارك هذا الرابط لتسجيل أعضاء جدد في النظام
          </p>

          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white rounded-lg border border-green-200 px-4 py-3">
              <p className="text-sm font-mono text-gray-700 truncate" dir="ltr">
                {registrationLink}
              </p>
            </div>
            <button
              onClick={handleCopyRegistration}
              className={`p-3 rounded-lg transition-all ${
                copiedRegistration
                  ? "bg-green-500 text-white"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {copiedRegistration ? (
                <FiCheck className="w-5 h-5" />
              ) : (
                <FiCopy className="w-5 h-5" />
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
