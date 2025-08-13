import DynamicTable from "@/app/_components/_dashboard/_dynamicComponents/DynamicTable";
import React from "react";

interface CategoryType {
  id: number;
  title_en: string;
  title_ar: string;
  bg_color: string;
  image: string;
  sub_categories_count?: number;
}

export default function CardCategories() {
  const headers = [
    "id",
    "صورة القسم",
    "العنوان (EN)",
    "العوان (AR)",
    "لون الخلفية",
    "عدد البطاقات المرتبطة",
    "ايقونة القسم",
    "تاريخ الانشاء",
  ];
  const keys = [
    { key: "id", cellType: "text" },
    { key: "image", cellType: "image" },
    { key: "title_en", cellType: "text" },
    { key: "title_ar", cellType: "text" },
    { key: "bg_color", cellType: "color" },
    { key: "cards_count", cellType: "text" },
    { key: "icon_name", cellType: "icon" },
    {
      key: "created_at",
      cellType: "date",
    },
  ];

  return (
    <>
      <DynamicTable<CategoryType>
        itemDirect="cardcategories"
        headers={headers}
        keys={keys}
        api="/card-categories"
        searchApi="/card-categories/search"
        deletedApi="/delete-card-category"
      />
    </>
  );
}
