"use client";
import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaPercentage } from "react-icons/fa";
import { BsCartX } from "react-icons/bs";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { setIsCartOpen } from "@/app/Store/variablesSlice";
import { directionMap } from "@/app/constants/_website/global";
import CartItem from "./CartItem";
import LocaleLink from "../LocaleLink";

export default function CartSide() {
  const sideRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const t = useTranslations("cart");

  const { isCartOpen } = useAppSelector((state) => state.variables);
  const { activeCurrency } = useAppSelector((state) => state.currency);
  const { items } = useAppSelector((state) => state.cartSlice);
  const dispatch = useAppDispatch();

  const locale = useLocale();
  const router = useRouter();

  const calculateTotal = () => {
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
    const vat = 0; // مثال: ضريبة 10%
    const discount = 0; // مثال: خصم ثابت
    const total = subtotal + vat - discount;
    return { subtotal, vat, discount, total };
  };
  const { subtotal, vat, discount, total }: any = calculateTotal();

  const handlToggle = () => {
    dispatch(setIsCartOpen(!isCartOpen));
  };

  const goToCart = async () => {
    handlToggle();
    router.push("/cart");
  };

  const Currency = Number(activeCurrency?.exchange_rate);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sideRef.current && !sideRef.current.contains(event.target as Node)) {
        handlToggle();
      }
    };

    if (isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCartOpen]);

  if (pathname.startsWith("/en/dashboard")) {
    return null;
  }

  return (
    <>
      <section ref={sideRef}>
        {isCartOpen && (
          <div
            onClick={handlToggle}
            className="w-full h-screen fixed top-0 left-0 z-99999 bg-black opacity-50"
          />
        )}
        <AnimatePresence>
          {isCartOpen && (
            <motion.div
              dir={directionMap[locale]}
              initial={{ x: "-100%" }}
              animate={{ x: "0" }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl max-md:w-[90%] px-4 py-8 sm:px-6 sm:py-12 lg:px-8 h-screen overflow-y-auto shadow-xl border border-gray-300 fixed top-0 left-0 z-[9999999] bg-white"
            >
              <div className="mx-auto max-w-3xl relative z-99999999">
                <header className="text-center">
                  <h1 className="text-xl font-bold text-gray-900  sm:text-3xl pb-2 border-b border-primary w-fit mx-auto">
                    {t("title")}
                  </h1>
                </header>
                <div className="mt-8">
                  {items && items.length > 0 ? (
                    <motion.ul
                      className="space-y-4 w-full"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      {items.map((item: any) => (
                        <motion.li
                          key={item.id}
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <CartItem item={item} />
                        </motion.li>
                      ))}
                    </motion.ul>
                  ) : (
                    <motion.div
                      className="w-full h-[50vh] flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 15,
                      }}
                    >
                      <motion.div
                        className="flex flex-col items-center"
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <BsCartX className="lg:text-6xl size-8 text-gray-400 mb-4 " />
                        <motion.h2
                          className="lg:text-xl  font-semibold text-gray-600"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.6 }}
                        >
                          {t("empty_title")}
                        </motion.h2>
                        <motion.p
                          className="mt-2 text-sm text-center text-gray-500"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5, duration: 0.6 }}
                        >
                          {t("empty_message")}
                        </motion.p>
                        <motion.button
                          className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-orange-500 transition"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.7, duration: 0.6 }}
                          onClick={() => (window.location.href = "/shop")} // إضافة الرابط إلى المتجر
                        >
                          <LocaleLink href={"/cards"}>
                            {t("start_shopping")}
                          </LocaleLink>
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  )}

                  <div className="mt-8 flex justify-end max-md:justify-start border-t border-gray-100 pt-8">
                    <div className="w-screen max-w-lg space-y-4">
                      <dl className="space-y-0.5 text-sm text-gray-700  ">
                        <div className="flex justify-between">
                          <dt>{t("subtotal")}</dt>
                          <dd>
                            <div className="flex items-center gap-1">
                              <span>{activeCurrency?.symbol}</span>
                              <p>{Number(Currency * subtotal).toFixed(2)}</p>
                            </div>
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt>{t("vat")}</dt>
                          <dd>
                            <div className="flex items-center gap-1">
                              <span>{activeCurrency?.symbol}</span>
                              <p>{Number(Currency * vat).toFixed(2)}</p>
                            </div>
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt>{t("discount")}</dt>
                          <dd>
                            <div className="flex items-center gap-1">
                              -<span>{activeCurrency?.symbol}</span>
                              <p>{Number(Currency * discount).toFixed(2)}</p>
                            </div>
                          </dd>
                        </div>
                        <div className="flex justify-between !text-base font-medium">
                          <dt>{t("total")}</dt>
                          <dd>
                            <div className="flex items-center gap-1">
                              <span>{activeCurrency?.symbol}</span>
                              <p>{Number(Currency * total).toFixed(2)}</p>
                            </div>
                          </dd>
                        </div>
                      </dl>

                      <div className="flex justify-end">
                        <span className="inline-flex items-center justify-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-indigo-700">
                          <FaPercentage className="mr-1 h-4 w-4" />
                          <p className="whitespace-nowrap text-xs">
                            {t("no_discounts")}
                          </p>
                        </span>
                      </div>

                      <div className="flex justify-start">
                        <button
                          onClick={() => goToCart()}
                          className="block rounded bg-primary px-5 py-3 text-sm text-white transition duration-200 hover:bg-orange-500"
                        >
                          {t("checkout")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                onClick={handlToggle}
                className="close px-4 py-1 absolute top-6 left-5 border border-gray-300 600 rounded-sm text-white hover:bg-white hover:text-black duration-200 cursor-pointer bg-red-400 flex items-center justify-center"
              >
                -
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
