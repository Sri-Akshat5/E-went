import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import API_BASE_URL from "../config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      login(res.data.token, false);
      navigate("/");
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  const handleGuestLogin = () => {
    const guestToken = "guest_token_123456";
    login(guestToken, true);
    navigate("/");
  };

  return (
    <div className="pt-24 p-4 sm:p-6 min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white/80 backdrop-blur-lg shadow-xl p-6 sm:p-8 rounded-xl w-full max-w-sm sm:max-w-md">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-6">🔑 Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 sm:py-3 px-6 rounded-lg transition transform hover:scale-105 text-sm sm:text-base">
            🚀 Login
          </button>
        </form>

        <button
          onClick={handleGuestLogin}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 sm:py-3 px-6 rounded-lg mt-3 transition transform hover:scale-105 text-sm sm:text-base"
        >
          👤 Continue as Guest
        </button>

        <p className="text-center mt-4 text-gray-600 text-sm sm:text-base">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline font-semibold">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
