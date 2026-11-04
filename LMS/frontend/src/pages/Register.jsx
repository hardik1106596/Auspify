import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex justify-center items-center p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-2xl p-8 w-full max-w-md shadow-lg"
        >
          <h1 className="text-3xl font-bold text-center">Create Account</h1>

          {error && <p className="text-red-500 mt-4">{error}</p>}

          <label className="block mt-6">Full Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg p-3 mt-2"
          />

          <label className="block mt-4">Email</label>
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
            minLength={6}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-3 mt-2"
          />

          <button className="w-full bg-indigo-600 text-white p-3 rounded-lg mt-6">
            Register
          </button>

          <p className="text-center mt-5">
            Already registered? <Link to="/login" className="text-indigo-600">Login</Link>
          </p>
        </form>
      </div>
    </MainLayout>
  );
}
