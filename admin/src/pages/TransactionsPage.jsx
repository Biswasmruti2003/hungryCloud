import { motion } from "framer-motion";

const TransactionsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-200 p-8">
      <motion.h2
        className="text-3xl font-bold text-slate-800 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        💳 Transaction History
      </motion.h2>

      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Replace with transaction history table */}
        <p className="text-gray-600">Transaction data will appear here.</p>
      </div>
    </div>
  );
};

export default TransactionsPage;
