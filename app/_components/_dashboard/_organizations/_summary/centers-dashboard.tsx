"use client";

import { motion } from "framer-motion";
import { ReportControls } from "./report-controls";
import { SummaryCards } from "./summary-cards";
import { ChartsSection } from "./charts-section";
import { CentersTable } from "./centers-table";
import { BookingsTable } from "./bookings-table";

export function CentersDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:w-[90%] max-md:w-[98%] max-lg:w-[95%] w-full mx-auto space-y-8"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Centers Statistics & Reports
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive overview of all centers performance
            </p>
          </div>
          <ReportControls />
        </div>

        {/* Summary Cards */}
        <SummaryCards />

        {/* Charts Section */}
        <ChartsSection />

        {/* Tables Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <CentersTable />
          <BookingsTable />
        </div>
      </motion.div>
    </div>
  );
}
