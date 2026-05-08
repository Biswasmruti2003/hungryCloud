import PlanTemplate from "../components/PlanTemplate";

const durations = [
  { label: "3 day", veg: 219, nonVeg: 239, days: 3 },
  { label: "7 day", veg: 219, nonVeg: 239, days: 7 },
  { label: "21 day", veg: 215, nonVeg: 235, days: 21 },
  { label: "28 day", veg: 209, nonVeg: 229, days: 28 },
];

const CustomMealPlanCard = () => {
  return (
    <PlanTemplate
      heading="Custom Meal"
      description="Tell us your goals and preferences — we’ll build a plan that fits your lifestyle and schedule."
      planName="Custom Meal Plan"
      durations={durations}
      images={{
        veg: "https://t4.ftcdn.net/jpg/01/81/12/37/360_F_181123726_invADRiRZle7YWLYfkEHz0mUfWH60kVZ.jpg",
        nonVeg:
          "https://divinenutrition.in/cdn/shop/articles/Foods_Photo_Collage.png?v=1716820587&width=1100",
      }}
      primaryBadgeText="Personalized"
      vegBadgeText="Balanced Veg"
    />
  );
};

export default CustomMealPlanCard;
