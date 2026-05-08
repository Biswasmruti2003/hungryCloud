import { useEffect, useState } from "react";
import {
  FaShoppingCart,
  FaUserCheck,
  FaRupeeSign,
  FaChartPie,
  FaArrowRight,
} from "react-icons/fa";
import { motion } from "framer-motion";
import api from "../api";

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    activeSubs: 0,
    revenue: 0,
    popularPlan: "",
  });
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin-login";
  };

  const stats = [
    {
      title: "Total Orders",
      value: metrics.totalOrders,
      icon: FaShoppingCart,
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "Active Subscriptions",
      value: metrics.activeSubs,
      icon: FaUserCheck,
      color: "from-sky-500 to-indigo-500",
    },
    {
      title: "Revenue Generated",
      value: `₹${metrics.revenue}`,
      icon: FaRupeeSign,
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Most Popular Plan",
      value: metrics.popularPlan || "N/A",
      icon: FaChartPie,
      color: "from-fuchsia-500 to-purple-600",
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-2rem)] overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/70 to-transparent" />

      <div className="mx-auto max-w-7xl py-8">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 -mx-4 mb-8 px-4 py-4 backdrop-blur md:static md:backdrop-blur-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Admin
              </p>
              <motion.h1
                className="mt-1 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Dashboard
              </motion.h1>
              <p className="mt-2 text-sm text-gray-600">
                Overview of orders, subscriptions, and revenue.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-black"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.35 }}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-5 shadow-lg shadow-emerald-900/5 backdrop-blur"
              >
                <div
                  className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${stat.color} opacity-30 blur-2xl transition group-hover:opacity-40`}
                />

                <div className="relative flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      {stat.title}
                    </p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <p className="text-2xl font-extrabold text-gray-900 tabular-nums">
                        {loading ? "—" : stat.value}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-md`}
                    >
                      <Icon />
                    </div>
                  </div>
                </div>

                <div className="relative mt-auto flex items-center gap-2 pt-4 text-xs font-semibold text-emerald-800">
                  <span className="rounded-full bg-emerald-50 px-2 py-1 ring-1 ring-emerald-100">
                    Updated live
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="inline-flex items-center gap-1 text-gray-600">
                    View details <FaArrowRight className="text-[10px]" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Hint Card */}
        <div className="mt-8 rounded-3xl border border-emerald-100 bg-white/70 p-6 shadow-lg shadow-emerald-900/5 backdrop-blur">
          <p className="text-sm font-semibold text-gray-900">Tip</p>
          <p className="mt-1 text-sm text-gray-600">
            Use the sidebar to navigate to users, subscriptions, plans, coupons, and revenue analytics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
