// src/pages/About.jsx
import { motion } from "framer-motion";
import { useEffect } from "react";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-orange-50 min-h-screen py-20 px-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-5xl mx-auto bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-10"
      >
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-green-800 mb-6 text-center"
        >
          About HungryCloud
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-gray-700 md:text-lg leading-relaxed mb-8"
        >
          HungryCloud is more than a meal subscription platform — it's your companion on the journey toward a healthier, simpler lifestyle. We combine <span className="text-green-600 font-medium">personalized nutrition</span>, <span className="text-orange-600 font-medium">chef-crafted meals</span>, and <span className="text-green-600 font-medium">science-backed plans</span> to help you achieve your fitness and wellness goals.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-8 text-center"
        >
          <div className="bg-gradient-to-br from-green-100 to-white p-6 rounded-xl shadow hover:shadow-md transition duration-300">
            <h3 className="text-xl font-semibold text-green-700 mb-2">🎯 Goal-Based Planning</h3>
            <p className="text-sm text-gray-600">
              Whether it’s muscle gain, weight loss, or balanced eating — our nutrition experts craft the perfect meal strategy for you.
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-100 to-white p-6 rounded-xl shadow hover:shadow-md transition duration-300">
            <h3 className="text-xl font-semibold text-orange-700 mb-2">👩‍🍳 Chef-Crafted Meals</h3>
            <p className="text-sm text-gray-600">
              Our chefs bring creativity and taste to healthy meals that are never boring and always satisfying.
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-white p-6 rounded-xl shadow hover:shadow-md transition duration-300">
            <h3 className="text-xl font-semibold text-green-700 mb-2">📦 Seamless Delivery</h3>
            <p className="text-sm text-gray-600">
              Timely delivery options ensure you always get fresh, ready-to-eat meals — lunch, dinner, or both.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="mt-12 text-center"
        >
          <h2 className="text-2xl font-bold text-green-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            To simplify healthy eating by offering personalized, delicious, and nourishing meals for every lifestyle.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;
