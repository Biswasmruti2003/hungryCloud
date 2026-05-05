// src/pages/PrivacyPolicy.jsx

import { motion } from "framer-motion";
import { useEffect } from "react";
import { FaLock, FaUserShield, FaClipboardList } from "react-icons/fa";

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

const icons = [FaUserShield, FaLock, FaClipboardList];

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <div className="relative min-h-screen py-20 px-6 md:px-24 bg-gradient-to-br from-green-50 via-white to-orange-50 text-gray-800 overflow-hidden">
      {/* Animated Floating Background Circles */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-green-100 opacity-20 blur-3xl rounded-full animate-pulse -z-10" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-100 opacity-20 blur-3xl rounded-full animate-pulse -z-10" />

      {/* Title with Icon Animation */}
      <motion.div
        variants={scaleFade}
        initial="hidden"
        animate="visible"
        className="text-center mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-2 drop-shadow-md">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 italic">Your data. Your control. Our commitment.</p>
        <div className="flex justify-center gap-6 mt-4">
          {icons.map((Icon, i) => (
            <motion.div
              key={i}
              className="p-3 rounded-full bg-white shadow-md hover:scale-110 transition"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.2 }}
            >
              <Icon className="text-green-600 text-xl" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Sections */}
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

      {/* Footer */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        custom={sections.length + 1}
        className="mt-16 text-center text-sm text-gray-600"
      >
        <p className="text-green-900 font-medium">
          Your trust is our priority. We ensure transparency and security every step of the way.
        </p>
        <p className="mt-1 text-xs text-gray-500 italic">Last updated: July 2025</p>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;
