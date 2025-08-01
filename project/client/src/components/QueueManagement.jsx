import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";

export default function QueueManagement() {
  const [queue, setQueue] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // New patient form state
  const [newPatient, setNewPatient] = useState({
    patientName: "",
    reason: "",
    doctorId: "",
    priority: "Normal",
  });

  useEffect(() => {
    fetchDoctors();
    fetchQueue();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/doctors`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDoctors(data);
    } catch (err) {
      console.error("❌ Error fetching doctors:", err);
    }
  };

  const getDoctorName = (id) => {
    const doctor = doctors.find((doc) => Number(doc.id) === Number(id));
    return doctor ? doctor.name : `Doctor #${id}`;
  };

  const fetchQueue = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/queue`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQueue(sortByPriority(data));
    } catch (error) {
      console.error("❌ Error fetching queue:", error);
    }
  };

  const sortByPriority = (data) =>
    data.sort((a, b) => {
      if (a.priority === "Urgent" && b.priority !== "Urgent") return -1;
      if (b.priority === "Urgent" && a.priority !== "Urgent") return 1;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

  // Update patient status or priority in queue
  const handleUpdatePatient = async (id, updateData) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/queue/${id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQueue((prev) =>
        sortByPriority(prev.map((p) => (p.id === id ? data : p)))
      );
    } catch (error) {
      console.error("❌ Error updating patient:", error);
    }
  };

  // Remove patient from queue
  const handleDeletePatient = async (id) => {
    if (!confirm("Do you really want to remove this patient from the queue?"))
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/queue/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQueue((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("❌ Error deleting patient:", error);
    }
  };

  // Add patient (via Appointments API)
  const handleAddPatient = async () => {
    if (
      !newPatient.patientName ||
      !newPatient.reason ||
      !newPatient.doctorId
    ) {
      alert("⚠️ Please fill all required fields!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments`,
        {
          patientName: newPatient.patientName,
          doctorId: newPatient.doctorId,
          appointmentDateTime: new Date().toISOString(), // now
          notes: newPatient.reason,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh queue
      fetchQueue();

      // Reset modal/form
      setShowModal(false);
      setNewPatient({
        patientName: "",
        reason: "",
        doctorId: "",
        priority: "Normal",
      });
      setSearchTerm("");
      setFilter("All");
    } catch (error) {
      console.error("❌ Error adding patient:", error);
    }
  };

  // Visible Queue after filters/search
  const visibleQueue = queue
    .filter((p) =>
      filter === "All" ? true : p.status.toLowerCase() === filter.toLowerCase()
    )
    .filter((p) =>
      p.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div>
      {/* Filter & Search */}
      <div className="flex justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">Filter:</span>
          <select
            className="bg-zinc-900 text-white rounded px-2 py-1"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All</option>
            <option>waiting</option>
            <option>with doctor</option>
            <option>done</option>
          </select>
        </div>

        <div className="flex">
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-zinc-900 text-white rounded-l px-2 py-1"
          />
          <button className="bg-white text-black px-3 rounded-r">🔍</button>
        </div>
      </div>

      {/* Queue list */}
      <div className="space-y-2">
        {visibleQueue.length === 0 ? (
          <p className="text-gray-400 text-center py-6">
            No patients found in the queue.
          </p>
        ) : (
          visibleQueue.map((patient, index) => (
            <div
              key={patient.id}
              className="flex justify-between items-center bg-zinc-900 p-4 rounded-lg hover:bg-zinc-800 transition"
            >
              {/* Index + Name */}
              <div>
                <h3 className="font-bold flex items-center gap-2">
                  <span className="text-white">{index + 1}</span>
                  {patient.priority === "Urgent" ? "🔴" : "🟢"}{" "}
                  {patient.patientName}
                </h3>
                <p className="text-sm text-gray-400">⏰ {patient.status}</p>
              </div>

              {/* Reason & Doctor */}
              <div className="text-sm">
                <p>Reason: {patient.reason}</p>
                <p>Doctor: {getDoctorName(patient.doctorId)}</p>
              </div>

              {/* Status */}
              <select
                className="bg-zinc-800 px-2 py-1 rounded text-sm"
                value={patient.status}
                onChange={(e) =>
                  handleUpdatePatient(patient.id, { status: e.target.value })
                }
              >
                <option value="waiting">Waiting</option>
                <option value="with doctor">With Doctor</option>
                <option value="done">Done</option>
              </select>

              {/* Priority */}
              <select
                className="bg-zinc-800 px-2 py-1 rounded text-sm"
                value={patient.priority || "Normal"}
                onChange={(e) =>
                  handleUpdatePatient(patient.id, { priority: e.target.value })
                }
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
              </select>

              {/* Delete */}
              <button
                onClick={() => handleDeletePatient(patient.id)}
                className="bg-red-700 px-2 py-1 rounded text-white text-sm hover:bg-red-800"
              >
                ✖
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Patient */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full mt-4 bg-white text-black py-2 rounded font-semibold"
      >
        Add New Patient to Queue
      </button>

      {/* Modal */}
      {showModal && (
        <Modal title="Add Patient" onClose={() => setShowModal(false)}>
          <div className="space-y-3">
            <input
              className="w-full px-2 py-1 rounded bg-zinc-800 text-white"
              placeholder="Patient Name"
              value={newPatient.patientName}
              onChange={(e) =>
                setNewPatient((prev) => ({
                  ...prev,
                  patientName: e.target.value,
                }))
              }
            />
            <input
              className="w-full px-2 py-1 rounded bg-zinc-800 text-white"
              placeholder="Reason"
              value={newPatient.reason}
              onChange={(e) =>
                setNewPatient((prev) => ({ ...prev, reason: e.target.value }))
              }
            />
            <select
              className="w-full px-2 py-1 rounded bg-zinc-800 text-white"
              value={newPatient.doctorId}
              onChange={(e) =>
                setNewPatient((prev) => ({
                  ...prev,
                  doctorId: e.target.value,
                }))
              }
            >
              <option value="">Select Doctor</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </select>
            <select
              className="w-full px-2 py-1 rounded bg-zinc-800 text-white"
              value={newPatient.priority}
              onChange={(e) =>
                setNewPatient((prev) => ({
                  ...prev,
                  priority: e.target.value,
                }))
              }
            >
              <option>Normal</option>
              <option>Urgent</option>
            </select>
            <button
              onClick={handleAddPatient}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white w-full"
            >
              Save
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
