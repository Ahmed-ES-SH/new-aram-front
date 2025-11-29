"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";

interface PromoterDataNotFoundProps {
  customMessage?: string;
}

const PromoterDataNotFound: React.FC<PromoterDataNotFoundProps> = ({
  customMessage,
}) => {
  const router = useRouter();

  const handleRetry = () => {
    router.back();
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
      >
        {/* أيقونة التنبيه */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-6"
        >
          <FiAlertCircle className="w-24 h-24 text-amber-500" />
        </motion.div>

        {/* الرسالة الرئيسية */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-800 mb-4"
        >
          بيانات المروج غير متوفرة
        </motion.h2>

        {/* الرسالة التفصيلية */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-8 max-w-md text-lg"
        >
          {customMessage ||
            "لم نتمكن من العثور على البيانات المطلوبة للمروج. قد يكون السبب أن البيانات غير مسجلة بعد أو هناك مشكلة في الاتصال."}
        </motion.p>

        {/* زر إعادة المحاولة */}
        {
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={handleRetry}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
          >
            <FiRefreshCw className="w-5 h-5" />
            عودة
          </motion.button>
        }
      </motion.div>
    </div>
  );
};

export default PromoterDataNotFound;
