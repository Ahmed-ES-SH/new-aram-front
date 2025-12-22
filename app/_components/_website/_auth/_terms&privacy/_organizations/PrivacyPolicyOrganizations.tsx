"use client";
import { directionMap } from "@/app/constants/_website/global";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";

export default function PrivacyPolicyOrganizations({ policies }) {
  const locale = useLocale();

  return (
    <div
      dir={directionMap[locale]}
      className="p-6 mt-24 min-h-screen bg-gray-50  text-gray-800  rounded-lg shadow-md"
    >
      <h2 className="text-2xl pb-3 border-b border-sky-400 w-fit mx-auto font-bold mb-4 text-center">
        {locale == "en" ? "Privacy Policy Centers" : "سياسات الخصوصية للمراكز"}
      </h2>
      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-3 mt-6"
      >
        {policies.map((policy, index) => (
          <motion.li
            key={index}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-2"
          >
            <span className="w-2.5 h-2.5 mt-1 bg-blue-500 rounded-full flex-shrink-0"></span>
            <p className="text-sm sm:text-base">
              {locale == "en" ? policy.content_en : policy.content_ar}
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
