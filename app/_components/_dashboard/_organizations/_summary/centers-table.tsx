"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import {
  FiDownload,
  FiMapPin,
  FiStar,
  FiSearch,
  FiFilter,
  FiChevronUp,
  FiChevronDown,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiEye,
} from "react-icons/fi"

const centersData = [
  {
    id: 1,
    name: "Downtown Fitness",
    location: "New York, NY",
    status: "Active",
    revenue: 485000,
    bookings: 1247,
    rating: 4.8,
    growth: 12.5,
    lastActive: "2024-01-15",
  },
  {
    id: 2,
    name: "Wellness Hub",
    location: "Los Angeles, CA",
    status: "Active",
    revenue: 420000,
    bookings: 1156,
    rating: 4.7,
    growth: 8.3,
    lastActive: "2024-01-14",
  },
  {
    id: 3,
    name: "Health Center Pro",
    location: "Chicago, IL",
    status: "Active",
    revenue: 380000,
    bookings: 1089,
    rating: 4.6,
    growth: 15.2,
    lastActive: "2024-01-15",
  },
  {
    id: 4,
    name: "Fit Zone Plus",
    location: "Houston, TX",
    status: "Active",
    revenue: 320000,
    bookings: 987,
    rating: 4.5,
    growth: -2.1,
    lastActive: "2024-01-13",
  },
  {
    id: 5,
    name: "Active Life Center",
    location: "Phoenix, AZ",
    status: "Inactive",
    revenue: 280000,
    bookings: 876,
    rating: 4.4,
    growth: -5.8,
    lastActive: "2024-01-10",
  },
  {
    id: 6,
    name: "Elite Fitness Studio",
    location: "Miami, FL",
    status: "Active",
    revenue: 395000,
    bookings: 1134,
    rating: 4.9,
    growth: 18.7,
    lastActive: "2024-01-15",
  },
  {
    id: 7,
    name: "Power Gym Central",
    location: "Dallas, TX",
    status: "Active",
    revenue: 310000,
    bookings: 945,
    rating: 4.3,
    growth: 6.4,
    lastActive: "2024-01-14",
  },
  {
    id: 8,
    name: "Zen Wellness Center",
    location: "Seattle, WA",
    status: "Pending",
    revenue: 275000,
    bookings: 823,
    rating: 4.6,
    growth: 9.1,
    lastActive: "2024-01-12",
  },
]

type SortField = "name" | "revenue" | "bookings" | "rating" | "growth"
type SortDirection = "asc" | "desc"

export function CentersTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [sortField, setSortField] = useState<SortField>("revenue")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  const filteredData = centersData
    .filter((center) => {
      const matchesSearch =
        center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "All" || center.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      const multiplier = sortDirection === "asc" ? 1 : -1

      if (typeof aValue === "string") {
        return aValue.localeCompare(bValue as string) * multiplier
      }
      return ((aValue as number) - (bValue as number)) * multiplier
    })

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Centers Overview</h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <FiDownload className="w-4 h-4" />
          <span>Export All</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search centers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="relative">
          <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th
                className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center space-x-1">
                  <span>Center</span>
                  <SortIcon field="name" />
                </div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
              <th
                className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
                onClick={() => handleSort("revenue")}
              >
                <div className="flex items-center space-x-1">
                  <span>Revenue</span>
                  <SortIcon field="revenue" />
                </div>
              </th>
              <th
                className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
                onClick={() => handleSort("bookings")}
              >
                <div className="flex items-center space-x-1">
                  <span>Bookings</span>
                  <SortIcon field="bookings" />
                </div>
              </th>
              <th
                className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
                onClick={() => handleSort("rating")}
              >
                <div className="flex items-center space-x-1">
                  <span>Rating</span>
                  <SortIcon field="rating" />
                </div>
              </th>
              <th
                className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
                onClick={() => handleSort("growth")}
              >
                <div className="flex items-center space-x-1">
                  <span>Growth</span>
                  <SortIcon field="growth" />
                </div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((center, index) => (
              <motion.tr
                key={center.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium text-gray-900">{center.name}</div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <FiMapPin className="w-3 h-3 mr-1" />
                      {center.location}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      center.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : center.status === "Inactive"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {center.status}
                  </span>
                </td>
                <td className="py-4 px-4 font-medium text-gray-900">${center.revenue.toLocaleString()}</td>
                <td className="py-4 px-4 text-gray-600">{center.bookings.toLocaleString()}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <FiStar className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-gray-900">{center.rating}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`font-medium ${center.growth >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {center.growth >= 0 ? "+" : ""}
                    {center.growth}%
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                      <FiMoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-500">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} centers
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border rounded-md text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  )
}
