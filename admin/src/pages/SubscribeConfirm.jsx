import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaArrowLeft,
  FaCreditCard,
  FaEdit,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPlus,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCrosshairs } from "react-icons/fa6";
import api from "../api";

const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

const planMealPrices = {
  "High Protein Plan": {
    "3 day": { veg: 249, nonVeg: 279 },
    "7 day": { veg: 249, nonVeg: 279 },
    "21 day": { veg: 249, nonVeg: 279 },
    "28 day": { veg: 239, nonVeg: 269 },
  },
  "Weightloss Meal Plan": {
    "3 day": { veg: 179, nonVeg: 189 },
    "7 day": { veg: 179, nonVeg: 189 },
    "21 day": { veg: 175, nonVeg: 185 },
    "28 day": { veg: 169, nonVeg: 179 },
  },
  "Diabetic Diet Plan": {
    "3 day": { veg: 229, nonVeg: 249 },
    "7 day": { veg: 229, nonVeg: 249 },
    "21 day": { veg: 229, nonVeg: 249 },
    "28 day": { veg: 219, nonVeg: 239 },
  },
  "Custom Meal Plan": {
    "3 day": { veg: 219, nonVeg: 239 },
    "7 day": { veg: 219, nonVeg: 239 },
    "21 day": { veg: 215, nonVeg: 235 },
    "28 day": { veg: 209, nonVeg: 229 },
  },
  "Office Employee Meal Plan": {
    "3 day": { veg: 169, nonVeg: 179 },
    "7 day": { veg: 169, nonVeg: 179 },
    "21 day": { veg: 169, nonVeg: 179 },
    "28 day": { veg: 159, nonVeg: 169 },
  },
};

const validCoupons = {
  meal100: 100,
  flat50: 50,
};

const dayOptions = [
  { label: "3 day", days: 3 },
  { label: "7 day", days: 7 },
  { label: "21 day", days: 21 },
  { label: "28 day", days: 28 },
];

const paymentMethodOptions = [
  { mode: "COD", label: "Cash on delivery", Icon: FaMoneyBillWave },
  { mode: "Online", label: "Online", Icon: FaCreditCard },
];

const dayNameToIndex = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const generateDefaultDays = (count) => {
  const all = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = new Date().getDay();
  return Array.from({ length: count }, (_, i) => all[(today + i) % 7]);
};

const getLocalAddressFromStorage = () => {
  const full = localStorage.getItem("user-location-full");
  const po = localStorage.getItem("user-location");
  const dist = localStorage.getItem("user-location-dist");
  const pin = localStorage.getItem("user-location-pin");
  if (full && po && dist && pin) {
    const lat = parseFloat(localStorage.getItem("user-location-lat")) || null;
    const lng = parseFloat(localStorage.getItem("user-location-lng")) || null;
    return {
      at: full.trim(),
      po: po.trim(),
      dist: dist.trim(),
      pin: pin.trim(),
      lat,
      lng,
      _isLocal: true,
    };
  }
  return null;
};

