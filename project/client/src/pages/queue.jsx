import { useState } from "react";

export default function QueuePage() {
  const [queue] = useState([
    { id: 1, name: "John Doe", status: "Waiting", priority: "Normal", arrival: "09:30 AM", wait: "15 min" },
    { id: 2, name: "Jane Smith", status: "With Doctor", priority: "Normal", arrival: "09:45 AM", wait: "0 min" },
    { id: 3, name: "Bob Johnson", status: "Waiting", priority: "Urgent", arrival: "10:00 AM", wait: "5 min" },
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Queue Management</h1>
      {queue.map((patient) => (
        <div
          key={patient.id}
          className="flex items-center justify-between bg-zinc-900 p-4 rounded-lg mb-3"
        >
          <div>
            <p className="font-semibold">
              {patient.name}{" "}
              {patient.priority === "Urgent" && <span className="text-red-500">⚠</span>}
            </p>
            <p className="text-gray-400 text-sm">
              Arrival: {patient.arrival} | Wait: {patient.wait}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={patient.status}
              className="bg-black border border-gray-600 rounded px-2 py-1 text-sm"
            >
              <option>Waiting</option>
              <option>With Doctor</option>
              <option>Completed</option>
            </select>
            <select
              value={patient.priority}
              className="bg-black border border-gray-600 rounded px-2 py-1 text-sm"
            >
              <option>Normal</option>
              <option>Urgent</option>
            </select>
            <button className="bg-red-700 text-white px-2 rounded">X</button>
          </div>
        </div>
      ))}

      <button className="w-full bg-white text-black py-2 rounded font-semibold">
        Add New Patient
      </button>
    </div>
  );
}
