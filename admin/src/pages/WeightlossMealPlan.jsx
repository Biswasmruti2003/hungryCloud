import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const weightLossData = {
  Veg: {
    Monday: {
      lunch: "Moong dal cheela (2 pcs), Curd (1 cup), Green chutney (1 tsp)",
      dinner: "Raggi noodles (1 bowl), Tomato soup (1 cup)",
      protein: 722,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/08/moong-dal-cheela-recipe.jpg",
    },
    Tuesday: {
      lunch: "Brown rice (1 cup), Mix veg curry (1 cup), Salad (1 cup)",
      dinner: "Vegetable soup (1 cup), Multigrain roti (2 pcs)",
      protein: 720,
      img: "https://www.indianveggiedelight.com/wp-content/uploads/2020/07/vegetable-curry-featured.jpg",
    },
    Wednesday: {
      lunch: "Quinoa pulao (1 cup), Low-fat curd (1 cup)",
      dinner: "Khichdi (1 bowl), Stir-fry veggies (1 cup)",
      protein: 750,
      img: "https://myfoodstory.com/wp-content/uploads/2021/08/Vegetable-Khichdi-2.jpg",
    },
    Thursday: {
      lunch: "Vegetable dalia (1 bowl), Mint chutney (1 tsp)",
      dinner: "Bajra roti (2 pcs), Lauki sabzi (1 cup), Curd (1/2 cup)",
      protein: 700,
      img: "https://www.vegrecipesofindia.com/wp-content/uploads/2021/05/dalia-recipe-1.jpg",
    },
    Friday: {
      lunch: "Besan chilla (2 pcs), Tomato chutney (1 tbsp)",
      dinner: "Oats upma (1 bowl), Buttermilk (1 glass)",
      protein: 724,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/06/oats-upma.jpg",
    },
    Saturday: {
      lunch: "Millet salad (1 bowl), Curd (1/2 cup)",
      dinner: "Vegetable stew (1 cup), Multigrain bread (1 slice)",
      protein: 720,
      img: "https://hebbarskitchen.com/wp-content/uploads/2021/04/millet-salad-recipe-weight-loss-recipe-1.jpg",
    },
    Sunday: {
      lunch: "Vegetable khichdi (1 bowl), Mint raita (1 cup)",
      dinner: "Pumpkin soup (1 bowl), Grilled paneer (50gm)",
      protein: 725,
      img: "https://static.toiimg.com/thumb/53109843.cms?width=1200&height=900",
    },
  },
  "Non-Veg": {
    Monday: {
      lunch: "Grilled chicken (100g), Brown rice (1 cup), Steamed veggies",
      dinner: "Egg curry (1 cup), Multigrain roti (2 pcs)",
      protein: 728,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/12/grilled-chicken.jpg",
    },
    Tuesday: {
      lunch: "Fish curry (1 cup), Red rice (1 cup), Salad",
      dinner: "Egg bhurji (1 cup), Roti (2 pcs)",
      protein: 730,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/10/egg-bhurji.jpg",
    },
    Wednesday: {
      lunch: "Boiled egg (2), Quinoa salad (1 bowl), Yogurt (1/2 cup)",
      dinner: "Chicken soup (1 bowl), Stir fry beans (1 cup)",
      protein: 726,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2020/11/chicken-soup-recipe.jpg",
    },
    Thursday: {
      lunch: "Methi chicken (1 cup), Brown rice (1 cup)",
      dinner: "Fish tikka (3 pcs), Veg salad (1 bowl)",
      protein: 729,
      img: "https://www.cookwithmanali.com/wp-content/uploads/2021/05/Tandoori-Fish-Tikka.jpg",
    },
    Friday: {
      lunch: "Chicken stew (1 cup), Red rice (1 cup), Cucumber salad",
      dinner: "Grilled eggplant, Boiled egg (1), Oats soup",
      protein: 727,
      img: "https://static.toiimg.com/thumb/61276114.cms?width=1200&height=900",
    },
    Saturday: {
      lunch: "Boiled chicken salad (1 bowl), Yogurt (1/2 cup)",
      dinner: "Grilled fish (100gm), Tomato soup",
      protein: 730,
      img: "https://www.seriouseats.com/thmb/vMvZeGLzZ1zMNxpv_s4hbpSlWus=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/20210427-Grilled-Fish-Vicky-Wasik-19-c9b6c037f0ea4f8592ad6a38f9eb8b44.jpg",
    },
    Sunday: {
      lunch: "Boiled egg (2), Bajra khichdi (1 bowl)",
      dinner: "Chicken curry (1 cup), Roti (2 pcs), Salad",
      protein: 731,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/06/chicken-curry-recipe.jpg",
    },
  },
};

const WeightlossMealPlan = () => {
  const [mealType, setMealType] = useState("Veg");
  const [meals, setMeals] = useState(weightLossData[mealType]);

  useEffect(() => {
    setMeals(weightLossData[mealType]);
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
        <h1 className="text-3xl font-bold">Weight Loss Meal Plan</h1>
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

      {/* Grid View */}
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

export default WeightlossMealPlan;
