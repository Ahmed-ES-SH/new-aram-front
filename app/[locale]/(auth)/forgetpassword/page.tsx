"use client";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FiMail, FiCheckCircle, FiEyeOff, FiEye } from "react-icons/fi";
import { useLocale, useTranslations } from "next-intl";
import { directionMap } from "@/app/constants/_website/global";
import { toast } from "sonner";
import { instance } from "@/app/_helpers/axios";
import { VscLoading } from "react-icons/vsc";
import { useRouter } from "next/navigation";

export default function ForgetPassword() {
  const t = useTranslations("forgetPassword");
  const locale = useLocale();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // Step 1: email, Step 2: OTP
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Handle OTP input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const val = e.target.value;
    if (/^[0-9]?$/.test(val)) {
      const newOtp = [...otp];
      newOtp[index] = val;
      setOtp(newOtp);

      // Move focus to next input if not last
      if (val && index < 4) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Handle paste for full OTP
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    let pasteData = e.clipboardData.getData("Text").slice(0, 5).split("");

    // If Arabic locale, reverse the order
    if (locale === "ar") {
      pasteData = pasteData.reverse();
    }

    const newOtp = [...otp];
    pasteData.forEach((char, i) => {
      if (/^[0-9]$/.test(char) && i < 5) {
        newOtp[i] = char;
      }
    });
    setOtp(newOtp);

    // Focus last filled input
    const lastIndex = pasteData.length > 4 ? 4 : pasteData.length - 1;
    inputsRef.current[lastIndex]?.focus();
  };

  // Handle email submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await instance.post(`/send-otp`, { email });
      if (response.status == 200) {
        setStep(2);
        toast.success("تم إرسال كود التحقق الى بريدك الالكترونى بنجاح");
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message ||
        "حدث خطا غير متوقع اثناء إرسال الكود الى البريد الالكترونى";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await instance.post(`/verify-otp`, {
        email,
        otp: otpString,
      });
      if (response.status == 200) {
        setStep(3);
        toast.success("نجح التحقق من الكود بنجاح .");
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message ||
        "حدث خطا غير متوقع اثناء التحقق من الكود";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length <= 8) {
      toast.error("تاكد من ان كلمة السر 8 حروف اقل شئ .");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("تأكد من ان كلمة السر وتاكيد كلمة السر متطابقان");
      return;
    }

    try {
      setLoading(true);
      const response = await instance.post(`/reset-password`, {
        email,
        otp: otpString,
        password,
      });
      if (response.status == 200) {
        setStep(3);
        toast.success(
          "تم إعادة تعيين كلمة السر بنجاح جارى اعادة توجيهك الى صفحة تسجيل الدخول ."
        );
        setTimeout(() => {
          router.push(`/${locale}/login`);
        }, 500);
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message ||
        "حدث خطا غير متوقع اثناء إعادة تعيين كلمة السر";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const otpString =
    locale === "ar"
      ? otp.slice().reverse().join("") // إذا واجهت أن الترتيب في الـ RTL عكسي، استخدم هذا السطر
      : otp.join("");

  return (
    <div
      dir={directionMap[locale]}
      className="min-h-screen flex items-center justify-center bg-gray-50"
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
      >
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-center">
              {t("titleStep1")}
            </h2>
            <div className="flex flex-col">
              <label className="text-gray-700 mb-2">{t("emailLabel")}</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 pr-4 border-gray-300 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder={t("emailPlaceholder")}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 disabled:bg-blue-200 text-white py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
            >
              {loading ? (
                <VscLoading className="animate-spin" />
              ) : (
                t("sendButton")
              )}
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6 items-center">
            <h2 className="text-2xl font-bold text-center">
              {t("titleStep2")}
            </h2>
            <p className="text-gray-500 text-center">{t("otpDescription")}</p>
            <div className="flex gap-3 mt-4">
              {otp.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={value}
                  ref={(el: any) => (inputsRef.current[index] = el)}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center border border-gray-300 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              ))}
            </div>
            <button
              onClick={handleVerify}
              disabled={loading}
              className="mt-6 flex items-center justify-center gap-2 bg-green-500 disabled:bg-green-200 text-white py-2 px-4 rounded-lg hover:bg-green-600"
            >
              {loading ? (
                <VscLoading />
              ) : (
                <div className="flex items-center gap-2">
                  <FiCheckCircle /> {t("verifyButton")}
                </div>
              )}
            </button>
          </div>
        )}

        {step == 3 && (
          <div className="space-y-4 w-full max-w-sm">
            {/* Password field */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={
                  locale === "ar" ? "كلمة المرور الجديدة" : "New Password"
                }
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

            {/* Confirm password field */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder={
                  locale === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"
                }
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? (
                  <FiEyeOff size={20} />
                ) : (
                  <FiEye size={20} />
                )}
              </button>
            </div>

            {/* Submit button */}
            <button
              type="button"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              onClick={handleResetPassword}
            >
              {locale === "ar" ? "إرسال" : "Submit"}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
