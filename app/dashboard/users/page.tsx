import DynamicTable from "@/app/_components/_dashboard/_dynamicComponents/DynamicTable";
import React from "react";

export default function page() {
  const headers = [
    "المعرف",
    "صورة الحساب",
    "الإسم",
    "البريد الإلكترونى",
    "نوع الحساب",
    "حالة الحساب",
    "تاريخ الانشاء",
  ];
  const keys = [
    { key: "id", cellType: "text" },
    { key: "image", cellType: "image" },
    { key: "name", cellType: "text" },
    { key: "email", cellType: "text" },
    { key: "role", cellType: "text" },
    {
      key: "status",
      cellType: "status",
      conditions: { green: "active", yellow: "inactive", red: "banned" },
    },
    {
      key: "created_at",
      cellType: "date",
    },
  ];
  return (
    <>
      <DynamicTable
        itemDirect="users"
        headers={headers}
        keys={keys}
        api="/users"
        searchApi="/search-for-user-by-name"
        deletedApi="/delete-user"
      />
    </>
  );
}
