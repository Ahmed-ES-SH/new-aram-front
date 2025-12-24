import AddPromoterComponent from "@/app/_components/_dashboard/_addPromoter/AddPromoterComponent";
import FetchData from "@/app/_helpers/FetchData";

export default async function AddPromoterPage() {
  const response = await FetchData(
    `/users-with-selected-data?for_promoters=1`,
    true
  );

  if (!response)
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <p>لا يوجد بيانات ليتم عرضها </p>
      </div>
    );

  const { data, pagination } = await response;

  return (
    <AddPromoterComponent data={data} last_page={pagination?.last_page ?? 1} />
  );
}
