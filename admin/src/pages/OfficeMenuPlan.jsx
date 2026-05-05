import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const officeMenuData = {
  Veg: {
    Monday: {
      lunch: "Spinach corn sandwiches (1 serve), ABC juice (1 glass)",
      dinner: "Raggi noodles (1 bowl), Mushroom soup (1 cup)",
      kcal: 450,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/06/ragi-noodles.jpg",
    },
    Tuesday: {
      lunch: "Mushroom salad (1 bowl), Green iced tea (1 cup)",
      dinner: "Roti (1.5 pcs), Rajma curry (1 cup), Salad (1 cup)",
      kcal: 460,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/12/rajma-recipe.jpg",
    },
    Wednesday: {
      lunch: "Broccoli beans wrap (1 serve), ABC juice (1 glass)",
      dinner: "Lemon coriander quinoa (1 cup), Seasonal veggies, Sautéed corn & mushrooms",
      kcal: 470,
      img: "https://www.vegrecipesofindia.com/wp-content/uploads/2021/01/quinoa-upma.jpg",
    },
    Thursday: {
      lunch: "Methi roti (1.5 slices), Coconut rajma gravy (1 cup)",
      dinner: "Rajma meal box (1 serve)",
      kcal: 480,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/01/rajma-chawal.jpg",
    },
    Friday: {
      lunch: "Beet pasta (1 bowl), Sautéed beans & corn (2 tbsp)",
      dinner: "Roti (2 pcs), Palak paneer (1 cup), Beetroot tikki (2 pcs)",
      kcal: 490,
      img: "https://www.vegrecipesofindia.com/wp-content/uploads/2021/07/beetroot-tikki.jpg",
    },
    Saturday: {
      lunch: "Russian salad (1 serve), Palak chickpea tikki (2 pcs)",
      dinner: "Paneer wrap (1 serve), Lentil soup (½ cup)",
      kcal: 500,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2020/10/paneer-wrap.jpg",
    },
    Sunday: {
      lunch: "American meal box (1 serve), Green soup (1 cup)",
      dinner: "Dalia khichdi (1 cup), Seasonal veggie stew, Chickpea beetroot tikki (1 pc)",
      kcal: 510,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/08/dalia-khichdi.jpg",
    },
  },
  "Non-Veg": {
    Monday: {
      lunch: "Spinach corn sandwich (1 serve), Scrambled egg (1), Green tea (1 cup)",
      dinner: "Raggi noodles (1 bowl), Egg drop soup (½ cup)",
      kcal: 480,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2020/12/egg-drop-soup.jpg",
    },
    Tuesday: {
      lunch: "Chicken salad (1 bowl), Green iced tea (1 cup)",
      dinner: "Roti (1.5 pcs), Egg tadka (1 cup), Salad (1 cup)",
      kcal: 495,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/06/egg-tadka.jpg",
    },
    Wednesday: {
      lunch: "Mushroom omelette (1), ABC juice (1 glass)",
      dinner: "Lemon coriander quinoa (1 cup), Stir-fried veggies, Egg poach (1)",
      kcal: 500,
      img: "https://www.vegrecipesofindia.com/wp-content/uploads/2022/06/omelette.jpg",
    },
    Thursday: {
      lunch: "Methi roti (1.5 slices), Coconut prawn gravy (1 cup)",
      dinner: "Mexican salad (1 bowl), Grilled fish (45 gm)",
      kcal: 525,
      img: "https://www.cookwithmanali.com/wp-content/uploads/2021/05/Tandoori-Fish-Tikka.jpg",
    },
    Friday: {
      lunch: "Beet pasta (1 bowl), Grilled fish (45 gm)",
      dinner: "Egg wrap (1), Soup (½ cup)",
      kcal: 530,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/11/egg-wrap.jpg",
    },
    Saturday: {
      lunch: "Russian salad (1 serve), Spinach lemon chicken (2 pcs)",
      dinner: "Chicken tikka salad (1 serve), Lemon coriander soup (1 cup)",
      kcal: 540,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/08/chicken-tikka-salad.jpg",
    },
    Sunday: {
      lunch: "American meal box (1 serve), Green soup (1 cup)",
      dinner: "Grilled fish sprout salad (1 bowl), Tomato ginger soup (1 cup)",
      kcal: 550,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2020/11/grilled-fish.jpg",
    },
  },
};

const OfficeMenuPlan = () => {
  const [mealType, setMealType] = useState("Veg");
  const [meals, setMeals] = useState(officeMenuData[mealType]);

  useEffect(() => {
    setMeals(officeMenuData[mealType]);
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
        <h1 className="text-3xl font-bold">Office Weekly Meal Plan</h1>
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
              <p className="text-sm font-semibold">Calories</p>
              <p className={`text-sm font-bold text-${themeColor}-600`}>
                {data.kcal} kcal
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OfficeMenuPlan;
