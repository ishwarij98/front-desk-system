import { useState } from "react";
import Tabs from "../components/Tabs";
import QueueManagement from "../components/QueueManagement";
import AppointmentManagement from "../components/AppointmentManagement";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("queue");

  return (
    <div className="bg-background text-foreground">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-4">Front Desk Dashboard</h1>

      {/* Tabs */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content */}
      <div className="p-6 rounded-lg mt-2 bg-gray-900">
        {activeTab === "queue" && <QueueManagement />}
        {activeTab === "appointments" && <AppointmentManagement />}
      </div>
    </div>
  );
}
