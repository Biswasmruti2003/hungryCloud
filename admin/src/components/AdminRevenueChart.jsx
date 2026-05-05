import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale } from "chart.js";
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale);

const AdminRevenueChart = ({ labels, values }) => {
  const data = {
    labels,
    datasets: [
      {
        label: "Weekly Revenue (₹)",
        data: values,
        fill: false,
        borderColor: "rgba(34, 197, 94, 1)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-10 max-w-4xl mx-auto">
      <h3 className="font-bold mb-2 text-green-700">📈 Revenue Overview</h3>
      <Line data={data} />
    </div>
  );
};

export default AdminRevenueChart;
