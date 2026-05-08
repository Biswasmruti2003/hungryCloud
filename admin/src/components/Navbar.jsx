import { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaBars,
  FaTimes,
  FaSyncAlt,
} from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import food1 from "../assets/food1.png";
import toast from "react-hot-toast";

const Navbar = () => {
  const [cityOnly, setCityOnly] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPermissionPopup, setShowPermissionPopup] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user) {
      setCityOnly("");
      setFullAddress("");
      return;
    }

    const updateLocation = () => {
      const storedCity = localStorage.getItem("user-location");
      const storedFull = localStorage.getItem("user-location-full");
      setCityOnly(storedCity || "");
      setFullAddress(storedFull || "");
    };

    updateLocation();
    window.addEventListener("location-updated", updateLocation);
    return () => window.removeEventListener("location-updated", updateLocation);
  }, [user]);

  const fetchCurrentLocation = async () => {
    setShowPermissionPopup(false);
    setLoading(true);
    try {
      const coords = await new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => res(pos.coords),
          (err) => rej(err),
          { enableHighAccuracy: true }
        );
      });

      const { latitude, longitude } = coords;

      const resp = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`
      );
      const data = await resp.json();
      const addr = data.address || {};

      const city =
        addr.city || addr.town || addr.village || addr.hamlet || addr.county || "Unknown";

      const state = addr.state || "";
      const full = data.display_name || "";

      if (addr.country_code !== "in" || state !== "Odisha") {
        setCityOnly("Unknown");
        setFullAddress("");
        toast.error("Only Odisha locations allowed");
      } else {
        setCityOnly(city);
        setFullAddress(full);
        localStorage.setItem("user-location", city);
        localStorage.setItem("user-location-full", full);
        localStorage.setItem("user-location-lat", latitude.toString());
        localStorage.setItem("user-location-lng", longitude.toString());
        localStorage.setItem("location-confirmed", "true");

        window.dispatchEvent(new Event("location-updated"));
        toast.success("Location updated");
      }
    } catch (err) {
      toast.error("Failed to detect location");
      setCityOnly("Unknown");
      setFullAddress("");
    } finally {
      setLoading(false);
    }
  };

  const handleNavClick = (item) => {
    setMenuOpen(false);
    const mapping = {
      Home: "/",
      "Meal Plans": "/meal-plan",
      Recipes: "/recipes",
      About: "/about",
    };
    navigate(mapping[item]);
  };

  const handleProfileClick = () => {
    setMenuOpen(false); // ✅ Close mobile menu
    if (user) {
      navigate("/profile");
    } else {
      // ✅ Keep location data if confirmed, remove only user info
      const confirmed = localStorage.getItem("location-confirmed");
      const locCity = localStorage.getItem("user-location");
      const locFull = localStorage.getItem("user-location-full");
      const locLat = localStorage.getItem("user-location-lat");
      const locLng = localStorage.getItem("user-location-lng");

      localStorage.clear();

      if (confirmed) {
        localStorage.setItem("location-confirmed", confirmed);
        if (locCity) localStorage.setItem("user-location", locCity);
        if (locFull) localStorage.setItem("user-location-full", locFull);
        if (locLat) localStorage.setItem("user-location-lat", locLat);
        if (locLng) localStorage.setItem("user-location-lng", locLng);
      }

      setCityOnly("");
      setFullAddress("");
      navigate("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4">
        {/* Logo */}
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={food1}
            alt="HungryCloud"
            className="w-10 h-10 sm:w-12 sm:h-12 object-scale-down"
          />
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold text-green-700">
              HungryCloud
            </span>
            <span className="text-[10px] sm:text-xs text-gray-500 leading-tight">
              Healthy Food For Happy Life
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-5 text-sm font-semibold">
          {["Home", "Meal Plans", "Recipes", "About"].map((item) => (
            <li
              key={item}
              onClick={() => handleNavClick(item)}
              className="cursor-pointer hover:text-green-700"
            >
              {item}
            </li>
          ))}
        </ul>

        {/* Right Side */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* City Location */}
          {user && (
            <div
              className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-700 max-w-[80px] sm:max-w-[140px] truncate"
              title={fullAddress}
            >
              <IoLocationOutline className="text-green-600 text-base sm:text-lg" />
              <span className="truncate">{cityOnly || "Set"}</span>
              <FaSyncAlt
                onClick={() => setShowPermissionPopup(true)}
                className={`text-green-500 cursor-pointer hover:rotate-180 transition-transform ${
                  loading ? "animate-spin" : ""
                } text-sm sm:text-base`}
                title="Refresh Location"
              />
            </div>
          )}

          {/* Profile Button */}
          <div
            onClick={handleProfileClick}
            className="hidden md:flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full hover:bg-green-100 cursor-pointer text-gray-600"
          >
            <FaUserCircle size={20} className="sm:w-[22px] sm:h-[22px]" />
            <span className="text-xs sm:text-sm font-medium">
              {user?.name?.trim() || "Profile"}
            </span>
          </div>

          {/* Mobile Menu Button */}
          <div
            className="md:hidden cursor-pointer text-green-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </div>
        </div>
      </nav>

      {/* Mobile Nav Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg px-6 py-6 space-y-4">
          {["Home", "Meal Plans", "Recipes", "About"].map((item) => (
            <div
              key={item}
              onClick={() => handleNavClick(item)}
              className="text-gray-700 font-medium border-b pb-2 hover:text-green-700 cursor-pointer"
            >
              {item}
            </div>
          ))}

          {/* Mobile Location Display */}
          {user && (
            <div
              className="flex items-center gap-1.5 mt-2 text-xs sm:text-sm text-gray-600"
              title={fullAddress}
            >
              <IoLocationOutline className="text-green-600 text-base sm:text-lg" />
              <span className="truncate max-w-[100px]">{cityOnly}</span>
              <FaSyncAlt
                onClick={() => setShowPermissionPopup(true)}
                className={`text-green-500 cursor-pointer hover:rotate-180 transition-transform ${
                  loading ? "animate-spin" : ""
                } text-sm sm:text-base`}
              />
            </div>
          )}

          {/* Profile Mobile */}
          <div
            onClick={handleProfileClick}
            className="flex items-center gap-2 pt-4 border-t text-gray-600 hover:text-green-800 cursor-pointer"
          >
            <FaUserCircle size={18} className="sm:w-[20px] sm:h-[20px]" />
            <span className="text-xs sm:text-sm font-medium truncate max-w-[120px]">
              {user?.phone || user?.email || "Profile"}
            </span>
          </div>
        </div>
      )}

      {/* Permission Popup */}
      {showPermissionPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-lg text-center max-w-sm w-full mx-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
              Allow Location Access
            </h3>
            <p className="text-gray-500 mb-4 text-xs sm:text-sm">
              We need your location to deliver meal plans in your area.
            </p>
            <div className="flex justify-center gap-3 sm:gap-4">
              <button
                onClick={fetchCurrentLocation}
                className="bg-green-600 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded hover:bg-green-700 text-xs sm:text-sm"
              >
                Allow
              </button>
              <button
                onClick={() => setShowPermissionPopup(false)}
                className="bg-gray-200 text-gray-600 px-4 sm:px-5 py-1.5 sm:py-2 rounded hover:bg-gray-300 text-xs sm:text-sm"
              >
                Deny
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
