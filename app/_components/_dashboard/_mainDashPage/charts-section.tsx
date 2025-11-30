"use client"

import { motion } from "framer-motion"
import { UsersChart } from "./charts/users-chart"
import { ServicesChart } from "./charts/services-chart"
import { CentersDistributionChart } from "./charts/centers-distribution-chart"

// Main charts section wrapper component
export function ChartsSection() {
  return (
    <section className="mt-8">
      <motion.h2
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6 text-xl font-bold text-gray-900"
      >
        الرسوم البيانية والتحليلات
      </motion.h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Users Line Chart - Full width on mobile, half on large screens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2"
        >
          <UsersChart />
        </motion.div>

        {/* Services Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ServicesChart />
        </motion.div>

        {/* Centers Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CentersDistributionChart />
        </motion.div>
      </div>
    </section>
  )
}
