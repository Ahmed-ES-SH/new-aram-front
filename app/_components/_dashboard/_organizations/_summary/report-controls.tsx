"use client"

import { motion } from "framer-motion"
import { FiDownload, FiFileText, FiCalendar } from "react-icons/fi"

export function ReportControls() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex items-center space-x-4"
    >
      <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
        <FiCalendar className="w-4 h-4" />
        <span>Date Range</span>
      </button>

      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        <FiFileText className="w-4 h-4" />
        <span>Generate Report</span>
      </button>

      <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
        <FiDownload className="w-4 h-4" />
        <span>Export PDF</span>
      </button>
    </motion.div>
  )
}
