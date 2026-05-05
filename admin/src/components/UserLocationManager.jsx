import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt, FaCrosshairs, FaTimes } from "react-icons/fa";

const UserLocationManager = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [fetchedAddress, setFetchedAddress] = useState(null);

  // Only show popup if no location is saved
  useEffect(() => {
    const locationExists = localStorage.getItem("user-location");
    if (!locationExists) {
      setShowPopup(true);
    }
  }, []);

  const saveLocation = (city, full, lat, lng, dist, pin, landmark, area) => {
    localStorage.setItem("user-location", city);
    localStorage.setItem("user-location-full", full);
    localStorage.setItem("user-location-lat", lat);
    localStorage.setItem("user-location-lng", lng);
    localStorage.setItem("user-location-dist", dist);
    localStorage.setItem("user-location-pin", pin);

    // Dispatch event for other components
    window.dispatchEvent(new Event("location-updated"));

    setShowPopup(false);
  };

  const fetchLocationFromInput = async () => {
    if (!manualInput.trim()) {
      alert("Please enter area or pincode");
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
        alert("No location found");
        return;
      }
      const loc = data[0];
      const addr = loc.address || {};
      const state = addr.state || "";

      if (state !== "Odisha") {
        alert("Only Odisha locations allowed");
        return;
      }

      const city =
        addr.city || addr.town || addr.village || addr.county || "Unknown";
      const full = loc.display_name;
      const lat = loc.lat;
      const lng = loc.lon;
      const dist = addr.county || addr.state_district || addr.city || "Unknown";
      const pin = addr.postcode || "000000";
      const landmark = addr.neighbourhood || addr.suburb || addr.road || "";
      const area = addr.suburb || addr.quarter || addr.ward || "";

      setFetchedAddress({ city, full, lat, lng, dist, pin, landmark, area });
    } catch (err) {
      console.error(err);
      alert("Error fetching address");
    }
  };

  const fetchLocationFromGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
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
          const state = addr.state || "";

          if (state !== "Odisha") {
            alert("Only Odisha locations allowed");
            return;
          }

          const city =
            addr.city || addr.town || addr.village || addr.county || "Unknown";
          const full = data.display_name;
          const dist = addr.county || addr.state_district || addr.city || "Unknown";
          const pin = addr.postcode || "000000";
          const landmark = addr.neighbourhood || addr.suburb || addr.road || "";
          const area = addr.suburb || addr.quarter || addr.ward || "";

          setFetchedAddress({
            city,
            full,
            lat: latitude.toString(),
            lng: longitude.toString(),
            dist,
            pin,
            landmark,
            area,
          });
        } catch (err) {
          console.error(err);
          alert("Error detecting location");
        }
      },
      () => alert("Permission denied"),
      { enableHighAccuracy: true }
    );
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-md relative text-gray-800"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
              aria-label="Close location popup"
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold text-green-700 mb-2">
              Location Required
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              We need your location to deliver meals to your area.
            </p>

            {/* Manual input */}
            <div className="flex items-center gap-2 border border-gray-300 p-2 rounded-lg mb-4">
              <FaMapMarkerAlt className="text-gray-500" />
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Enter area or pincode"
                className="flex-1 outline-none bg-transparent text-sm"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={fetchLocationFromInput}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold mb-3"
              aria-label="Submit manual location"
            >
              Find Location
            </motion.button>

            {/* Current location */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={fetchLocationFromGPS}
              className="w-full flex items-center justify-center gap-2 border border-green-500 text-green-700 py-2 rounded-lg font-semibold mb-4"
              aria-label="Use current location"
            >
              <FaCrosshairs /> Use Current Location
            </motion.button>

            {/* Fetched address display */}
            {fetchedAddress && (
              <div className="mt-4 border-t pt-3">
                <h3 className="text-sm font-semibold mb-2">Detected Address:</h3>
                <div className="text-xs text-gray-700 space-y-1">
                  <div>
                    <b>City:</b> {fetchedAddress.city}
                  </div>
                  <div>
                    <b>Area:</b> {fetchedAddress.area || "N/A"}
                  </div>
                  <div>
                    <b>Landmark:</b> {fetchedAddress.landmark || "N/A"}
                  </div>
                  <div>
                    <b>District:</b> {fetchedAddress.dist}
                  </div>
                  <div>
                    <b>PIN:</b> {fetchedAddress.pin}
                  </div>
                  <div className="text-gray-500">
                    <b>Full:</b> {fetchedAddress.full}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() =>
                    saveLocation(
                      fetchedAddress.city,
                      fetchedAddress.full,
                      fetchedAddress.lat,
                      fetchedAddress.lng,
                      fetchedAddress.dist,
                      fetchedAddress.pin,
                      fetchedAddress.landmark,
                      fetchedAddress.area
                    )
                  }
                  className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
                >
                  Confirm & Save
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserLocationManager;
