import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaRegCalendarAlt,
  FaMapMarkedAlt,
  FaTags,
  FaCreditCard,
} from "react-icons/fa";

const SubscriptionTable = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalDates, setModalDates] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // All | Active | Cancelled

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) return;
        const res = await api.get("/api/admin/subscriptions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubscriptions(res.data.subscriptions || []);
      } catch (err) {
        console.error("Error loading subscriptions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubs();
  }, []);

  const fullDayToJSIndex = {
    Sunday: 0, Monday: 1, Tuesday: 2,
    Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6,
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };

  const getDatesWithSkipInfo = (startDateRaw, selectedDaysRaw, numDeliveries) => {
    const normalizeDay = (day) => {
      const cleaned = day.trim().toLowerCase();
      const cap = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
      const short = cap.slice(0, 3);
      return fullDayToJSIndex[cap] ?? fullDayToJSIndex[short];
    };

    const selectedDaysArray = Array.isArray(selectedDaysRaw)
      ? selectedDaysRaw
      : typeof selectedDaysRaw === "string"
        ? selectedDaysRaw.split(",")
        : [];

    const targetIndexes = selectedDaysArray.map(normalizeDay).filter((v) => v !== undefined);
    const deliveryDates = [], skipped = [];
    const startDate = new Date(startDateRaw);

    if (isNaN(startDate.getTime()) || !targetIndexes.length || !numDeliveries || Number(numDeliveries) <= 0) {
      console.warn("Invalid data for calendar generation");
      return { deliveryDates: [], skipped: [] };
    }

    let current = new Date(startDate);
    current.setHours(0, 0, 0, 0);
    let scannedDays = 0;

    while (deliveryDates.length < numDeliveries && scannedDays < 90) {
      const dayIndex = current.getDay();
      const formatted = current.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      });

      if (targetIndexes.includes(dayIndex)) {
        deliveryDates.push({ date: formatted, status: "✅" });
      } else {
        skipped.push({ date: formatted, status: "❌" });
      }

      current.setDate(current.getDate() + 1);
      scannedDays++;
    }

    return { deliveryDates, skipped };
  };

  const filteredSubscriptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return subscriptions.filter((sub) => {
      const status = (sub.status || "").toLowerCase();
      const statusOk =
        statusFilter === "All"
          ? true
          : statusFilter === "Active"
            ? status === "active"
            : status === "cancelled" || status === "canceled";

      if (!statusOk) return false;
      if (!q) return true;

      const userName = (sub.user?.name || "").toLowerCase();
      const phone = (sub.user?.phone || "").toLowerCase();
      const plan = (sub.plan || "").toLowerCase();
      const slot = (sub.slot || "").toLowerCase();
      const meal = (sub.mealOption || "").toLowerCase();
      return (
        userName.includes(q) ||
        phone.includes(q) ||
        plan.includes(q) ||
        slot.includes(q) ||
        meal.includes(q)
      );
    });
  }, [subscriptions, query, statusFilter]);

  const counts = useMemo(() => {
    const total = subscriptions.length;
    const active = subscriptions.filter(
      (s) => (s.status || "").toLowerCase() === "active"
    ).length;
    const cancelled = subscriptions.filter((s) => {
      const st = (s.status || "").toLowerCase();
      return st === "cancelled" || st === "canceled";
    }).length;
    return { total, active, cancelled };
  }, [subscriptions]);

  const handleConfirmCancel = async () => {
    if (!confirmCancelId) return;
    try {
      const token = localStorage.getItem("adminToken");
      await api.put(`/api/admin/cancel-subscription/${confirmCancelId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSubscriptions((prev) =>
        prev.map((s) =>
          s._id === confirmCancelId ? { ...s, status: "Cancelled" } : s
        )
      );
      setConfirmCancelId(null);
      toast.success("Subscription cancelled successfully.");
    } catch (err) {
      toast.error("Failed to cancel subscription.");
      console.error(err);
    }
  };

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
              Subscriptions
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Search subscriptions, view delivery calendar, and manage cancellations.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-96">
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search user, plan, slot, meal…"
                className="w-full rounded-2xl border border-gray-200 bg-white px-11 py-3 text-sm font-medium text-gray-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
              />
            </div>

            <div className="inline-flex flex-wrap gap-2 rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">
              {["All", "Active", "Cancelled"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setStatusFilter(opt)}
                  className={`rounded-xl px-4 py-2 text-xs font-extrabold uppercase tracking-wide transition ${
                    statusFilter === opt
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-2 text-xs font-bold text-gray-700 ring-1 ring-gray-100">
            {counts.total} total
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 ring-1 ring-emerald-100">
            {counts.active} active
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 ring-1 ring-rose-100">
            {counts.cancelled} cancelled
          </span>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="rounded-3xl border border-white/60 bg-white/70 p-8 text-center shadow-lg shadow-emerald-900/5 backdrop-blur">
          <p className="text-sm text-gray-600 animate-pulse">Loading subscriptions…</p>
        </div>
      ) : filteredSubscriptions.length === 0 ? (
        <div className="rounded-3xl border border-white/60 bg-white/70 p-8 text-center shadow-lg shadow-emerald-900/5 backdrop-blur">
          <p className="text-sm text-gray-600">
            No subscriptions found{query.trim() ? " for this search." : "."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-xl shadow-emerald-900/5 backdrop-blur">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-emerald-50/80 text-emerald-900 text-left">
                <tr>
                  <th className="py-4 px-4 font-bold">User</th>
                  <th className="py-4 px-4 font-bold">Plan</th>
                  <th className="py-4 px-4 font-bold">Slot</th>
                  <th className="py-4 px-4 font-bold">Meal</th>
                  <th className="py-4 px-4 font-bold">Days</th>
                  <th className="py-4 px-4 font-bold text-center">Calendar</th>
                  <th className="py-4 px-4 font-bold text-center">Address</th>
                  <th className="py-4 px-4 font-bold">Price</th>
                  <th className="py-4 px-4 font-bold">Coupon</th>
                  <th className="py-4 px-4 font-bold">Payment</th>
                  <th className="py-4 px-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSubscriptions.map((sub, i) => {
              let allDates = [];

if (Array.isArray(sub.deliveryDates) && sub.deliveryDates.length > 0) {
  // If deliveryDates exist in backend (especially for Online)
  allDates = sub.deliveryDates.map((date) => ({
    date: new Date(date).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    }),
    status: "✅",
  }));
} else {
  // Fallback to calculate via selectedDays
  const fallback = getDatesWithSkipInfo(sub.startDate, sub.selectedDays, sub.days);
  allDates = [...fallback.deliveryDates, ...fallback.skipped];
}

              return (
                <tr key={sub._id || i} className="hover:bg-emerald-50/40 transition">
                  <td className="py-4 px-4">
                    {sub.user
                      ? `${sub.user.name || "No Name"} - ${sub.user.phone || "No Phone"}`
                      : "User Deleted"}
                  </td>
                  <td className="py-4 px-4 font-semibold text-gray-900">{sub.plan || "N/A"}</td>
                  <td className="py-4 px-4">{sub.slot || "-"}</td>
                  <td className="py-4 px-4">{sub.mealOption || "-"}</td>
                  <td className="py-4 px-4">{sub.days || "-"}</td>
                  <td className="py-4 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setModalDates(allDates);
                        setSelectedUser(sub.user ? `${sub.user.name} - ${sub.user.phone}` : "User Deleted");
                        setModalVisible(true);
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-2 text-xs font-bold text-sky-800 shadow-sm transition hover:bg-sky-50"
                    >
                      <FaRegCalendarAlt />
                      Calendar
                    </button>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAddress(sub.address);
                        setShowAddressModal(true);
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-2 text-xs font-bold text-sky-800 shadow-sm transition hover:bg-sky-50"
                    >
                      <FaMapMarkedAlt />
                      Address
                    </button>
                  </td>
                  <td className="py-4 px-4 font-extrabold text-emerald-900 tabular-nums">
                    ₹{sub.totalPrice || 0}
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-2 text-gray-700">
                      <FaTags className="text-gray-400" />
                      {sub.couponCode || "-"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-2 text-gray-700">
                      <FaCreditCard className="text-gray-400" />
                      {sub.paymentMode || "-"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {sub.status?.toLowerCase?.() === "active" ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-800 ring-1 ring-emerald-100">
                          Active
                        </span>
                        <button
                          type="button"
                          onClick={() => setConfirmCancelId(sub._id)}
                          className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1.5 text-xs font-extrabold text-rose-700 ring-1 ring-rose-100 hover:bg-rose-100"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1.5 text-xs font-extrabold text-rose-700 ring-1 ring-rose-100">
                        Cancelled
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODALS */}
      {/* Calendar */}
      <AnimatePresence>
        {modalVisible && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              className="bg-white p-6 rounded-3xl shadow-2xl w-[92%] max-w-md border border-gray-100"
            >
              <h3 className="text-xl font-bold text-center text-green-700 mb-4">
                🗓️ Delivery Calendar for <br />
                <span className="text-base font-medium">{selectedUser}</span>
              </h3>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-800 max-h-[300px] overflow-y-auto">
                {modalDates.length === 0 ? (
                  <p className="text-red-500 text-center col-span-2">No delivery dates available.</p>
                ) : (
                  modalDates.map((item, idx) => (
                    <div key={idx} className={`flex justify-between items-center px-3 py-1 rounded ${item.status === "✅" ? "bg-green-100" : "bg-red-100"}`}>
                      <span>{item.date}</span>
                      <span className="font-bold">{item.status}</span>
                    </div>
                  ))
                )}
              </div>

              <button onClick={() => setModalVisible(false)} className="mt-6 block mx-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full">
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address Modal */}
      <AnimatePresence>
        {showAddressModal && selectedAddress && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white p-6 rounded-3xl shadow-2xl w-[92%] max-w-md border border-gray-100"
            >
              <h3 className="text-xl font-bold mb-4 text-green-800 text-center">🏠 Full Address</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>At:</strong> {selectedAddress.at}</p>
                <p><strong>PO:</strong> {selectedAddress.po}</p>
                <p><strong>Dist:</strong> {selectedAddress.dist}</p>
                <p><strong>PIN:</strong> {selectedAddress.pin}</p>
                {(selectedAddress.lat && selectedAddress.lng) && (
                  <>
                    <p><strong>Lat:</strong> {selectedAddress.lat}</p>
                    <p><strong>Lng:</strong> {selectedAddress.lng}</p>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${selectedAddress.lat},${selectedAddress.lng}`} target="_blank" rel="noopener noreferrer"
                      className="block mt-2 text-blue-600 underline hover:text-blue-800">
                      🌍 View on Google Maps
                    </a>
                  </>
                )}
              </div>
              <button onClick={() => setShowAddressModal(false)} className="mt-6 block mx-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full">
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Modal */}
      <AnimatePresence>
        {confirmCancelId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-blue-200/30 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-3xl p-6 shadow-2xl w-[92%] max-w-sm text-center border border-gray-100">
              <h3 className="text-lg font-semibold text-red-600 mb-4">
                Are you sure you want to cancel this subscription?
              </h3>
              <div className="flex justify-center gap-4">
                <button onClick={() => setConfirmCancelId(null)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">
                  No
                </button>
                <button onClick={handleConfirmCancel} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                  Yes, Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubscriptionTable;
