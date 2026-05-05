import { motion } from "framer-motion";

const PlansPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-emerald-100 p-8">
      <motion.h2
        className="text-3xl font-bold text-green-800 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🥗 Manage Meal Plans
      </motion.h2>

      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Replace with real plan cards or table */}
        <p className="text-gray-600">List of meal plans will appear here.</p>
      </div>
    </div>
  );
};

export default PlansPage;
