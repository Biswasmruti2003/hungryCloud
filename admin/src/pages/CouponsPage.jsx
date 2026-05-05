import { motion } from "framer-motion";

const CouponsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-white to-orange-100 p-8">
      <motion.h2
        className="text-3xl font-bold text-yellow-800 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🎟️ Manage Coupons
      </motion.h2>

      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Replace with coupon management form/table */}
        <p className="text-gray-600">Coupon management UI will go here.</p>
      </div>
    </div>
  );
};

export default CouponsPage;
