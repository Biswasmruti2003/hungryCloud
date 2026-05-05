import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [input, setInput] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!input.identifier || !input.password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data = await res.json();

      if (data.success) {
        login(data.user); // ✅ save user in context
        localStorage.setItem("token", data.token); // token in localStorage
        localStorage.setItem("justLoggedIn", "true"); // ✅ for address popup logic
        toast.success("Login successful! 🎉");

        navigate(from); // 🔁 go to intended page
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-md relative">
        <h2 className="text-3xl font-bold text-green-900 mb-4">Login</h2>
        <p className="mb-4 text-sm text-gray-600">
          Please enter your phone/email and password to continue
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            name="identifier"
            placeholder="Phone or Email"
            value={input.identifier}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={input.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 pr-10"
            />
            <div
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg transition duration-200 hover:bg-green-600"
          >
            {loading ? "Logging in..." : "Continue"}
          </button>
        </form>

        {error && (
          <p className="text-red-500 mt-3 text-center font-medium">{error}</p>
        )}

        <p className="text-sm text-gray-500 mt-6 text-center">
          By logging in you agree to our{" "}
          <Link
            to="/terms"
            className="text-green-600 underline hover:text-green-700"
          >
            terms and conditions
          </Link>
        </p>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-green-600 underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
