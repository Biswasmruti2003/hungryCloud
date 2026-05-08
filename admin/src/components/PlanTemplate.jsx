import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const dayList = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function PlanTemplate({
  planLabel = "Meal plan",
  heading,
  description,
  planName,
  durations,
  images,
  heroOverlayText = "Fresh • Macro-balanced • Delivered daily",
  primaryBadgeText,
  vegBadgeText = "Pure Veg",
}) {
  const [mealOption, setMealOption] = useState("Veg");
  const [slot, setSlot] = useState("Lunch");
  const [daysOption, setDaysOption] = useState("7 days a week");
  const [selectedDays, setSelectedDays] = useState([]);
  const [duration, setDuration] = useState(durations?.[1] ?? durations?.[0]);
  const [orderDate, setOrderDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );

  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("token") !== null;

  const isVeg = mealOption === "Veg";
  const tagColor = isVeg ? "bg-emerald-600" : "bg-rose-600";
  const tagText = isVeg ? "Veg" : "Non-Veg";

  const getConsecutiveDays = (startDate, count) => {
    if (!startDate) return [];
    const startDayName = new Date(startDate).toLocaleDateString("en-US", {
      weekday: "long",
    });
    const startIndex = dayList.findIndex((day) => day === startDayName);
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

  const getPricePerMeal = () => (isVeg ? duration?.veg : duration?.nonVeg);
  const isDoubleMeal = slot === "Lunch + Dinner";
  const finalPrice = isDoubleMeal ? getPricePerMeal() * 2 : getPricePerMeal();

  useEffect(() => {
    if (daysOption === "7 days a week") setSelectedDays([]);
  }, [daysOption]);

  useEffect(() => {
    if (daysOption !== "Custom") return;
    const count = selectedDays.length;
    if (count === 3) setDuration(durations[0]);
    else if (count === 5) setDuration(durations[1]);
    else if (count === 7) setDuration(durations[2]);
  }, [selectedDays, daysOption, durations]);

  const primaryBadge = useMemo(
    () => primaryBadgeText ?? heading,
    [primaryBadgeText, heading],
  );

  const handleNavigate = () => {
    const stateData = {
      mealOption,
      slot,
      duration,
      daysOption,
      selectedDays: daysOption === "Custom" ? selectedDays : dayList,
      planName,
    };
    navigate("/subscribe-confirm", { state: stateData });
  };

  const handleProtectedAction = () => {
    if (isLoggedIn) handleNavigate();
    else navigate("/login", { state: { from: location.pathname } });
  };

  const start3DayTrial = () => {
    const threeDayDuration = durations.find((d) => d.label === "3 day");
    navigate("/subscribe-confirm", {
      state: {
        mealOption,
        slot,
        duration: threeDayDuration,
        daysOption: "Custom",
        selectedDays: getConsecutiveDays(orderDate, 3),
        planName,
      },
    });
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              {planLabel}
            </p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
              {heading}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-gray-600 md:text-base">
              {description}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/my-meal-plans")}
            className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-emerald-800 shadow-sm backdrop-blur transition hover:border-emerald-300 hover:bg-emerald-50"
          >
            View My Meal Plans
          </button>
        </div>

        <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-start">
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.55 }}
            className="relative w-full max-w-sm lg:sticky lg:top-24"
          >
            <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-2xl shadow-emerald-900/10 backdrop-blur-md">
              <div className="relative aspect-[4/3] w-full">
                <div
                  className={`absolute left-4 top-4 z-10 rounded-full ${tagColor} px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-md`}
                >
                  {tagText}
                </div>
                <img
                  src={isVeg ? images?.veg : images?.nonVeg}
                  alt={planName}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent p-5">
                  <p className="text-sm font-semibold text-white drop-shadow-sm">
                    {heroOverlayText}
                  </p>
                </div>
              </div>
              <div className="border-t border-emerald-100/80 p-5">
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-sm leading-relaxed text-gray-600"
                >
                  HungryCloud&apos;s{" "}
                  <span className="font-semibold text-gray-900">
                    {mealOption}
                  </span>{" "}
                  {planName} is tailored to your slot and schedule.
                </motion.p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.55 }}
            className="w-full flex-1 space-y-5"
          >
            <div className="rounded-3xl border border-emerald-100/80 bg-white/80 p-6 shadow-xl shadow-emerald-900/5 backdrop-blur-md md:p-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                    Configure your plan
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
                      {primaryBadge}
                    </span>
                    <span className="rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700 ring-1 ring-gray-100">
                      {slot}
                    </span>
                    {isVeg && (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
                        {vegBadgeText}
                      </span>
                    )}
                  </div>
                </div>
                <motion.div
                  key={finalPrice}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 px-5 py-3 text-white shadow-lg"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-100">
                    From
                  </p>
                  <p className="text-2xl font-extrabold tabular-nums">
                    ₹{finalPrice}
                  </p>
                  <p className="text-xs text-emerald-100">per day</p>
                </motion.div>
              </div>

              <div className="mt-8 space-y-6">
                <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
                  <label
                    className="text-sm font-semibold text-gray-800"
                    htmlFor="plan-start-date"
                  >
                    Plan start date
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    Used for 3-day trials and auto-selecting consecutive delivery
                    days.
                  </p>
                  <input
                    id="plan-start-date"
                    type="date"
                    value={orderDate}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setOrderDate(e.target.value)}
                    className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none ring-emerald-500/0 transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Meal preference
                  </p>
                  <div className="mt-2 inline-flex rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">
                    {["Veg", "Non-Veg"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setMealOption(opt)}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                          mealOption === opt
                            ? opt === "Veg"
                              ? "bg-emerald-600 text-white shadow-sm"
                              : "bg-rose-600 text-white shadow-sm"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Delivery slot
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["Lunch", "Dinner", "Lunch + Dinner"].map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSlot(time)}
                        className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                          slot === time
                            ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm"
                            : "border-gray-200 bg-white text-gray-700 hover:border-emerald-200"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Delivery days
                  </p>
                  <div className="mt-2 inline-flex flex-wrap gap-2 rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">
                    {["7 days a week", "Custom"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setDaysOption(option);
                          if (option !== "Custom") setSelectedDays([]);
                        }}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                          daysOption === option
                            ? "bg-gray-900 text-white shadow-sm"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {daysOption === "Custom" && (
                    <motion.div
                      key="customDays"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4"
                    >
                      <p className="text-xs font-medium text-emerald-900">
                        Pick the weekdays you want delivery.
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {dayList.map((day) => (
                          <label
                            key={day}
                            className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                              selectedDays.includes(day)
                                ? "border-emerald-500 bg-white text-emerald-900 shadow-sm"
                                : "border-gray-200 bg-white/70 text-gray-700 hover:border-emerald-200"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedDays.includes(day)}
                              onChange={() => toggleDay(day)}
                              className="h-4 w-4 rounded border-gray-300 text-emerald-600 accent-emerald-600"
                            />
                            {day.slice(0, 3)}
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label
                    htmlFor="duration-select"
                    className="text-sm font-semibold text-gray-800"
                  >
                    Plan duration
                  </label>
                  <select
                    id="duration-select"
                    value={duration?.label}
                    onChange={(e) => {
                      const selected = durations.find(
                        (d) => d.label === e.target.value,
                      );
                      if (!selected) return;
                      setDuration(selected);
                      if (selected.label === "3 day") {
                        setDaysOption("Custom");
                        setSelectedDays(getConsecutiveDays(orderDate, 3));
                      }
                    }}
                    className="mt-2 w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none ring-emerald-500/0 transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                  >
                    {durations.map((d) => {
                      const perDay =
                        (isVeg ? d.veg : d.nonVeg) *
                        (slot === "Lunch + Dinner" ? 2 : 1);
                      return (
                        <option key={d.label} value={d.label}>
                          {d.label} — ₹{perDay} / day
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleProtectedAction}
                  className="flex-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:brightness-105 active:scale-[0.99]"
                >
                  Subscribe
                </button>
                <button
                  type="button"
                  onClick={start3DayTrial}
                  className="flex-1 rounded-full border-2 border-emerald-200 bg-white px-6 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50 active:scale-[0.99]"
                >
                  3-day trial
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

