import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const weekData = {
  Veg: {
    Monday: {
      lunch: "Brown rice - 1 cup, Chana masala - 1 medium cup, Salad - 1 cup",
      dinner: "Raggi Paneer noodles - 1 bowl, Tomato soup - 1 cup",
      protein: 1000,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQdS4annPVrPsKzElMwtjoXM-M6IX9SeM7ssiLvJvNxSYRoiicVwj5Z_DLHREugCQcpDY&usqp=CAU",
    },
    Tuesday: {
      lunch: "Veg khichdi - 1 bowl, Raita - 1 cup, Tomato chutney - 1 tbsp, Soya tikki - 1 pc",
      dinner: "Roti - 2 pcs, Rajma Curry - 1 cup, Boiled corn - 2 tbsp",
      protein: 1050,
      img: "https://shrikripa.in/wp-content/uploads/2023/04/DSC_0140-1024x683.jpg",
    },
    Wednesday: {
      lunch: "Cooked quinoa - 1 cup, Dalma - 1 small cup, Leafy greens saute - 1 small cup, Salad - 1 cup, Curd - 1 small cup",
      dinner: "Lemon coriander quinoa - 1 medium cup, Stir fry mixed vegetable - 1 cup, Sautéed mushrooms",
      protein: 1050,
      img: "https://www.veggieinspired.com/wp-content/uploads/2018/03/vegan-green-curry-vegetables-hero.jpg",
    },
    Thursday: {
      lunch: "Millet Pulao - 1 cup, Dal Makhani - 1 cup, Veg stew - 1 cup, Grilled Tofu - 60 gm",
      dinner: "Rajma meal box - 1 bowl",
      protein: 1100,
      img: "https://vegecravings.com/wp-content/uploads/2017/03/stuffed-capsicum-recipe-step-by-step-instructions.jpg",
    },
    Friday: {
      lunch: "Cooked millets - 1 cup, Beans stew - 1 cup, Paneer gravy - 1 cup",
      dinner: "Roti - 3 pcs, Palak paneer - 1 medium cup, Beet root sweet potato tikki - 2 pcs",
      protein: 1000,
      img: "https://premasculinary.com/wp-content/uploads/2022/02/Kalyana-Vettu-Veg-Pulao-or-Veg-Birynai-scaled.jpg",
    },
    Saturday: {
      lunch: "Roti - 2 pcs, Salad - 1 cup, Soyabean/Lobia curry - 1 cup",
      dinner: "Paneer wrap - 1 serving, Lentil soup - 1 cup",
      protein: 1090,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG-c2fzZOoghNiiSVUNft8EjgkkcWSTgtzVQ&s",
    },
    Sunday: {
      lunch: "Pea rice - 1 cup, Palak corn sabji - 1 medium cup, Lemon greek salad - 1 cup",
      dinner: "Dalia Khichdi - 1 bowl, Seasonal veggies stew - 1 cup, Chickpea beetroot",
      protein: 1080,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS_rQQwl4kUCkwXyjB7JJt-IsXbjW2X9dMhg&s",
    },
  },
  "Non-Veg": {
    Monday: {
      lunch: "Red rice - 1 cup, Egg dalma - 1 medium cup, Salad - 1 cup",
      dinner: "Raggi noodles - 1 bowl, Egg drop soup - 1 cup",
      protein: 1020,
      img: "https://www.halfbakedharvest.com/wp-content/uploads/2019/07/Crispy-Buffalo-Ranch-Chicken-Salad-with-Goddess-Dressing-1.jpg",
    },
    Tuesday: {
      lunch: "Veg khichdi - 1 bowl, Raita - 1 cup, Tomato chutney - 1 tbsp, Whole egg - 1 pc",
      dinner: "Roti - 2 pcs, Egg tadka - 1 cup, Salad - 1 cup",
      protein: 1050,
      img: "https://www.isabeleats.com/wp-content/uploads/2021/09/salmon-tacos-small-4.jpg",
    },
    Wednesday: {
      lunch: "Cooked quinoa - 1 cup, Dalma - 1 small cup, Leafy greens saute - 1 small cup, Steamed fish - 1 cup",
      dinner: "Lemon coriander quinoa - 1 cup, Stir fry mixed vegetable - 1 cup, Egg poach - 2",
      protein: 1090,
      img: "https://images.immediate.co.uk/production/volatile/sites/30/2021/04/pork-mince-stir-fry-1ea3a15.jpg",
    },
    Thursday: {
      lunch: "Millet Pulao - 1 cup, Dal Makhani - 1 cup, Veg stew - 1 cup, Grilled fish - 60 gm",
      dinner: "Mexican salad - 1 bowl, Grilled fish - 1 pc (40 gm)",
      protein: 1100,
      img: "https://thegirlonbloor.com/wp-content/uploads/2018/05/The-Ultimate-Vegetarian-Mason-Jar-Salad-13.jpg",
    },
    Friday: {
      lunch: "Cooked millets - 1 cup, Beans stew - 1 cup, Chicken bhurji - 1 cup, Italian seasoning - 2 tsp",
      dinner: "Egg wrap - 1 serving, Soup - 1 cup",
      protein: 1050,
      img: "https://i0.wp.com/marilenaskitchen.com/wp-content/uploads/2024/04/Greek-grilled-chicken-salad.jpg?ssl=1",
    },
    Saturday: {
      lunch: "Roti - 2 pcs, Salad - 1 cup, Prawn curry - 1 cup",
      dinner: "Chicken tikka salad - 1 bowl, Green soup - 1 cup",
      protein: 1080,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5uIOh3EPUwjM8NQ5vUnhXSt-fYvJiKc1tk-SReHmnl6B9jNI7YqCO9w-YmV-7fOFLfDs&usqp=CAU",
    },
    Sunday: {
      lunch: "Pea rice - 1 cup, Mutton stew curry - 1 cup, Lemon greek salad - 1 cup",
      dinner: "Grilled fish sprout salad - 1 bowl, Lemon coriander soup - 1 cup",
      protein: 1095,
      img: "https://uploads.prod01.london.platform-os.com/instances/232/assets/images/recipes/Pulled-pork-square.jpg?updated=1574697006",
    },
  },
};

const MyMealPlans = () => {
  const [mealType, setMealType] = useState("Veg");
  const [meals, setMeals] = useState(weekData[mealType]);

  useEffect(() => {
    setMeals(weekData[mealType]);
  }, [mealType]);

  const isVeg = mealType === "Veg";
  const themeColor = isVeg ? "green" : "red";

  return (
    <div className="max-w-7xl mx-auto py-16 bg-gradient-to-br from-orange-50 via-white to-green-50 min-h-screen p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-8"
      >
        <h1 className="text-3xl font-bold">My Meal Plans</h1>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
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

export default MyMealPlans;
