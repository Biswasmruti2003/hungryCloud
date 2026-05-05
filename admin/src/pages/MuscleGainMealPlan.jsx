import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const muscleGainData = {
  Veg: {
    Monday: {
      lunch: "Rice -1.5 cup, Dalma-1 cup, Ghee-2 tsp, Curd salad-1 cup",
      dinner: "Raggi noodles-1 bowl, Tomato Soup-1 cup",
      protein: 700,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/01/dalma.jpg",
    },
    Tuesday: {
      lunch: "Roti -3 pcs, Ghanta Tarkari-1 cup, Roasted badi-5 pcs, Lemon tomato salad-1 cup",
      dinner: "Roti-2 pcs, Rajma Curry-1 cup, Salads-1 cup",
      protein: 720,
      img: "https://www.archanaskitchen.com/images/archanaskitchen/1-Author/sibyl_sunitha/Rajma_Masala_Curry.jpg",
    },
    Wednesday: {
      lunch: "Rice-1.5 cup, Dal-1 cup, Mushroom besar-50 gm, Allu verta-1/2 cup",
      dinner: "Lemon coriander Quinoa-1 cup, Stir fry mixed vegetable-1 cup",
      protein: 730,
      img: "https://www.cookwithmanali.com/wp-content/uploads/2020/07/Mushroom-Curry.jpg",
    },
    Thursday: {
      lunch: "Moong dal stuffed paratha-2 pcs, Curd-1 cup, Rasogola-1",
      dinner: "Roti-2 pcs, Palak Paneer-1 cup",
      protein: 750,
      img: "https://www.vegrecipesofindia.com/wp-content/uploads/2022/07/moong-dal-paratha-1.jpg",
    },
    Friday: {
      lunch: "Allu paratha-2 pcs, Saag moong-1 cup",
      dinner: "Soya tiki wrap-1 serving",
      protein: 740,
      img: "https://www.vegrecipesofindia.com/wp-content/uploads/2021/06/aloo-paratha-1.jpg",
    },
    Saturday: {
      lunch: "Khichdi-1 bowl, Santula-1 cup, Soya tikki-2 pcs",
      dinner: "Rajma salad-1 bowl, Soup-1 cup",
      protein: 765,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/06/khichdi-recipe.jpg",
    },
    Sunday: {
      lunch: "Pea rice-1 cup, Palak corn sabji-1 cup, Lemon greek salad-1 cup",
      dinner: "Greek salad with stewed beans-1 bowl",
      protein: 780,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/06/greek-salad-recipe.jpg",
    },
  },
  "Non-Veg": {
    Monday: {
      lunch: "Rice -1.5 cup, Dalma-1 cup, Ghee-2 tsp, Egg salad-1 cup",
      dinner: "Raggi noodles-1 bowl, Egg drop Soup-1 cup",
      protein: 820,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/06/boiled-eggs.jpg",
    },
    Tuesday: {
      lunch: "Roti -3 pcs, Prawn ghanta-1 cup, Roasted badi-5 pcs, Lemon tomato salad-1 cup",
      dinner: "Roti-2 pcs, Egg tadka-1 cup, Salads-1 cup",
      protein: 840,
      img: "https://www.archanaskitchen.com/images/archanaskitchen/1-Author/sibyl_sunitha/Anda_Bhurji.jpg",
    },
    Wednesday: {
      lunch: "Rice-1.5 cup, Dal-1 cup, Fish besar-50 gm, Allu verta-1/2 cup",
      dinner: "Lemon coriander Quinoa-1 cup, Stir fry mixed vegetable-1 cup, Egg Poach-1",
      protein: 850,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/10/fish-curry.jpg",
    },
    Thursday: {
      lunch: "Moong dal stuffed paratha-2 pcs, Macha patra poda-50 gm, Tomato chutney-2 tbsp",
      dinner: "Mexican Salad-1 bowl, Grilled Fish-1 pc (40gm)",
      protein: 830,
      img: "https://www.vegrecipesofindia.com/wp-content/uploads/2022/01/fish-fry.jpg",
    },
    Friday: {
      lunch: "Allu paratha-2 pcs, Chuna macha curry-1 cup",
      dinner: "Egg wrap-1 serving",
      protein: 845,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/10/egg-roll-recipe.jpg",
    },
    Saturday: {
      lunch: "Khichdi-1 bowl, Prawn curry-1 cup",
      dinner: "Chicken tikka salad-1 bowl",
      protein: 855,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/12/prawn-curry.jpg",
    },
    Sunday: {
      lunch: "Pea rice-1 cup, Mutton stew curry-1 cup, Lemon greek salad-1 cup",
      dinner: "Grilled fish sprout salad-1 bowl",
      protein: 860,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/12/mutton-curry.jpg",
    },
  },
};

const MuscleGainMealPlan = () => {
  const [mealType, setMealType] = useState("Veg");
  const [meals, setMeals] = useState(muscleGainData[mealType]);

  useEffect(() => {
    setMeals(muscleGainData[mealType]);
  }, [mealType]);

  const isVeg = mealType === "Veg";
  const themeColor = isVeg ? "green" : "red";

  return (
    <div className="bg-gradient-to-br from-orange-50 via-white to-green-50 min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-6"
      >
        <h1 className="text-3xl font-bold">Muscle Gain Meal Plan</h1>
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

export default MuscleGainMealPlan;
