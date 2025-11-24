import NoCardsFound from "@/app/_components/_website/_controlpanals/_usercontrol/_userCards/NoCardsFound";
import { OwnedCreditCard } from "@/app/_components/_website/_controlpanals/_usercontrol/_userCards/OwnedCreditCard";
import ServerPagination from "@/app/_components/_website/_global/ServerPagination";
import FetchData from "@/app/_helpers/FetchData";
import { getSharedMetadata } from "@/app/_helpers/helpers";
import { getTranslations } from "next-intl/server";
import React from "react";

export async function generateMetadata() {
  const t = await getTranslations("metaMyCards");
  const sharedMetadata = await getSharedMetadata(t("title"), t("description"));
  return {
    title: t("title"),
    describtion: t("description"),
    ...sharedMetadata,
  };
}

export default async function UserCardsPage({ searchParams }: any) {
  const user = await FetchData(`/current-user`, false);

  if (!user) return null;

  const userId = user.id;
  const type = user.account_type;

  const page = searchParams.page;
  const endPoint = page
    ? `/cards-account?owner_id=${userId}&owner_type=${type}&page=${page}`
    : `/cards-account?owner_id=${userId}&owner_type=${type}`;
  const response = await FetchData(endPoint, true);

  const t = await getTranslations("card");

  if (!response || response.error) return <NoCardsFound />;

  const cards = response.data.cards;
  const pagination = response.data.pagination;

  return (
    <main className="min-h-screen w-full  py-12 px-4">
      <div className="w-full">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {t("title")}
          </h1>
          <p className="text-gray-600 text-lg">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:justify-items-start justify-items-center">
          {cards.map((card) => (
            <OwnedCreditCard key={`card.id+${card.card.title}`} data={card} />
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
  );
}
