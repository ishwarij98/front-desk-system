export default function Tabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex space-x-4 mb-4">
      <button
        className={`px-4 py-2 rounded ${
          activeTab === "queue" ? "bg-zinc-700 text-white" : "bg-zinc-800"
        }`}
        onClick={() => setActiveTab("queue")}
      >
        Queue Management
      </button>
      <button
        className={`px-4 py-2 rounded ${
          activeTab === "appointments"
            ? "bg-zinc-700 text-white"
            : "bg-zinc-800"
        }`}
        onClick={() => setActiveTab("appointments")}
      >
        Appointment Management
      </button>
    </div>
  );
}
