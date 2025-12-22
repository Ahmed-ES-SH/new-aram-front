import DynamicTable from "@/app/_components/_dashboard/_dynamicComponents/DynamicTable";
import React from "react";

export default function ProblemsPage() {
  const headers = [
    "المعرف",
    "اسم المرسل",
    "البريد الإلكترونى",
    "رقم الهاتف",
    "حالة الشكوى",
    "تاريخ الإرسال",
  ];
  const keys = [
    { key: "id", cellType: "text" },
    { key: "name", cellType: "text" },
    { key: "email", cellType: "text" },
    { key: "phone_number", cellType: "text" },
    {
      key: "status",
      cellType: "status",
      conditions: { green: "resolved", yellow: "under_review", red: "pending" },
    },
    {
      key: "created_at",
      cellType: "date",
    },
  ];

  return (
    <>
      <DynamicTable
        api={"/contact-messages"}
        deletedApi={"/contact-message"}
        headers={headers}
        itemDirect={"/problems"}
        keys={keys}
        searchState={false}
        searchApi={""}
      />
    </>
  );
}
