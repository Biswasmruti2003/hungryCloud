import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await api.get("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const usersWithOrders = res.data.users || [];

        // Sort users by latest order date
        const sorted = usersWithOrders.sort((a, b) => {
          const aLatest = a.orders?.[0]?.createdAt || 0;
          const bLatest = b.orders?.[0]?.createdAt || 0;
          return new Date(bLatest) - new Date(aLatest);
        });

        setUsers(sorted);
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };

    fetchUsers();
  }, []);

  const toggleExpand = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-green-700 text-center">
        👥 All Users
      </h2>

      {users.length === 0 ? (
        <p className="text-gray-600 text-center">No users found.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Make table scrollable on small screens */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-green-100 text-green-800">
                <tr>
                  <th className="text-left px-3 sm:px-4 py-3">Name</th>
                  <th className="text-left px-3 sm:px-4 py-3">Email</th>
                  <th className="text-left px-3 sm:px-4 py-3">Phone</th>
                  <th className="text-center px-3 sm:px-4 py-3">Orders</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <Fragment key={user._id}>
                    <tr className="border-t hover:bg-green-50 transition">
                      <td className="px-3 sm:px-4 py-3 break-words max-w-[150px] sm:max-w-none">
                        {user.name || "No Name"}
                      </td>
                      <td className="px-3 sm:px-4 py-3 break-words max-w-[180px] sm:max-w-none">
                        {user.email || "-"}
                      </td>
                      <td className="px-3 sm:px-4 py-3">{user.phone || "-"}</td>
                      <td className="px-3 sm:px-4 py-3 text-center">
                        <button
                          onClick={() => toggleExpand(user._id)}
                          className="text-green-600 hover:text-green-800 text-lg sm:text-xl"
                        >
                          {expandedUserId === user._id ? (
                            <FaChevronUp />
                          ) : (
                            <FaChevronDown />
                          )}
                        </button>
                      </td>
                    </tr>

                    <AnimatePresence>
                      {expandedUserId === user._id && (
                        <motion.tr
                          key={user._id + "_details"}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-gray-50 border-t"
                        >
                          <td colSpan="4" className="px-4 py-4">
                            <UserOrders userId={user._id} />
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

import { Fragment } from "react";

const UserOrders = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await api.get(`/api/admin/user-subscriptions/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sorted = (res.data.subscriptions || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setOrders(sorted);
      } catch (err) {
        console.error("Error fetching orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading)
    return (
      <p className="text-gray-500 text-sm animate-pulse">Loading orders...</p>
    );
  if (orders.length === 0)
    return <p className="text-gray-500 text-sm">No subscriptions found.</p>;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map((order, i) => (
        <motion.div
          key={order._id || i}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="p-4 border rounded-lg bg-white shadow transition text-sm sm:text-base"
        >
          <div className="mb-2">
            <p>
              <strong className="text-green-700">Plan:</strong> {order.plan}
            </p>
            <p>
              <strong className="text-green-700">Meal Type:</strong>{" "}
              {order.mealOption}
            </p>
            <p>
              <strong className="text-green-700">Slot:</strong> {order.slot}
            </p>
          </div>
          <div className="mb-2">
            <p>
              <strong className="text-green-700">Start:</strong>{" "}
              {new Date(order.startDate).toLocaleDateString()}
            </p>
            <p>
              <strong className="text-green-700">Days:</strong> {order.days}
            </p>
          </div>
          <div className="flex justify-between items-center flex-wrap gap-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                order.status.toLowerCase() === "cancelled"
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {order.status}
            </span>
            <span className="text-green-800 font-bold text-sm sm:text-base">
              ₹{order.totalPrice}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminUsers;
