import DynamicElementPage from "@/app/_components/_dashboard/_dynamicComponents/DynamicElementPage";
import FetchData from "@/app/_helpers/FetchData";

export default async function SubCategoryPage({ params }: any) {
  const { id } = await params;
  const categories = await FetchData(`/all-public-categories`, false);

  const addCategoryinputs = [
    {
      name: "image",
      type: "file",
      fildType: "normal-image",
      label: { ar: "صورة القسم", en: "" },
    },
    {
      name: "icon_name",
      type: "non-input",
      fildType: "icon-fild",
      label: { ar: "حدد  أيقونة القسم", en: "" },
    },
    {
      name: "title_en",
      type: "text",
      fildType: "short-text",
      label: { ar: "العنوان (EN)", en: "" },
      placeholder: "أدخل عنوان القسم الجديد بالانجلزية",
    },
    {
      name: "title_ar",
      type: "text",
      fildType: "short-text",
      label: { ar: "العنوان (AR)", en: "" },
      placeholder: "أدخل عنوان القسم الجديد بالعربية",
    },

    {
      name: "parent_id",
      type: "",
      fildType: "select-type",
      label: { ar: "حدد القسم الرئيسى", en: "" },
      placeholder: "",
      selectItems: categories,
    },

    {
      name: "bg_color",
      type: "color",
      fildType: "color-fild",
      label: { ar: "حدد لون خلفية القسم", en: "" },
      placeholder: "",
    },
  ];
  return (
    <DynamicElementPage
      api={"/sub-category"}
      updateEndPoint={"/update-sub-category"}
      id={id}
      inputsData={addCategoryinputs}
      direct={`/en/dashboard/subcategories`}
    />
  );
}
