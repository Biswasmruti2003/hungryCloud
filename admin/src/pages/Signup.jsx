import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(""); // general error
  const [fieldErrors, setFieldErrors] = useState({}); // field-specific errors

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Prevent spaces in phone number
  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "phone") {
      value = value.replace(/\s/g, ""); // remove spaces
    }
    setForm({ ...form, [name]: value });
  };

  // Field Validations
  const validateFields = () => {
    const errors = {};

    if (!form.name.trim() || form.name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters.";
    }
    if (
      !form.email.trim() ||
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)
    ) {
      errors.email = "Enter a valid email address.";
    }
    if (
      !form.phone ||
      !/^\d{10}$/.test(form.phone) // only 10 digits allowed
    ) {
      errors.phone = "Enter a valid 10-digit phone number.";
    }
    if (!form.password || form.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    // Local validation before API call
    if (!validateFields()) return;

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setSuccess(true);
        setForm({ name: "", email: "", phone: "", password: "" });

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-green-900 mb-4">Sign Up</h2>
        <p className="mb-4 text-sm text-gray-600">
          Create a new account to continue
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 ${
              fieldErrors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {fieldErrors.name && (
            <p className="text-red-500 text-sm">{fieldErrors.name}</p>
          )}

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 ${
              fieldErrors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {fieldErrors.email && (
            <p className="text-red-500 text-sm">{fieldErrors.email}</p>
          )}

          {/* Phone */}
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 ${
              fieldErrors.phone ? "border-red-500" : "border-gray-300"
            }`}
          />
          {fieldErrors.phone && (
            <p className="text-red-500 text-sm">{fieldErrors.phone}</p>
          )}

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 ${
              fieldErrors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {fieldErrors.password && (
            <p className="text-red-500 text-sm">{fieldErrors.password}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg transition duration-200 hover:bg-green-600"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {success && (
          <p className="text-green-600 mt-4 text-center font-medium">
            ✅ Signup successful! Redirecting...
          </p>
        )}

        {error && (
          <p className="text-red-500 mt-2 text-center">{error}</p>
        )}

        <p className="text-sm text-gray-500 mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
