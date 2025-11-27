"use client";

import { FaCheckCircle } from "react-icons/fa";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { instance } from "@/app/_helpers/axios";
import { useDispatch } from "react-redux";
import { clearCart } from "@/app/Store/cartSlice";
import LoadingPage from "../_global/LoadingPage";
import PaymentStatusCard from "./PaymentStatusCard";

export function SuccessContent() {
  const dispatch = useDispatch();

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

  useEffect(() => {
    const check = async () => {
      const response = await instance.post(
        `/payments/callback?order_id=${orderId}&payment_id=${payment_id}&provisionalData_id=${provisionalData_id}&payment_type=${payment_type}&invoice_number=${invoice_number}&session_id=${session_id}&activity_id=${activity_id}`
      );
      if (response.status == 200) {
        dispatch(clearCart());
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
