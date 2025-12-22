import PromoterActivitiesTable from "@/app/_components/_website/_controlpanals/_centerorg/_accountStats/PromoterActivitiesTable";
import PromoterNumbers from "@/app/_components/_website/_controlpanals/_centerorg/_accountStats/PromoterNumbers";
import FetchData from "@/app/_helpers/FetchData";
import { getBaseUrl } from "@/app/_helpers/GetBaseUrl";

export default async function AccountStats() {
  const baseUrl = await getBaseUrl();

  const user = await FetchData(`/current-user`, false);
  const response = await FetchData(`/promoter-activities`, true);
  const promoter = user && user.promoter;

  const { data, pagination } = await response;

  return (
    <div className="w-full mt-4 p-6 space-y-4">
      <PromoterNumbers promoter={promoter} baseUrl={baseUrl} />
      <PromoterActivitiesTable
        data={data ?? []}
        pagination={pagination}
        accountType={user.account_type}
        userId={user.id}
      />
    </div>
  );
}
