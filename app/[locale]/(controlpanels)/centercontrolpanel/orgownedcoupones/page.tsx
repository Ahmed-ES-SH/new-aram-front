import CouponCard from "@/app/_components/_website/_controlpanals/_usercontrol/_userCoupones/CouponCard";
import NoCouponsFound from "@/app/_components/_website/_controlpanals/_usercontrol/_userCoupones/NoCouponsFound";
import ServerPagination from "@/app/_components/_website/_global/ServerPagination";
import FetchData from "@/app/_helpers/FetchData";
import { getSharedMetadata } from "@/app/_helpers/helpers";
import { getTranslations } from "next-intl/server";
import React from "react";

export async function generateMetadata() {
  const t = await getTranslations("metaOwnedCoupones");
  const sharedMetadata = await getSharedMetadata(t("title"), t("description"));
  return {
    title: t("title"),
    describtion: t("description"),
    ...sharedMetadata,
  };
}

export default async function CenterOwnedCoupones({ searchParams }: any) {
  const user = await FetchData(`/current-user`, false);

  if (!user) return null;

  const userId = user.id;
  const type = user.account_type;

  const page = searchParams.page;
  const endPoint = page
    ? `/account-coupons?id=${userId}&type=${type}&page=${page}`
    : `/account-coupons?id=${userId}&type=${type}`;

  const response = await FetchData(endPoint, true);

  const t = await getTranslations("myCoupons");

  if (!response || response.error) return <NoCouponsFound />;

  const coupones = response.data;
  const pagination = response.pagination;

  return (
    <>
      <main className="min-h-screen w-full  py-12 px-4">
        <div className="w-full">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t("title")}
            </h1>
            <p className="text-gray-600 text-lg">{t("subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:justify-items-start justify-items-center">
            {coupones.map((coupon) => (
              <CouponCard
                key={`CouponCard.id+${coupon.title}`}
                coupon={coupon}
              />
            ))}
          </div>

          {/* pagination */}
          {pagination && pagination.last_page > 1 && (
            <ServerPagination
              totalPages={pagination.last_page}
              currentPage={pagination.current_page}
            />
          )}
        </div>
      </main>
    </>
  );
}
