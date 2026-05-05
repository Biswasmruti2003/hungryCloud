import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const allMealPlans = [
  {
    title: "High Protein Plan",
    desc: "Protein, you say? Oh, you gym rat! This meal plan is packed with all the proteeein!",
    price: "₹239",
    image:
      "https://cdn.betterme.world/articles/wp-content/uploads/2025/05/weekly-high-protein-meal-plan.png",
    path: "/high-protein-plan",
  },
  {
    title: "Weightloss Plan",
    desc: "Ugh, we've all been there – the never-ending weight loss struggle. But guess what? Your search ends here. It's time to shred that weight.",
    price: "₹169",
    image:
      "https://blog.buywow.in/wp-content/uploads/2024/02/jpeg-optimizer_flay-lay-scale-weights-1.jpg",
    path: "/weightloss-plan",
  },
  {
    title: "Diabetic Diet Plan",
    desc: "Sugar spikes? Mood swings? The struggle is real. But hey, no more guesswork—this meal plan keeps your blood sugar steady while keeping things delicious!",
    price: "₹219",
    image:
      "https://media.istockphoto.com/id/1221739066/photo/low-glycemic-healthy-foods-for-diabetic-diet.jpg?s=612x612&w=0&k=20&c=lHeG470HJzvTh-Zj74IE6EaqLSvjjsZ7enRllqhzccg=",
    path: "/diabetic-plan",
  },
  {
    title: "Muscle Gain Meal Plan",
    desc: "A customized meal plan aligns with your goals, tastes, and dietary needs for balanced, sustainable eating.",
    price: "₹209",
    image:
      "https://t4.ftcdn.net/jpg/01/81/12/37/360_F_181123726_invADRiRZle7YWLYfkEHz0mUfWH60kVZ.jpg",
    path: "/custom-meal-plan",
  },
  {
    title: "Ofiice Employee Meal Plan",
    desc: "A customized meal plan aligns with your goals, tastes, and dietary needs for balanced, sustainable eating.",
    price: "₹159",
    image:
      "https://static.wixstatic.com/media/853ac6_3749c23f84ec44f095497d056f73159c~mv2.jpg/v1/fill/w_1000,h_772,al_c,q_85,usm_0.66_1.00_0.01/853ac6_3749c23f84ec44f095497d056f73159c~mv2.jpg",
    path: "/employee-meal-plan",
  }
];

const MealPlans = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [startIndex, setStartIndex] = useState(0);

  const getVisiblePlans = (start) => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      result.push(allMealPlans[(start + i) % allMealPlans.length]);
    }
    return result;
  };

  const visiblePlans = getVisiblePlans(startIndex);
  const totalSlides = allMealPlans.length;

  useEffect(() => {
    if (!isHome) return;

    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [isHome, totalSlides]);

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleDotClick = (index) => {
    setStartIndex(index);
  };

  const plansToDisplay = isHome ? visiblePlans : allMealPlans;

  return (
    <section id="meal-plans" className="bg-green-50 py-16 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Centered Heading */}
        <div className="flex justify-center mb-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center"
          >
            <span className="inline-block border-b-4 border-green-500 pb-1">
              MEAL PLANS
            </span>
          </motion.h2>
        </div>

        {isHome && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-[52%] transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:scale-110 transition z-10"
              aria-label="Previous Meal Plan"
            >
              <ChevronLeft className="text-green-500 w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-[52%] transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:scale-110 transition z-10"
              aria-label="Next Meal Plan"
            >
              <ChevronRight className="text-green-500 w-6 h-6" />
            </button>
          </>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-6 transition-all duration-500">
          {plansToDisplay.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden border border-green-100"
            >
              <img
                src={plan.image}
                alt={plan.title}
                className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="p-6 text-left space-y-3">
                <h3 className="text-xl font-bold text-gray-800">{plan.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{plan.desc}</p>
                <p className="text-green-700 font-semibold text-md">
                  Starting from <span className="text-black">{plan.price}</span>/meal
                </p>
                <button
                  onClick={() => navigate(plan.path)}
                  className="w-full cursor-pointer bg-green-500 hover:bg-green-600 text-white py-2 mt-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
                >
                  Buy Now →
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {isHome && (
          <div className="flex justify-center mt-6 space-x-2">
            {allMealPlans.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === startIndex ? "bg-green-500 scale-125" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MealPlans;
