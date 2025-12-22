"use client";
import React, { Dispatch, SetStateAction } from "react";
import { Coupon } from "../_coupons/types";
import { LuNavigationOff } from "react-icons/lu";
import CouponCardForSelect from "./CouponCardForSelect";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { motion } from "framer-motion";

interface props {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: Dispatch<SetStateAction<Coupon | null>>;
  loading: boolean;
}

export default function SelectCoupon({
  selectedCoupon,
  setSelectedCoupon,
  coupons,
  loading,
}: props) {
  const handleSelectCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <motion.div
          animate={{ rotate: [360, 0, 360] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <AiOutlineLoading3Quarters className="size-32 text-sky-400" />
        </motion.div>
      </div>
    );
  }

  if (coupons && coupons.length == 0) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <LuNavigationOff />
          <p>لا يوجد كوبونات فعالة ليتم استعراضها فى الوقت الحالى</p>
        </div>
      </div>
    );
  }

  if (coupons && coupons.length > 0) {
    return (
      <>
        <div className="w-full grid xl:grid-cols-4 lg:grid-cols-3 max-lg:grid-cols-2 grid-cols-1 gap-3">
          {coupons.map((coupon) => {
            const isSelected = selectedCoupon?.id === coupon.id;
            return (
              <CouponCardForSelect
                coupon={coupon}
                key={`${coupon.id}+coupon`}
                isSelected={isSelected}
                onSelect={handleSelectCoupon}
              />
            );
          })}
        </div>
      </>
    );
  }
}