const SubscribeConfirm = () => {
  const navigate = useNavigate();
  const { state = {} } = useLocation();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newAddrFields, setNewAddrFields] = useState({
    at: "",
    po: "",
    dist: "",
    pin: "",
  });
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [mealOption, setMealOption] = useState(() =>
    state.mealOption?.toLowerCase() === "non-veg" ? "Non-Veg" : "Veg"
  );
  const [slot, setSlot] = useState(state.slot || "Lunch");
  const [duration, setDuration] = useState(() => {
    if (typeof state.duration === "string") {
      return (
        dayOptions.find((d) => d.label === state.duration) || dayOptions[2]
      );
    }
    if (state.duration?.label) {
      return (
        dayOptions.find((d) => d.label === state.duration.label) ||
        dayOptions[2]
      );
    }
    return dayOptions[2];
  });
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState("COD");

  // New state for location popup display
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [manualInput, setManualInput] = useState("");

  const selectedPlan = state.planName || "Custom Meal Plan";

  const pricing = planMealPrices[selectedPlan]?.[duration.label] || {
    veg: 179,
    nonVeg: 189,
  };
  const isVeg = mealOption === "Veg";
  const pricePerMeal = isVeg ? pricing.veg : pricing.nonVeg;
  const totalMeals = (slot === "Lunch + Dinner" ? 2 : 1) * duration.days;
  const calculatedTotal = totalMeals * pricePerMeal;
  const totalPrice = Math.max(calculatedTotal - discount, 0);

  // Fetch addresses and handle location popup if none
  const fetchAddresses = async () => {
    try {
      const res = await api.get("/api/user/address", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      let userAddresses = res.data.addresses || [];
      const localAddr = getLocalAddressFromStorage();

      if (localAddr) {
        const duplicate = userAddresses.some(
          (a) =>
            a.pin === localAddr.pin &&
            a.dist.toLowerCase() === localAddr.dist.toLowerCase()
        );
        if (!duplicate) {
          userAddresses = [localAddr, ...userAddresses];
        } else {
          userAddresses = [
            localAddr,
            ...userAddresses.filter(
              (a) =>
                a.pin !== localAddr.pin ||
                a.dist.toLowerCase() !== localAddr.dist.toLowerCase()
            ),
          ];
        }
      }

      setAddresses(userAddresses);
      if (userAddresses.length === 0) {
        setShowLocationPopup(true); // Show popup if no addresses
      }
    } catch {
      setMessage("Failed to load addresses");
      setShowLocationPopup(true); // Show popup if error fetching addresses
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (addresses.length && selectedAddressIndex === null) {
      setSelectedAddressIndex(0);
    }
  }, [addresses, selectedAddressIndex]);

  useEffect(() => {
    const onLocationUpdate = () => {
      fetchAddresses();
    };
    window.addEventListener("location-updated", onLocationUpdate);
    return () =>
      window.removeEventListener("location-updated", onLocationUpdate);
  }, []);

  // UserLocationManager like location handlers inside this component

  const saveLocation = (city, full, lat, lng, dist, pin, landmark, area) => {
    localStorage.setItem("user-location", city);
    localStorage.setItem("user-location-full", full);
    localStorage.setItem("user-location-lat", lat);
    localStorage.setItem("user-location-lng", lng);
    localStorage.setItem("user-location-dist", dist);
    localStorage.setItem("user-location-pin", pin);

    window.dispatchEvent(new Event("location-updated"));

    toast(
      () => (
        <div className="text-sm text-left">
          <div className="font-bold text-green-700 mb-1">Location Saved</div>
          <div>
            📍 <b>City:</b> {city}
          </div>
          <div>
            📍 <b>Area:</b> {area || "N/A"}
          </div>
          <div>
            📍 <b>Landmark:</b> {landmark || "N/A"}
          </div>
          <div>
            📍 <b>District:</b> {dist}
          </div>
          <div>
            📍 <b>PIN:</b> {pin}
          </div>
          <div className="text-xs mt-1 text-gray-500">📍 Full: {full}</div>
        </div>
      ),
      { autoClose: 6000 }
    );

    setShowLocationPopup(false);
  };

  const handleManualSubmit = async () => {
    if (!manualInput.trim()) {
      toast.error("Please enter area or pincode");
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          manualInput
        )}&format=json&addressdetails=1&limit=1&countrycodes=in`
      );
      const data = await res.json();
      if (!data.length) {
        toast.error("No location found");
        return;
      }
      const loc = data[0];
      const addr = loc.address || {};

      const city =
        addr.city || addr.town || addr.village || addr.county || "Unknown";
      const full = loc.display_name;
      const lat = loc.lat;
      const lng = loc.lon;
      const dist = addr.county || addr.state_district || addr.city || "Unknown";
      const pin = addr.postcode || "000000";
      const landmark = addr.neighbourhood || addr.suburb || addr.road || "";
      const area = addr.suburb || addr.quarter || addr.ward || "";

      if (addr.state !== "Odisha") {
        toast.error("Only Odisha locations allowed");
        return;
      }

      saveLocation(city, full, lat, lng, dist, pin, landmark, area);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching address");
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await res.json();
          const addr = data.address || {};

          const city =
            addr.city || addr.town || addr.village || addr.county || "Unknown";
          const full = data.display_name;
          const dist =
            addr.county || addr.state_district || addr.city || "Unknown";
          const pin = addr.postcode || "000000";
          const landmark = addr.neighbourhood || addr.suburb || addr.road || "";
          const area = addr.suburb || addr.quarter || addr.ward || "";
          const state = addr.state || "";

          if (state !== "Odisha") {
            toast.error("Only Odisha locations allowed");
            return;
          }

          saveLocation(
            city,
            full,
            latitude.toString(),
            longitude.toString(),
            dist,
            pin,
            landmark,
            area
          );
        } catch (err) {
          console.error(err);
          toast.error("Error detecting location");
        }
      },
      () => toast.error("Permission denied"),
      { enableHighAccuracy: true }
    );
  };

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toLowerCase();
    if (!validCoupons[code]) {
      setDiscount(0);
      setMessage("Invalid coupon code");
      return;
    }
    setDiscount(validCoupons[code]);
    setMessage("");
    toast.success(`Coupon "${couponCode}" applied: ₹${validCoupons[code]} off`);
  };

  const handleAddOrEditAddress = async () => {
    const { at, po, dist, pin } = newAddrFields;
    if (!at || !po || !dist || !pin) {
      setMessage("All address fields are required");
      return;
    }
    try {
      const method = editingIndex !== null ? "put" : "post";
      const payload =
        editingIndex !== null
          ? { index: editingIndex, updatedAddress: newAddrFields }
          : { address: newAddrFields };
      await api[method]("/api/user/address", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await fetchAddresses();
      setEditingIndex(null);
      setShowAddressForm(false);
      setNewAddrFields({ at: "", po: "", dist: "", pin: "" });
      toast.success(
        editingIndex !== null ? "Address updated!" : "Address added!"
      );
    } catch {
      setMessage("Failed to save address");
      toast.error("Failed to save address");
    }
  };

  const getDatesWithSkipInfo = (
    startDateRaw,
    selectedDaysRaw,
    numDeliveries
  ) => {
    const dayNameToIndexMap = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    };
    const normalizeDay = (day) => {
      const clean = day.trim();
      const full = clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
      const short = full.slice(0, 3);
      return dayNameToIndexMap[full] ?? dayNameToIndexMap[short];
    };
    const selectedIndexes = (
      Array.isArray(selectedDaysRaw) ? selectedDaysRaw : []
    )
      .map(normalizeDay)
      .filter((v) => v !== undefined);
    const deliveryDates = [];
    let current = new Date(startDateRaw);
    let safety = 0;
    while (deliveryDates.length < numDeliveries && safety < 60) {
      if (selectedIndexes.includes(current.getDay())) {
        deliveryDates.push({
          date: current.toISOString().split("T")[0],
          status: "✅",
        });
      }
      current.setDate(current.getDate() + 1);
      safety++;
    }
    return { deliveryDates, skipped: [] };
  };

  const handleDeleteAddress = async (addressId) => {
    const idx = addresses.findIndex(
      (a) => a.id === addressId || a._id === addressId
    );
    if (idx === -1) return;
    const address = addresses[idx];
    if (address._isLocal) {
      localStorage.removeItem("user-location");
      localStorage.removeItem("user-location-full");
      localStorage.removeItem("user-location-lat");
      localStorage.removeItem("user-location-lng");
      localStorage.removeItem("user-location-dist");
      localStorage.removeItem("user-location-pin");
      await fetchAddresses();
      toast.info("Local address deleted");
      return;
    }
    try {
      await api.delete("/api/user/address", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        data: { index: idx },
      });
      await fetchAddresses();
      toast.success("Address deleted");
    } catch (err) {
      setMessage("Failed to delete address");
      toast.error("Failed to delete address");
    }
  };

  const handleConfirm = async () => {
    const addr = addresses[selectedAddressIndex];
    if (!addr) {
      setMessage("Please select a delivery address");
      return;
    }
    let selectedDays =
      Array.isArray(state.selectedDays) &&
      state.selectedDays.length === duration.days
        ? state.selectedDays
        : generateDefaultDays(duration.days);
    if (selectedDays.length !== duration.days) {
      setMessage(
        `You selected ${selectedDays.length} days but plan requires ${duration.days} days`
      );
      return;
    }
    const { deliveryDates } = getDatesWithSkipInfo(
      startDate,
      selectedDays,
      duration.days
    );
    const payload = {
      plan: selectedPlan,
      slot,
      mealOption,
      duration: duration.label,
      days: duration.days,
      startDate,
      deliveryDates: deliveryDates.map((d) => d.date),
      address: {
        at: addr.at,
        po: addr.po,
        dist: addr.dist,
        pin: addr.pin,
        lat: addr.lat ?? null,
        lng: addr.lng ?? null,
      },
      totalPrice,
      discount,
      couponCode,
      paymentMode,
      selectedDays,
    };
    if (paymentMode === "Online") {
      navigate("/payment", {
        state: { paymentMode, subscriptionData: payload },
      });
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/api/subscribe", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) {
        toast.success("🎉 Order Confirmed!");
        setTimeout(() => navigate("/profile"), 1500);
      } else {
        setMessage("Subscription failed. Try again.");
        toast.error("Subscription failed. Try again.");
      }
    } catch {
      setMessage("Something went wrong");
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50"
      >
        {/* Header */}
        <div className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => navigate(-1)}
                className="text-emerald-700 hover:text-emerald-800 flex items-center gap-2 font-semibold text-sm sm:text-base"
              >
                <FaArrowLeft /> Back
              </button>
              <div className="hidden sm:block h-6 w-px bg-gray-200" />
              <div className="min-w-0">
                <div className="text-sm text-gray-500">Confirm subscription</div>
                <div className="font-bold text-gray-900 truncate">
                  {selectedPlan}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-gray-500">Payable</div>
              <div className="font-extrabold text-emerald-700">
                {formatINR(totalPrice)}
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
          {/* Left Side */}
          <div className="lg:col-span-7 space-y-6">
            <section className="bg-white/80 backdrop-blur rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">
                    Start date
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    We’ll begin deliveries from this date.
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 sm:px-4 py-2.5 text-sm sm:text-base outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </section>

            {/* Delivery Address */}
            <section className="bg-white/80 backdrop-blur rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FaMapMarkerAlt
                      className="text-emerald-600 shrink-0"
                      aria-hidden
                    />
                    Delivery address
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Choose where you want the meals delivered.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAddressForm((prev) => !prev);
                    setEditingIndex(null);
                    setNewAddrFields({ at: "", po: "", dist: "", pin: "" });
                  }}
                  className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs sm:text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                >
                  {!showAddressForm && (
                    <FaPlus className="text-xs sm:text-sm" aria-hidden />
                  )}
                  {showAddressForm ? "Cancel" : "Add new"}
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3">
                {addresses.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-600">
                    No saved addresses yet. Add one to continue.
                  </div>
                ) : (
                  addresses.map((addr, idx) => {
                    const isSelected = selectedAddressIndex === idx;
                    return (
                      <motion.button
                        type="button"
                        key={idx}
                        onClick={() => setSelectedAddressIndex(idx)}
                        whileHover={{ scale: 1.01 }}
                        className={[
                          "text-left w-full rounded-2xl border p-4 transition shadow-sm",
                          isSelected
                            ? "border-emerald-500 bg-emerald-50 ring-emerald-200"
                            : "border-gray-200 bg-white hover:border-emerald-200",
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-bold text-gray-900 truncate">
                                {addr.at}
                              </div>
                              {addr._isLocal && (
                                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 border border-blue-100">
                                  Current location
                                </span>
                              )}
                            </div>
                            <div className="mt-1 text-xs sm:text-sm text-gray-600 break-words">
                              {addr.po}, {addr.dist} - {addr.pin}
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-2">
                            {!addr._isLocal && (
                              <button
                                type="button"
                                className="rounded-full p-2 text-blue-600 hover:bg-blue-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setNewAddrFields(addr);
                                  setEditingIndex(idx);
                                  setShowAddressForm(true);
                                }}
                                aria-label="Edit address"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                            )}
                            <button
                              type="button"
                              className="rounded-full p-2 text-red-600 hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAddress(addr.id || addr._id);
                              }}
                              aria-label="Delete address"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })
                )}
              </div>

              <AnimatePresence>
                {showAddressForm && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 overflow-hidden"
                  >
                    <div className="rounded-2xl border border-gray-200 bg-white p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {["at", "po", "dist", "pin"].map((field) => (
                          <div key={field} className="sm:col-span-1">
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                              {field.toUpperCase()}
                            </label>
                            <input
                              placeholder={
                                field === "pin" ? "e.g. 751001" : "Enter"
                              }
                              value={newAddrFields[field]}
                              onChange={(e) =>
                                setNewAddrFields((prev) => ({
                                  ...prev,
                                  [field]: e.target.value,
                                }))
                              }
                              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={handleAddOrEditAddress}
                        className="mt-4 w-full rounded-xl bg-emerald-600 text-white text-sm sm:text-base py-2.5 font-semibold hover:bg-emerald-700"
                      >
                        {editingIndex !== null
                          ? "Update address"
                          : "Save address"}
                      </button>
                      {message && (
                        <p className="text-red-600 text-xs sm:text-sm mt-2">
                          {message}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>

          {/* Right Side — Plan Card */}
          <motion.div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 bg-white/90 backdrop-blur p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg sm:text-2xl font-extrabold text-emerald-700">
                  Order summary
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm">
                  Review your plan and confirm.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="space-y-2 text-sm sm:text-base">
                  <Row label="Meal option" value={mealOption} />
                  <Row label="Slot" value={slot} />
                  <Row label="Duration" value={duration.label} />
                </div>
              </div>

            {/* Coupon */}
            <div>
              <label className="text-sm sm:text-base font-bold text-gray-900">
                Coupon code
              </label>
              <div className="flex flex-col sm:flex-row mt-2 gap-2">
                <input
                  type="text"
                  placeholder="e.g. MEAL100"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-grow rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm sm:text-base outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="rounded-xl bg-emerald-600 text-white px-4 py-2.5 text-sm sm:text-base font-semibold hover:bg-emerald-700"
                >
                  Apply
                </button>
              </div>
              {discount > 0 && (
                <p className="text-emerald-700 text-xs sm:text-sm mt-2 font-semibold">
                  Discount applied: -{formatINR(discount)}
                </p>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <label className="text-sm sm:text-base font-bold text-gray-900">
                Payment method
              </label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {paymentMethodOptions.map(({ mode, label, Icon }) => (
                  <motion.div
                    key={mode}
                    role="button"
                    tabIndex={0}
                    onClick={() => setPaymentMode(mode)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setPaymentMode(mode);
                      }
                    }}
                    className={`cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-2 px-3 py-2.5 text-sm sm:text-base rounded-xl border font-semibold text-center ${
                      paymentMode === mode
                        ? "bg-emerald-600 text-white border-emerald-700"
                        : "bg-white border-gray-200 hover:border-emerald-200"
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Icon className="text-lg shrink-0" aria-hidden />
                    <span className="leading-tight">{label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="py-6 border-t border-gray-100 text-sm sm:text-base">
              <div className="space-y-2 mb-6">
                <Row label="Total meals" value={totalMeals} />
                <Row label="Price per meal" value={formatINR(pricePerMeal)} />
                <Row
                  label="Subtotal"
                  value={formatINR(calculatedTotal)}
                  subtle
                />
                {discount > 0 && (
                  <Row
                    label="Discount"
                    value={`- ${formatINR(discount)}`}
                    highlight
                  />
                )}
              </div>
              <div className="mt-3 rounded-2xl bg-gray-50 border border-gray-100 p-4 flex items-center justify-between">
                <div className="font-bold text-gray-900">Payable</div>
                <div className="text-lg sm:text-xl font-extrabold text-emerald-700">
                  {formatINR(totalPrice)}
                </div>
              </div>
            </div>

            <button
              disabled={loading}
              onClick={handleConfirm}
              className="w-full mt-1 bg-emerald-700 text-white text-sm sm:text-base py-3 rounded-2xl hover:bg-emerald-800 disabled:opacity-50 font-semibold"
            >
              {loading
                ? "Processing..."
                : paymentMode === "Online"
                ? "Proceed to Payment"
                : "Confirm Order"}
            </button>
            </div>
          </motion.div>
          </div>
        </div>

        <ToastContainer position="bottom-right" autoClose={3000} />
      </motion.div>

      {/* Location Popup */}
      <AnimatePresence>
        {showLocationPopup && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full max-w-md rounded-2xl shadow-xl relative text-gray-800 p-4 sm:p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button onClick={() => setShowLocationPopup(false)} className="absolute top-2 right-2 text-gray-500 hover:text-red-600">
                <FaTimes />
              </button>
              <h2 className="text-lg sm:text-xl font-extrabold text-emerald-700 mb-2">Location required</h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-3">We need your location to deliver meals to your area.</p>

              <div className="flex items-center gap-2 border border-gray-200 p-3 rounded-xl mb-3">
                <FaMapMarkerAlt className="text-gray-500 text-sm sm:text-base" />
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Enter area or pincode"
                  className="flex-1 text-xs sm:text-sm outline-none bg-transparent"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={handleManualSubmit}
                className="w-full text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-semibold mb-2"
              >
                Submit Location
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleUseCurrentLocation}
                className="w-full flex items-center justify-center gap-2 text-xs sm:text-sm border border-emerald-500 text-emerald-700 py-2.5 rounded-xl font-semibold"
              >
                <FaCrosshairs /> Use Current Location
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Row = ({ label, value, subtle, highlight }) => (
  <div
    className={[
      "flex items-center justify-between gap-4",
      subtle ? "text-gray-500" : "text-gray-800",
      highlight ? "text-emerald-700 font-semibold" : "",
    ].join(" ")}
  >
    <div>{label}</div>
    <div className="font-semibold">{value}</div>
  </div>
);

export default SubscribeConfirm;
