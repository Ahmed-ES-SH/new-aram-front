import { PaymentFailureContent } from "@/app/_components/_website/_faildpayment/PaymentFailureContent";

export default function PaymentFailurePage({ searchParams }: any) {
  const totalInvoice = searchParams.total_invoice || "0.00";

  return <PaymentFailureContent totalInvoice={totalInvoice} />;
}
