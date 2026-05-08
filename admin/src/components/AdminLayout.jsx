// layouts/AdminLayout.jsx
import AdminSidebar from "../components/AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
