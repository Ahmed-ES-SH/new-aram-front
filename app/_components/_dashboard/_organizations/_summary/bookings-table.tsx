"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import {
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiSearch,
  FiFilter,
  FiChevronUp,
  FiChevronDown,
  FiDownload,
  FiEye,
  FiEdit,
  FiX,
} from "react-icons/fi"

const bookingsData = [
  {
    id: 1,
    date: "2024-01-15",
    time: "09:00 AM",
    center: "Downtown Fitness",
    service: "Personal Training",
    users: 24,
    revenue: 1200,
    status: "Completed",
    duration: 60,
    instructor: "Sarah Johnson",
    rating: 4.8,
  },
  {
    id: 2,
    date: "2024-01-15",
    time: "10:30 AM",
    center: "Wellness Hub",
    service: "Yoga Class",
    users: 18,
    revenue: 540,
    status: "Completed",
    duration: 90,
    instructor: "Mike Chen",
    rating: 4.9,
  },
  {
    id: 3,
    date: "2024-01-14",
    time: "02:00 PM",
    center: "Health Center Pro",
    service: "Massage Therapy",
    users: 12,
    revenue: 960,
    status: "Cancelled",
    duration: 45,
    instructor: "Emma Davis",
    rating: 4.6,
  },
  {
    id: 4,
    date: "2024-01-14",
    time: "06:00 PM",
    center: "Fit Zone Plus",
    service: "Group Fitness",
    users: 32,
    revenue: 800,
    status: "Completed",
    duration: 75,
    instructor: "Alex Rodriguez",
    rating: 4.7,
  },
  {
    id: 5,
    date: "2024-01-13",
    time: "11:00 AM",
    center: "Active Life Center",
    service: "Swimming",
    users: 15,
    revenue: 450,
    status: "Pending",
    duration: 60,
    instructor: "Lisa Wang",
    rating: 4.5,
  },
  {
    id: 6,
    date: "2024-01-13",
    time: "03:30 PM",
    center: "Elite Fitness Studio",
    service: "CrossFit",
    users: 20,
    revenue: 700,
    status: "Completed",
    duration: 60,
    instructor: "Tom Wilson",
    rating: 4.8,
  },
  {
    id: 7,
    date: "2024-01-12",
    time: "08:00 AM",
    center: "Power Gym Central",
    service: "Strength Training",
    users: 16,
    revenue: 640,
    status: "Completed",
    duration: 90,
    instructor: "Rachel Green",
    rating: 4.4,
  },
  {
    id: 8,
    date: "2024-01-12",
    time: "07:00 PM",
    center: "Zen Wellness Center",
    service: "Meditation",
    users: 25,
    revenue: 375,
    status: "In Progress",
    duration: 45,
    instructor: "David Kim",
    rating: 4.9,
  },
]

type SortField = "date" | "center" | "service" | "users" | "revenue" | "rating"
type SortDirection = "asc" | "desc"

export function BookingsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [serviceFilter, setServiceFilter] = useState("All")
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)
  const [selectedBooking, setSelectedBooking] = useState<(typeof bookingsData)[0] | null>(null)

  const filteredData = bookingsData
    .filter((booking) => {
      const matchesSearch =
        booking.center.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "All" || booking.status === statusFilter
      const matchesService = serviceFilter === "All" || booking.service === serviceFilter
      return matchesSearch && matchesStatus && matchesService
    })
    .sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      if (sortField === "date") {
        aValue = new Date(a.date).getTime()
        bValue = new Date(b.date).getTime()
      }

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

  const uniqueServices = [...new Set(bookingsData.map((booking) => booking.service))]

  const totalRevenue = filteredData.reduce((sum, booking) => sum + booking.revenue, 0)
  const totalUsers = filteredData.reduce((sum, booking) => sum + booking.users, 0)
  const avgRating = filteredData.reduce((sum, booking) => sum + booking.rating, 0) / filteredData.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Bookings Management</h3>
          <p className="text-sm text-gray-500 mt-1">Track and manage all service bookings</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <FiDownload className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <FiDollarSign className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Revenue</p>
              <p className="text-xl font-bold text-blue-900">${totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <FiUsers className="w-5 h-5 text-green-600 mr-2" />
            <div>
              <p className="text-sm text-green-600 font-medium">Total Users</p>
              <p className="text-xl font-bold text-green-900">{totalUsers.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center">
            <FiTrendingUp className="w-5 h-5 text-yellow-600 mr-2" />
            <div>
              <p className="text-sm text-yellow-600 font-medium">Avg Rating</p>
              <p className="text-xl font-bold text-yellow-900">{avgRating.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search bookings, centers, or instructors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[120px]"
            >
              <option value="All">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>

          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[140px]"
          >
            <option value="All">All Services</option>
            {uniqueServices.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th
                className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center space-x-1">
                  <span>Date & Time</span>
                  <SortIcon field="date" />
                </div>
              </th>
              <th
                className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
                onClick={() => handleSort("center")}
              >
                <div className="flex items-center space-x-1">
                  <span>Center</span>
                  <SortIcon field="center" />
                </div>
              </th>
              <th
                className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
                onClick={() => handleSort("service")}
              >
                <div className="flex items-center space-x-1">
                  <span>Service</span>
                  <SortIcon field="service" />
                </div>
              </th>
              <th
                className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
                onClick={() => handleSort("users")}
              >
                <div className="flex items-center space-x-1">
                  <span>Users</span>
                  <SortIcon field="users" />
                </div>
              </th>
              <th
                className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
                onClick={() => handleSort("revenue")}
              >
                <div className="flex items-center space-x-1">
                  <span>Revenue</span>
                  <SortIcon field="revenue" />
                </div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((booking, index) => (
              <motion.tr
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium text-gray-900">{booking.date}</div>
                    <div className="text-sm text-gray-500">{booking.time}</div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium text-gray-900">{booking.center}</div>
                    <div className="text-sm text-gray-500">{booking.instructor}</div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <div className="text-gray-900">{booking.service}</div>
                    <div className="text-sm text-gray-500">{booking.duration} min</div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <FiUsers className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-gray-900">{booking.users}</span>
                  </div>
                </td>
                <td className="py-4 px-4 font-medium text-gray-900">${booking.revenue.toLocaleString()}</td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : booking.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                      <FiEdit className="w-4 h-4" />
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
          {filteredData.length} bookings
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + Math.max(1, currentPage - 2)
            if (page > totalPages) return null
            return (
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
            )
          })}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Booking Details</h4>
              <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time:</span>
                <span className="font-medium">
                  {selectedBooking.date} at {selectedBooking.time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Center:</span>
                <span className="font-medium">{selectedBooking.center}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium">{selectedBooking.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Instructor:</span>
                <span className="font-medium">{selectedBooking.instructor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{selectedBooking.duration} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Users:</span>
                <span className="font-medium">{selectedBooking.users}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue:</span>
                <span className="font-medium">${selectedBooking.revenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rating:</span>
                <span className="font-medium">{selectedBooking.rating}/5.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedBooking.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : selectedBooking.status === "Cancelled"
                        ? "bg-red-100 text-red-800"
                        : selectedBooking.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {selectedBooking.status}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
