import DynamicTable from "@/app/_components/_dashboard/_dynamicComponents/DynamicTable";
import React from "react";

export default function PromotersPage() {
  const headers = [
    "المعرف", // id
    "صورة المروج", // user.image
    "الإسم", // user.name
    "البريد الإلكترونى", // user.email
    "رقم الهاتف", // user.phone
    "نسبة الخصم", // discount_percentage
    "كود الإحالة", // code
    "التسجيلات", // registrations
    "المشتريات", // purchases
    "حالة الحساب", // status
    "تاريخ الإنشاء", // created_at
  ];
  const keys = [
    { key: "id", cellType: "text" },
    { key: "promoter.image", cellType: "user-image" },
    { key: "promoter.name", cellType: "text" },
    { key: "promoter.email", cellType: "text" },
    { key: "promoter.phone", cellType: "text" },
    { key: "discount_percentage", cellType: "text" },
    { key: "referral_code", cellType: "text" },
    { key: "total_signups", cellType: "text" },
    { key: "total_purchases", cellType: "text" },
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
        searchApi="/search-for-promoter"
        deletedApi="/delete-promoter"
      />
    </>
  );
}
