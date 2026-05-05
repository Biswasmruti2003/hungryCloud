import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaUtensils, FaLeaf, FaClock, FaMoneyBillAlt } from "react-icons/fa";

const faqData = [
  {
    question: "How do I subscribe to a meal plan?",
    answer: "Simply visit the 'Meal Plans' page, choose between High Protein, Weight Loss, or Custom Plan, select your delivery slots, meal type, and days, then click 'Subscribe'.",
  },
  {
    question: "Can I customize my meal preferences?",
    answer: "Yes, we allow full customization for meal types (Veg/Non-Veg), delivery timing (Lunch/Dinner/Both), and number of days.",
  },
  {
    question: "What if I miss a delivery?",
    answer: "In case of a missed delivery, please reach out to our support team via the Contact page. We may offer credits or rescheduling based on the situation.",
  },
  {
    question: "Are there any trial options?",
    answer: "Yes! You can opt for a 3-day trial plan to try our meals before committing to a full subscription.",
  },
  {
    question: "How do I cancel or pause my subscription?",
    answer: "You can cancel or pause your plan from your account dashboard. Make sure to do this 24 hours before the next delivery to avoid charges.",
  },
  {
    question: "Do you support dietary restrictions?",
    answer: "Yes, during subscription you can mention allergies or special preferences. Our team will ensure your meals are tailored accordingly.",
  },
  {
    question: "What is your refund policy?",
    answer: "Refunds are available if canceled 24 hours before the plan starts. After that, the refund policy outlined on our Refund Policy page applies.",
  },
];

const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <motion.div
    layout
    initial={{ borderRadius: "1rem" }}
    className="bg-white/90 border border-green-200 backdrop-blur-md rounded-2xl shadow-md hover:shadow-xl p-6 transition-all duration-300"
  >
    <button
      onClick={onClick}
      className="w-full text-left flex justify-between items-center text-green-800 font-semibold text-lg"
    >
      {question}
      <FaChevronDown
        className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.p
          key="answer"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 text-gray-700 text-sm leading-relaxed"
        >
          {answer}
        </motion.p>
      )}
    </AnimatePresence>
  </motion.div>
);

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="relative min-h-screen py-20 px-6 md:px-24 bg-gradient-to-tr from-orange-50 via-white to-green-50 overflow-hidden">
      {/* Floating background circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-100 blur-3xl opacity-20 rounded-full animate-pulse -z-10" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-100 blur-3xl opacity-20 rounded-full animate-pulse -z-10" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-2 drop-shadow">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 italic text-sm">
          Find quick answers to common questions about our meal plans.
        </p>
        <div className="flex justify-center gap-5 mt-4">
          <FaUtensils className="text-green-600 text-xl" />
          <FaLeaf className="text-green-600 text-xl" />
          <FaClock className="text-green-600 text-xl" />
          <FaMoneyBillAlt className="text-green-600 text-xl" />
        </div>
      </motion.div>

      {/* FAQ Items */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.2 }}
        className="max-w-5xl mx-auto grid gap-6"
      >
        {faqData.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === index}
            onClick={() => toggleFAQ(index)}
          />
        ))}
      </motion.div>

      {/* Footer Message */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-20 text-center text-sm text-gray-600"
      >
        <p className="text-green-800 font-medium">
          Didn't find your question? Contact us — we're happy to help!
        </p>
      </motion.div>
    </div>
  );
};

export default FAQs;
