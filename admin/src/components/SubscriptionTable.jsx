import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";
import { toast } from "react-toastify";

const SubscriptionTable = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [modalDates, setModalDates] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);

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
    console.log("Raw Start Date:", startDateRaw);
    console.log("Raw Selected Days:", selectedDaysRaw);
    console.log("Raw Days:", numDeliveries);

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
    <div className="overflow-x-auto mt-12 max-w-7xl mx-auto px-2">
      <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">📄 All Subscriptions</h2>

      <table className="min-w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden text-sm">
        <thead className="bg-green-100 text-green-800 text-left">
          <tr>
            <th className="py-3 px-4 border-b">User</th>
            <th className="py-3 px-4 border-b">Plan</th>
            <th className="py-3 px-4 border-b">Slot</th>
            <th className="py-3 px-4 border-b">Meal</th>
            <th className="py-3 px-4 border-b">Days</th>
            <th className="py-3 px-4 border-b">Calendar</th>
            <th className="py-3 px-4 border-b">Address</th>
            <th className="py-3 px-4 border-b">Price</th>
            <th className="py-3 px-4 border-b">Coupon</th>
            <th className="py-3 px-4 border-b">Payment Mode</th>
            <th className="py-3 px-4 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.length === 0 ? (
            <tr>
              <td colSpan="11" className="text-center py-6 text-gray-500 font-medium">
                No subscriptions found.
              </td>
            </tr>
          ) : (
            subscriptions.map((sub, i) => {
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
                <tr key={i} className="hover:bg-green-50 transition duration-200">
                  <td className="py-2 px-4 border-b">
                    {sub.user
                      ? `${sub.user.name || "No Name"} - ${sub.user.phone || "No Phone"}`
                      : "User Deleted"}
                  </td>
                  <td className="py-2 px-4 border-b">{sub.plan || "N/A"}</td>
                  <td className="py-2 px-4 border-b">{sub.slot || "-"}</td>
                  <td className="py-2 px-4 border-b">{sub.mealOption || "-"}</td>
                  <td className="py-2 px-4 border-b">{sub.days || "-"}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() => {
                        setModalDates(allDates);
                        setSelectedUser(sub.user ? `${sub.user.name} - ${sub.user.phone}` : "User Deleted");
                        setModalVisible(true);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-3 rounded-full"
                    >
                      📅 View Calendar
                    </button>
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() => {
                        setSelectedAddress(sub.address);
                        setShowAddressModal(true);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-3 rounded-full"
                    >
                      View Address
                    </button>
                  </td>
                  <td className="py-2 px-4 border-b">₹{sub.totalPrice || 0}</td>
                  <td className="py-2 px-4 border-b">{sub.couponCode || "-"}</td>
                  <td className="py-2 px-4 border-b">{sub.paymentMode || "-"}</td>
                  <td className="py-2 px-4 border-b">
                    {sub.status?.toLowerCase() === "active" ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-green-600 font-semibold">Active</span>
                        <button
                          onClick={() => setConfirmCancelId(sub._id)}
                          className="text-red-500 underline text-xs hover:text-red-700"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span className="text-red-500 font-semibold">Cancelled</span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

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
              className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md"
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
              className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md"
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
              className="bg-white rounded-lg p-6 shadow-xl w-full max-w-sm text-center">
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
