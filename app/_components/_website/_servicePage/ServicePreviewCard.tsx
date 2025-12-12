"use client";
import { LocaleType } from "@/app/types/_dashboard/GlobalTypes";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import {
  FaPhone,
  FaWhatsapp,
  FaLinkedin,
  FaStar,
  FaInstagram,
  FaTiktok,
  FaSnapchat,
  FaShareAlt,
} from "react-icons/fa";

interface PreviewCardProps {
  activeFeatureId: string;
  ctaText: string;
}

export default function PreviewCard({
  activeFeatureId,
  ctaText,
}: PreviewCardProps) {
  const locale = useLocale() as LocaleType;

  // Render different content inside the phone based on active feature
  const renderPhoneContent = () => {
    switch (activeFeatureId) {
      case "business-card":
        return (
          <div className="flex flex-col items-center justify-center h-full p-4 space-y-3">
            <div className="w-20 h-20 bg-primary/10 rounded-full mb-2 overflow-hidden border-2 border-primary shadow-sm">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="Avatar"
                className="w-full h-full"
              />
            </div>
            <h4 className="font-bold text-slate-800">John Doe</h4>
            <p className="text-xs text-slate-500">CEO & Founder</p>
            <div className="flex gap-2 mt-2">
              <div className="p-2 bg-primary/10 text-primary rounded-full">
                <FaPhone size={12} />
              </div>
              <div className="p-2 bg-primary/10 text-primary rounded-full">
                <FaWhatsapp size={12} />
              </div>
              <div className="p-2 bg-primary/10 text-primary rounded-full">
                <FaLinkedin size={12} />
              </div>
            </div>
          </div>
        );
      case "smart-menu":
        return (
          <div className="h-full overflow-hidden relative bg-orange-50/50">
            <div className="h-1/3 bg-orange-500 rounded-b-3xl absolute top-0 w-full" />
            <div className="relative z-10 p-4 pt-8">
              <div className="bg-white p-3 rounded-xl shadow-sm mb-2 flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🍔</span>
                </div>
                <div>
                  <div className="h-2 w-20 bg-slate-200 rounded mb-1"></div>
                  <div className="h-2 w-10 bg-slate-100 rounded"></div>
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🍕</span>
                </div>
                <div>
                  <div className="h-2 w-20 bg-slate-200 rounded mb-1"></div>
                  <div className="h-2 w-10 bg-slate-100 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        );
      case "google-review":
        return (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="text-yellow-400 text-4xl mb-2 flex gap-1">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>
            <h4 className="font-bold text-slate-800 text-lg mb-1">Google</h4>
            <p className="text-xs text-slate-500 mb-4">Rate us 5 stars!</p>
            <div className="w-full h-8 bg-blue-600 rounded-lg"></div>
          </div>
        );
      case "social-media":
      default:
        // The default "Social Media" view similar to the screenshot
        return (
          <div className="relative h-full w-full flex items-center justify-center">
            {/* Floating Icons Animation */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 bg-linear-to-tr from-yellow-400 to-pink-500 text-white p-2 rounded-xl shadow-lg z-20"
            >
              <FaInstagram size={20} />
            </motion.div>

            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute top-1/3 right-1/4 bg-black text-white p-2 rounded-xl shadow-lg z-10"
            >
              <FaTiktok size={18} />
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute bottom-1/3 left-1/3 bg-yellow-400 text-white p-2 rounded-xl shadow-lg z-30"
            >
              <FaSnapchat size={20} />
            </motion.div>

            {/* Phone Graphic */}
            <div className="relative z-0 w-32 h-56 bg-slate-900 rounded-4xl border-4 border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center">
              {/* Screen Reflection */}
              <div className="absolute top-0 right-0 w-full h-full bg-linear-to-bl from-white/10 to-transparent pointer-events-none"></div>
              <div className="text-white/20 text-4xl">
                <FaShareAlt />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full min-h-[500px] bg-primary/10 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-linear(circle_at_50%_120%,rgba(120,50,255,0.1),transparent_70%)] pointer-events-none" />

      {/* Main Content Area */}
      <motion.div
        key={activeFeatureId}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-64 h-[450px] bg-white rounded-[2.5rem] shadow-2xl border-[6px] border-slate-900 overflow-hidden"
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-b-xl z-50"></div>

        {/* Dynamic Screen Content */}
        <div className="w-full h-full bg-slate-50 pt-8">
          {renderPhoneContent()}
        </div>
      </motion.div>
    </div>
  );
}
