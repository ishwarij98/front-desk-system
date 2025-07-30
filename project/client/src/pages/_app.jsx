import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout"; 
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const publicPages = ["/login", "/signup"];
  const isPublicPage = publicPages.includes(router.pathname);

  const [loading, setLoading] = useState(true);

  // Initial auth check
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {isPublicPage ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </>
  );
}
