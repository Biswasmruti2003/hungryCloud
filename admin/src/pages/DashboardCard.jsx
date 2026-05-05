import { motion } from "framer-motion";

const DashboardCard = ({ title, value, icon: Icon, color }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className={`bg-white shadow-lg border-l-4 ${color} p-6 rounded-lg flex items-center gap-4 transition-transform hover:scale-[1.03]`}
    >
      <div className="text-3xl text-gray-700">
        <Icon />
      </div>
      <div>
        <h4 className="text-gray-600 text-sm">{title}</h4>
        <p className="text-xl font-bold text-green-700">{value}</p>
      </div>
    </motion.div>
  );
};

export default DashboardCard;
