"use client";

import { FaCheckCircle } from "react-icons/fa";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { instance } from "@/app/_helpers/axios";
import { useDispatch } from "react-redux";
import { clearCart } from "@/app/Store/cartSlice";
import { useUserCountry } from "@/app/_hooks/useUserCountry";
import { getDeviceType } from "@/app/_helpers/getDeviceType";
import { getBrowser } from "@/app/_helpers/getBrowser";
import { toast } from "sonner";
import PaymentFailedPage from "../_faildpayment/PaymentFailedPage";
import LoadingPage from "../_global/LoadingPage";
import PaymentStatusCard from "./PaymentStatusCard";

export function SuccessContent() {
  const dispatch = useDispatch();
  // Fetch user's country and location data with permission status
  const { country } = useUserCountry();

  const t = useTranslations("payment");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  // params
  const total_invoice = searchParams.get(`total_invoice`);
  const payment_id = searchParams.get(`payment_id`);
  const activity_id = searchParams.get(`activity_id`);
  const provisionalData_id = searchParams.get(`provisionalData_id`);
  const orderId = searchParams.get(`orderId`);
  const payment_type = searchParams.get(`payment_type`);
  const invoice_number = searchParams.get(`invoice_number`);
  const session_id = searchParams.get(`session_id`);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  function buildQuery(params: Record<string, any>) {
    const query = new URLSearchParams();

    for (const key in params) {
      const value = params[key];
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, value.toString());
      }
    }

    return query.toString();
  }

  const deviceType = getDeviceType(); // Detect device type (mobile/desktop/tablet)
  const browser = getBrowser(); // Detect browser type

  const query = buildQuery({
    order_id: orderId,
    device_type: deviceType,
    browser,
    country,
    payment_id,
    provisionalData_id,
    payment_type,
    invoice_number,
    session_id,
    activity_id,
  });

  const url = `/payment/webhook?` + query;

  // Effect to handle referral tracking based on location permission status
  useEffect(() => {
    const check = async () => {
      try {
        const response = await instance.post(url);
        if (response.status == 200) {
          dispatch(clearCart());
        }
      } catch (error: any) {
        console.log(error);
        setError(true);
        const message =
          error?.response?.data?.message ??
          "حدث خطا غير متوقع اثناء عملية الدفع الرجاء المحالة لاحقا";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) check();
  }, [
    dispatch,
    invoice_number,
    orderId,
    payment_id,
    payment_type,
    provisionalData_id,
    session_id,
    activity_id,
  ]);

  const details: any = [
    { label: t("invoiceNumber"), value: invoice_number },
    { label: t("total"), value: total_invoice },
  ];

  if (loading) return <LoadingPage />;

  if (error) return <PaymentFailedPage />;

  return (
    <PaymentStatusCard
      icon={<FaCheckCircle className="text-emerald-500 text-7xl md:text-8xl" />}
      title={t("successTitle")}
      message={t("successMessage")}
      details={details}
      primaryButton={{
        label: t("backHome"),
        onClick: () => router.push(`/${locale}`),
      }}
      variant="success"
      isRTL={locale == "ar"}
    />
  );
}
