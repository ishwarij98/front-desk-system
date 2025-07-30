import { useState } from "react";
import Tabs from "../components/Tabs";
import QueueManagement from "../components/QueueManagement";
import AppointmentManagement from "../components/AppointmentManagement";

export default function IndexPage() {
  const [activeTab, setActiveTab] = useState("queue");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Front Desk Dashboard</h1>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="bg-zinc-800 p-6 rounded-lg">
        {activeTab === "queue" && <QueueManagement />}
        {activeTab === "appointments" && <AppointmentManagement />}
      </div>
    </div>
  );
}
