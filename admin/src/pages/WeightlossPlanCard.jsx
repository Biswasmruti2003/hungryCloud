import PlanTemplate from "../components/PlanTemplate";

const durations = [
  { label: "3 day", veg: 179, nonVeg: 189, days: 3 },
  { label: "7 day", veg: 179, nonVeg: 189, days: 7 },
  { label: "21 day", veg: 175, nonVeg: 185, days: 21 },
  { label: "28 day", veg: 169, nonVeg: 179, days: 28 },
];

const WeightlossPlanCard = () => {
  return (
    <PlanTemplate
      heading="Weightloss"
      description="Burn fat and feel light with calorie-smart meals — tailored to your slot and schedule."
      planName="Weightloss Plan"
      durations={durations}
      images={{
        veg: "https://blog.buywow.in/wp-content/uploads/2024/02/jpeg-optimizer_flay-lay-scale-weights-1.jpg",
        nonVeg:
          "https://s3.india.com/wp-content/uploads/2023/09/Weight-Loss-With-Meat-4-Reasons-Why-Lean-Meat-is-The-Best-Choice-For-Those-Trying-to-Shed-Belly-Fat.jpg",
      }}
      primaryBadgeText="Weightloss"
      vegBadgeText="Low Cal Veg"
    />
  );
};

export default WeightlossPlanCard;
