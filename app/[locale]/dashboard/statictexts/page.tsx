import CardsHeaderSection from "@/app/_components/_dashboard/_statictexts/CardsHeaderSection";
import OrganizationsEditSection from "@/app/_components/_dashboard/_statictexts/OrganizationsEditSection";
import ServicesEditSection from "@/app/_components/_dashboard/_statictexts/ServicesEditSection";
import StatsSectionEdit from "@/app/_components/_dashboard/_statictexts/StatsSectionEdit";
import FetchData from "@/app/_helpers/FetchData";

export default async function StaticTextsPage() {
  const mainSectionsData = await FetchData("/get-main-sections", false);

  if (!mainSectionsData) {
    return <div>لا يوجد بيانات</div>;
  }

  const { cards_section, centers_section, services_section, stats_section } =
    mainSectionsData;

  return (
    <div className="min-h-screen p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            إدارة النصوص الثابتة
          </h1>
          <p className="text-gray-600">
            تعديل النصوص والإحصائيات الظاهرة في الصفحة الرئيسية
          </p>
        </div>

        {/* Section 1: Cards Header */}
        <CardsHeaderSection data={cards_section.data} />

        {/* Section 2: Organizations */}
        <OrganizationsEditSection data={centers_section.data} />

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-gray-300 to-transparent my-8" />

        {/* Section 3: Services */}
        <ServicesEditSection data={services_section.data} />

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-gray-300 to-transparent my-8" />

        {/* Section 4: Stats */}
        <StatsSectionEdit data={stats_section.data} />

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-gray-300 to-transparent my-8" />
      </div>
    </div>
  );
}
