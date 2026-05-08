// src/pages/PrivacyPolicy.jsx

import { motion } from "framer-motion";
import { useEffect } from "react";
import { useState } from "react";
import {
  FaLock,
  FaUserShield,
  FaClipboardList,
  FaChevronDown,
  FaShieldAlt,
  FaCookieBite,
  FaUserEdit,
} from "react-icons/fa";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
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
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [openIndex, setOpenIndex] = useState(0);

  const sections = [
    {
      title: "1. Introduction",
      content:
        "This Privacy Policy describes how we collect, use, and protect your information when you use our meal subscription platform.",
    },
    {
      title: "2. Information We Collect",
      content:
        "We may collect personal details such as name, email, phone number, delivery address, dietary preferences, and payment details during registration or while using our services.",
    },
    {
      title: "3. How We Use Your Information",
      content:
        "We use the information to provide personalized meal plans, manage subscriptions, deliver meals, and communicate important updates.",
    },
    {
      title: "4. Sharing Your Data",
      content:
        "We do not sell your data. It may be shared with trusted third-party services like payment processors or delivery partners under strict privacy agreements.",
    },
    {
      title: "5. Security Measures",
      content:
        "We use industry-standard security protocols (SSL, encryption) to protect your data from unauthorized access, breaches, or misuse.",
    },
    {
      title: "6. Your Choices",
      content:
        "You can review and edit your information, request deletion, or opt out of promotional messages anytime via your account settings or by contacting support.",
    },
    {
      title: "7. Cookies & Tracking",
      content:
        "We use cookies to enhance your browsing experience, personalize content, and track performance metrics. You may disable cookies in your browser settings.",
    },
    {
      title: "8. Changes to This Policy",
      content:
        "We may update this policy periodically. You will be notified of major changes via email or notifications in the app.",
    },
    {
      title: "9. Contact Us",
      content:
        "For any privacy-related concerns or questions, please reach out to us via our Contact page.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 text-gray-800 overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-green-100 opacity-25 blur-3xl rounded-full animate-pulse -z-10" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-100 opacity-25 blur-3xl rounded-full animate-pulse -z-10" />
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-white/70 to-transparent -z-10" />

      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-12 py-16 md:py-20">
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
              Your data. Your control.
            </span>
          </div>

          <h1 className="mt-5 text-4xl md:text-5xl font-extrabold tracking-tight text-green-900">
            Privacy Policy
          </h1>
          <p className="mt-3 text-gray-600 md:text-lg">
            How we collect, use, and protect your information while you use HungryCloud.
          </p>

        </motion.div>

        {/* Summary Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Security",
              value: "Encryption + SSL",
              desc: "We use industry-standard security protocols to protect your data.",
              icon: FaLock,
            },
            {
              title: "Your control",
              value: "Access & deletion",
              desc: "You can review, update, or request deletion of your information.",
              icon: FaUserEdit,
            },
            {
              title: "Cookies",
              value: "Optional tracking",
              desc: "Cookies help improve experience and performance; you can disable them in your browser.",
              icon: FaCookieBite,
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
                      <Icon className="text-green-700 text-xl" size={24} />
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

                <p className="mt-3 text-sm text-gray-600 leading-relaxed">{card.desc}</p>
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
              <p className="mt-1 text-sm text-gray-600">Tap a section to expand.</p>
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
                        className={`shrink-0 text-green-700 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <motion.div
                      initial={false}
                      animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 text-gray-700 leading-relaxed">
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
            className="mt-10 text-center text-sm text-gray-600"
          >
            <p className="text-green-900 font-medium">
              Your trust is our priority. We ensure transparency and security every step of the way.
            </p>
            <p className="mt-1 text-xs text-gray-500 italic">Last updated: July 2025</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
