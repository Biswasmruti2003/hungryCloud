import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const balancedDietData = {
  Veg: {
    Monday: {
      lunch:
        "Parboiled cumin rice (½ cup), Nabaratan dal (1 cup), Salad (1 cup)",
      dinner: "Raggi noodles (1 bowl), Mushroom soup (1 cup)",
      protein: 922,
      img: "https://www.vegrecipesofindia.com/wp-content/uploads/2017/07/nawabi-nabaratan-dal.jpg",
    },
    Tuesday: {
      lunch:
        "Vegetable khichdi (1 bowl), Tomato chutney (1 tsp), Raita (1 cup)",
      dinner: "Roti (2 pcs), Rajma Curry (1 cup), Salad (1 cup)",
      protein: 923,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/06/oats-khichdi.jpg",
    },
    Wednesday: {
      lunch: "Mushroom meal box (1 bowl)",
      dinner:
        "Lemon coriander quinoa (1 cup), Seasonal veggies, Sautéed corn & mushrooms (1 small cup)",
      protein: 881,
      img: "https://www.archanaskitchen.com/images/archanaskitchen/1-Author/shaheen/Fun_Foods_Lemon_Coriander_Quinoa_Recipe.jpg",
    },
    Thursday: {
      lunch: "Garlic flavoured paratha (1.5 pcs), Coconut rajma gravy (1 cup)",
      dinner: "Rajma meal box (1 serve)",
      protein: 920,
      img: "https://www.vegrecipesofindia.com/wp-content/uploads/2021/07/rajma-recipe-3.jpg",
    },
    Friday: {
      lunch: "Paneer meal box (1 bowl)",
      dinner:
        "Roti (2 pcs), Palak paneer (1 cup), Beetroot sweet potato tikki (2 pcs)",
      protein: 854,
      img: "https://www.vegrecipesofindia.com/wp-content/uploads/2016/11/palak-paneer-1.jpg",
    },
    Saturday: {
      lunch:
        "Curd rice (1 cup), Dalma (1 cup), Leafy greens sauté (1 cup), Sweet potato bharta (2 tbsp)",
      dinner: "Paneer wrap (1 serve), Lentil soup (½ cup)",
      protein: 923,
      img: "https://hebbarskitchen.com/wp-content/uploads/2020/05/paneer-wrap.jpg",
    },
    Sunday: {
      lunch:
        "Missi roti (2 pcs), Corn palak sabji (1 cup), Red beetroot-carrot-tomato salad (1 cup)",
      dinner:
        "Dalia khichdi (1 cup), Soyachunks bhurji (1 cup), Chickpea beetroot tikki (1 pc)",
      protein: 925,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/06/dalia-khichdi.jpg",
    },
  },
  "Non-Veg": {
    Monday: {
      lunch:
        "Parboiled cumin rice (½ cup), Nabaratan dal (1 cup), Egg vegetable bhurji (1 cup)",
      dinner: "Raggi noodles (1 bowl), Egg drop soup (½ cup)",
      protein: 866,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/12/egg-bhurji.jpg",
    },
    Tuesday: {
      lunch:
        "Vegetable khichdi (1 bowl), Broccoli omelette (1 pc), Raita (1 cup)",
      dinner: "Roti (1.5 pcs), Egg tadka (1 cup), Salad (1 cup)",
      protein: 927,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/12/broccoli-omelet.jpg",
    },
    Wednesday: {
      lunch: "Egg millet box (1 bowl)",
      dinner:
        "Lemon coriander quinoa (1 cup), Stir fry veggies, Egg poach (1 pc)",
      protein: 876,
      img: "https://www.cookwithmanali.com/wp-content/uploads/2021/03/Poached-Egg.jpg",
    },
    Thursday: {
      lunch: "Garlic paratha (1.5 pcs), Coconut prawn gravy (1 cup)",
      dinner: "Mexican salad (1 bowl), Grilled fish (1 pc)",
      protein: 868,
      img: "https://www.cubesnjuliennes.com/wp-content/uploads/2021/02/Coconut-Prawn-Curry-Recipe.jpg",
    },
    Friday: {
      lunch: "Chicken broccoli meal box (1 bowl)",
      dinner: "Egg wrap (1 pc), Soup (½ cup)",
      protein: 929,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/11/chicken-broccoli-meal.jpg",
    },
    Saturday: {
      lunch:
        "Curd rice (1 cup), Grilled Indian fish (45 gm), Sweet potato (boiled)",
      dinner: "Chicken tikka salad (1 serve), Lemon coriander soup (1 cup)",
      protein: 930,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/12/chicken-tikka.jpg",
    },
    Sunday: {
      lunch:
        "Missi roti (2 pcs), Chicken tikka (45 gm), Red salad (1 cup), Plain kadhi (1 cup)",
      dinner: "Grilled fish sprout salad (1 bowl), Tomato ginger soup (1 cup)",
      protein: 931,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2020/11/grilled-fish.jpg",
    },
  },
};

const DiabeticDietPlan = () => {
  const [mealType, setMealType] = useState("Veg");
  const [meals, setMeals] = useState(balancedDietData[mealType]);

  useEffect(() => {
    setMeals(balancedDietData[mealType]);
  }, [mealType]);

  const isVeg = mealType === "Veg";
  const themeColor = isVeg ? "green" : "red";

  return (
    <div className="bg-gradient-to-br from-orange-50 via-white to-green-50 min-h-screen p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-6"
      >
        <h1 className="text-3xl font-bold">Diabetic Diet Plan</h1>
        <div className="flex gap-3">
          {["Veg", "Non-Veg"].map((type) => (
            <button
              key={type}
              onClick={() => setMealType(type)}
              className={`px-4 py-2 rounded-full border text-sm transition-all ${
                mealType === type
                  ? `bg-${themeColor}-500 text-white`
                  : `border-${themeColor}-400 text-${themeColor}-600`
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(meals).map(([day, data], index) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white shadow-lg rounded-xl p-4 space-y-3 border-t-4"
            style={{ borderColor: isVeg ? "#22c55e" : "#ef4444" }}
          >
            <img
              src={data.img}
              alt={`${day} Meal`}
              className="w-full h-40 object-cover rounded-lg shadow"
            />
            <h3 className="text-lg font-bold">{day}</h3>
            <div>
              <p className="text-sm font-semibold">Lunch</p>
              <p className="text-sm text-gray-700">{data.lunch}</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Dinner</p>
              <p className="text-sm text-gray-700">{data.dinner}</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Protein</p>
              <p className={`text-sm font-bold text-${themeColor}-600`}>
                {data.protein} Kcal
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DiabeticDietPlan;
