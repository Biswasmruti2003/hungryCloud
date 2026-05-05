// src/pages/TermsAndConditions.jsx

import { motion } from "framer-motion";
import { useEffect } from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const TermsAndConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative bg-gradient-to-tr from-orange-50 via-white to-green-50 min-h-screen py-16 px-6 md:px-24 text-gray-800 overflow-x-hidden">
      {/* Background Gradient Circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-orange-100 rounded-full opacity-30 blur-3xl animate-pulse -z-10"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-green-100 rounded-full opacity-30 blur-3xl animate-pulse -z-10"></div>

      <motion.h1
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="text-4xl md:text-5xl font-bold text-center mb-8 text-green-700"
      >
        Terms & Conditions
      </motion.h1>

      <div className="space-y-10 max-w-5xl mx-auto text-lg leading-relaxed text-gray-700">
        {[
          {
            title: "1. Introduction",
            content:
              "By subscribing to our meal plans, you agree to be bound by these Terms & Conditions. Please read them carefully before using our service.",
          },
          {
            title: "2. Meal Plans & Subscription",
            content:
              "We offer customized meal plans including High Protein, Weight Loss, and Custom Plans. Subscription duration and meal preferences are set at the time of ordering.",
          },
          {
            title: "3. Delivery & Scheduling",
            content:
              "Meals are delivered according to your chosen slot – Lunch, Dinner, or Both. We aim to deliver on time, but delivery time may vary due to unforeseen circumstances.",
          },
          {
            title: "4. Cancellation & Refund",
            content:
              "You may cancel the subscription 24 hours before the start date for a full refund. No refunds are provided once the subscription period has started.",
          },
          {
            title: "5. User Account & Privacy",
            content:
              "Users are responsible for keeping their login credentials secure. We protect your data as per our Privacy Policy.",
          },
          {
            title: "6. Dietary Disclaimer",
            content:
              "Our meals are curated by certified nutritionists, but results may vary. Always consult your doctor before starting any new diet.",
          },
          {
            title: "7. Modifications to Service",
            content:
              "We reserve the right to modify or terminate the service at any time, with or without notice.",
          },
          {
            title: "8. Contact Information",
            content:
              "For queries regarding your meal plan or these terms, please contact us via the Contact page.",
          },
        ].map((section, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-white/80 rounded-2xl shadow-lg p-6 border border-green-100"
          >
            <h2 className="text-2xl font-semibold text-green-600 mb-2">
              {section.title}
            </h2>
            <p>{section.content}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TermsAndConditions;
