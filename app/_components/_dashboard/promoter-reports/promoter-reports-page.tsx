"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiSettings } from "react-icons/fi";
import SummaryKPIs from "./summary-kpis";
import ChartsSection from "./charts-section";
import ActivityLog from "./activity-log";
import TrafficInsights from "./traffic-insights";
import EarningsBreakdown from "./earnings-breakdown";
import ReferralLinkBox from "./referral-link-box";
import TopReferredMembers from "./top-referred-members";
import SettingsSection from "./settings-section";
import { Promoter, PromotionActivity } from "./types";
import Img from "../../_website/_global/Img";
import PromoterDataNotFound from "./PromoterDataNotFound";

interface props {
  promoterData: {
    promoter: Promoter;
    activities: {
      data: PromotionActivity[];
      last_page: number;
      total: number;
      per_page: number;
    };
  };
}

export default function PromoterReportsPage({ promoterData }: props) {
  const [promoter, setPromoter] = useState<Partial<Promoter>>(
    promoterData?.promoter ?? {}
  );
  const [activeTab, setActiveTab] = useState<"reports" | "settings">("reports");

  const handleUpdatePromoter = (updates: Partial<Promoter>) => {
    setPromoter((prev) => ({ ...prev, ...updates }));
  };

  console.log(promoter);

  if (!promoter) return <PromoterDataNotFound />;

  return (
    <div dir="rtl" className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="shadow-sm border-b border-border z-50"
      >
        <div className="lg:max-w-[90%] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Img
                className="w-12 h-12 object-cover rounded-full"
                src={promoter.promoter?.image ?? "/defaults/male-noimage.jpg"}
                errorSrc="/defaults/male-noimage.jpg"
              />
              <div>
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <p className="text-muted-foreground">
                      {promoter.promoter?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ({promoter.promoter?.phone})
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {promoter.promoter?.email}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("reports")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "reports"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-primary"
                }`}
              >
                التقارير
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  activeTab === "settings"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-primary"
                }`}
              >
                <FiSettings className="w-4 h-4" />
                الإعدادات
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-[90%] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "reports" ? (
          <div className="space-y-8">
            {/* Summary KPIs */}
            <SummaryKPIs promoter={promoter} />

            {/* Referral Link Box */}
            <ReferralLinkBox promoter={promoter} />

            {/* Charts Section */}
            <ChartsSection activities={promoterData.activities.data} />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Traffic Insights */}
              <TrafficInsights activities={promoterData.activities.data} />

              {/* Top Referred Members */}
              <TopReferredMembers />
            </div>

            {/* Earnings Breakdown */}
            <EarningsBreakdown activities={promoterData.activities.data} />

            {/* Activity Log */}
            <ActivityLog activitiesData={promoterData.activities ?? []} />
          </div>
        ) : (
          <SettingsSection
            promoter={promoter}
            onUpdate={handleUpdatePromoter}
          />
        )}
      </main>
    </div>
  );
}
