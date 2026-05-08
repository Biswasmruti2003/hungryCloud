import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaPhone,
  FaEnvelope,
  FaSignOutAlt,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0);
  const [subscriptions, setSubscriptions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });

  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const formatINR = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));

  const formatINRNumber = (amount) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));

  const handleDownloadReceipt = (sub) => {
    try {
      const id = sub?._id || "NA";
      const plan = (sub?.plan || "Unnamed Plan").toString().trim();
      const createdAt = sub?.confirmedAt || sub?.createdAt;
      const receiptNo = `HC-${String(id).slice(-6).toUpperCase()}`;
      const safePlan = plan.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "");
      const filename = `receipt_${safePlan || "plan"}_${String(id).slice(-6)}.pdf`;

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      doc.setProperties({
        title: `Receipt - ${plan}`,
        subject: "Subscription receipt",
      });
      doc.setFont("helvetica", "normal");

      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const marginX = 44;
      const marginY = 46;
      const contentW = pageW - marginX * 2;
      const green = { r: 22, g: 163, b: 74 }; // tailwind green-600-ish
      const grayText = { r: 75, g: 85, b: 99 }; // gray-600-ish
      const border = { r: 229, g: 231, b: 235 }; // gray-200-ish

      const ensureSpace = (y, needed = 0) => {
        if (y + needed <= pageH - marginY) return y;
        doc.addPage();
        return marginY;
      };

      const drawLabelValue = (x, y, label, value, valueAlign = "left") => {
        doc.setFontSize(9);
        doc.setTextColor(grayText.r, grayText.g, grayText.b);
        doc.text(String(label), x, y);
        doc.setFontSize(11);
        doc.setTextColor(17, 24, 39);
        const v = value == null || value === "" ? "N/A" : String(value);
        if (valueAlign === "right") {
          doc.text(v, x, y + 14, { align: "right" });
        } else {
          doc.text(v, x, y + 14);
        }
      };

      const drawSectionTitle = (y, title) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(17, 24, 39);
        doc.text(title, marginX, y);
        doc.setFont("helvetica", "normal");
      };

      // Header bar
      doc.setFillColor(green.r, green.g, green.b);
      doc.roundedRect(marginX, marginY - 22, contentW, 44, 10, 10, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("HungryCloud", marginX + 16, marginY + 5);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("Receipt", marginX + contentW - 16, marginY + 5, {
        align: "right",
      });

      // Meta row (Receipt No / Date / Status)
      let y = marginY + 52;
      y = ensureSpace(y, 90);

      doc.setDrawColor(border.r, border.g, border.b);
      doc.setFillColor(250, 250, 250);
      doc.roundedRect(marginX, y, contentW, 78, 12, 12, "FD");

      const colGap = 18;
      const colW = (contentW - colGap * 2) / 3;
      const x1 = marginX + 16;
      const x2 = x1 + colW + colGap;
      const x3 = x2 + colW + colGap;

      drawLabelValue(x1, y + 18, "Receipt No", receiptNo);
      drawLabelValue(
        x2,
        y + 18,
        "Created At",
        createdAt ? new Date(createdAt).toLocaleString() : "N/A"
      );
      drawLabelValue(x3, y + 18, "Status", sub?.status || "N/A");

      y += 96;

      // Customer / Address
      y = ensureSpace(y, 170);
      drawSectionTitle(y, "Billed To");
      y += 14;

      doc.setDrawColor(border.r, border.g, border.b);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(marginX, y, contentW, 106, 12, 12, "FD");

      const customerName =
        user?.name || JSON.parse(localStorage.getItem("user") || "{}")?.name || "Customer";
      const customerPhone =
        user?.phone || JSON.parse(localStorage.getItem("user") || "{}")?.phone || "";
      const customerEmail =
        user?.email || JSON.parse(localStorage.getItem("user") || "{}")?.email || "";

      doc.setTextColor(17, 24, 39);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(customerName, marginX + 16, y + 24);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(grayText.r, grayText.g, grayText.b);
      const contactLine = [customerPhone, customerEmail].filter(Boolean).join(" • ");
      if (contactLine) doc.text(contactLine, marginX + 16, y + 40);

      doc.setTextColor(17, 24, 39);
      doc.setFontSize(10);
      doc.text("Delivery Address", marginX + 16, y + 62);
      doc.setTextColor(grayText.r, grayText.g, grayText.b);
      const addr = formatAddress(sub?.address);
      const addrWrapped = doc.splitTextToSize(addr, contentW - 32);
      doc.text(addrWrapped, marginX + 16, y + 78);

      y += 130;

      // Plan details + Amount summary (two columns)
      y = ensureSpace(y, 210);
      drawSectionTitle(y, "Subscription Details");
      y += 14;

      const leftW = (contentW - 16) * 0.62;
      const rightW = contentW - 16 - leftW;
      const leftX = marginX;
      const rightX = marginX + leftW + 16;

      doc.setDrawColor(border.r, border.g, border.b);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(leftX, y, leftW, 152, 12, 12, "FD");
      doc.roundedRect(rightX, y, rightW, 152, 12, 12, "FD");

      // Left box: plan info
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(17, 24, 39);
      const planWrapped = doc.splitTextToSize(plan, leftW - 32);
      doc.text(planWrapped, leftX + 16, y + 26);
      doc.setFont("helvetica", "normal");

      doc.setFontSize(10);
      doc.setTextColor(grayText.r, grayText.g, grayText.b);
      const startDateStr = sub?.startDate
        ? new Date(sub.startDate).toLocaleDateString()
        : "N/A";
      const detailLines = [
        `Meal Option: ${sub?.mealOption || "N/A"}`,
        `Slot: ${sub?.slot || "N/A"}`,
        `Duration: ${sub?.duration || "N/A"} (${sub?.days ?? "N/A"} days)`,
        `Start Date: ${startDateStr}`,
        `Payment Mode: ${sub?.paymentMode || "N/A"}`,
      ];
      const detailWrapped = doc.splitTextToSize(detailLines.join("\n"), leftW - 32);
      doc.text(detailWrapped, leftX + 16, y + 52);

      // Right box: amounts
      const amount = Number(sub?.totalPrice || 0);
      const discount = Number(sub?.discount || 0);
      const subtotal = amount + (discount > 0 ? discount : 0);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(17, 24, 39);
      doc.text("Amount Summary", rightX + 16, y + 26);
      doc.setFont("helvetica", "normal");

      const row = (label, value, rowY, bold = false, color = null) => {
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setFontSize(bold ? 11 : 10);
        if (color) doc.setTextColor(color.r, color.g, color.b);
        else doc.setTextColor(grayText.r, grayText.g, grayText.b);
        doc.text(label, rightX + 16, rowY);
        doc.setTextColor(17, 24, 39);
        doc.text(String(value), rightX + rightW - 28, rowY, { align: "right" });
      };

      row("Subtotal", `Rs. ${formatINRNumber(subtotal)}`, y + 56);
      if (discount > 0)
        row("Discount", `- Rs. ${formatINRNumber(discount)}`, y + 76);

      const totalY = y + 110;
      doc.setDrawColor(border.r, border.g, border.b);
      doc.line(rightX + 16, totalY - 10, rightX + rightW - 16, totalY - 10);

      doc.setFillColor(240, 253, 244); // green-50-ish
      doc.roundedRect(rightX + 12, totalY, rightW - 24, 34, 10, 10, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(green.r, green.g, green.b);
      doc.text("Total", rightX + 24, totalY + 22);
      doc.text(
        `Rs. ${formatINRNumber(amount)}`,
        rightX + rightW - 20,
        totalY + 22,
        {
        align: "right",
        }
      );

      y += 176;

      // Footer note
      y = ensureSpace(y, 70);
      doc.setTextColor(grayText.r, grayText.g, grayText.b);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const note =
        "This is a system-generated receipt for your HungryCloud subscription. Keep it for your records.";
      doc.text(doc.splitTextToSize(note, contentW), marginX, y + 10);
      doc.setTextColor(156, 163, 175);
      doc.text(`Subscription ID: ${id}`, marginX, y + 30);
      doc.text("© HungryCloud", marginX + contentW, y + 30, { align: "right" });

      doc.save(filename);
      toast.success("Receipt downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download receipt");
    }
  };

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
          setForm({
            name: data.user?.name || "",
            phone: data.user?.phone || "",
            email: data.user?.email || "",
          });
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

  const startEdit = () => {
    setForm({
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
    });
    setEditMode(true);
  };

  const cancelEdit = () => {
    setForm({
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
    });
    setEditMode(false);
  };

  const saveProfile = async () => {
    const name = form.name?.trim();
    const phone = form.phone?.trim();
    const email = form.email?.trim();

    if (!name) {
      toast.error("Name is required");
      return;
    }
    if (!phone) {
      toast.error("Phone is required");
      return;
    }
    if (!email) {
      toast.error("Email is required");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Phone must be 10 digits");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Enter a valid email");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/api/user/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone, email }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data?.message || "Failed to update profile");
        return;
      }

      const updatedUser = {
        ...(user || {}),
        name: data.user?.name ?? name,
        phone: data.user?.phone ?? phone,
        email: data.user?.email ?? email,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("userChanged"));
      setEditMode(false);
      toast.success("Profile updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

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
              {!editMode ? (
                <>
                  <h2 className="text-xl font-semibold text-green-800">Welcome, {user?.name}</h2>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <FaPhone className="text-green-500" /> {user?.phone}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <FaEnvelope className="text-green-500" /> {user?.email}
                  </p>
                </>
              ) : (
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      className="w-full sm:w-80 border px-3 py-2 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-200"
                      placeholder="Your name"
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Phone</label>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                      className="w-full sm:w-80 border px-3 py-2 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-200"
                      placeholder="10-digit phone"
                      inputMode="numeric"
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                    <input
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      className="w-full sm:w-80 border px-3 py-2 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-200"
                      placeholder="you@example.com"
                      inputMode="email"
                      disabled={saving}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!editMode ? (
              <button
                onClick={startEdit}
                className="text-sm px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100 flex items-center gap-2 justify-center"
              >
                <FaEdit /> Edit
              </button>
            ) : (
              <>
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="text-sm px-4 py-2 bg-green-600 text-white border border-green-700 rounded hover:bg-green-700 disabled:opacity-60 flex items-center gap-2 justify-center"
                >
                  <FaSave /> {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={cancelEdit}
                  disabled={saving}
                  className="text-sm px-4 py-2 bg-gray-100 text-gray-700 border border-gray-200 rounded hover:bg-gray-200 disabled:opacity-60 flex items-center gap-2 justify-center"
                >
                  <FaTimes /> Cancel
                </button>
              </>
            )}
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
                className={`relative border-l-4 p-4 pb-14 rounded-md shadow-md bg-white ${
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
                <p className="text-sm text-gray-700"><strong>Amount:</strong> {formatINR(sub.totalPrice)}</p>

                <button
                  type="button"
                  onClick={() => handleDownloadReceipt(sub)}
                  className="absolute bottom-4 right-4 text-xs sm:text-sm px-3 py-1.5 rounded bg-green-600 text-white hover:bg-green-700"
                >
                  Download Receipt
                </button>
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
