import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const durations = [
  { label: "3 day", veg: 219, nonVeg: 239, days: 3 },
  { label: "7 day", veg: 219, nonVeg: 239, days: 7 },
  { label: "21 day", veg: 215, nonVeg: 235, days: 21 },
  { label: "28 day", veg: 209, nonVeg: 229, days: 28 },
];

const dayList = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const CustomMealPlanCard = () => {
  const [mealOption, setMealOption] = useState("Veg");
  const [slot, setSlot] = useState("Lunch");
  const [daysOption, setDaysOption] = useState("7 days a week");
  const [selectedDays, setSelectedDays] = useState([]);
  const [duration, setDuration] = useState(durations[1]); // default 7 day
  const [orderDate, setOrderDate] = useState(""); // ✅ Added for start date

  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("token") !== null;

  const isVeg = mealOption === "Veg";
  const tagColor = isVeg ? "bg-green-500" : "bg-red-500";
  const tagText = isVeg ? "Veg" : "Non-Veg";

   // ✅ Helper to get consecutive days from a start date
  const getConsecutiveDays = (startDate, count) => {
    if (!startDate) return [];
    const startDayName = new Date(startDate).toLocaleDateString("en-US", { weekday: "long" });
    const startIndex = dayList.findIndex(day => day === startDayName);
    if (startIndex === -1) return [];
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(dayList[(startIndex + i) % dayList.length]);
    }
    return result;
  };

   const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays((prev) => prev.filter((d) => d !== day));
    } else {
      setSelectedDays((prev) => [...prev, day]);
    }
  };

  const getPricePerMeal = () => (isVeg ? duration.veg : duration.nonVeg);
  const isDoubleMeal = slot === "Lunch + Dinner";
  const finalPrice = isDoubleMeal ? getPricePerMeal() * 2 : getPricePerMeal();

  useEffect(() => {
    if (daysOption === "7 days a week") {
      setSelectedDays([]);
    }
  }, [daysOption]);


  useEffect(() => {
      if (daysOption === "Custom") {
        const count = selectedDays.length;
        if (count === 3) {
          setDuration(durations[0]);
        } else if (count === 5) {
          setDuration(durations[1]);
        } else if (count === 7) {
          setDuration(durations[2]);
        }
      }
    }, [selectedDays, daysOption]);

  const handleNavigate = () => {
    const stateData = {
      mealOption,
      slot,
      duration,
      daysOption,
      selectedDays: daysOption === "Custom" ? selectedDays : dayList,
      planName: "Custom Meal Plan",
    };
    navigate("/subscribe-confirm", { state: stateData });
  };


  const handleProtectedAction = () => {
    if (isLoggedIn) {
      handleNavigate();
    } else {
      navigate("/login", { state: { from: location.pathname } });
    }
  };

   // ✅ Updated to use consecutive days from order date
  const start3DayTrial = () => {
    const threeDayDuration = durations.find((d) => d.label === "3 day");
    navigate("/subscribe-confirm", {
      state: {
        mealOption,
        slot,
        duration: threeDayDuration,
        daysOption: "Custom",
        selectedDays: getConsecutiveDays(orderDate, 3),
        planName: "Custom Meal Plan",
      }
    });
  };

  return (
    <section className="bg-white py-16 px-4 max-w-7xl mx-auto relative">
     {/* Top Button */}
      <div className="flex justify-center lg:justify-end mb-6">
        <button
          onClick={() => navigate("/my-meal-plans")}
          className="text-green-700 border border-green-500 hover:bg-green-100 font-semibold px-4 py-2 rounded-full transition-transform hover:scale-105"
        >
          View My Meal Plans
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
        {/* Left Side Image */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-md"
        >
          <div
            className={`absolute top-0 left-0 ${tagColor} text-white px-3 py-1 text-sm rounded-br-xl z-10`}
          >
            {tagText}
          </div>
          <img
            src={
              isVeg
                ? "https://t4.ftcdn.net/jpg/01/81/12/37/360_F_181123726_invADRiRZle7YWLYfkEHz0mUfWH60kVZ.jpg"
                : "https://divinenutrition.in/cdn/shop/articles/Foods_Photo_Collage.png?v=1716820587&width=1100"
            }
            alt="Muscle Gain Meal Plan"
            className="rounded-2xl shadow-xl w-full object-cover"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 text-gray-700 text-sm leading-relaxed"
          >
            A customized meal plan aligns with your goals, tastes, and dietary
            needs for balanced, sustainable eating. Flexibility, flavor, and
            nutrition—all in one.
          </motion.p>
        </motion.div>

        {/* Right Side Controls */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-xl space-y-4"
        >
          <h2 className="text-3xl font-bold">Muscle Gain Meal Plan</h2>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              Personalized
            </span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              {slot}
            </span>
            {isVeg && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                Balanced Veg
              </span>
            )}
          </div>

          {/* Price Display */}
          <motion.p
            key={finalPrice}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-xl font-semibold text-green-600"
          >
            Starting from{" "}
            <span className="text-black font-bold">₹{finalPrice}</span> per day
          </motion.p>

          {/* Meal Option Selector */}
          <div>
            <p className="font-semibold">Meal Option:</p>
            <div className="flex gap-2 mt-2">
              {["Veg", "Non-Veg"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setMealOption(opt)}
                  className={`px-4 py-2 rounded border transition ${
                    mealOption === opt
                      ? opt === "Veg"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : "border-gray-300"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

         
          {/* Delivery Slot */}
          <div>
            <p className="font-semibold">Choose Your Delivery Slot:</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {["Lunch", "Dinner", "Lunch + Dinner"].map((time) => (
                <label
                  key={time}
                  onClick={() => setSlot(time)}
                  className={`border px-4 py-2 rounded cursor-pointer transition ${
                    slot === time ? "bg-green-100 border-green-500" : "border-gray-300"
                  }`}
                >
                  {time}
                </label>
              ))}
            </div>
          </div>


           {/* Days Option */}
          <div>
            <p className="font-semibold">Choose Days On Which You Want The Food To Be Delivered:</p>
            <div className="flex gap-2 mt-2">
              {["7 days a week", "Custom"].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setDaysOption(option);
                    if (option !== "Custom") setSelectedDays([]);
                  }}
                  className={`px-4 py-2 rounded border ${
                    daysOption === option ? "bg-green-100 border-green-500" : "border-gray-300"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>


          {/* Custom Days */}
                   <AnimatePresence>
                     {daysOption === "Custom" && (
                       <motion.div
                         key="customDays"
                         initial={{ opacity: 0, y: -10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -10 }}
                         className="grid grid-cols-3 gap-2 mt-4"
                       >
                         {dayList.map((day) => (
                           <label
                             key={day}
                             className={`border px-3 py-2 rounded cursor-pointer flex items-center gap-2 transition ${
                               selectedDays.includes(day)
                                 ? "bg-green-100 border-green-500"
                                 : "border-gray-300"
                             }`}
                           >
                             <input
                               type="checkbox"
                               checked={selectedDays.includes(day)}
                               onChange={() => toggleDay(day)}
                               className="form-checkbox accent-green-500"
                             />
                             {day}
                           </label>
                         ))}
                       </motion.div>
                     )}
                   </AnimatePresence>

        {/* Duration */}
          <div>
            <p className="font-semibold">Choose Your Delivery Duration:</p>
            <select
              value={duration.label}
              onChange={(e) => {
                const selected = durations.find((d) => d.label === e.target.value);
                if (selected) {
                  setDuration(selected);
                  if (selected.label === "3 day") {
                    setDaysOption("Custom");
                    setSelectedDays(getConsecutiveDays(orderDate, 3));
                  }
                }
              }}
              className="mt-2 border border-green-400 px-4 py-2 rounded w-full cursor-pointer bg-white"
            >
              {durations.map((d) => {
                const perDay = (isVeg ? d.veg : d.nonVeg) * (slot === "Lunch + Dinner" ? 2 : 1);
                return (
                  <option key={d.label} value={d.label}>
                    {d.label} - ₹{perDay}.00 per day
                  </option>
                );
              })}
            </select>
          </div>

           {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleProtectedAction}
              className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-transform hover:scale-105"
            >
              Subscribe
            </button>
            <button
              onClick={start3DayTrial}
              className="border border-green-500 text-green-600 px-6 py-2 rounded-full hover:bg-green-50 transition-transform hover:scale-105"
            >
              3 day Trial
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CustomMealPlanCard;
