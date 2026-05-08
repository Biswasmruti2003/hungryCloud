import { useState } from "react";
import { motion } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaLocationArrow } from "react-icons/fa";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      alert("All fields are required");
      return;
    }
    // Simulate sending logic
    console.log("Contact Message Sent:", form);
    setSuccess(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 overflow-hidden px-4 py-16">
      {/* Background animation blob */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-green-200 opacity-30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-green-100 opacity-30 rounded-full blur-2xl animate-ping"></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-white z-10 w-full max-w-3xl p-8 rounded-xl shadow-xl"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-green-800 mb-6 text-center">
          Contact HungryCloud
        </h2>

        <p className="text-gray-600 text-center mb-8">
          We'd love to hear from you. Whether you're curious about our meal
          plans, partnerships, or anything else — our team is ready to answer
          all your questions.
        </p>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400"
          />
          <textarea
            name="message"
            rows="5"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 resize-none"
          ></textarea>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition duration-300"
          >
            Send Message
          </button>
        </form>

        {success && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-600 mt-4 text-center"
          >
            ✅ Your message has been sent!
          </motion.p>
        )}

        {/* Contact Info */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-gray-700 text-sm">
          {/* Phone */}
          <div className="flex flex-col items-center gap-2">
            <FaPhoneAlt className="text-green-600 text-xl" />
            <a
              href="tel:+919090530409"
              className="text-green-700 hover:underline hover:text-green-900"
              aria-label="Call HungryCloud"
            >
              +91 9090530409
            </a>
          </div>

          {/* Email */}
          <div className="flex flex-col items-center gap-2">
            <FaEnvelope className="text-green-600 text-xl" />
            <a
              href="mailto:support@hungrycloud.in"
              className="text-green-700 hover:underline hover:text-green-900"
              aria-label="Email HungryCloud"
            >
              support@hungrycloud.in
            </a>
          </div>

          {/* Address */}
          <div className="flex flex-col items-center gap-2">
            <FaLocationArrow className="text-green-600 text-xl" />
            <a
              href="https://www.google.com/maps?q=Bhubaneswar,+India"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 hover:underline hover:text-green-900"
              aria-label="View HungryCloud address on map"
            >
              Bhubaneswar, India
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
