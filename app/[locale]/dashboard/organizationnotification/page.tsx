import MultiSelectOrganizations from "@/app/_components/_dashboard/_organizationnotification/MultiSelectOrganizations";
import FetchData from "@/app/_helpers/FetchData";
import React from "react";

export default async function OrganizationsSendNotification() {
  const response = await FetchData(`/dashboard/organizations-table`, true);

  if (!response)
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-2xl font-bold">حدث خطا اثناء جلب البيانات</div>
      </div>
    );

  const { data, pagination } = await response;

  return (
    <MultiSelectOrganizations
      organizations={data}
      last_page={pagination.last_page}
    />
  );
}
