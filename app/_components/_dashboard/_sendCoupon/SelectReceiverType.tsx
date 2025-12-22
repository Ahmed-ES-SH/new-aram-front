"use client";

import type { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { HiUser, HiGlobeAlt } from "react-icons/hi2";
import { GiMeepleGroup } from "react-icons/gi";

interface Props {
  setSelectedType: Dispatch<
    SetStateAction<"organization" | "user" | "general" | "">
  >;
}

export default function SelectReceiverType({ setSelectedType }: Props) {
  const receiverTypes = [
    {
      id: "organization" as const,
      title: "المراكز",
      description: "إرسال الكوبون إلى المراكز",
      icon: GiMeepleGroup,
      color: "from-blue-500 to-blue-600",
      colorText: "text-blue-500",
      hoverColor: "hover:from-blue-600 hover:to-blue-700",
    },
    {
      id: "user" as const,
      title: "المستخدمين",
      description: "إرسال الكوبون إلى مستخدمين محددين",
      icon: HiUser,
      color: "from-green-500 to-green-600",
      colorText: "text-green-500",
      hoverColor: "hover:from-green-600 hover:to-green-700",
    },
    {
      id: "general" as const,
      title: "كوبون عام",
      description: "إرسال الكوبون بشكل عام للجميع",
      icon: HiGlobeAlt,
      color: "from-purple-500 to-purple-600",
      colorText: "text-purple-500",
      hoverColor: "hover:from-purple-600 hover:to-purple-700",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-6"
      >
        {/* Options */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {receiverTypes.map((type) => {
            const IconComponent = type.icon;

            return (
              <motion.button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`
                  relative overflow-hidden rounded-2xl p-8 text-white
                  bg-gradient-to-br ${type.color} ${type.hoverColor}
                  transform transition-all duration-300 ease-out
                  hover:scale-105 hover:shadow-2xl
                  focus:outline-none focus:ring-4 focus:ring-opacity-50
                  focus:ring-blue-400 active:scale-95
                `}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: receiverTypes.indexOf(type) * 0.1,
                }}
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <div className="w-full h-full bg-white rounded-full transform translate-x-8 -translate-y-8" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`p-4 bg-white bg-opacity-20 rounded-full ${type.colorText}`}
                  >
                    <IconComponent className="w-8 h-8 " />
                  </motion.div>

                  <div>
                    <h3 className="text-xl font-bold mb-2">{type.title}</h3>
                    <p className="text-sm opacity-90 leading-relaxed">
                      {type.description}
                    </p>
                  </div>
                </div>

                {/* Hover effect overlay */}
                <motion.div
                  className="absolute inset-0 bg-white opacity-0"
                  whileHover={{ opacity: 0.1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            );
          })}
        </motion.div>

        {/* Footer */}
        <motion.div variants={itemVariants} className="text-center">
          <p className="text-sm text-gray-500">
            اضغط على أحد الخيارات أعلاه للمتابعة
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
