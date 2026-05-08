import PlanTemplate from "../components/PlanTemplate";

const durations = [
  { label: "3 day", veg: 169, nonVeg: 179, days: 3 },
  { label: "7 day", veg: 169, nonVeg: 179, days: 7 },
  { label: "21 day", veg: 169, nonVeg: 179, days: 21 },
  { label: "28 day", veg: 159, nonVeg: 169, days: 28 },
];

const EmployeePlan = () => {
  return (
    <PlanTemplate
      heading="Employee Meal"
      description="Reliable, wholesome meals for busy workdays — tailored to your slot and schedule."
      planName="Office Employee Meal Plan"
      durations={durations}
      images={{
        veg: "https://media.istockphoto.com/id/1147252758/photo/healthy-vegetarian-food-background-vegetables-pesto-and-lentil-curry-with-tofu.jpg?s=612x612&w=0&k=20&c=tfLYLtT-f_I-tnmOdb_6WHRhIQa8jXy7SkFakC-P-LU=",
        nonVeg:
          "https://150888732.cdn6.editmysite.com/uploads/1/5/0/8/150888732/STOP25NRISI2TYYOU3ZUGJTM.png",
      }}
      primaryBadgeText="Employee Plan"
      vegBadgeText="Office Veg"
    />
  );
};

export default EmployeePlan;
