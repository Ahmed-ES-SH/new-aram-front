"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaBuilding,
  FaCalendarCheck,
  FaCreditCard,
  FaBullhorn,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaArrowUp,
  FaArrowDown,
  FaBell,
  FaSearch,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// Dummy data
const dashboardStats = [
  {
    title: "العملاء",
    value: "1,234",
    change: "+12%",
    icon: FaUsers,
    color: "bg-blue-500",
    trend: "up",
  },
  {
    title: "المراكز",
    value: "45",
    change: "+3%",
    icon: FaBuilding,
    color: "bg-green-500",
    trend: "up",
  },
  {
    title: "الحجوزات",
    value: "2,567",
    change: "-5%",
    icon: FaCalendarCheck,
    color: "bg-purple-500",
    trend: "down",
  },
  {
    title: "إجمالي المبيعات",
    value: "125,430 ر.س",
    change: "+18%",
    icon: FaCreditCard,
    color: "bg-orange-500",
    trend: "up",
  },
];

const monthlyBookings = [
  { month: "يناير", bookings: 150, revenue: 15000 },
  { month: "فبراير", bookings: 180, revenue: 18500 },
  { month: "مارس", bookings: 220, revenue: 22000 },
  { month: "أبريل", bookings: 190, revenue: 19500 },
  { month: "مايو", bookings: 250, revenue: 25500 },
  { month: "يونيو", bookings: 280, revenue: 28000 },
];

const centerDistribution = [
  { name: "الرياض", value: 35, color: "#3B82F6" },
  { name: "جدة", value: 25, color: "#10B981" },
  { name: "الدمام", value: 20, color: "#F59E0B" },
  { name: "المدينة", value: 12, color: "#EF4444" },
  { name: "أخرى", value: 8, color: "#8B5CF6" },
];

const recentUsers = [
  {
    id: 1,
    name: "أحمد محمد",
    email: "ahmed@example.com",
    center: "مركز الرياض",
    status: "نشط",
    joinDate: "2024-01-15",
  },
  {
    id: 2,
    name: "فاطمة علي",
    email: "fatima@example.com",
    center: "مركز جدة",
    status: "نشط",
    joinDate: "2024-01-14",
  },
  {
    id: 3,
    name: "محمد سعد",
    email: "mohamed@example.com",
    center: "مركز الدمام",
    status: "معلق",
    joinDate: "2024-01-13",
  },
  {
    id: 4,
    name: "نورا أحمد",
    email: "nora@example.com",
    center: "مركز الرياض",
    status: "نشط",
    joinDate: "2024-01-12",
  },
];

const recentBookings = [
  {
    id: 1,
    user: "خالد محمد",
    service: "استشارة طبية",
    center: "مركز الرياض",
    date: "2024-01-20",
    time: "10:00 ص",
    status: "مؤكد",
  },
  {
    id: 2,
    user: "سارة علي",
    service: "فحص دوري",
    center: "مركز جدة",
    date: "2024-01-20",
    time: "2:00 م",
    status: "في الانتظار",
  },
  {
    id: 3,
    user: "عبدالله سعد",
    service: "علاج طبيعي",
    center: "مركز الدمام",
    date: "2024-01-21",
    time: "11:30 ص",
    status: "مؤكد",
  },
  {
    id: 4,
    user: "مريم أحمد",
    service: "استشارة نفسية",
    center: "مركز المدينة",
    date: "2024-01-21",
    time: "4:00 م",
    status: "ملغي",
  },
];

const promotionalCampaigns = [
  {
    id: 1,
    name: "خصم الصيف 2024",
    discount: "30%",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    status: "نشط",
    usage: 156,
  },
  {
    id: 2,
    name: "عرض العملاء الجدد",
    discount: "25%",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "نشط",
    usage: 89,
  },
  {
    id: 3,
    name: "خصم الأسرة",
    discount: "40%",
    startDate: "2024-03-01",
    endDate: "2024-05-31",
    status: "منتهي",
    usage: 234,
  },
  {
    id: 4,
    name: "عرض نهاية الأسبوع",
    discount: "15%",
    startDate: "2024-01-15",
    endDate: "2024-12-31",
    status: "نشط",
    usage: 67,
  },
];

// Components
const StatsCard = ({ stat, index }: { stat: any; index: number }) => {
  const Icon = stat.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-lg p-6 border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
          <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          <div className="flex items-center mt-2">
            {stat.trend === "up" ? (
              <FaArrowUp className="text-green-500 text-xs ml-1" />
            ) : (
              <FaArrowDown className="text-red-500 text-xs ml-1" />
            )}
            <span
              className={`text-sm ${
                stat.trend === "up" ? "text-green-500" : "text-red-500"
              }`}
            >
              {stat.change}
            </span>
          </div>
        </div>
        <div className={`${stat.color} p-3 rounded-full`}>
          <Icon className="text-white text-xl" />
        </div>
      </div>
    </motion.div>
  );
};

const QuickAction = ({
  title,
  icon: Icon,
  onClick,
  color,
}: {
  title: string;
  icon: any;
  onClick: () => void;
  color: string;
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`${color} text-white p-4 rounded-lg shadow-lg flex flex-col items-center space-y-2 hover:shadow-xl transition-shadow`}
  >
    <Icon className="text-2xl" />
    <span className="text-sm font-medium">{title}</span>
  </motion.button>
);

