import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaMapLocationDot,
} from "react-icons/fa6";
import { FaZ } from "react-icons/fa6";
import { SiSwiggy } from "react-icons/si";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // ✅ React Router Link
import food1 from "../assets/food1.png";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-green-50 to-white border-t border-gray-200 w-full z-50"
    >
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-10 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left: Brand & Social */}
        <div className="flex flex-col gap-4 items-start">
          <div className="flex items-center gap-2">
            <img
              src={food1}
              alt="HungryCloud Logo"
              className="h-10 w-auto object-contain"
            />
            <h2 className="text-xl sm:text-2xl font-extrabold text-green-800">
              HungryCloud
            </h2>
          </div>
          <p className="text-gray-700 text-sm sm:text-base italic max-w-xs">
            “Fuel your body, feed your soul with balanced nutrition.”
          </p>

          {/* Social Icons */}
          <div className="flex flex-wrap gap-4 mt-2 text-green-700">
            <motion.a
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white border border-green-200 rounded-full shadow hover:shadow-md transition"
            >
              <FaWhatsapp className="text-lg sm:text-xl" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white border border-green-200 rounded-full shadow hover:shadow-md transition"
            >
              <FaInstagram className="text-lg sm:text-xl" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              href="#"
              className="p-2 bg-white border border-green-200 rounded-full shadow hover:shadow-md transition"
            >
              <FaFacebookF className="text-lg sm:text-xl" />
            </motion.a>
            
          </div>
        </div>

        {/* Middle: Quick Links */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-4">
            QUICK LINKS
          </h3>
          <div className="space-y-2">
            {[
              { name: "About Us", path: "/about" },
              { name: "Contact", path: "/contact" },
              { name: "Terms & Conditions", path: "/terms" },
              { name: "Privacy Policy", path: "/privacy" },
              { name: "Refund Policy", path: "/refund" },
              { name: "FAQs", path: "/faqs" },
            ].map((link, i) => (
              <motion.div key={i} whileHover={{ x: 5 }}>
                <Link
                  to={link.path}
                  className="block text-gray-700 text-sm sm:text-base hover:text-green-600 transition"
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: Location Details */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-4">
            LOCATION DETAILS
          </h3>
          <div className="flex flex-col gap-3 text-sm sm:text-base text-gray-700">
            <div className="flex items-start gap-2">
              <FaLocationDot className="mt-0.5 text-green-700" />
              <div>
                <p className="font-semibold text-gray-800">Bhubaneswar, Odisha</p>
                <p className="text-gray-600">India</p>
              </div>
            </div>

            <a
              href="tel:+919090530409"
              className="inline-flex items-center gap-2 text-green-700 hover:underline hover:text-green-900"
              aria-label="Call HungryCloud"
            >
              <FaPhone className="text-green-700" />
              +91 9090530409
            </a>

            <a
              href="mailto:support@hungrycloud.in"
              className="inline-flex items-center gap-2 text-green-700 hover:underline hover:text-green-900"
              aria-label="Email HungryCloud"
            >
              <FaEnvelope className="text-green-700" />
              support@hungrycloud.in
            </a>

            <a
              href="https://www.google.com/maps?q=Bhubaneswar,+Odisha,+India"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition shadow-md text-sm sm:text-base"
              aria-label="Open HungryCloud location on map"
            >
              <FaMapLocationDot className="text-white" />
              View on Map
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-sm text-gray-600 py-6 border-t border-gray-200 px-4">
        © 2025 <span className="text-green-800 font-semibold">HungryCloud</span>.
        All rights reserved.
        <br className="block sm:hidden" />
        Powered by{" "}
        <a
          href="https://cybknow.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold hover:underline text-green-800"
        >
          Cybknow Technology
        </a>
      </div>
      
    </motion.footer>
  );
};

export default Footer;
