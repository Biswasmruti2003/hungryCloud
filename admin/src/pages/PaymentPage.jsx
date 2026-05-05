import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);

  // ✅ Validate required state
  useEffect(() => {
    if (!state?.subscriptionData) {
      navigate("/");
    }
  }, [state, navigate]);

  if (!state?.subscriptionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-600 font-semibold text-lg">
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
    totalPrice,
    address,
    discount,
    couponCode,
  } = state.subscriptionData;

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
          deliveryDates,
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
        toast.success("Payment successful! Order confirmed 🎉");
        setTimeout(() => {
          navigate("/profile", { state: { paymentSuccess: true } });
        }, 1800);
      } else {
        toast.error("Payment succeeded but order not saved. Please contact support.");
        setProcessing(false);
      }
    } catch (err) {
      toast.error("Something went wrong while saving your order.");
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4 py-10">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-white shadow-xl rounded-xl p-8 max-w-lg w-full relative"
      >
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 left-3 text-green-600 hover:text-green-800"
        >
          <FaArrowLeft size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          Confirm & Pay
        </h2>

        <div className="space-y-3 text-sm mb-6">
          <div className="flex justify-between"><span>Plan:</span><span className="font-medium">{plan}</span></div>
          <div className="flex justify-between"><span>Meal Option:</span><span>{mealOption}</span></div>
          <div className="flex justify-between"><span>Slot:</span><span>{slot}</span></div>
          <div className="flex justify-between"><span>Duration:</span><span>{duration} ({days} days)</span></div>
          <div className="flex justify-between"><span>Start Date:</span><span>{startDate}</span></div>
          <div className="flex justify-between"><span>Coupon:</span><span>{couponCode || "None"}</span></div>
          <div className="flex justify-between"><span>Discount:</span><span className="text-red-600">₹{discount}</span></div>
          <div className="flex justify-between text-lg font-semibold text-green-700 border-t pt-3">
            <span>Total Amount:</span><span>₹{totalPrice}</span>
          </div>
        </div>

        <AnimatePresence>
          {!paid && !processing && (
            <motion.button
              onClick={handleFakePayment}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-full font-semibold shadow-sm"
            >
              Pay ₹{totalPrice}
            </motion.button>
          )}

          {processing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full flex justify-center items-center h-12 bg-green-100 text-green-800 rounded-full font-medium"
            >
              Processing Payment...
              <motion.div
                className="ml-2 w-4 h-4 rounded-full bg-green-500"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              />
            </motion.div>
          )}

          {paid && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center mt-4 text-green-700"
            >
              <FiCheckCircle size={48} className="mb-2" />
              <p className="font-semibold text-lg">Payment Successful</p>
              <p className="text-sm">Redirecting to your profile...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default PaymentPage;
