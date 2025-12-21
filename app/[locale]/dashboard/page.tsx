import OrganizationsList from "@/app/_components/_dashboard/_mainDashPage/CentersList";
import { ChartsSection } from "@/app/_components/_dashboard/_mainDashPage/charts-section";
import { DashboardHeader } from "@/app/_components/_dashboard/_mainDashPage/dashboard-header";
import { PromotersOverview } from "@/app/_components/_dashboard/_mainDashPage/promoters-overview";
import QuickActions from "@/app/_components/_dashboard/_mainDashPage/QuickActions";
import { StatsCards } from "@/app/_components/_dashboard/_mainDashPage/stats-cards";
import { TasksSection } from "@/app/_components/_dashboard/_mainDashPage/tasks-section";
import FetchData from "@/app/_helpers/FetchData";

// Main dashboard page component
export default async function DashboardPage() {
  const stats = await FetchData(`/dashboard-main-page-stats`, false);
  const chartsData = await FetchData(`/charts-data`, false);
  const organizations = await FetchData(
    `/organizations-for-selection-table`,
    false
  );

  const topPromoters = await FetchData(`/top-promoters-data`, false);

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 pb-12">
      <div className="c-container">
        {/* Welcome Header Section */}
        <DashboardHeader />

        <QuickActions />

        {/* Statistics Cards Section */}
        <StatsCards statsData={stats} />

        {/* Charts Section */}
        <ChartsSection chartsData={chartsData} />

        {/* Bottom Grid: Activity, Promoters, Tasks */}
        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Promoters Overview */}
          <div className="lg:col-span-1">
            <PromotersOverview topPromotersResponse={topPromoters} />
          </div>

          {/* Admin Tasks */}
          <div className="lg:col-span-1">
            <TasksSection />
          </div>
        </section>

        <OrganizationsList organizations={organizations} />
      </div>
    </main>
  );
}
