import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();



  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("⚠️ Please fill all fields!");
      return;
    }

    try {
      setLoading(true);
      // ✅ API request to backend
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        name,
        email,
        password,
      });
      alert("✅ Account created successfully!");
      router.push("/login");
    } catch (error) {
      console.error("Signup error:", error);
      alert(
        error?.response?.data?.message || "❌ Signup failed! Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <form
        onSubmit={handleSignup}
        className="bg-zinc-900 p-8 rounded-lg w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center mb-4">Sign Up</h1>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 bg-zinc-800 rounded"
          disabled={loading}
        />
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
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
        <p className="text-sm text-center text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
