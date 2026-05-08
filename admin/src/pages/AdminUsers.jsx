import { Fragment, useEffect, useMemo, useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaUsers,
  FaBoxOpen,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

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
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleExpand = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const name = (u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const phone = (u.phone || "").toLowerCase();
      return name.includes(q) || email.includes(q) || phone.includes(q);
    });
  }, [users, query]);

  const totalUsers = users.length;
  const usersWithOrders = useMemo(
    () => users.filter((u) => (u.orders?.length || 0) > 0).length,
    [users]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="mb-6 rounded-3xl border border-white/60 bg-white/70 p-5 shadow-lg shadow-emerald-900/5 backdrop-blur md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Admin
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              Users
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Search users and expand to view subscriptions.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-80">
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, email, or phone"
                className="w-full rounded-2xl border border-gray-200 bg-white px-11 py-3 text-sm font-medium text-gray-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 ring-1 ring-emerald-100">
                <FaUsers />
                {totalUsers} total
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-2 text-xs font-bold text-gray-700 ring-1 ring-gray-100">
                <FaBoxOpen />
                {usersWithOrders} with orders
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="rounded-3xl border border-white/60 bg-white/70 p-8 text-center shadow-lg shadow-emerald-900/5 backdrop-blur">
          <p className="text-sm text-gray-600 animate-pulse">Loading users…</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-3xl border border-white/60 bg-white/70 p-8 text-center shadow-lg shadow-emerald-900/5 backdrop-blur">
          <p className="text-sm text-gray-600">
            No users found{query.trim() ? " for this search." : "."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-xl shadow-emerald-900/5 backdrop-blur">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-emerald-50/80 text-emerald-900">
                <tr>
                  <th className="text-left px-4 py-4 font-bold">Name</th>
                  <th className="text-left px-4 py-4 font-bold">Email</th>
                  <th className="text-left px-4 py-4 font-bold">Phone</th>
                  <th className="text-center px-4 py-4 font-bold">Orders</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <Fragment key={user._id}>
                    <tr className="hover:bg-emerald-50/40 transition">
                      <td className="px-4 py-4">
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {user.name || "No Name"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user._id?.slice?.(0, 10) || ""}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4 max-w-[260px]">
                        <p className="text-gray-700 break-words">{user.email || "-"}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-gray-700">{user.phone || "-"}</p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleExpand(user._id)}
                          className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-3 py-2 text-emerald-800 shadow-sm transition hover:bg-emerald-50"
                          aria-label="Toggle user orders"
                        >
                          {expandedUserId === user._id ? <FaChevronUp /> : <FaChevronDown />}
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
                          className="bg-white/60"
                        >
                          <td colSpan="4" className="px-4 py-5">
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {orders.map((order, i) => (
        <motion.div
          key={order._id || i}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-lg shadow-emerald-900/5 backdrop-blur transition"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Plan
              </p>
              <p className="mt-1 font-bold text-gray-900 truncate">{order.plan}</p>
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-semibold text-gray-800">Meal:</span>{" "}
                {order.mealOption} •{" "}
                <span className="font-semibold text-gray-800">Slot:</span>{" "}
                {order.slot}
              </p>
            </div>

            <div className="text-right shrink-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Total
              </p>
              <p className="mt-1 text-lg font-extrabold text-emerald-800 tabular-nums">
                ₹{order.totalPrice}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-800">Start:</span>{" "}
              {new Date(order.startDate).toLocaleDateString()}{" "}
              <span className="text-gray-400">•</span>{" "}
              <span className="font-semibold text-gray-800">Days:</span> {order.days}
            </p>
            <span
              className={`text-xs font-extrabold px-3 py-1.5 rounded-full ring-1 ${
                order.status?.toLowerCase?.() === "cancelled"
                  ? "bg-rose-50 text-rose-700 ring-rose-100"
                  : "bg-emerald-50 text-emerald-800 ring-emerald-100"
              }`}
            >
              {order.status}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminUsers;
