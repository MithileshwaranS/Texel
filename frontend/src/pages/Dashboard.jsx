import React from "react";
import {
  FaHome,
  FaShoppingCart,
  FaUsers,
  FaBoxOpen,
  FaChartLine,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaTshirt,
  FaSearch,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  // Sample data for charts
  const revenueData = [
    { name: "Jan", revenue: 4000 },
    { name: "Feb", revenue: 3000 },
    { name: "Mar", revenue: 5000 },
    { name: "Apr", revenue: 2780 },
    { name: "May", revenue: 1890 },
    { name: "Jun", revenue: 2390 },
  ];

  const fabricTypeData = [
    { name: "Cotton", value: 35 },
    { name: "Silk", value: 25 },
    { name: "Wool", value: 20 },
    { name: "Polyester", value: 15 },
    { name: "Linen", value: 5 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  // Recent orders data
  const recentOrders = [
    {
      id: "#TXT-001",
      customer: "Fashion Trends Inc.",
      date: "2023-06-15",
      amount: "$12,500",
      status: "Shipped",
    },
    {
      id: "#TXT-002",
      customer: "Elite Textiles",
      date: "2023-06-14",
      amount: "$8,200",
      status: "Processing",
    },
    {
      id: "#TXT-003",
      customer: "Urban Wear Co.",
      date: "2023-06-13",
      amount: "$15,750",
      status: "Shipped",
    },
    {
      id: "#TXT-004",
      customer: "Luxury Fabrics Ltd.",
      date: "2023-06-12",
      amount: "$6,300",
      status: "Delivered",
    },
    {
      id: "#TXT-005",
      customer: "Classic Styles",
      date: "2023-06-10",
      amount: "$9,800",
      status: "Delivered",
    },
  ];

  // Key metrics
  const metrics = [
    {
      title: "Total Revenue",
      value: "$152,340",
      icon: <FaMoneyBillWave className="text-green-500" />,
      change: "+12% from last month",
    },
    {
      title: "Total Orders",
      value: "284",
      icon: <FaShoppingCart className="text-blue-500" />,
      change: "+8% from last month",
    },
    {
      title: "Active Buyers",
      value: "56",
      icon: <FaUsers className="text-purple-500" />,
      change: "+5 new buyers",
    },
    {
      title: "Inventory Items",
      value: "1,245",
      icon: <FaBoxOpen className="text-orange-500" />,
      change: "32 low stock",
    },
  ];

  // Upcoming events
  const upcomingEvents = [
    { title: "Fabric Expo 2023", date: "June 25-27", location: "New York" },
    { title: "Supplier Meeting", date: "July 5", location: "Conference Room" },
    { title: "New Collection Launch", date: "July 15", location: "Showroom" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header - Responsive for all screens */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <h1 className="text-xl md:text-2xl font-bold flex items-center">
            <FaHome className="mr-2" />
            Textile Management Dashboard
          </h1>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto text-sm md:text-base">
              New Order
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Metrics Cards - Responsive Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white p-3 sm:p-4 lg:p-5 rounded-lg shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    {metric.title}
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold mt-1">
                    {metric.value}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{metric.change}</p>
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl p-2 rounded-full bg-gray-100">
                  {metric.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section - Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
          {/* Revenue Chart */}
          <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-semibold flex items-center mb-2 sm:mb-0">
                <FaChartLine className="mr-2 text-blue-500" />
                Monthly Revenue
              </h2>
              <select className="border rounded px-2 sm:px-3 py-1 text-xs sm:text-sm w-full sm:w-auto">
                <option>Last 6 Months</option>
                <option>Last Year</option>
                <option>Last 3 Years</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#4f46e5" name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fabric Types Chart */}
          <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow">
            <h2 className="text-base sm:text-lg font-semibold flex items-center mb-3 sm:mb-4">
              <FaTshirt className="mr-2 text-green-500" />
              Fabric Type Distribution
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fabricTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {fabricTypeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Orders and Upcoming Events - Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
          {/* Recent Orders - Full width on mobile, 2/3 on larger screens */}
          <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-semibold flex items-center mb-2 sm:mb-0">
                <FaShoppingCart className="mr-2 text-purple-500" />
                Recent Orders
              </h2>
              <button className="text-blue-600 text-xs sm:text-sm font-medium hover:underline">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="hidden sm:table-cell px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="hidden xs:table-cell px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-xs sm:text-sm font-medium text-blue-600">
                        {order.id}
                      </td>
                      <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500 truncate max-w-[100px] sm:max-w-[150px]">
                        {order.customer}
                      </td>
                      <td className="hidden sm:table-cell px-3 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {order.date}
                      </td>
                      <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {order.amount}
                      </td>
                      <td className="hidden xs:table-cell px-2 sm:px-3 py-2 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Events - Full width on mobile, 1/3 on larger screens */}
          <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow">
            <h2 className="text-base sm:text-lg font-semibold flex items-center mb-3 sm:mb-4">
              <FaCalendarAlt className="mr-2 text-orange-500" />
              Upcoming Events
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="border-l-4 border-blue-500 pl-2 sm:pl-3 py-1 sm:py-2"
                >
                  <h3 className="font-medium text-xs sm:text-sm lg:text-base">
                    {event.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {event.date} • {event.location}
                  </p>
                  <button className="mt-1 text-blue-600 text-xs hover:underline">
                    Add to calendar
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 sm:mt-6">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                <button className="text-left px-2 sm:px-3 py-1 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded text-xs sm:text-sm transition">
                  Generate Inventory Report
                </button>
                <button className="text-left px-2 sm:px-3 py-1 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded text-xs sm:text-sm transition">
                  Contact Top Buyers
                </button>
                <button className="text-left px-2 sm:px-3 py-1 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded text-xs sm:text-sm transition">
                  Schedule Production
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Top Buyers - Responsive grid */}
        <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow mb-6">
          <h2 className="text-base sm:text-lg font-semibold flex items-center mb-3 sm:mb-4">
            <FaUsers className="mr-2 text-indigo-500" />
            Top Buyers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="border rounded-lg p-2 sm:p-3 lg:p-4 hover:shadow-md transition">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs sm:text-sm lg:text-base">
                  FT
                </div>
                <div>
                  <h3 className="font-medium text-xs sm:text-sm lg:text-base">
                    Fashion Trends Inc.
                  </h3>
                  <p className="text-xs text-gray-500">$42,500 total spent</p>
                </div>
              </div>
              <div className="mt-1 sm:mt-2 lg:mt-3 flex justify-between text-xs">
                <span>12 orders</span>
                <span className="text-green-600">+15% from last year</span>
              </div>
            </div>
            <div className="border rounded-lg p-2 sm:p-3 lg:p-4 hover:shadow-md transition">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs sm:text-sm lg:text-base">
                  UW
                </div>
                <div>
                  <h3 className="font-medium text-xs sm:text-sm lg:text-base">
                    Urban Wear Co.
                  </h3>
                  <p className="text-xs text-gray-500">$38,750 total spent</p>
                </div>
              </div>
              <div className="mt-1 sm:mt-2 lg:mt-3 flex justify-between text-xs">
                <span>9 orders</span>
                <span className="text-green-600">+22% from last year</span>
              </div>
            </div>
            <div className="border rounded-lg p-2 sm:p-3 lg:p-4 hover:shadow-md transition">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs sm:text-sm lg:text-base">
                  ET
                </div>
                <div>
                  <h3 className="font-medium text-xs sm:text-sm lg:text-base">
                    Elite Textiles
                  </h3>
                  <p className="text-xs text-gray-500">$31,200 total spent</p>
                </div>
              </div>
              <div className="mt-1 sm:mt-2 lg:mt-3 flex justify-between text-xs">
                <span>7 orders</span>
                <span className="text-green-600">+8% from last year</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
