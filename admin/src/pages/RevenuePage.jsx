// pages/RevenuePage.jsx
import { useEffect, useState } from "react";
import AdminRevenueChart from "../components/AdminRevenueChart";
import { motion } from "framer-motion";

const RevenuePage = () => {
  const [data, setData] = useState({
    labels: [],
    values: [],
  });

  useEffect(() => {
    // Placeholder chart data
    setData({
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      values: [1000, 2000, 1500, 2500, 3000, 1800, 2200],
    });
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      <motion.h2
        className="text-4xl font-bold mb-10 text-center text-green-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        📊 Revenue Overview
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <AdminRevenueChart labels={data.labels} values={data.values} />
      </motion.div>
    </div>
  );
};

export default RevenuePage;
