import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Modal from "./Modal";

export default function Header() {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("✅ Logged out successfully!");
    router.push("/login");
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-gray-800">
      <h1 className="text-lg font-bold">Front Desk System</h1>
      <div className="flex gap-4 items-center">
        {/* Logout */}
        <button
          onClick={() => setShowConfirm(true)}
          className="bg-red-600 px-3 py-1 rounded text-white"
        >
          Logout
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showConfirm && (
        <Modal title="Confirm Logout" onClose={() => setShowConfirm(false)}>
          <p className="text-sm text-gray-300 mb-4">
            Are you sure you want to logout?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              className="bg-gray-600 px-4 py-2 rounded text-white"
            >
              No
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
            >
              Yes, Logout
            </button>
          </div>
        </Modal>
      )}
    </header>
  );
}
