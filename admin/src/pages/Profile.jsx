import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaPhone,
  FaEnvelope,
  FaSignOutAlt,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaReceipt,
  FaLayerGroup,
  FaMapMarkerAlt,
  FaDownload,
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

  const activePlanCount = subscriptions.filter(
    (s) => s.status?.toLowerCase() === "active"
  ).length;

  const profileInitials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "HC";

  const filterTabs = [
    { id: "all", label: "All plans" },
    { id: "active", label: "Active" },
    { id: "expired", label: "Cancelled" },
  ];

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-4">
        <div
          className="h-11 w-11 rounded-full border-2 border-emerald-200 border-t-emerald-600 animate-spin"
          aria-hidden
        />
        <p className="text-sm font-medium text-slate-600">Loading your profile…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/90 via-white to-amber-50/50">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="presentation"
          >
            <motion.div
              className="relative z-[201] w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl shadow-slate-900/10"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-account-title"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <FaTrash className="text-lg" />
              </div>
              <h2
                id="delete-account-title"
                className="mt-4 text-lg font-semibold tracking-tight text-slate-900"
              >
                Delete account?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                This permanently removes your profile and access. This cannot be undone.
              </p>
              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
                >
                  Yes, delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          {/* Hero card */}
          <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-xl shadow-emerald-900/5 backdrop-blur-sm">
            <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400" />
            <div className="flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-1 flex-col gap-6 sm:flex-row sm:items-start">
                <div
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-xl font-bold tracking-tight text-white shadow-lg shadow-emerald-600/25 ring-4 ring-white"
                  aria-hidden
                >
                  {profileInitials}
                </div>
                <div className="min-w-0 flex-1 space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700/90">
                      Your account
                    </p>
                    {!editMode ? (
                      <>
                        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                          {user?.name}
                        </h1>
                        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
                          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-slate-50/80 px-3 py-1.5 text-sm text-slate-700">
                            <FaPhone className="text-emerald-600" aria-hidden />
                            {user?.phone}
                          </span>
                          <span className="inline-flex min-w-0 items-center gap-2 rounded-full border border-slate-200/90 bg-slate-50/80 px-3 py-1.5 text-sm text-slate-700">
                            <FaEnvelope className="shrink-0 text-emerald-600" aria-hidden />
                            <span className="truncate">{user?.email}</span>
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="mt-3 grid max-w-xl gap-4 sm:grid-cols-1">
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                            Name
                          </label>
                          <input
                            value={form.name}
                            onChange={(e) =>
                              setForm((p) => ({ ...p, name: e.target.value }))
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/60"
                            placeholder="Your name"
                            disabled={saving}
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                            Phone
                          </label>
                          <input
                            value={form.phone}
                            onChange={(e) =>
                              setForm((p) => ({ ...p, phone: e.target.value }))
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/60"
                            placeholder="10-digit phone"
                            inputMode="numeric"
                            disabled={saving}
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                            Email
                          </label>
                          <input
                            value={form.email}
                            onChange={(e) =>
                              setForm((p) => ({ ...p, email: e.target.value }))
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/60"
                            placeholder="you@example.com"
                            inputMode="email"
                            disabled={saving}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 lg:shrink-0 lg:justify-end">
                {!editMode ? (
                  <button
                    type="button"
                    onClick={startEdit}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
                  >
                    <FaEdit /> Edit profile
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={saveProfile}
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FaSave /> {saving ? "Saving…" : "Save changes"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FaTimes /> Cancel
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                >
                  <FaSignOutAlt /> Log out
                </button>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Meal credits
              </p>
              <div className="mt-4 flex items-center gap-5">
                <div className="h-20 w-20 shrink-0">
                  <CircularProgressbar
                    value={credits}
                    maxValue={100}
                    text={`${credits}%`}
                    styles={buildStyles({
                      textSize: "28px",
                      textColor: "#0f172a",
                      pathColor: "#059669",
                      trailColor: "#ecfdf5",
                    })}
                  />
                </div>
                <div>
                  <p className="text-2xl font-semibold tabular-nums text-slate-900">{credits}</p>
                  <p className="text-sm text-slate-500">of 100 remaining</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <FaLayerGroup className="text-emerald-600" aria-hidden />
                Active plans
              </div>
              <p className="mt-4 text-3xl font-semibold tabular-nums text-slate-900">
                {activePlanCount}
              </p>
              <p className="mt-1 text-sm text-slate-500">Currently subscribed</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <FaReceipt className="text-amber-600" aria-hidden />
                Transactions
              </div>
              <p className="mt-4 text-3xl font-semibold tabular-nums text-slate-900">
                {transactions.length}
              </p>
              <p className="mt-1 text-sm text-slate-500">All-time count</p>
            </div>
          </section>

          {/* Subscriptions */}
          <section className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-lg shadow-slate-900/5 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                  Subscriptions
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Plans, delivery details, and receipts in one place.
                </p>
              </div>
              <div className="hidden flex-wrap items-center gap-2 rounded-2xl bg-slate-100/80 p-1 sm:flex">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilter(tab.id)}
                    className={`rounded-xl px-3.5 py-2 text-sm font-medium transition ${
                      filter === tab.id
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 sm:hidden">
              <label htmlFor="sub-filter" className="sr-only">
                Filter subscriptions
              </label>
              <select
                id="sub-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/60"
              >
                <option value="all">All plans</option>
                <option value="active">Active</option>
                <option value="expired">Cancelled</option>
              </select>
            </div>

            {filteredSubscriptions.length > 0 ? (
              <ul className="mt-4 space-y-4 sm:mt-6">
                {filteredSubscriptions.map((sub, idx) => {
                  const cancelled = sub.status?.toLowerCase() === "cancelled";
                  return (
                    <motion.li
                      key={sub._id || idx}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.35 }}
                      className={`group relative overflow-hidden rounded-2xl border bg-white transition hover:shadow-md ${
                        cancelled
                          ? "border-red-200/90"
                          : "border-emerald-200/80 hover:border-emerald-300"
                      }`}
                    >
                      <div
                        className={`absolute left-0 top-0 h-full w-1 ${
                          cancelled ? "bg-red-500" : "bg-emerald-500"
                        }`}
                        aria-hidden
                      />
                      <div className="p-5 pl-6 sm:p-6 sm:pl-7">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                              {sub.plan ? sub.plan.toString().trim() : "Unnamed Plan"}
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                              Subscribed{" "}
                              {new Date(sub.confirmedAt || sub.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <span
                            className={`inline-flex w-fit shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold ${
                              cancelled
                                ? "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200"
                                : "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-200"
                            }`}
                          >
                            {sub.status?.charAt(0).toUpperCase() + sub.status?.slice(1)}
                          </span>
                        </div>

                        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                          <div className="rounded-xl bg-slate-50/80 px-3 py-2">
                            <dt className="text-xs font-medium text-slate-500">Meal option</dt>
                            <dd className="mt-0.5 font-medium text-slate-900">
                              {sub.mealOption || "N/A"}
                            </dd>
                          </div>
                          <div className="rounded-xl bg-slate-50/80 px-3 py-2">
                            <dt className="text-xs font-medium text-slate-500">Duration</dt>
                            <dd className="mt-0.5 font-medium text-slate-900">{sub.duration}</dd>
                          </div>
                          <div className="rounded-xl bg-slate-50/80 px-3 py-2">
                            <dt className="text-xs font-medium text-slate-500">Start date</dt>
                            <dd className="mt-0.5 font-medium text-slate-900">
                              {new Date(sub.startDate).toLocaleDateString()}
                            </dd>
                          </div>
                          <div className="rounded-xl bg-slate-50/80 px-3 py-2">
                            <dt className="text-xs font-medium text-slate-500">Amount</dt>
                            <dd className="mt-0.5 font-semibold text-slate-900">
                              {formatINR(sub.totalPrice)}
                            </dd>
                          </div>
                          <div className="sm:col-span-2">
                            <div className="flex items-start gap-2 rounded-xl bg-slate-50/80 px-3 py-2">
                              <FaMapMarkerAlt
                                className="mt-0.5 shrink-0 text-emerald-600"
                                aria-hidden
                              />
                              <div>
                                <dt className="text-xs font-medium text-slate-500">Address</dt>
                                <dd className="mt-0.5 text-slate-800">
                                  {formatAddress(sub.address)}
                                </dd>
                              </div>
                            </div>
                          </div>
                        </dl>

                        <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-4">
                          <button
                            type="button"
                            onClick={() => handleDownloadReceipt(sub)}
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                          >
                            <FaDownload className="text-xs" aria-hidden />
                            Download receipt
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            ) : (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-12 text-center">
                <FaLayerGroup className="mx-auto text-3xl text-slate-300" aria-hidden />
                <p className="mt-3 text-sm font-medium text-slate-700">No subscriptions yet</p>
                <p className="mt-1 text-sm text-slate-500">
                  When you subscribe to a plan, it will show up here with receipts.
                </p>
              </div>
            )}
          </section>

          {/* Danger zone */}
          <section className="rounded-3xl border border-red-200/80 bg-red-50/40 p-6 sm:p-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-red-800">
              Danger zone
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-red-900/80">
              Deleting your account removes your profile and cannot be reversed.
            </p>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 shadow-sm transition hover:bg-red-50"
            >
              <FaTrash className="text-xs" aria-hidden />
              Delete account
            </button>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
