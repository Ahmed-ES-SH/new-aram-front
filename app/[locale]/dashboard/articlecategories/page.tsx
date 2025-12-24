import DynamicTable from "@/app/_components/_dashboard/_dynamicComponents/DynamicTable";
import React from "react";

export default function page() {
  const headers = [
    "المعرف",
    "صورة القسم",
    "العنوان بالعربية",
    "العنوان بالإنجليزية",
    "لون الخلفية",
    "ايقونة القسم",
    "تاريخ الانشاء",
  ];
  const keys = [
    { key: "id", cellType: "text" },
    { key: "image", cellType: "image" },
    { key: "title_en", cellType: "text" },
    { key: "title_ar", cellType: "text" },
    { key: "bg_color", cellType: "color" },
    { key: "icon_name", cellType: "icon" },

    {
      key: "created_at",
      cellType: "date",
    },
  ];
  return (
    <>
      <DynamicTable
        itemDirect="articlecategories"
        headers={headers}
        keys={keys}
        api="/article-categories"
        deletedApi="/delete-article-category"
        searchApi={"/article-categories/search"}
      />
    </>
  );
}
