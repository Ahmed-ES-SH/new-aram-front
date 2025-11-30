import CenterAppointmentTable from "@/app/_components/_website/_controlpanals/_centerorg/_orgResravations/CenterAppointmentTable";
import NoAppointmentsFound from "@/app/_components/_website/_controlpanals/_usercontrol/_listofreservations/NoAppointmentsFound";
import FetchData from "@/app/_helpers/FetchData";
import { getSharedMetadata } from "@/app/_helpers/helpers";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("metaAppointments");
  const sharedMetadata = await getSharedMetadata(t("title"), t("description"));
  return {
    title: t("title"),
    description: t("description"),
    ...sharedMetadata,
  };
}

export default async function AppointmentsPage() {
  const user = await FetchData(`/current-user`, false);

  if (!user) return null;

  const userId = user.id;
  const type = user.account_type;

  const response = await FetchData(`/appointments/${type}/${userId}`, true);

  if (!response || response.error) return <NoAppointmentsFound />;

  const t = await getTranslations("appointments");

  const appointments = response.data;
  const pagination = response.pagination;

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
          <CenterAppointmentTable
            appointments={appointments}
            pagination={pagination}
          />
        </div>
      </div>
    </div>
  );
}
