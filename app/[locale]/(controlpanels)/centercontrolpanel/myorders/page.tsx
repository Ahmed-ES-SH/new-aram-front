import AcountOrders from "@/app/_components/_website/_controlpanals/AcountOrders";
import FetchData from "@/app/_helpers/FetchData";
import NoOrders from "@/app/_components/_website/_controlpanals/NoOrders";

export default async function MyOrdersPage({ params }: any) {
  const { locale } = await params;
  const response = await FetchData(`/user-service-orders`, true);

  if (!response) return <NoOrders />;

  const { data, pagination } = await response;

  if (!data || data.length === 0) return <NoOrders />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {locale == "ar" ? "طلباتي" : "My Orders"}
      </h1>
      <AcountOrders data={data} last_page={pagination?.last_page ?? 1} />
    </div>
  );
}
