import { useEffect, useState } from "react";
import {
  FaShoppingCart,
  FaUserCheck,
  FaRupeeSign,
  FaChartPie,
} from "react-icons/fa";
import { motion } from "framer-motion";
import DashboardCard from "../pages/DashboardCard";
import api from "../api";

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    activeSubs: 0,
    revenue: 0,
    popularPlan: "",
  });

  const getStats = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const res = await api.get("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setMetrics({
          totalOrders: res.data.totalOrders,
          activeSubs: res.data.activeSubs,
          revenue: res.data.revenue,
          popularPlan: res.data.popularPlan,
        });
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  const stats = [
    {
      title: "Total Orders",
      value: metrics.totalOrders,
      icon: FaShoppingCart,
      color: "from-green-400 to-green-600",
    },
    {
      title: "Active Subscriptions",
      value: metrics.activeSubs,
      icon: FaUserCheck,
      color: "from-blue-400 to-blue-600",
    },
    {
      title: "Revenue Generated",
      value: `₹${metrics.revenue}`,
      icon: FaRupeeSign,
      color: "from-yellow-400 to-yellow-600",
    },
    {
      title: "Most Popular Plan",
      value: metrics.popularPlan || "N/A",
      icon: FaChartPie,
      color: "from-purple-400 to-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-amber-50 to-orange-100 py-14 px-6 relative overflow-hidden">
      {/* Logout Button */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={() => {
            localStorage.removeItem("adminToken");
            window.location.href = "/admin-login";
          }}
          className="bg-red-500 hover:bg-red-600 text-white text-sm px-5 py-2 rounded-full shadow-lg transition-all duration-300"
        >
          Logout
        </button>
      </div>

      {/* Heading */}
      <motion.h1
        className="text-5xl font-bold text-center text-green-900 mb-20 tracking-wide drop-shadow-lg"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🌟 Admin Dashboard
      </motion.h1>

      {/* Animated Metric Cards */}
      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, scale: 0.8, y: 30 },
              visible: { opacity: 1, scale: 1, y: 0 },
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className={`relative rounded-2xl shadow-xl p-6 bg-gradient-to-br ${stat.color} text-white`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-3xl opacity-80">
                <stat.icon />
              </div>
            </div>
            <p className="text-sm font-medium tracking-wider uppercase">
              {stat.title}
            </p>
            {/* Glowing Dot */}
            <span className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-white animate-ping opacity-60"></span>
          </motion.div>
        ))}
      </motion.div>

      {/* Optional Sparkle or Gradient Animation Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="animate-pulse opacity-5 w-full h-full bg-[radial-gradient(#a7f3d0,transparent_70%)]" />
      </div>
    </div>
  );
};

export default AdminDashboard;
