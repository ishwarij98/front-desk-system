import { useState } from "react";
import Modal from "../components/Modal";

export default function DoctorsPage() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointments, setAppointments] = useState({}); // doctorName -> appointments array

  const doctors = [
    { name: "Dr. Smith", specialty: "General Practice", status: "Available", next: "Now", color: "bg-green-200 text-green-900" },
    { name: "Dr. Johnson", specialty: "Pediatrics", status: "Busy", next: "2:30 PM", color: "bg-yellow-200 text-yellow-900" },
    { name: "Dr. Lee", specialty: "Cardiology", status: "Off Duty", next: "Tomorrow 9:00 AM", color: "bg-red-200 text-red-900" }
  ];

  const [newAppointment, setNewAppointment] = useState({
    date: "",
    time: "",
    patient: ""
  });

  // Add new appointment
  const handleAddAppointment = () => {
    if (!newAppointment.date || !newAppointment.time || !newAppointment.patient) {
      alert("Please fill all fields!");
      return;
    }

    setAppointments((prev) => {
      const updated = { ...prev };
      if (!updated[selectedDoctor.name]) updated[selectedDoctor.name] = [];
      updated[selectedDoctor.name].push({ ...newAppointment });
      return updated;
    });

    setNewAppointment({ date: "", time: "", patient: "" });
  };

  // Delete appointment
  const handleDeleteAppointment = (index) => {
    setAppointments((prev) => {
      const updated = { ...prev };
      updated[selectedDoctor.name].splice(index, 1);
      if (updated[selectedDoctor.name].length === 0) {
        delete updated[selectedDoctor.name]; // remove if empty
      }
      return updated;
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Front Desk Dashboard</h1>

      <div className="bg-zinc-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Available Doctors</h2>

        <div className="space-y-4">
          {doctors.map((doctor, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-zinc-900 p-4 rounded-lg"
            >
              <div>
                <h3 className="font-bold">{doctor.name}</h3>
                <p className="text-zinc-400">{doctor.specialty}</p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${doctor.color}`}
                >
                  {doctor.status}
                </span>
                <p className="text-zinc-400 text-sm">
                  Next available: {doctor.next}
                </p>
                <button
                  onClick={() => setSelectedDoctor(doctor)}
                  className="bg-white text-black px-4 py-2 rounded-md font-semibold hover:bg-zinc-200"
                >
                  View Schedule
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedDoctor && (
        <Modal
          title={`Schedule for ${selectedDoctor.name}`}
          onClose={() => setSelectedDoctor(null)}
        >
          {/* Appointments list */}
          {appointments[selectedDoctor.name] &&
          appointments[selectedDoctor.name].length > 0 ? (
            <table className="w-full text-left border-collapse mb-4">
              <thead>
                <tr className="text-zinc-400">
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Time</th>
                  <th className="py-2 px-3">Patient</th>
                  <th className="py-2 px-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments[selectedDoctor.name].map((slot, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-zinc-700 hover:bg-zinc-900"
                  >
                    <td className="py-2 px-3">{slot.date}</td>
                    <td className="py-2 px-3">{slot.time}</td>
                    <td className="py-2 px-3">{slot.patient}</td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => handleDeleteAppointment(idx)}
                        className="bg-black-300 hover:bg-red-300 text-white px-2 rounded"
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-400 mb-4">
              No scheduled appointments yet.
            </p>
          )}

          {/* Form: Add new appointment */}
          <div className="space-y-3">
            <input
              type="date"
              value={newAppointment.date}
              onChange={(e) =>
                setNewAppointment({ ...newAppointment, date: e.target.value })
              }
              className="w-full px-2 py-1 rounded bg-zinc-800 text-white"
            />
            <input
              type="time"
              value={newAppointment.time}
              onChange={(e) =>
                setNewAppointment({ ...newAppointment, time: e.target.value })
              }
              className="w-full px-2 py-1 rounded bg-zinc-800 text-white"
            />
            <input
              type="text"
              placeholder="Patient Name"
              value={newAppointment.patient}
              onChange={(e) =>
                setNewAppointment({ ...newAppointment, patient: e.target.value })
              }
              className="w-full px-2 py-1 rounded bg-zinc-800 text-white"
            />
            <button
              onClick={handleAddAppointment}
              className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-semibold"
            >
              Add Appointment
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
