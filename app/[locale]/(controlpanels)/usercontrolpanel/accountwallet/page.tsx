import WalletOverview from "@/app/_components/_website/_controlpanals/_usercontrol/_wallet/WalletOverview";
import { WalletTransactionsTable } from "@/app/_components/_website/_controlpanals/_usercontrol/_wallet/WalletTransactionsTable";
import UserIdNotFound from "@/app/_components/_website/_global/UserIdNotFound";
import FetchData from "@/app/_helpers/FetchData";
import { getSharedMetadata } from "@/app/_helpers/helpers";
import { directionMap } from "@/app/constants/_website/global";
import { getTranslations } from "next-intl/server";
import React from "react";

export async function generateMetadata() {
  const t = await getTranslations("metaAccountWallet");
  const sharedMetadata = await getSharedMetadata(t("title"), t("description"));
  return {
    title: t("title"),
    describtion: t("description"),
    ...sharedMetadata,
  };
}

export default async function WalletPage({ searchParams, params }: any) {
  const userId = searchParams.userId;
  const account_type = searchParams.account_type;

  const locale = await params.locale;

  const wallet = await FetchData(
    `/wallet?user_id=${userId}&type=${account_type}`,
    false
  );
  const { data: transactions, pagination } = await FetchData(
    `/user-transactions?user_id=${userId}&type=${account_type}`,
    true
  );

  if (!userId) return <UserIdNotFound />;

  return (
    <div
      dir={directionMap[locale]}
      className="flex flex-col gap-4 w-full mb-6 p-2"
    >
      <WalletOverview wallet={wallet} />
      <WalletTransactionsTable
        transactions={transactions}
        pagination={pagination}
      />
    </div>
  );
}
