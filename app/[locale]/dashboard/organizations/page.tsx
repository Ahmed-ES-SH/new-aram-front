import OrganizationsBody from "@/app/_components/_dashboard/_organizations/OrganizationsBody";
import FetchData from "@/app/_helpers/FetchData";

export default async function OrganizationsDashPage({ searchParams }: any) {
  const search = await searchParams;

  // Convert categories to array of numbers
  const categories = search.categories?.length
    ? search.categories.split(",").map(Number)
    : undefined;

  // Prepare URLSearchParams
  const params = new URLSearchParams();

  // Add basic params only if they exist
  if (search.page) params.append("page", search.page);
  if (search.status) params.append("status", search.status);
  if (search.rating) params.append("rating", search.rating);
  if (search.active) params.append("active", search.active);
  if (search.number_of_reservations)
    params.append("number_of_reservations", search.number_of_reservations);

  // Add categories if exist
  if (categories?.length) {
    params.append("categories", categories.join(","));
  }

  // Final API
  const api = `/dashboard/organizations?${params.toString()}`;

  const response = await FetchData(api, true);

  if (!response) return null;

  const { data, pagination } = await response;

  return (
    <div dir="rtl" className="min-h-screen w-[90%] mx-auto">
      <OrganizationsBody
        data={data}
        last_page={pagination.last_page}
        total={pagination.total}
      />
    </div>
  );
}
