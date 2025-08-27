import DynamicTable from "@/app/_components/_dashboard/_dynamicComponents/DynamicTable";
import React from "react";

export default function PromotersPage() {
  const headers = [
    "المعرف", // id
    "صورة المروج", // user.image
    "الإسم", // user.name
    "البريد الإلكترونى", // user.email
    "كود الإحالة", // code
    "التسجيلات", // registrations
    "المشتريات", // purchases
    "الزيارات", // visits
    "حالة الحساب", // status
    "تاريخ الإنشاء", // created_at
  ];
  const keys = [
    { key: "id", cellType: "text" },
    { key: "user.image", cellType: "image" },
    { key: "user.name", cellType: "text" },
    { key: "user.email", cellType: "text" },
    { key: "code", cellType: "text" },
    { key: "registrations", cellType: "text" },
    { key: "purchases", cellType: "text" },
    { key: "visits", cellType: "text" },
    {
      key: "status",
      cellType: "status",
      conditions: { green: "active", red: "disabled", yellow: "" },
    },
    {
      key: "created_at",
      cellType: "date",
    },
  ];

  return (
    <>
      <DynamicTable
        itemDirect="promoters"
        headers={headers}
        keys={keys}
        api="/promoters"
        searchApi="/search-for-promoters"
        deletedApi="/delete-promoter"
      />
    </>
  );
}
