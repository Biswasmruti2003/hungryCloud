import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HeroSection = () => {
  const navigate = useNavigate();
  const [slideIndex, setSlideIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const slides = ["hero", "consult"];
  const containerRef = useRef();

  // Auto slide
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") {
        setSlideIndex((prev) => (prev + 1) % slides.length);
      } else if (e.key === "ArrowLeft") {
        setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Touch swipe navigation
  useEffect(() => {
    let startX = 0;
    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
    };
    const handleTouchEnd = (e) => {
      const endX = e.changedTouches.clientX;
      const diffX = endX - startX;
      if (diffX > 50) {
        setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
      } else if (diffX < -50) {
        setSlideIndex((prev) => (prev + 1) % slides.length);
      }
    };
    const ref = containerRef.current;
    ref.addEventListener("touchstart", handleTouchStart);
    ref.addEventListener("touchend", handleTouchEnd);
    return () => {
      ref?.removeEventListener("touchstart", handleTouchStart);
      ref?.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-[50vh] overflow-hidden px-4 pt-10 pb-28 sm:pb-10" // increased bottom padding
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://as2.ftcdn.net/jpg/02/42/31/83/1000_F_242318320_t1kvGXR8F1ZGdyp3lBKUqYiTi1Rsuqid.jpg"
          alt="bg"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/80 via-green-50/80 to-orange-50/80 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-center item-center">
        <AnimatePresence mode="wait">
          {slideIndex === 0 ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.8 }}
              className="w-full flex flex-col lg:flex-row items-center justify-between gap-10"
            >
              {/* Left Text */}
              <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug">
                  Subscribe once. <br />
                  <span className="text-green-600">Delivered Daily</span> 🍽️
                </h1>
                <p className="text-md sm:text-lg text-gray-700 max-w-lg mx-auto lg:mx-0">
                  Enjoy curated, healthy meals crafted by nutritionists and chefs.
                  Your health journey starts from your plate.
                </p>
                <p className="text-lg text-green-700 font-semibold">
                  Starting from ₹159/- per meal
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/meal-plan")}
                  className="bg-green-600 hover:bg-green-700 cursor-pointer text-white px-6 py-3 rounded-full shadow-md hover:shadow-xl transition"
                >
                  Subscribe Now
                </motion.button>
              </div>

              {/* Right Images */}
              <div className="w-full lg:w-1/2 flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  {[
                    {
                      label: "Lunch",
                      img: "https://media.istockphoto.com/id/920931456/photo/healthy-buddha-bowl-lunch-with-grilled-chicken-quinoa-spinach-avocado-brussels-sprouts.jpg?s=612x612&w=0&k=20&c=2ZMDpAVWCpjWC801LqWqTck54C6cvZUgtlXZzx7oim0=",
                    },
                    {
                      label: "Dinner",
                      img: "https://cdn.pixabay.com/photo/2018/12/20/19/28/vegan-3886637_1280.jpg",
                    },
                  ].map((meal, idx) => (
                    <motion.div
                      key={idx}
                      onClick={() => navigate("/meal-plan")}
                      whileHover={{ scale: 1.05 }}
                      className="flex-1 bg-white rounded-2xl shadow-xl p-4 cursor-pointer"
                    >
                      <img
                        src={meal.img}
                        alt={meal.label}
                        className="w-full h-40 sm:h-44 md:h-52 object-cover rounded-xl"
                      />
                      <p className="mt-3 text-base sm:text-lg font-semibold text-gray-800 text-center">
                        {meal.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            // Slide 2
            <motion.div
              key="consult"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -60 }}
              transition={{ duration: 0.9 }}
              className="w-full flex flex-col lg:flex-row items-center justify-between gap-8"
            >
              <motion.div
                className="w-full lg:w-1/2"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
              >
                <img
                  src="https://img.freepik.com/free-photo/medium-shot-happy-doctor-with-orange-kiwi_23-2148302076.jpg?semt=ais_hybrid&w=740"
                  alt="Nutritionist"
                  className="w-full h-64 sm:h-80 md:h-76 object-cover rounded-xl shadow-2xl"
                />
              </motion.div>

              <motion.div
                className="w-full lg:w-1/2 text-center lg:text-left px-2 md:px-10"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <h3 className="text-3xl sm:text-4xl font-extrabold text-green-800 mb-4">
                  Free Nutritionist Consultation
                </h3>
                <p className="text-gray-700 text-md sm:text-lg mb-2">
                  Unlock your healthiest self with a personal diet expert!
                </p>
                <ul className="list-disc text-left ml-6 text-sm sm:text-base text-gray-600 mb-4 space-y-1">
                  <li>Personalized nutrition planning</li>
                  <li>Expert advice on your health goals</li>
                  <li>30-minute online video consultation</li>
                </ul>
                <p className="text-green-700 font-medium mb-4">
                  Meet Teja Kiran – Lead Nutritionist
                </p>
                <motion.a
                  href="https://calendly.com/tejagogineni-swapnow/30min?month=2025-02"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block bg-green-600 hover:bg-green-700 text-white text-md px-6 py-3 rounded-full transition shadow-lg"
                >
                  Book Now
                </motion.a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Responsive Dots - fixed position */}
      <div className="absolute bottom-4 sm:bottom-6 w-full flex flex-wrap justify-center gap-2 sm:gap-3 px-4 z-50">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlideIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              slideIndex === i
                ? "bg-green-600 scale-125"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
