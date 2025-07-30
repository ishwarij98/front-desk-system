// src/components/Layout.jsx
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar stays fixed */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1">
        <Header />
        {/* Wrap page content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
