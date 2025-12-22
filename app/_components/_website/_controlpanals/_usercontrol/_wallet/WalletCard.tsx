"use client";
// Reusable card component
import { motion } from "framer-motion";

interface props {
  title: string;
  value: string | number;
  icon: React.ElementType;
  gradient: string;
  delay: number;
}

export default function WalletCard({
  title,
  value,
  icon: Icon,
  gradient,
  delay,
}: props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.03 }}
      className={`flex flex-col items-start justify-between p-6 rounded-2xl shadow-md text-gray-800 ${gradient}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-white/60 rounded-full shadow-sm">
          <Icon className="text-2xl text-emerald-600" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-emerald-700">{value}</p>
    </motion.div>
  );
}
