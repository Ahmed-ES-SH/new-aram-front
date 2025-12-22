"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle, FiCheckCircle, FiMail, FiX } from "react-icons/fi";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { instance } from "@/app/_helpers/axios";

interface EmailVerificationAlertProps {
  isVerified: boolean;
  email: string;
}

export function EmailVerificationAlert({
  isVerified,
  email,
}: EmailVerificationAlertProps) {
  const t = useTranslations("userProfile");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [show, setShow] = useState(true);

  const handleSendVerification = async () => {
    setIsSending(true);
    try {
      const response = await instance.post(`/send-verify-email?email=${email}`);
      if (response.status == 200) {
        toast.success(
          "تم إرسال رسالة التفعيل الى البريد الالكترونى الخاص بك تحقق من صندوق البريد"
        );
        setIsSent(true);
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message ??
        "حدث خطأ غير متوقع أثناء إرسال رسالة التحقق حاول مره اخرى لاحقا!";
      toast.error(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="email-alert"
          initial={{ y: -10, scale: 0.95 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: -20, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className={`rounded-xl fixed top-32 ltr:right-4 rtl:left-4 w-fit opacity-60 hover:opacity-100 max-w-sm shadow-sm border p-6 z-50  transition-opacity duration-300 ${
            isVerified
              ? "bg-emerald-50 border-emerald-200"
              : "bg-amber-50 border-amber-200"
          }`}
        >
          {/* Close button */}
          <button
            onClick={() => setShow(false)}
            className="absolute top-2 ltr:right-2 rtl:left-2  text-red-400 hover:text-red-700 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-3">
            {isVerified ? (
              <FiCheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <FiAlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            )}

            <div className="flex-1">
              <h3
                className={`font-semibold text-balance ${
                  isVerified ? "text-emerald-900" : "text-amber-900"
                }`}
              >
                {isVerified ? t("emailVerified") : t("emailNotVerified")}
              </h3>

              <p
                className={`text-sm mt-1 text-pretty ${
                  isVerified ? "text-emerald-700" : "text-amber-700"
                }`}
              >
                {isVerified
                  ? t("emailVerifiedMessage")
                  : t("emailNotVerifiedMessage")}
              </p>

              {!isVerified && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendVerification}
                  disabled={isSending || isSent}
                  className={`mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                    isSent
                      ? "bg-emerald-600 text-white"
                      : "bg-amber-600 text-white hover:bg-amber-700"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSending ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      >
                        <FiMail className="w-4 h-4" />
                      </motion.div>
                      {t("sendingVerification")}
                    </>
                  ) : isSent ? (
                    <>
                      <FiCheckCircle className="w-4 h-4" />
                      {t("verificationSent")}
                    </>
                  ) : (
                    <>
                      <FiMail className="w-4 h-4" />
                      {t("sendVerification")}
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
