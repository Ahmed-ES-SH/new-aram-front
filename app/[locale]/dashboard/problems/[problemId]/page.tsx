import DynamicElementPage from "@/app/_components/_dashboard/_dynamicComponents/DynamicElementPage";
import React from "react";

export default function page({ params }: any) {
  const problemId = params.problemId;

  const problemInputs = [
    {
      name: "name",
      type: "text",
      fildType: "short-text",
      label: { ar: "إسم المرسل ", en: "" },
      readOnly: true,
    },
    {
      name: "email",
      type: "text",
      fildType: "short-text",
      label: { ar: "البريد الإلكترونى", en: "" },
      readOnly: true,
    },
    {
      name: "phone_number",
      type: "text",
      fildType: "short-text",
      label: { ar: "رقم الهاتف", en: "" },
      readOnly: true,
    },
    {
      name: "subject",
      type: "text",
      fildType: "short-text",
      label: { ar: "عنوان الشكوى", en: "" },
      readOnly: true,
    },
    {
      name: "message",
      type: "",
      fildType: "long-text",
      label: { ar: "محتوى الشكوى", en: "" },
      readOnly: true,
    },
    {
      name: "status",
      type: "",
      fildType: "select-type",
      label: { ar: "حالة الشكوى", en: "" },
      placeholder: "",
      selectItems: [
        { name: "pending" },
        { name: "under_review" },
        { name: "resolved" },
      ],
    },
  ];

  return (
    <>
      <DynamicElementPage
        api={"/contact-message"}
        updateEndPoint={"/update-contact-message"}
        id={problemId}
        inputsData={problemInputs}
        direct={"/dashboard/problems"}
      />
    </>
  );
}
