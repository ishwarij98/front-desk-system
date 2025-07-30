// src/pages/dashboard.jsx
'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";        // ✅ Named import
import Tabs from "../components/Tabs";
import QueueManagement from "../components/QueueManagement";
import AppointmentManagement from "../components/AppointmentManagement";
import DoctorsPage from "./doctors";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("queue");
  const [userRole, setUserRole] = useState("staff");
  const router = useRouter();

  // Decode token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    try {
      const { role } = jwtDecode(token);       // ✅ now using named import
      setUserRole(role || "staff");
    } catch {
      router.replace("/login");
    }
  }, [router]);

  // Build tabs by role
  const tabs = [
    { key: "queue", label: "Queue Management" },
    { key: "appointments", label: "Appointment Management" },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <h1 className="text-2xl font-bold mb-4 px-6">Front Desk Dashboard</h1>

      <div className="px-6">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
      </div>

      <div className="p-6 rounded-lg mt-2 bg-gray-900 mx-6">
        {activeTab === "queue" && <QueueManagement />}
        {activeTab === "appointments" && <AppointmentManagement />}
        {activeTab === "doctors" && <DoctorsPage />}
      </div>
    </div>
  );
}
