// src/pages/_app.jsx
import { useEffect, useState, createContext, useContext } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout"; 
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";

const ThemeContext = createContext();
export function useTheme() {
  return useContext(ThemeContext);
}

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const publicPages = ["/login", "/signup"];
  const isPublicPage = publicPages.includes(router.pathname);

  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);

  // ✅ Only run once on initial mount
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token && !isPublicPage) {
      router.replace("/login");
    } else if (token && isPublicPage) {
      router.replace("/dashboard");
    } else {
      setLoading(false);
    }
  }, [router.pathname]);

  // ✅ Apply dark mode globally
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <Toaster position="top-right" reverseOrder={false} />
      {isPublicPage ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </ThemeContext.Provider>
  );
}
