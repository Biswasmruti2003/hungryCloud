import { motion } from "framer-motion";
import { useEffect } from "react";
import { FaMoneyCheckAlt, FaUndoAlt, FaClock } from "react-icons/fa";

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const scaleFade = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: "1. Eligibility for Refund",
      content:
        "You are eligible for a full refund if the subscription is canceled at least 24 hours before your selected plan start date. This applies to all plans including Weight Loss, High Protein, and Custom Meal Plans.",
    },
    {
      title: "2. Non-Refundable Situations",
      content:
        "Refunds are not applicable once the subscription period has started or if meals have already been delivered. Additionally, trial plans (e.g., 3-day trials) are non-refundable.",
    },
    {
      title: "3. How to Request a Refund",
      content:
        "To request a refund, contact our support team via the Contact page or email us at refund@yourwebsite.com. Please provide your order ID and reason for cancellation.",
    },
    {
      title: "4. Refund Processing Time",
      content:
        "Approved refunds will be processed within 5–7 business days to your original payment method (UPI, Card, Wallet, etc.). You will receive a confirmation email once processed.",
    },
    {
      title: "5. Modifications or Plan Adjustments",
      content:
        "We allow you to pause, reschedule, or switch your plan with prior notice. In such cases, partial adjustments may be offered instead of a refund.",
    },
    {
      title: "6. Disputes & Escalations",
      content:
        "If you're not satisfied with the resolution, you can escalate your concern to refund-escalation@yourwebsite.com. We aim to ensure a fair resolution within 72 hours.",
    },
  ];

  return (
    <div className="relative min-h-screen py-20 px-6 md:px-24 bg-gradient-to-br from-orange-50 via-white to-green-50 text-gray-800 overflow-hidden">
      {/* Background Animation Bubbles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-100 opacity-20 blur-3xl rounded-full animate-pulse -z-10" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-100 opacity-20 blur-3xl rounded-full animate-pulse -z-10" />

      {/* Title with Icons */}
      <motion.div
        variants={scaleFade}
        initial="hidden"
        animate="visible"
        className="text-center mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-3 drop-shadow-md">
          Refund Policy
        </h1>
        <p className="text-gray-600 italic text-sm">
          Transparency you can count on.
        </p>
        <div className="flex justify-center gap-6 mt-4">
          {[FaMoneyCheckAlt, FaUndoAlt, FaClock].map((Icon, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.2 }}
              className="p-3 rounded-full bg-white shadow-md hover:scale-110 transition"
            >
              <Icon className="text-green-600 text-xl" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Refund Policy Sections */}
      <div className="max-w-5xl mx-auto space-y-10">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={index + 1}
            className="p-6 bg-white/90 rounded-3xl shadow-xl border border-green-100 backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]"
          >
            <h2 className="text-2xl font-semibold text-green-600 mb-2">
              {section.title}
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              {section.content}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Footer Message */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        custom={sections.length + 1}
        className="mt-16 text-center text-sm text-gray-600"
      >
        <p className="text-green-900 font-medium">
          We’re committed to keeping things fair and clear.
        </p>
        <p className="mt-1 text-xs text-gray-500 italic">
          Last updated: July 2025
        </p>
      </motion.div>
    </div>
  );
};

export default RefundPolicy;
