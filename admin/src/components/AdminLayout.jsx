// layouts/AdminLayout.jsx
import AdminSidebar from "../components/AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 bg-gradient-to-br from-green-50 via-white to-orange-50 min-h-screen p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
