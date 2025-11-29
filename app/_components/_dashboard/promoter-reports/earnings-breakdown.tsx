"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FiCalendar, FiGlobe, FiUsers } from "react-icons/fi";
import { PromotionActivity } from "./types";

interface EarningsBreakdownProps {
  activities: PromotionActivity[];
}

type TimeRange = "daily" | "weekly" | "monthly";

export default function EarningsBreakdown({
  activities,
}: EarningsBreakdownProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");

  const purchaseActivities = useMemo(
    () => activities.filter((a) => a.activity_type === "purchase"),
    [activities]
  );

  // Earnings by time
  const earningsByTime = useMemo(() => {
    const grouped: Record<string, number> = {};
    purchaseActivities.forEach((a) => {
      const date = new Date(a.created_at);
      let key: string;
      if (timeRange === "daily") {
        key = date.toLocaleDateString("ar-EG", {
          month: "short",
          day: "numeric",
        });
      } else if (timeRange === "weekly") {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = `أسبوع ${weekStart.toLocaleDateString("ar-EG", {
          month: "short",
          day: "numeric",
        })}`;
      } else {
        key = date.toLocaleDateString("ar-EG", {
          month: "long",
          year: "numeric",
        });
      }
      grouped[key] = (grouped[key] || 0) + (a.commission_amount || 0);
    });
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .slice(-10);
  }, [purchaseActivities, timeRange]);

  // Earnings by country
  const earningsByCountry = useMemo(() => {
    const grouped: Record<string, number> = {};
    purchaseActivities.forEach((a) => {
      grouped[a.country] =
        (grouped[a.country] || 0) + (a.commission_amount || 0);
    });
    return Object.entries(grouped)
      .map(([country, earnings]) => ({ country, earnings }))
      .sort((a, b) => b.earnings - a.earnings)
      .slice(0, 5);
  }, [purchaseActivities]);

  // Earnings by referred member
  const earningsByMember = useMemo(() => {
    const grouped: Record<
      string,
      { name: string; earnings: number; purchases: number }
    > = {};
    purchaseActivities.forEach((a) => {
      if (a.referredMemberId) {
        if (!grouped[a.referredMemberId]) {
          grouped[a.referredMemberId] = {
            name: a.referredMemberName || `عضو #${a.referredMemberId}`,
            earnings: 0,
            purchases: 0,
          };
        }
        grouped[a.referredMemberId].earnings += a.commission_amount || 0;
        grouped[a.referredMemberId].purchases++;
      }
    });
    return Object.values(grouped)
      .sort((a, b) => b.earnings - a.earnings)
      .slice(0, 5);
  }, [purchaseActivities]);

  const totalEarnings = purchaseActivities.reduce(
    (sum, a) => sum + (a.commission_amount || 0),
    0
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-bold text-foreground">تفاصيل الأرباح</h2>

      <div className="grid grid-cols-1  gap-4">
        {/* Earnings Over Time Chart */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FiCalendar className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">
                الأرباح حسب الفترة
              </h3>
            </div>
            <div className="flex gap-1">
              {(["daily", "weekly", "monthly"] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    timeRange === range
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-primary"
                  }`}
                >
                  {range === "daily"
                    ? "يومي"
                    : range === "weekly"
                    ? "أسبوعي"
                    : "شهري"}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsByTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    direction: "rtl",
                  }}
                  formatter={(value: number) => [
                    `${value.toLocaleString("ar-EG")} ر.س`,
                    "الأرباح",
                  ]}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Earnings by Country */}
        {/* <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <FiGlobe className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">
              الأرباح حسب الدولة
            </h3>
          </div>
          <div className="space-y-3">
            {earningsByCountry.map((item, index) => {
              const percentage = (item.earnings / totalEarnings) * 100;
              return (
                <div key={item.country}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">
                      {item.country}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {item.earnings.toLocaleString("ar-EG")} ر.س
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                      className="h-full bg-amber-500 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div> */}
      </div>

      {/* Earnings by Member */}
      {/* <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <FiUsers className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">
            إجمالي العمولة حسب الأعضاء المحالين
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-300">
              <tr>
                <th className="px-4 py-2 text-right text-sm font-semibold text-foreground">
                  العضو
                </th>
                <th className="px-4 py-2 text-right text-sm font-semibold text-foreground">
                  عدد المشتريات
                </th>
                <th className="px-4 py-2 text-right text-sm font-semibold text-foreground">
                  إجمالي العمولة
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {earningsByMember.map((member) => (
                <tr
                  key={member.name}
                  className="hover:bg-secondary/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {member.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {member.purchases.toLocaleString("ar-EG")}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-green-600">
                    {member.earnings.toLocaleString("ar-EG")} ر.س
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
    </motion.section>
  );
}
