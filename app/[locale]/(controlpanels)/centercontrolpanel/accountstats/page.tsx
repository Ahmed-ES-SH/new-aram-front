import PromoterActivitiesTable from "@/app/_components/_website/_controlpanals/_centerorg/_accountStats/PromoterActivitiesTable";
import PromoterNumbers from "@/app/_components/_website/_controlpanals/_centerorg/_accountStats/PromoterNumbers";
import FetchData from "@/app/_helpers/FetchData";
import React from "react";

export default async function AccountStats() {
  const user = await FetchData(`/current-user`, false);
  const promoter = user && user.promoter;
  const response = await FetchData(
    `/user-activites?user_id=${user.id}&user_type=organization`,
    true
  );
  const { data, pagination } = await response;

  return (
    <div className="w-full mt-4 p-6 space-y-4">
      <PromoterNumbers promoter={promoter} baseUrl="http://localhost:3000/en" />
      <PromoterActivitiesTable
        data={data ?? []}
        pagination={pagination}
        accountType={user.account_type}
        userId={user.id}
      />
    </div>
  );
}
