"use client";
import React, { useEffect, useState } from "react";
import LocaleLink from "../_global/LocaleLink";
import { useAppSelector } from "@/app/Store/hooks";
import { instance } from "@/app/_helpers/axios";
import { useTranslations } from "next-intl";
import PromoCodeBox from "./PromoCodeBox";
import CheckCurrentUserPopup from "../_global/CheckCurrentUserPopup";
import { VscLoading } from "react-icons/vsc";

export default function CartSidebar() {
  const t = useTranslations("cartPage");

  const { user } = useAppSelector((state) => state.user);
  const { items } = useAppSelector((state) => state.cartSlice);
  const { activeCurrency } = useAppSelector((state) => state.currency);

  const [cardsDetailes, setCardsDetailes] = useState<any>([]);
  const [checkCurrentuser, setCheckCurrentuser] = useState(false);
  const [purchaseId, setpurchaseId] = useState("");
  const [checkLoading, setCheckLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [loading, setLoading] = useState(false);

  const calculateTotal = () => {
    // calculate subtotal from items (price * quantity)
    const subtotal = items.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 0;
      return acc + price * qty;
    }, 0);

    const vat = 0; // Example VAT (you can change formula)
    const discount = 0; // Example discount

    // convert exchange_rate to number
    const exchangeRate = activeCurrency
      ? Number(activeCurrency.exchange_rate)
      : 1;

    // calculate total
    const total = ((subtotal + vat - discount) * exchangeRate).toFixed(2);

    return { subtotal, vat, discount, total };
  };

  const { subtotal, vat, discount, total } = calculateTotal();

  const handleSubmit = async () => {
    if (!user) {
      setCheckCurrentuser(true);
      return;
    }
    try {
      setLoading(true);
      const formdata = new FormData();
      if (purchaseId) formdata.append("purchase_id", purchaseId);
      if (user) formdata.append("account_type", user?.account_type);
      if (user) formdata.append("user_id", user.id.toString());
      formdata.append("total_invoice", total);
      formdata.append("invoice_type", "cards");
      formdata.append("payment_method", "thawani");
      formdata.append("cardsDetailes", JSON.stringify(cardsDetailes));
      const response = await instance.post("/payment/create-session", formdata);
      if (response.status == 200) {
        const sessionId = response.data.data.session_id;
        const checkoutUrl = `https://uatcheckout.thawani.om/pay/${sessionId}?key=${process.env.NEXT_PUBLIC_THAWANI_PUBLISHABLE_KEY}`;
        window.location.href = checkoutUrl;
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const checkPromoCode = async () => {
    try {
      setCheckLoading(true);
      const data = {
        promo_code: promoCode,
        amount: total,
        buyer_id: user && user?.id,
        buyer_type: user && user?.account_type,
      };
      const response = await instance.post("/purchase", data);
      if (response.status == 200) {
        const data = response.data.data;
        setpurchaseId(data.uniqId);
        // إظهار علامة النجاح
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000); // إخفاء العلامة بعد ثانيتين
      }
    } catch (error: any) {
      console.log(error);
      // إظهار علامة الفشل
      setError(true);
      setTimeout(() => setError(false), 2000); // إخفاء العلامة بعد ثانيتين
    } finally {
      setCheckLoading(false);
    }
  };

  useEffect(() => {
    setCardsDetailes((prevcards: any) => {
      // الاحتفاظ فقط بالعناصر التي لا تزال موجودة في السلة
      const filteredPrevCards = prevcards.filter((prevcard: any) =>
        items.some((card) => card.id === prevcard.id)
      );

      const updatedCards = [...filteredPrevCards];

      // إضافة العناصر الجديدة التي ليست في القائمة القديمة
      items.forEach((card) => {
        const existingCard = filteredPrevCards.find(
          (prevcard: any) => prevcard.id === card.id
        );

        if (!existingCard) {
          updatedCards.push({
            id: `${card.id}`,
            price: card.price,
            title: card.title,
            image: card.image,
            quantity: card.quantity,
            duration: card.duration,
          });
        }
      });

      return updatedCards;
    });
  }, [items]);

  if (!activeCurrency) return null;

  return (
    <>
      <div className="mx-auto min-h-[60vh] max-xl:h-fit max-xl:w-full mt-6  flex-1 space-y-6 lg:mt-0 xl:sticky top-[100px] left-0">
        <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-100 p-4 h-full  shadow-lg sm:p-6">
          <p className="text-xl pb-2 border-b border-primary font-semibold text-gray-900 ">
            {t("orderSummary")}
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <dl className="flex items-center justify-between gap-4">
                <dt className="text-base font-normal text-gray-500 ">
                  {t("subTotal")}
                </dt>
                <dd className="text-base font-medium text-gray-900  flex items-center gap-1">
                  <span>{activeCurrency.symbol}</span>{" "}
                  <p>
                    {subtotal && activeCurrency
                      ? (
                          Number(activeCurrency.exchange_rate) * subtotal
                        ).toFixed(2)
                      : "0.00"}
                  </p>
                </dd>
              </dl>

              <dl className="flex items-center justify-between gap-4">
                <dt className="text-base font-normal text-gray-500">
                  {t("discount")}
                </dt>
                <dd className="text-base font-medium text-green-600">
                  -%{` ${discount && discount.toFixed(2)}`}
                </dd>
              </dl>
              <dl className="flex items-center justify-between gap-4">
                <dt className="text-base font-normal text-gray-500 ">
                  {t("vat")}
                </dt>
                <dd className="text-base font-medium text-gray-900  flex items-center gap-1">
                  <span>{activeCurrency.symbol}</span>
                  <p>{vat && vat.toFixed(2)}</p>
                </dd>
              </dl>
            </div>

            <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2">
              <dt className="text-base font-bold text-gray-900 ">
                {t("total")}
              </dt>
              <dd className="text-base flex items-center gap-1 font-bold text-gray-900 ">
                <span>{activeCurrency.symbol}</span>
                <p>{total && total}</p>
              </dd>
            </dl>
          </div>
          <div className="text-sm flex flex-wrap items-center gap-1">
            <span>{t("purchase_notice.text_before_terms")}</span>
            <LocaleLink className="underline hover:text-sky-500" href="/terms">
              {t("purchase_notice.terms")}
            </LocaleLink>
            <span>{t("purchase_notice.and")}</span>
            <LocaleLink
              className="underline hover:text-sky-500"
              href="/policies"
            >
              {t("purchase_notice.policies")}
            </LocaleLink>
            <span>{t("purchase_notice.text_after_policies")}</span>
          </div>

          <button
            onClick={handleSubmit}
            className="flex w-full items-center justify-center rounded-lg bg-primary border border-transparent duration-200 hover:bg-transparent  hover:text-black hover:border-primary hover:scale-105 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800"
          >
            {loading ? (
              <VscLoading className="animate-spin size-6" />
            ) : (
              t("checkout")
            )}
          </button>

          <div className="flex items-center justify-center gap-2">
            <span className="text-sm font-normal text-gray-500 ">
              {t("or")}
            </span>
            <LocaleLink
              href="/cards"
              className="inline-flex  items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline"
            >
              {t("continueShopping")}
            </LocaleLink>
          </div>
        </div>
        {/* promo box */}
        <PromoCodeBox
          setPromoCode={setPromoCode}
          promoCode={promoCode}
          success={success}
          error={error}
          checkLoading={checkLoading}
          checkPromoCode={checkPromoCode}
        />
      </div>

      {checkCurrentuser && (
        <CheckCurrentUserPopup
          onClose={() => setCheckCurrentuser((prev) => !prev)}
          isOpen={checkCurrentuser}
        />
      )}
    </>
  );
}
