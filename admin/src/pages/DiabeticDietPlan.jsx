import PlanTemplate from "../components/PlanTemplate";

const durations = [
  { label: "3 day", veg: 229, nonVeg: 249, days: 3 },
  { label: "7 day", veg: 229, nonVeg: 249, days: 7 },
  { label: "21 day", veg: 229, nonVeg: 249, days: 21 },
  { label: "28 day", veg: 219, nonVeg: 239, days: 28 },
];

const DiabeticDietPlan = () => {
  return (
    <PlanTemplate
      heading="Diabetic"
      description="Low-GI, diabetic-friendly meals to keep energy steady — tailored to your slot and schedule."
      planName="Diabetic Diet Plan"
      durations={durations}
      images={{
        veg: "https://media.istockphoto.com/id/1221739066/photo/low-glycemic-healthy-foods-for-diabetic-diet.jpg?s=612x612&w=0&k=20&c=lHeG470HJzvTh-Zj74IE6EaqLSvjjsZ7enRllqhzccg=",
        nonVeg:
          "https://uploads-ssl.webflow.com/61a0875915332c1fd8109f03/6464bf0be81b76287a4bee70_imageedit_1_4290061612.webp",
      }}
      primaryBadgeText="Diabetic Friendly"
      vegBadgeText="Low GI Veg"
    />
  );
};

export default DiabeticDietPlan;
