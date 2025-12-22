"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import {
  FaMoneyBillWave,
  FaPaypal,
  FaUniversity,
  FaEnvelope,
  FaCreditCard,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";
import { WithdrawFormData, WithdrawMethod } from "./withdraw";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { setWithdrawOpen } from "@/app/Store/variablesSlice";
import { instance } from "@/app/_helpers/axios";
import { toast } from "sonner";
import {
  updateAvailableBalance,
  updateTotalBalance,
} from "@/app/Store/walletSlice";
import { Transaction } from "../types";

interface props {
  setTransactions: Dispatch<SetStateAction<Transaction[]>>;
}

export default function WithdrawForm({ setTransactions }: props) {
  const { user } = useAppSelector((state) => state.user);
  const { available_balance, total_balance } = useAppSelector(
    (state) => state.wallet
  );
  const { withdrawOpen } = useAppSelector((state) => state.variables);

  const dispatch = useAppDispatch();

  const locale = useLocale();

  const t = useTranslations("withdraw");
  const [formData, setFormData] = useState<WithdrawFormData>({
    user_id: null,
    type: null,
    amount: 0,
    method: "bank",
    bank_number: "",
    details: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof WithdrawFormData, string>>
  >({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof WithdrawFormData, string>> = {};

    // Minimum amount check
    if (!formData.amount || formData.amount < 20) {
      newErrors.amount = t("validation.amountMin20"); // e.g., "The minimum withdrawal amount is 20"
    }
    // Check if user has enough balance
    else if (formData.amount > available_balance) {
      newErrors.amount = t("validation.insufficientBalance"); // e.g., "You don't have enough balance"
    }

    // Bank or PayPal account check
    if (!formData.bank_number.trim()) {
      newErrors.bank_number =
        formData.method === "bank"
          ? t("validation.bankNumberRequired")
          : t("validation.paypalEmailRequired");
    }

    // PayPal email format check
    if (formData.method === "paypal" && !isValidEmail(formData.bank_number)) {
      newErrors.bank_number = t("validation.invalidEmail");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (
    field: keyof WithdrawFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (submitError) {
      setSubmitError("");
    }
  };

  const handleMethodChange = (method: WithdrawMethod) => {
    handleInputChange("method", method);
    // Clear bank number when switching methods
    handleInputChange("bank_number", "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setErrors({});

    if (!validateForm()) {
      return;
    }

    if (!user) return;

    setLoading(true);
    try {
      const response = await instance.post(`/wallet/withdraw`, formData);
      if (response.status == 200) {
        const data = response.data.data;
        toast.success(t("messages.success"));
        dispatch(
          updateAvailableBalance(
            Number(available_balance - Number(formData.amount))
          )
        );
        dispatch(
          updateTotalBalance(Number(total_balance - Number(formData.amount)))
        );
        dispatch(setWithdrawOpen(false));
        setTransactions((prev) => [data.transaction, ...prev]);
        // Reset form
        setFormData({
          user_id: user?.id,
          type: user?.account_type,
          amount: 0,
          method: "bank",
          bank_number: "",
          details: "",
        });
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message[locale] ??
        error?.response?.data?.message ??
        t("messages.submitError");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({ ...formData, user_id: user.id, type: user.account_type });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <AnimatePresence>
      {withdrawOpen && (
        <div className="flex items-center justify-center fixed top-0 left-0 z-[999] w-full h-screen bg-black/50 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className=" md:max-w-2xl w-[98%] mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaMoneyBillWave className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex items-start justify-between w-full">
                  <div className="">
                    <h1 className="text-2xl font-bold text-gray-800">
                      {t("title")}
                    </h1>
                    <p className="text-gray-600 mt-1">{t("subtitle")}</p>
                  </div>
                  <FaTimes
                    onClick={() => dispatch(setWithdrawOpen(false))}
                    className="size-6 text-red-400 cursor-pointer hover:scale-110 hover:text-red-600 duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-6">
              {submitError && <ErrorMessage message={submitError} />}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount Input */}
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t("amountLabel")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="amount"
                      min="1"
                      step="0.01"
                      value={formData.amount || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "amount",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.amount ? "border-rose-500" : "border-gray-300"
                      }`}
                      placeholder={t("amountPlaceholder")}
                    />
                  </div>
                  {errors.amount && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-1 text-sm text-rose-600 flex items-center gap-1"
                    >
                      <FaInfoCircle className="w-3 h-3" />
                      {errors.amount}
                    </motion.p>
                  )}
                </div>

                {/* Method Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t("methodLabel")}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Bank Transfer Option */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMethodChange("bank")}
                      className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                        formData.method === "bank"
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            formData.method === "bank"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <FaUniversity className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <span
                            className={`font-medium ${
                              formData.method === "bank"
                                ? "text-blue-700"
                                : "text-gray-700"
                            }`}
                          >
                            {t("methods.bank")}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">
                            {t("methods.bankDescription")}
                          </p>
                        </div>
                      </div>
                    </motion.button>

                    {/* PayPal Option */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMethodChange("paypal")}
                      className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                        formData.method === "paypal"
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            formData.method === "paypal"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <FaPaypal className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <span
                            className={`font-medium ${
                              formData.method === "paypal"
                                ? "text-blue-700"
                                : "text-gray-700"
                            }`}
                          >
                            {t("methods.paypal")}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">
                            {t("methods.paypalDescription")}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  </div>
                </div>

                {/* Conditional Fields */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={formData.method}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {formData.method === "bank" ? (
                      <div>
                        <label
                          htmlFor="bank_number"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          {t("bankNumberLabel")}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUniversity className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="bank_number"
                            value={formData.bank_number}
                            onChange={(e) =>
                              handleInputChange("bank_number", e.target.value)
                            }
                            className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              errors.bank_number
                                ? "border-rose-500"
                                : "border-gray-300"
                            }`}
                            placeholder={t("bankNumberPlaceholder")}
                          />
                        </div>
                        {errors.bank_number && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-1 text-sm text-rose-600 flex items-center gap-1"
                          >
                            <FaInfoCircle className="w-3 h-3" />
                            {errors.bank_number}
                          </motion.p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <label
                          htmlFor="paypal_email"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          {t("paypalEmailLabel")}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            id="paypal_email"
                            value={formData.bank_number}
                            onChange={(e) =>
                              handleInputChange("bank_number", e.target.value)
                            }
                            className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              errors.bank_number
                                ? "border-rose-500"
                                : "border-gray-300"
                            }`}
                            placeholder={t("paypalEmailPlaceholder")}
                          />
                        </div>
                        {errors.bank_number && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-1 text-sm text-rose-600 flex items-center gap-1"
                          >
                            <FaInfoCircle className="w-3 h-3" />
                            {errors.bank_number}
                          </motion.p>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Additional Details */}
                <div>
                  <label
                    htmlFor="details"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t("detailsLabel")}{" "}
                    <span className="text-gray-400 font-normal">
                      ({t("optional")})
                    </span>
                  </label>
                  <textarea
                    id="details"
                    rows={3}
                    value={formData.details}
                    onChange={(e) =>
                      handleInputChange("details", e.target.value)
                    }
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder={t("detailsPlaceholder")}
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-md transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner />
                      <span>{t("submitting")}</span>
                    </>
                  ) : (
                    <>
                      <FaMoneyBillWave className="w-5 h-5" />
                      <span>{t("submitButton")}</span>
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
