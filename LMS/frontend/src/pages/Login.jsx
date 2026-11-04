import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = await login(email, password);

      if (user.role === "admin") navigate("/admin");
      else if (user.role === "instructor") navigate("/instructor");
      else navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex justify-center items-center p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-2xl p-8 w-full max-w-md shadow-lg"
        >
          <h1 className="text-3xl font-bold text-center">Welcome Back</h1>
          <p className="text-gray-500 text-center mt-2">
            Login to continue learning
          </p>

          {error && <p className="text-red-500 mt-4">{error}</p>}

          <label className="block mt-6">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg p-3 mt-2"
          />

          <label className="block mt-4">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-3 mt-2"
          />

          <button className="w-full bg-indigo-600 text-white p-3 rounded-lg mt-6">
            Login
          </button>

          <p className="text-center mt-5">
            Don't have an account? <Link to="/register" className="text-indigo-600">Register</Link>
          </p>
        </form>
      </div>
    </MainLayout>
  );
}