const TableRow = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <tr
    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${className}`}
  >
    {children}
  </tr>
);

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "نشط":
      case "مؤكد":
        return "bg-green-100 text-green-800";
      case "معلق":
      case "في الانتظار":
        return "bg-yellow-100 text-yellow-800";
      case "ملغي":
      case "منتهي":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {status}
    </span>
  );
};

const Dashboard = () => {
  // const [activeTab, setActiveTab] = useState("overview");

  const quickActions = [
    {
      title: "إضافة عميل جديد",
      icon: FaUsers,
      color: "bg-blue-500",
      action: () => console.log("Add user"),
    },
    {
      title: "إضافة مركز",
      icon: FaBuilding,
      color: "bg-green-500",
      action: () => console.log("Add center"),
    },
    {
      title: "حجز جديد",
      icon: FaCalendarCheck,
      color: "bg-purple-500",
      action: () => console.log("New booking"),
    },
    {
      title: "حملة ترويجية",
      icon: FaBullhorn,
      color: "bg-orange-500",
      action: () => console.log("New campaign"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 rtl" dir="rtl">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-200 px-6 py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-reverse space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">
              لوحة التحكم الإدارية
            </h1>
            <FaBell className="text-gray-400 cursor-pointer hover:text-gray-600" />
          </div>
          <div className="flex items-center space-x-reverse space-x-4">
            <div className="relative">
              <FaSearch className="absolute right-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="البحث..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              تصدير التقرير
            </button>
          </div>
        </div>
      </motion.header>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, index) => (
            <StatsCard key={index} stat={stat} index={index} />
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            إجراءات سريعة
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <QuickAction
                key={index}
                title={action.title}
                icon={action.icon}
                onClick={action.action}
                color={action.color}
              />
            ))}
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Bookings Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              الحجوزات الشهرية
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyBookings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Center Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              توزيع المراكز
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={centerDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {centerDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            الإيرادات الشهرية
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyBookings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Users */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                العملاء الجدد
              </h3>
              <button className="text-blue-500 hover:text-blue-600 text-sm">
                عرض الكل
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 text-right">
                    <th className="py-3 text-sm font-medium text-gray-500">
                      الاسم
                    </th>
                    <th className="py-3 text-sm font-medium text-gray-500">
                      المركز
                    </th>
                    <th className="py-3 text-sm font-medium text-gray-500">
                      الحالة
                    </th>
                    <th className="py-3 text-sm font-medium text-gray-500">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <td className="py-3">
                        <div>
                          <p className="font-medium text-gray-800">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {user.center}
                      </td>
                      <td className="py-3">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="py-3">
                        <div className="flex space-x-reverse space-x-2">
                          <button className="text-blue-500 hover:text-blue-600">
                            <FaEye />
                          </button>
                          <button className="text-green-500 hover:text-green-600">
                            <FaEdit />
                          </button>
                          <button className="text-red-500 hover:text-red-600">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </TableRow>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                الحجوزات الأخيرة
              </h3>
              <button className="text-blue-500 hover:text-blue-600 text-sm">
                عرض الكل
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 text-right">
                    <th className="py-3 text-sm font-medium text-gray-500">
                      العميل
                    </th>
                    <th className="py-3 text-sm font-medium text-gray-500">
                      الخدمة
                    </th>
                    <th className="py-3 text-sm font-medium text-gray-500">
                      التاريخ
                    </th>
                    <th className="py-3 text-sm font-medium text-gray-500">
                      الحالة
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <td className="py-3">
                        <p className="font-medium text-gray-800">
                          {booking.user}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.center}
                        </p>
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {booking.service}
                      </td>
                      <td className="py-3">
                        <p className="text-sm text-gray-600">{booking.date}</p>
                        <p className="text-xs text-gray-500">{booking.time}</p>
                      </td>
                      <td className="py-3">
                        <StatusBadge status={booking.status} />
                      </td>
                    </TableRow>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Promotional Campaigns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              الحملات الترويجية
            </h3>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-reverse space-x-2">
              <FaPlus />
              <span>حملة جديدة</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-right">
                  <th className="py-3 text-sm font-medium text-gray-500">
                    اسم الحملة
                  </th>
                  <th className="py-3 text-sm font-medium text-gray-500">
                    الخصم
                  </th>
                  <th className="py-3 text-sm font-medium text-gray-500">
                    تاريخ الانتهاء
                  </th>
                  <th className="py-3 text-sm font-medium text-gray-500">
                    الاستخدام
                  </th>
                  <th className="py-3 text-sm font-medium text-gray-500">
                    الحالة
                  </th>
                  <th className="py-3 text-sm font-medium text-gray-500">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {promotionalCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <td className="py-3 font-medium text-gray-800">
                      {campaign.name}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {campaign.discount}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {campaign.endDate}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {campaign.usage} مرة
                    </td>
                    <td className="py-3">
                      <StatusBadge status={campaign.status} />
                    </td>
                    <td className="py-3">
                      <div className="flex space-x-reverse space-x-2">
                        <button className="text-blue-500 hover:text-blue-600">
                          <FaEye />
                        </button>
                        <button className="text-green-500 hover:text-green-600">
                          <FaEdit />
                        </button>
                        <button className="text-red-500 hover:text-red-600">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
