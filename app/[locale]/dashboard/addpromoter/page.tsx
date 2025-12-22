import AddPromoterComponent from "@/app/_components/_dashboard/_addPromoter/AddPromoterComponent";
import FetchData from "@/app/_helpers/FetchData";

export default async function AddPromoterPage() {
  const { data, pagination } = await FetchData(
    `/users-with-selected-data?for_promoters=1`,
    true
  );

  return <AddPromoterComponent data={data} last_page={pagination.last_page} />;
}
