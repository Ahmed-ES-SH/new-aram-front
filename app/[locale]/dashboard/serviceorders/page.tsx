import FetchData from "@/app/_helpers/FetchData";
import ServiceOrdersContainer from "@/app/_components/_dashboard/_serviceOrders/ServiceOrdersContainer";
import NoServiceOrders from "@/app/_components/_dashboard/_serviceOrders/NoServiceOrders";

export default async function ServiceOrders() {
  const response = await FetchData(`/all-service-orders`, true);

  if (!response) return <NoServiceOrders error="حدث خطأ أثناء تحميل الطلبات" />;

  const { data: initialOrders, pagination } = await response;

  return (
    <ServiceOrdersContainer
      initialOrders={initialOrders}
      last_page={pagination.last_page}
    />
  );
}
