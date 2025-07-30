// src/pages/_app.jsx
import { useEffect, useState, createContext, useContext } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout"; 
import "../styles/globals.css";

const ThemeContext = createContext();
export function useTheme() {
  return useContext(ThemeContext);
}

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const publicPages = ["/login", "/signup"];
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  // Handle authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && !publicPages.includes(router.pathname)) {
      router.replace("/login");
    } else if (token && publicPages.includes(router.pathname)) {
      router.replace("/dashboard");
    } else {
      setLoading(false);
    }
  }, [router.pathname]);

  // Apply dark/light theme globally
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

  const isPublicPage = publicPages.includes(router.pathname);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {/* Wrap every page in Layout (except public pages) */}
      {isPublicPage ? (
        <div className="min-h-screen bg-background text-foreground">
          <Component {...pageProps} />
        </div>
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </ThemeContext.Provider>
  );
}
