import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle, FaPhone, FaEnvelope, FaSignOutAlt, FaTrash
} from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0);
  const [subscriptions, setSubscriptions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
          window.dispatchEvent(new Event("userChanged"));
          setCredits(data.user.credits || 0);
          setSubscriptions(data.user.subscriptions || []);
          setTransactions(data.user.transactions || []);
        } else {
          handleLogout();
        }
      } catch (err) {
        console.error(err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userChanged"));
    setTimeout(() => {
      window.location.href = "/login";
    }, 100);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/user/delete`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Account deleted");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("userChanged"));
        setTimeout(() => navigate("/signup"), 1500);
      }
    } catch (err) {
      toast.error("Failed to delete account");
      console.error(err);
    }
  };

  const filteredSubscriptions = subscriptions
    .filter((sub) => {
      if (filter === "active") return sub.status?.toLowerCase() === "active";
      if (filter === "expired") return sub.status?.toLowerCase() === "cancelled";
      return true;
    })
    .sort((a, b) =>
      new Date(b.confirmedAt || b.createdAt) - new Date(a.confirmedAt || a.createdAt)
    );

  const formatAddress = (addr) =>
    addr?.at || addr?.po || addr?.dist || addr?.pin
      ? `${addr?.at}, ${addr?.po}, ${addr?.dist} - ${addr?.pin}`
      : "No address info";

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-gray-600 font-medium">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 md:px-20 bg-gradient-to-br from-green-50 via-white to-orange-50">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-xl font-semibold text-red-600 mb-2">Delete Account</h2>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-1.5 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-1.5 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between border-b pb-4 gap-4">
          <div className="flex gap-4 items-start">
            <FaUserCircle className="text-green-700 text-4xl mt-1" />
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-green-800">Welcome, {user?.name}</h2>
              <p className="text-sm text-gray-600 flex items-center gap-2"><FaPhone className="text-green-500" /> {user?.phone}</p>
              <p className="text-sm text-gray-600 flex items-center gap-2"><FaEnvelope className="text-green-500" /> {user?.email}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded-xl bg-orange-50 shadow-inner text-center">
            <h4 className="text-sm text-gray-600 font-semibold mb-2">Meal Progress</h4>
            <div className="w-24 h-24 mx-auto">
              <CircularProgressbar
                value={credits}
                maxValue={100}
                text={`${credits}%`}
                styles={buildStyles({ textColor: "#166534", pathColor: "#22c55e" })}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Credits Remaining</p>
          </div>
          <div className="p-4 border rounded-xl bg-green-50 shadow-inner">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">Summary</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>Active Plans: <strong>{subscriptions.filter(s => s.status?.toLowerCase() === "active").length}</strong></li>
              <li>Total Transactions: <strong>{transactions.length}</strong></li>
              <li>Credits: <strong>{credits}</strong></li>
            </ul>
          </div>
        </div>

        {/* Subscription Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-2">
          <h3 className="text-lg font-semibold text-green-800">Your Subscriptions</h3>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border px-3 py-1.5 rounded text-sm bg-white shadow"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="expired">Cancelled</option>
          </select>
        </div>

        {/* Subscription List */}
        {filteredSubscriptions.length > 0 ? (
          <ul className="space-y-3">
            {filteredSubscriptions.map((sub, idx) => (
              <motion.li
                key={sub._id || idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                className={`border-l-4 p-4 rounded-md shadow-md bg-white ${
                  sub.status?.toLowerCase() === "cancelled"
                    ? "border-red-400"
                    : "border-green-400"
                }`}
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-md font-semibold mb-1 text-gray-800">
                    {sub.plan ? sub.plan.toString().trim() : "Unnamed Plan"}
                  </h4>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      sub.status?.toLowerCase() === "cancelled"
                        ? "bg-red-100 text-red-700 border border-red-300"
                        : "bg-green-100 text-green-700 border border-green-300"
                    }`}
                  >
                    {sub.status?.charAt(0).toUpperCase() + sub.status?.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-700"><strong>Meal Option:</strong> {sub.mealOption || "N/A"}</p>
                <p className="text-sm text-gray-700"><strong>Duration:</strong> {sub.duration}</p>
                <p className="text-sm text-gray-700"><strong>Start Date:</strong> {new Date(sub.startDate).toLocaleDateString()}</p>
                <p className="text-sm text-gray-700"><strong>Time of Subscription:</strong> {new Date(sub.confirmedAt || sub.createdAt).toLocaleString()}</p>
                <p className="text-sm text-gray-700"><strong>Address:</strong> {formatAddress(sub.address)}</p>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 mt-2">No subscriptions found.</p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-6 border-t mt-6">
          <button
            onClick={handleLogout}
            className="text-sm px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 flex items-center gap-2 justify-center"
          >
            <FaSignOutAlt /> Logout
          </button>
         
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
