import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";
import { FaArrowLeft, FaEnvelope, FaUtensils } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";
import { notifyEmailResult } from "../utils/emailNotificationToast";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (!state?.subscriptionData) {
      navigate("/");
    }
  }, [state, navigate]);

  if (!state?.subscriptionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 px-4 text-center text-red-700 font-semibold">
        Invalid payment session. Please go back and subscribe again.
      </div>
    );
  }

  const {
    plan,
    slot,
    mealOption,
    duration,
    days,
    startDate,
    deliveryDates,
    selectedDays,
    totalPrice,
    address,
    discount,
    couponCode,
  } = state.subscriptionData;

  const formatINR = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(n || 0));

  const handleFakePayment = async () => {
    setProcessing(true);
    try {
      const res = await api.post(
        "/api/subscribe",
        {
          plan,
          slot,
          mealOption,
          duration,
          days,
          startDate,
          deliveryDates: Array.isArray(deliveryDates) ? deliveryDates : [],
          selectedDays: Array.isArray(selectedDays) ? selectedDays : [],
          address,
          totalPrice,
          discount,
          couponCode,
          paymentMode: "Online",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        setPaid(true);
        toast.success("Payment successful — your order is confirmed.");
        notifyEmailResult(res.data.emailNotification);
        setTimeout(() => {
          navigate("/profile", {
            state: {
              paymentSuccess: true,
              emailSent: res.data.emailNotification?.sent === true,
            },
          });
        }, 2200);
      } else {
        toast.error("Payment succeeded but order not saved. Please contact support.");
        setProcessing(false);
      }
    } catch (err) {
      toast.error("Something went wrong while saving your order.");
      setProcessing(false);
    }
  };

  const shortAddr = address
    ? [address.at, address.po].filter(Boolean).join(", ")
    : "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/90 via-white to-amber-50/40 px-4 py-10 sm:py-14">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="mx-auto w-full max-w-lg"
      >
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-xl shadow-emerald-900/10 backdrop-blur-sm">
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400" />

          <div className="relative p-6 sm:p-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl text-emerald-700 transition hover:bg-emerald-50 sm:left-6 sm:top-6"
              aria-label="Go back"
            >
              <FaArrowLeft size={18} />
            </button>

            <div className="mb-6 flex flex-col items-center pt-6 text-center sm:pt-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25">
                <FaUtensils className="text-xl" aria-hidden />
              </div>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
                Confirm &amp; pay
              </h1>
              <p className="mt-2 max-w-sm text-sm text-slate-600">
                Review your order, then complete payment. We&apos;ll email you a confirmation.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Plan</span>
                <span className="max-w-[55%] text-right font-semibold text-slate-900">
                  {plan}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Meal</span>
                <span className="font-medium text-slate-800">{mealOption}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Slot</span>
                <span className="font-medium text-slate-800">{slot}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Duration</span>
                <span className="font-medium text-slate-800">
                  {duration} ({days} days)
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Starts</span>
                <span className="font-medium text-slate-800">{startDate}</span>
              </div>
              {shortAddr ? (
                <div className="border-t border-slate-200/80 pt-3">
                  <span className="text-slate-500">Deliver to</span>
                  <p className="mt-1 text-right text-xs leading-relaxed text-slate-700 sm:text-sm">
                    {shortAddr}
                  </p>
                </div>
              ) : null}
              <div className="flex justify-between gap-4 border-t border-slate-200/80 pt-3">
                <span className="text-slate-500">Coupon</span>
                <span className="font-medium text-slate-800">
                  {couponCode || "None"}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Discount</span>
                <span className="font-medium text-red-600">
                  −{formatINR(discount)}
                </span>
              </div>
              <div className="flex justify-between gap-2 border-t border-emerald-100 pt-3 text-base font-semibold text-emerald-800">
                <span>Total</span>
                <span>{formatINR(totalPrice)}</span>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2.5 text-xs text-emerald-900 sm:text-sm">
              <FaEnvelope className="mt-0.5 shrink-0 text-emerald-600" aria-hidden />
              <span>
                After payment, we send a <strong>confirmation email</strong> with your order
                reference and delivery details.
              </span>
            </div>

            <AnimatePresence mode="wait">
              {!paid && !processing && (
                <motion.button
                  key="pay"
                  type="button"
                  onClick={handleFakePayment}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="mt-6 w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-center text-base font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:from-emerald-700 hover:to-teal-700"
                >
                  Pay {formatINR(totalPrice)}
                </motion.button>
              )}

              {processing && (
                <motion.div
                  key="proc"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 flex h-14 items-center justify-center gap-3 rounded-2xl bg-emerald-100/90 text-emerald-900"
                >
                  <span className="text-sm font-semibold">Processing payment…</span>
                  <motion.span
                    className="h-2.5 w-2.5 rounded-full bg-emerald-600"
                    animate={{ scale: [1, 1.35, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 0.9 }}
                  />
                </motion.div>
              )}

              {paid && (
                <motion.div
                  key="ok"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 flex flex-col items-center rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-6 text-center"
                >
                  <FiCheckCircle size={52} className="text-emerald-600" aria-hidden />
                  <p className="mt-3 text-lg font-semibold text-emerald-900">
                    Payment successful
                  </p>
                  <p className="mt-1 text-sm text-emerald-800/90">
                    Redirecting to your profile…
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <ToastContainer position="bottom-center" autoClose={4000} theme="colored" />
    </div>
  );
};

export default PaymentPage;
