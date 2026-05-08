import { FaUserMd, FaTruck, FaLeaf, FaFire } from "react-icons/fa";

const cards = [
  {
    icon: <FaUserMd className="text-4xl transition-transform group-hover:rotate-6" />,
    title: "By Nutritionists",
    desc: "Crafted by experts, our meals are tailored to you using premium, high-quality ingredients. Your health is our top priority.",
    colorFrom: "from-green-400",
    colorTo: "to-emerald-600",
  },
  {
    icon: <FaTruck className="text-4xl transition-transform group-hover:-rotate-12" />,
    title: "Free Fast Delivery",
    desc: "Home, gym, or office—we deliver anywhere! Always fresh, always on time, every time.",
    colorFrom: "from-cyan-400",
    colorTo: "to-blue-600",
  },
  {
    icon: <FaLeaf className="text-4xl transition-transform group-hover:scale-110" />,
    title: "Fresh Ingredients",
    desc: "We champion freshness: hand-picked, high-quality ingredients for maximized nutrition and flavor.",
    colorFrom: "from-lime-400",
    colorTo: "to-green-700",
  },
  {
    icon: <FaFire className="text-4xl transition-transform group-hover:scale-125" />,
    title: "Calorie Counted Meals",
    desc: "Meals with expertly calculated nutrients—balanced for taste, health, and satisfaction.",
    colorFrom: "from-pink-500",
    colorTo: "to-red-600",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="w-full  bg-gradient-to-br from-gray-100 to-white flex flex-col items-center gap-10 py-20 px-4 sm:px-6 md:px-10">
      <h2 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-800 mb-8 text-center underline decoration-green-400 decoration-4">
        WHY HUNGRYCLOUD?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-12 w-full max-w-5xl">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`
              group relative bg-white bg-opacity-60 backdrop-blur-lg rounded-2xl shadow-xl 
              border-2 border-transparent hover:border-gradient-to-tr ${card.colorFrom} ${card.colorTo}
              transition-all duration-500 ease-out p-6 sm:p-7 flex flex-col items-center text-center
              hover:scale-105 hover:shadow-2xl hover:bg-white/80
              before:absolute before:inset-0 before:rounded-2xl
              before:bg-gradient-to-br before:${card.colorFrom} before:${card.colorTo} 
              before:z-0 before:opacity-40 before:blur-lg
            `}
          >
            <span className="z-10 bg-gradient-to-tr from-white/80 to-white/40 shadow-lg p-4 rounded-full mb-4 sm:mb-5 transition-all duration-500">
              {card.icon}
            </span>
            <h3 className="z-10 font-bold text-xl sm:text-2xl mb-2 bg-gradient-to-r from-emerald-600 to-green-400 bg-clip-text text-transparent">
              {card.title}
            </h3>
            <p className="z-10 text-sm sm:text-base text-gray-700 font-medium">{card.desc}</p>
            <span className={`absolute top-0 right-0 w-3 h-3 rounded-full bg-gradient-to-tr ${card.colorFrom} ${card.colorTo} animate-ping z-0`}></span>
          </div>
        ))}
      </div>
    </section>
  );
}
