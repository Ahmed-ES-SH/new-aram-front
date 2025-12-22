"use client";

import Link from "next/link";
import { easeInOut, motion } from "framer-motion";
import { FaExclamationTriangle, FaHome, FaRocket } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import "./globals.css";

export default function NotFound() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeInOut },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-5, 5, -5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: easeInOut,
      },
    },
  };

  const sparkleVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: easeInOut,
      },
    },
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        "0 0 20px rgba(255, 169, 77, 0.3)", // light orange glow
        "0 0 40px rgba(255, 169, 77, 0.6)",
        "0 0 20px rgba(255, 169, 77, 0.3)",
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: easeInOut,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 text-blue-400/20"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <HiSparkles size={60} />
        </motion.div>
        <motion.div
          className="absolute top-40 right-32 text-purple-400/20"
          animate={{
            rotate: -360,
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <FaRocket size={40} />
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-32 text-pink-400/20"
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <HiSparkles size={80} />
        </motion.div>
      </div>

      <motion.div
        className="text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Floating warning icon */}
        <motion.div
          className="flex justify-center mb-8"
          variants={floatingVariants}
          animate="animate"
        >
          <motion.div
            className="relative"
            variants={sparkleVariants}
            animate="animate"
          >
            <FaExclamationTriangle className="text-8xl text-yellow-400 drop-shadow-2xl" />
            <motion.div
              className="absolute -inset-4 bg-yellow-400/20 rounded-full blur-xl"
              variants={glowVariants}
              animate="animate"
            />
          </motion.div>
        </motion.div>

        {/* 404 Title with gradient */}
        <motion.div variants={itemVariants} className="mb-6">
          <motion.h1
            className="text-8xl md:text-9xl font-black bg-gradient-to-r from-blue-400 via-primary to-pink-500 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundSize: "200% 200%",
            }}
          >
            404
          </motion.h1>
        </motion.div>

        {/* Arabic description */}
        <motion.div variants={itemVariants} className="mb-8">
          <p className="text-xl md:text-2xl text-gray-300 font-medium leading-relaxed">
            الصفحة التي تبحث عنها غير موجودة
          </p>
          <motion.p
            className="text-sm md:text-base text-gray-400 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            ربما تم نقلها أو حذفها، أو ربما كتبت الرابط خطأ
          </motion.p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/">
            <motion.div
              className="group relative px-8 py-4 bg-gradient-to-r from-mid-primary to-primary text-white font-semibold rounded-xl shadow-2xl cursor-pointer overflow-hidden"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(255, 169, 77, 0.4)", // orange hover glow
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0 0 0px #FFA94D",
                  "0 0 10px #FFA94D",
                  "0 0 0px #FFA94D",
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <div className="relative flex items-center gap-3">
                <FaHome className="text-lg" />
                <span className="text-lg">العودة إلى الصفحة الرئيسية</span>
              </div>
            </motion.div>
          </Link>

          <motion.button
            className="px-6 py-3 border-2 border-gray-400 text-gray-300 font-medium rounded-xl hover:border-white hover:text-white transition-all duration-300"
            whileHover={{
              scale: 1.05,
              borderColor: "#ffffff",
              color: "#ffffff",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
          >
            العودة للخلف
          </motion.button>
        </motion.div>

        {/* Animated dots */}
        <motion.div
          className="flex justify-center gap-2 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 bg-gradient-to-r from-orange-300 to-orange-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
