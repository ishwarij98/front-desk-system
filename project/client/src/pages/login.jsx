import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode"; // ✅ Correct for E
// ✅ Default import

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("⚠️ Please fill all fields!");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password }
      );

      const token = res.data.token;
      localStorage.setItem("token", token);

      // ✅ Decode token
      const decoded = jwtDecode(token);
      console.log("Decoded JWT:", decoded);

      const userRole = (decoded?.role || "").toLowerCase();

      toast.success(` Welcome back, ${userRole}!`);

      // ✅ Redirect everyone to the main dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error?.response?.data?.message ||
          " Invalid credentials! Please try again."
      );
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
