"use client";

import React, { useEffect } from "react";
import { FiDollarSign, FiClock, FiCreditCard } from "react-icons/fi";
import { useLocale, useTranslations } from "next-intl";
import WalletCard from "./WalletCard";
import { directionMap } from "@/app/constants/_website/global";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { setWallet } from "@/app/Store/walletSlice";

// Wallet data interface
export interface WalletData {
  id?: number;
  user_id?: number;
  account_type?: string;
  available_balance: number;
  pending_balance: number;
  total_balance: number;
  created_at?: string;
  updated_at?: string;
}

// Props type
interface WalletOverviewProps {
  wallet: WalletData;
}

export default function WalletOverview({ wallet }: WalletOverviewProps) {
  const t = useTranslations("walletOverview");

  const { available_balance, pending_balance, total_balance } = useAppSelector(
    (state) => state.wallet
  );
  const dispatch = useAppDispatch();

  const locale = useLocale();

  useEffect(() => {
    if (wallet) {
      dispatch(setWallet(wallet));
    }
  }, [dispatch, wallet]);

  return (
    <div
      dir={directionMap[locale]}
      className="w-full  flex flex-col justify-center items-start mt-4 lg:mt-12"
    >
      <div className="w-full">
        {/* Header Section */}
        <div className="flex items-center justify-between max-md:flex-col max-md:mb-4 max-md:items-start w-full">
          <div className="ltr:text-left rtl:text-right mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t("title")}
            </h1>
            <p className="text-gray-600">{t("subtitle")}</p>
          </div>
        </div>

        {/* Wallet Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <WalletCard
            title={t("availableBalance")}
            value={available_balance ?? 0}
            icon={FiDollarSign}
            gradient="bg-gradient-to-br from-emerald-50 to-emerald-100"
            delay={0.1}
          />
          <WalletCard
            title={t("pendingBalance")}
            value={pending_balance ?? 0}
            icon={FiClock}
            gradient="bg-gradient-to-br from-amber-50 to-amber-100"
            delay={0.2}
          />
          <WalletCard
            title={t("totalBalance")}
            value={total_balance ?? 0}
            icon={FiCreditCard}
            gradient="bg-gradient-to-br from-blue-50 to-blue-100"
            delay={0.3}
          />
        </div>
      </div>
    </div>
  );
}
