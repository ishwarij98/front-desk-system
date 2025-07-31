// src/pages/login.jsx
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode"; // default import

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // fallback if env var missing
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("⚠️ Please fill all fields!");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${apiUrl}/auth/login`,
        { email, password }
      );

      const { token } = res.data;
      localStorage.setItem("token", token);

      // decode your JWT so you can read the role
      const { role } = jwtDecode(token);
      const userRole = (role || "staff").toLowerCase();
      toast.success(`✅ Welcome back, ${userRole}!`);

      // redirect however you like
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err.response?.data?.message ||
        "❌ Login failed! Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <form
        onSubmit={handleLogin}
        className="bg-zinc-900 p-8 rounded-lg w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 bg-zinc-800 rounded"
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 bg-zinc-800 rounded"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading ? "bg-gray-600" : "bg-green-600 hover:bg-green-700"
          } px-4 py-2 rounded text-white font-semibold`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-sm text-center text-gray-400">
          Don't have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}
