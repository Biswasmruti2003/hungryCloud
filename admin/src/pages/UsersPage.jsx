import { motion } from "framer-motion";

const UsersPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 p-8">
      <motion.h2
        className="text-3xl font-bold text-blue-800 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        👤 All Registered Users
      </motion.h2>

      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Replace with real user table */}
        <p className="text-gray-600">User table coming soon...</p>
      </div>
    </div>
  );
};

export default UsersPage;
