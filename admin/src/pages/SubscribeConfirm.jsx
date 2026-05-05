import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTimes, FaMapMarkerAlt } from "react-icons/fa";
import { FaCrosshairs } from "react-icons/fa6";
import api from "../api";

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
          <div className="font-bold text-green-700 mb-1">✅ Location Saved</div>
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
      { duration: 6000 }
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
        className="min-h-screen bg-gradient-to-tr from-white via-green-50 to-white"
      >
        {/* Back */}
        <div className="flex items-center px-4 sm:px-6 py-3 sm:py-4 border-b bg-white shadow-sm">
          <button
            onClick={() => navigate(-1)}
            className="text-green-700 flex items-center gap-2 font-medium text-sm sm:text-base"
          >
            <FaArrowLeft /> Back
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 p-4 sm:p-6 max-w-7xl mx-auto">
          {/* Left Side */}
          <div>
            {/* Start Date */}
            <motion.h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">
              Start Date
            </motion.h2>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-green-400 rounded px-3 sm:px-4 py-2 text-sm sm:text-base mb-4 sm:mb-6"
            />

            {/* Delivery Address */}
            <motion.h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">
              Delivery Address
            </motion.h2>

            <div className="space-y-3 mb-3 sm:mb-4">
              {addresses.map((addr, idx) => (
                <motion.div
                  key={idx}
                  onClick={() => setSelectedAddressIndex(idx)}
                  className={`border p-3 sm:p-4 rounded cursor-pointer break-words transition relative ${
                    selectedAddressIndex === idx
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="text-sm sm:text-base">
                    <p><strong>At:</strong> {addr.at}</p>
                    <p><strong>PO:</strong> {addr.po}</p>
                    <p><strong>Dist:</strong> {addr.dist}</p>
                    <p><strong>PIN:</strong> {addr.pin}</p>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1 sm:gap-2">
                    {!addr._isLocal && (
                      <FaEdit
                        className="text-blue-500 cursor-pointer hover:scale-105"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNewAddrFields(addr);
                          setEditingIndex(idx);
                          setShowAddressForm(true);
                        }}
                      />
                    )}
                    <FaTrash
                      className="text-red-500 cursor-pointer hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(addr.id || addr._id);
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Add Address Button */}
            <button
              onClick={() => {
                setShowAddressForm((prev) => !prev);
                setEditingIndex(null);
                setNewAddrFields({ at: "", po: "", dist: "", pin: "" });
              }}
              className="text-xs sm:text-sm text-green-600 underline mb-3 sm:mb-4"
            >
              {showAddressForm ? "Cancel" : "➕ Add New Address"}
            </button>

            {/* Add Address Form */}
            <AnimatePresence>
              {showAddressForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 sm:space-y-3 mb-4"
                >
                  {["at", "po", "dist", "pin"].map((field) => (
                    <input
                      key={field}
                      placeholder={field.toUpperCase()}
                      value={newAddrFields[field]}
                      onChange={(e) =>
                        setNewAddrFields((prev) => ({
                          ...prev,
                          [field]: e.target.value,
                        }))
                      }
                      className="w-full border px-2 sm:px-3 py-1.5 sm:py-2 rounded text-sm sm:text-base"
                    />
                  ))}
                  <button
                    onClick={handleAddOrEditAddress}
                    className="w-full bg-green-500 text-white text-sm sm:text-base py-1.5 sm:py-2 rounded hover:bg-green-600"
                  >
                    {editingIndex !== null ? "Update Address" : "Save Address"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side — Plan Card */}
          <motion.div className="bg-green-50 p-4 sm:p-6 rounded-xl shadow-md space-y-4 sm:space-y-5">
            <h2 className="text-lg sm:text-2xl font-bold text-green-700">
              {selectedPlan}
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              Subscribe to this plan
            </p>

            <Select label="Meal Option" value={mealOption} onChange={setMealOption} options={["Veg", "Non-Veg"]} />
            <Select label="Slot" value={slot} onChange={setSlot} options={["Lunch", "Dinner", "Lunch + Dinner"]} />
            <Select
              label="Duration"
              value={duration.label}
              onChange={(val) => setDuration(dayOptions.find((d) => d.label === val))}
              options={dayOptions.map((d) => d.label)}
            />

            {/* Coupon */}
            <div>
              <label className="text-sm sm:text-base font-semibold">Coupon Code</label>
              <div className="flex flex-col sm:flex-row mt-1 gap-2">
                <input
                  type="text"
                  placeholder="e.g. MEAL100"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-grow border px-3 py-2 rounded text-sm sm:text-base"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-green-600 text-white px-3 py-2 text-sm sm:text-base rounded hover:bg-green-700"
                >
                  Apply
                </button>
              </div>
              {discount > 0 && <p className="text-green-600 text-xs sm:text-sm mt-1">- ₹{discount}</p>}
              {message && <p className="text-red-500 text-xs sm:text-sm mt-1">{message}</p>}
            </div>

            {/* Payment Method */}
            <div>
              <label className="text-sm sm:text-base font-semibold">Payment Method</label>
              <div className="flex gap-3 mt-2">
                {["COD", "Online"].map((mode) => (
                  <motion.div
                    key={mode}
                    onClick={() => setPaymentMode(mode)}
                    className={`cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg border ${
                      paymentMode === mode
                        ? "bg-green-600 text-white border-green-700"
                        : "bg-white border-gray-300"
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {mode}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t text-sm sm:text-base">
              <p><strong>Total meals:</strong> {totalMeals}</p>
              <p><strong>Price per meal:</strong> ₹{pricePerMeal}</p>
              <h3 className="text-lg sm:text-xl font-bold mt-2">Total: ₹{totalPrice}</h3>
            </div>

            <button
              disabled={loading}
              onClick={handleConfirm}
              className="w-full mt-3 sm:mt-4 bg-green-700 text-white text-sm sm:text-base py-2 rounded-full hover:bg-green-800 disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : paymentMode === "Online"
                ? "Proceed to Payment"
                : "Confirm Order"}
            </button>
          </motion.div>
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
              className="bg-white w-full max-w-md rounded-xl shadow-xl relative text-gray-800 p-4 sm:p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button onClick={() => setShowLocationPopup(false)} className="absolute top-2 right-2 text-gray-500 hover:text-red-600">
                <FaTimes />
              </button>
              <h2 className="text-lg sm:text-xl font-bold text-green-700 mb-2">Location Required</h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-3">We need your location to deliver meals to your area.</p>

              <div className="flex items-center gap-2 border p-2 rounded-lg mb-3">
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
                className="w-full text-xs sm:text-sm bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold mb-2"
              >
                Submit Location
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleUseCurrentLocation}
                className="w-full flex items-center justify-center gap-2 text-xs sm:text-sm border border-green-500 text-green-700 py-2 rounded-lg font-semibold"
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

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="text-sm sm:text-base font-semibold">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border px-2 sm:px-3 py-1.5 sm:py-2 rounded mt-1 text-sm sm:text-base"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default SubscribeConfirm;
