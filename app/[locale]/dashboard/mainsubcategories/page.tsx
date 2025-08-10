import DynamicTable from "@/app/_components/_dashboard/_dynamicComponents/DynamicTable";
import React from "react";

interface CategoryType {
  id: number;
  title_en: string;
  title_ar: string;
  bg_color: string;
  image: string;
}

export default function MainSubcategories({ searchParams }: any) {
  const parantId = searchParams.parentId;

  const headers = [
    "id",
    "صورة القسم",
    "العنوان (EN)",
    "العوان (AR)",
    "لون الخلفية",
    "ايقونة القسم",
    "القسم الرئيسى",
    "تاريخ الانشاء",
  ];
  const keys = [
    { key: "id", cellType: "text" },
    { key: "image", cellType: "image" },
    { key: "title_en", cellType: "text" },
    { key: "title_ar", cellType: "text" },
    { key: "bg_color", cellType: "color" },
    { key: "icon_name", cellType: "icon" },
    { key: "parent", cellType: "parent" },
    {
      key: "created_at",
      cellType: "date",
    },
  ];

  return (
    <>
      <DynamicTable<CategoryType>
        itemDirect="mainsubcategories"
        headers={headers}
        keys={keys}
        api={`/sub-categories-by-parent?parent_id=${parantId}`}
        searchApi="/sub-categories/search"
        deletedApi="/delete-sub-category"
      />
    </>
  );
}
