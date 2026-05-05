import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../api"; // Axios instance

const AdminLogin = () => {
  const [input, setInput] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/api/admin/login", input);

      if (res.data.success) {
        localStorage.setItem("adminToken", res.data.token);
        navigate("/admin-dashboard");
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-orange-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 shadow-xl rounded-lg max-w-md w-full space-y-5 animate-fade-in"
      >
        <h2 className="text-3xl font-bold text-green-800 text-center">🔐 Admin Login</h2>

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded text-center">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Admin Email"
          required
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          value={input.email}
          onChange={(e) => setInput({ ...input, email: e.target.value })}
        />

        {/* Password field with toggle visibility */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400 pr-10"
            value={input.password}
            onChange={(e) => setInput({ ...input, password: e.target.value })}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-600"
          >
            {showPassword ?  <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-all disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
