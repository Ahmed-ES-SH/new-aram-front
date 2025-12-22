"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FaTimesCircle } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import PaymentStatusCard from "../_successPayment/PaymentStatusCard";

export default function PaymentFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const t = useTranslations("payment");

  const locale = params.locale;
  const isRTL = locale === "ar";

  const invoiceNumber = searchParams.get("invoice_number") || "N/A";
  const totalInvoice = searchParams.get("total_invoice") || "N/A";

  const details = [
    { label: t("invoiceNumber"), value: invoiceNumber },
    { label: t("total"), value: totalInvoice },
  ];

  const handleRetry = () => {
    // Navigate back or to payment page
    router.back();
  };

  return (
    <PaymentStatusCard
      icon={<FaTimesCircle className="text-rose-500 text-7xl md:text-8xl" />}
      title={t("failedTitle")}
      message={t("failedMessage")}
      details={details}
      primaryButton={{
        label: t("retry"),
        onClick: handleRetry,
      }}
      secondaryButton={{
        label: t("backHome"),
        onClick: () => router.push(`/${locale}`),
      }}
      variant="error"
      isRTL={isRTL}
    />
  );
}
