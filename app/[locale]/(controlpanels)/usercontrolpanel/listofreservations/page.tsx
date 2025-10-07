import { AppointmentTable } from "@/app/_components/_website/_controlpanals/_usercontrol/_listofreservations/AppointmentsTable";
import NoAppointmentsFound from "@/app/_components/_website/_controlpanals/_usercontrol/_listofreservations/NoAppointmentsFound";
import FetchData from "@/app/_helpers/FetchData";
import { getTranslations } from "next-intl/server";

export default async function AppointmentsPage({ searchParams }: any) {
  const type = searchParams.acouunt_type;
  const userId = searchParams.userId;

  const response = await FetchData(`/appointments/${type}/${userId}`, true);
  console.log(`/appointments/${type}/${userId}`);

  if (!response || response.error) return <NoAppointmentsFound />;
  const t = await getTranslations("appointments");

  const appointments = response.data;

  return (
    <div className="min-h-screen overflow-hidden w-full mt-2 p-6">
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {t("title")}
          </h1>
          <p className="text-slate-600">{t("subtitle")}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden w-full">
          <AppointmentTable appointments={appointments} />
        </div>
      </div>
    </div>
  );
}
