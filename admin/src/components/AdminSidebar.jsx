import {
  FaTachometerAlt,
  FaUser,
  FaClipboardList,
  FaTags,
  FaCog,
  FaChartLine,
} from "react-icons/fa";
import { MdFastfood, MdPayment } from "react-icons/md";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: FaTachometerAlt, to: "/admin", exact: true },
  { label: "Users", icon: FaUser, to: "/admin/users" },
  { label: "Subscriptions", icon: FaClipboardList, to: "/admin/subscriptions" },
  // { label: "Plans", icon: MdFastfood, to: "/admin/plans" },
  // { label: "Coupons", icon: FaTags, to: "/admin/coupons" },
  // { label: "Transactions", icon: MdPayment, to: "/admin/transactions" },
  // { label: "Revenue", icon: FaChartLine, to: "/admin/revenue" },
  // { label: "Settings", icon: FaCog, to: "/admin/settings" },
];

const AdminSidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-white shadow-xl px-4 py-6 sticky top-0">
      <h2 className="text-2xl font-bold mb-10 text-green-700 text-center">Admin Panel</h2>
      <nav className="space-y-3">
        {navItems.map((item, i) => (
          <NavLink
            to={item.to}
            key={i}
            end={item.exact || false} // ✅ Only Dashboard has exact=true
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-green-100 transition ${
                isActive ? "bg-green-200 text-green-900 font-semibold" : "text-gray-700"
              }`
            }
          >
            <item.icon className="text-lg" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
