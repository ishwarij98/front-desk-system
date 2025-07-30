import { useRouter } from "next/router";
import { useTheme } from "../pages/_app";

export default function Header() {
  const router = useRouter();
  const { darkMode, setDarkMode } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-gray-800">
      <h1 className="text-lg font-bold">Front Desk System</h1>
      <div className="flex gap-4 items-center">
        {/* Dark/Light Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-1 rounded bg-gray-600 text-white"
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>
        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-600 px-3 py-1 rounded text-white"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
