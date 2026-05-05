import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const allRecipes = [
  {
    id: "protein-bowl",
    title: "Balanced Protein Bowl",
    desc: "A perfect mix of quinoa, roasted veggies, and tofu or grilled chicken, ideal for muscle building and weight loss.",
    img: "https://t3.ftcdn.net/jpg/02/51/68/10/360_F_251681081_yAxA7U0zAGYLd0RlsnrUrJt4lya7km6Z.jpg",
    category: ["High Protein", "Veg"],
    calories: 420,
    protein: 30,
    carbs: 35,
    fats: 14,
  },
  {
    id: "detox-soup",
    title: "Detox Veggie Soup",
    desc: "Low-calorie, nutrient-dense soup made with seasonal veggies, herbs, and gut-friendly spices.",
    img: "https://plantbaes.com/wp-content/uploads/2023/07/Green-Thai-Curry-Meal-Prep-scaled.jpg",
    category: ["Low Calorie", "Veg"],
    calories: 180,
    protein: 8,
    carbs: 22,
    fats: 5,
  },
  {
    id: "chickpea-wrap",
    title: "Spicy Chickpea Wrap",
    desc: "Whole grain wrap filled with spicy chickpeas, creamy hummus, and crunchy veggies — perfect for a quick protein-rich bite.",
    img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
    category: ["High Protein"],
    calories: 350,
    protein: 20,
    carbs: 40,
    fats: 10,
  },
  {
    id: "tofu-stirfry",
    title: "Tofu Stir Fry Bowl",
    desc: "High-protein tofu cubes sautéed with bell peppers and broccoli, served with brown rice and sesame glaze.",
    img: "https://media.istockphoto.com/id/523445425/photo/homemade-tofu-stir-fry.jpg?s=612x612&w=0&k=20&c=wt9ie_VlwAIHl5Cp7oeggDcBI4HOn7yfqGSWVFTDNss=",
    category: ["High Protein", "Veg"],
    calories: 400,
    protein: 25,
    carbs: 38,
    fats: 12,
  },
];

const filters = ["All", "High Protein", "Veg", "Low Calorie"];

const Recipes = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredRecipes =
    activeFilter === "All"
      ? allRecipes
      : allRecipes.filter((r) => r.category.includes(activeFilter));

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-100 overflow-hidden">
      {/* Background animation circles */}
      <div className="absolute w-72 h-72 bg-green-200 opacity-30 rounded-full -top-24 -left-24 animate-pulse blur-2xl" />
      <div className="absolute w-72 h-72 bg-orange-200 opacity-30 rounded-full -bottom-20 -right-20 animate-pulse blur-2xl" />

      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-center text-green-700 mb-10"
        >
          Delicious & Nutritious Recipes
        </motion.h1>

        {/* CTA */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-4">
            Explore how your custom meals are crafted with care, nutrition, and flavor. Every recipe is dietitian-approved and hand-prepared by expert chefs.
          </p>
          <button
            onClick={() => navigate("/meal-plan")}
            className="bg-green-500 cursor-pointer text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-green-600 transition transform hover:scale-105 shadow-lg"
          >
            Refer My Meal Plan
          </button>
        </motion.div>

        {/* Filters */}
        <div className="flex justify-center flex-wrap gap-4 mb-10">
          {filters.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={`px-4 py-2 rounded-full border font-medium transition ${
                activeFilter === tag
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-white text-green-600 border-green-300 hover:bg-green-100"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Recipe Cards */}
        <div className="grid md:grid-cols-2 gap-10">
          {filteredRecipes.map((recipe, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              onClick={() => navigate(`/recipes/${recipe.id}`)}
              className="cursor-pointer bg-white rounded-2xl shadow-2xl p-6 overflow-hidden hover:shadow-green-300 transition-transform duration-300"
            >
              <img
                src={recipe.img}
                alt={recipe.title}
                className="w-full h-52 object-cover rounded-xl mb-4"
              />
              <h3 className="text-xl font-bold text-green-700 mb-2">
                {recipe.title}
              </h3>
              <p className="text-gray-600 mb-2">{recipe.desc}</p>
              <div className="text-sm text-gray-500 space-x-3">
                <span>🍽 {recipe.calories} kcal</span>
                <span>💪 {recipe.protein}g protein</span>
                <span>⚡ {recipe.carbs}g carbs</span>
                <span>🧈 {recipe.fats}g fat</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-20 bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-4">
            How Our Meal Plan Recipes Are Crafted
          </h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>Nutritionist-approved recipes tailored for each plan type.</li>
            <li>Locally sourced, organic ingredients for maximum freshness.</li>
            <li>Meals prepared fresh daily in state-of-the-art kitchens.</li>
            <li>Each meal is calorie-controlled, protein-packed, and portion-balanced.</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default Recipes;
