import DynamicElementPage from "@/app/_components/_dashboard/_dynamicComponents/DynamicElementPage";
import React from "react";

export default async function PromoterPage({ params }: any) {
  const { promoterId } = await params;

  const updatePromoterInputs = [
    {
      name: "promoter.name",
      type: "text",
      fildType: "short-text",
      label: { ar: "الإسم", en: "" },
      placeholder: "أدخل إسم الحساب الجديد",
      readOnly: true,
    },
    {
      name: "promoter.email",
      type: "email",
      fildType: "short-text",
      label: { ar: "البريد الإلكترونى", en: "" },
      placeholder: "أدخل البريد الإلكترونى للحساب الجديد",
      readOnly: true,
    },
    {
      name: "status",
      type: "",
      fildType: "select-type",
      label: { ar: "حالة المروج", en: "" },
      placeholder: "",
      selectItems: [
        { name: "نشط", value: "active" },
        { name: "غير نشط", value: "disabled" },
      ],
    },
  ];
  return (
    <DynamicElementPage
      api={"/get-promoter"}
      updateEndPoint={"/update-promoter"}
      id={promoterId}
      inputsData={updatePromoterInputs}
      direct={"/dashboard/promoters"}
    />
  );
}
