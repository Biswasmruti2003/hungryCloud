import { motion } from "framer-motion";
import { useEffect } from "react";
import { useState } from "react";
import {
  FaMoneyCheckAlt,
  FaUndoAlt,
  FaClock,
  FaChevronDown,
  FaShieldAlt,
} from "react-icons/fa";

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

  const [openIndex, setOpenIndex] = useState(0);

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
        "To request a refund, contact our support team via the Contact page or email us at refund@hungrycloud.in. Please provide your order ID and reason for cancellation.",
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
        "If you're not satisfied with the resolution, you can escalate your concern to refund-escalation@hungrycloud.in. We aim to ensure a fair resolution within 72 hours.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 text-gray-800 overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-green-100 opacity-25 blur-3xl rounded-full animate-pulse -z-10" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-100 opacity-25 blur-3xl rounded-full animate-pulse -z-10" />
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-white/70 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 py-16 md:py-20">
        {/* Hero */}
        <motion.div
          variants={scaleFade}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-green-100 shadow-sm backdrop-blur">
            <FaShieldAlt className="text-green-700" />
            <span className="text-xs sm:text-sm font-semibold text-green-800">
              Clear, fair, and transparent
            </span>
          </div>

          <h1 className="mt-5 text-4xl md:text-5xl font-extrabold tracking-tight text-green-900">
            Refund Policy
          </h1>
          <p className="mt-3 text-gray-600 md:text-lg">
            Everything you need to know about cancellations, refunds, and processing timelines.
          </p>

          
        </motion.div>

        {/* Summary Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Cancel window",
              value: "24 hours",
              desc: "Cancel at least 24 hours before the plan start date for full refund eligibility.",
              icon: FaUndoAlt,
            },
            {
              title: "Refund timeline",
              value: "5–7 days",
              desc: "Approved refunds return to the original payment method within 5–7 business days.",
              icon: FaMoneyCheckAlt,
            },
            {
              title: "Escalation SLA",
              value: "72 hours",
              desc: "If needed, escalations are reviewed for a fair resolution within 72 hours.",
              icon: FaClock,
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i + 1}
                className="rounded-3xl bg-white/90 border border-green-100 shadow-lg backdrop-blur p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-full bg-green-50 border border-green-100 flex items-center justify-center shadow-sm">
                      <Icon className="text-green-700 text-xl " size={24} />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      {card.title}
                    </p>
                    <p className="mt-1 text-2xl font-extrabold text-green-900">
                      {card.value}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Accordion */}
        <div className="mt-10 max-w-7xl mx-auto">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={4}
            className="rounded-3xl bg-white/90 border border-green-100 shadow-xl backdrop-blur overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl md:text-2xl font-bold text-green-900">
                Policy details
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Tap a section to expand.
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              {sections.map((section, index) => {
                const isOpen = openIndex === index;
                return (
                  <div key={section.title} className="px-6 py-5">
                    <button
                      type="button"
                      onClick={() => setOpenIndex((prev) => (prev === index ? -1 : index))}
                      className="w-full flex items-center justify-between gap-4 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="text-base md:text-lg font-semibold text-green-800">
                        {section.title}
                      </span>
                      <FaChevronDown
                        className={`shrink-0 text-green-700 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    <motion.div
                      initial={false}
                      animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="py-6 text-gray-700 leading-relaxed">
                        {section.content}
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Footer Note */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={5}
            className="mt-20 text-xl text-center text-sm text-gray-600"
          >
            <p className="text-green-900 font-medium">
              We’re committed to keeping things fair and clear.
            </p>
            <p className="mt-1 text-lg text-gray-500 italic">Last updated: April 2026</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
