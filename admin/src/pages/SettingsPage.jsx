import { motion } from "framer-motion";

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-300 p-8">
      <motion.h2
        className="text-3xl font-bold text-gray-800 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        ⚙️ Admin Settings
      </motion.h2>

      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Replace with real admin settings form */}
        <p className="text-gray-600">Admin settings options will be here.</p>
      </div>
    </div>
  );
};

export default SettingsPage;
