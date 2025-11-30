import { ChartsSection } from "@/app/_components/_dashboard/_mainDashPage/charts-section";
import { DashboardHeader } from "@/app/_components/_dashboard/_mainDashPage/dashboard-header";
import { PromotersOverview } from "@/app/_components/_dashboard/_mainDashPage/promoters-overview";
import { RecentActivity } from "@/app/_components/_dashboard/_mainDashPage/recent-activity";
import { StatsCards } from "@/app/_components/_dashboard/_mainDashPage/stats-cards";
import { TasksSection } from "@/app/_components/_dashboard/_mainDashPage/tasks-section";

// Main dashboard page component
export default function DashboardPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 pb-12">
      <div className="c-container">
        {/* Welcome Header Section */}
        <DashboardHeader />

        {/* Statistics Cards Section */}
        <StatsCards />

        {/* Charts Section */}
        <ChartsSection />

        {/* Bottom Grid: Activity, Promoters, Tasks */}
        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>

          {/* Promoters Overview */}
          <div className="lg:col-span-1">
            <PromotersOverview />
          </div>

          {/* Admin Tasks */}
          <div className="lg:col-span-1">
            <TasksSection />
          </div>
        </section>
      </div>
    </main>
  );
}
