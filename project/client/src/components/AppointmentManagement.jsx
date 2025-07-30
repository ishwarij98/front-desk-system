'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "./Modal";

export default function AppointmentManagement() {
  // State to hold list of appointments fetched from backend
  const [appointments, setAppointments] = useState([]);
  // State to toggle modal visibility for scheduling new appointment
  const [showModal, setShowModal] = useState(false);
  // State to hold form values for new appointment
  const [formData, setFormData] = useState({
    patientName: "",
    doctorId: "",
    appointmentDateTime: "",
    notes: "",
  });
  // State for filtering and loading
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  // Function to get token from localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  /**
   * Fetch all appointments from backend on component load
   */
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments`,
        { headers: getAuthHeaders() }
      );
      setAppointments(res.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      alert("❌ Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle new appointment submission
   */
  const handleAddAppointment = async () => {
    const { patientName, doctorId, appointmentDateTime, notes } = formData;
    if (!patientName || !doctorId || !appointmentDateTime) {
      alert("⚠️ Please fill in all required fields");
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments`,
        { patientName, doctorId: parseInt(doctorId), appointmentDateTime, notes },
        { headers: getAuthHeaders() }
      );

      alert("✅ Appointment scheduled!");
      setShowModal(false);
      setFormData({ patientName: "", doctorId: "", appointmentDateTime: "", notes: "" });
      fetchAppointments(); // Refresh list
    } catch (error) {
      console.error("Error adding appointment:", error);
      alert("❌ Failed to schedule appointment");
    }
  };

  /**
   * Handle appointment cancellation
   */
  const handleCancelAppointment = async (id) => {
    if (!confirm("❌ Are you sure you want to cancel this appointment?")) return;

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/${id}/cancel`,
        {},
        { headers: getAuthHeaders() }
      );

      alert("⚠️ Appointment cancelled");
      fetchAppointments();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      alert("❌ Failed to cancel appointment");
    }
  };

  /**
   * Load appointments when component mounts
   */
  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div>
      {/* Filters & search */}
      <div className="flex justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">Filter:</span>
          <select
            className="bg-zinc-900 text-white rounded px-2 py-1"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All</option>
            <option>booked</option>
            <option>completed</option>
            <option>cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointment List */}
      {loading ? (
        <p className="text-center">⏳ Loading appointments...</p>
      ) : (
        <div className="space-y-2">
          {appointments
            .filter((app) => filter === "All" || app.status === filter)
            .map((app) => (
              <div
                key={app.id}
                className="flex justify-between items-center bg-zinc-900 p-4 rounded-lg"
              >
                <div>
                  <h3 className="font-bold">{app.patientName}</h3>
                  <p className="text-sm text-gray-400">👨‍⚕️ Doctor ID: {app.doctorId}</p>
                  <p className="text-sm text-gray-400">⏰ {app.appointmentDateTime}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      app.status === "booked"
                        ? "bg-blue-200 text-blue-800"
                        : app.status === "completed"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {app.status}
                  </span>

                  {/* Cancel button */}
                  {app.status === "booked" && (
                    <button
                      onClick={() => handleCancelAppointment(app.id)}
                      className="bg-red-700 px-2 py-1 rounded text-white text-sm hover:bg-red-800"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Add Appointment Button */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full mt-4 bg-white text-black py-2 rounded font-semibold"
      >
        Schedule New Appointment
      </button>

      {/* Modal for scheduling new appointment */}
      {showModal && (
        <Modal title="Schedule New Appointment" onClose={() => setShowModal(false)}>
          <div className="space-y-3">
            <input
              className="w-full px-2 py-1 rounded bg-zinc-800 text-white"
              placeholder="Patient Name"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
            />
            <input
              type="number"
              className="w-full px-2 py-1 rounded bg-zinc-800 text-white"
              placeholder="Doctor ID"
              value={formData.doctorId}
              onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
            />
            <input
              type="datetime-local"
              className="w-full px-2 py-1 rounded bg-zinc-800 text-white"
              value={formData.appointmentDateTime}
              onChange={(e) =>
                setFormData({ ...formData, appointmentDateTime: e.target.value })
              }
            />
            <input
              className="w-full px-2 py-1 rounded bg-zinc-800 text-white"
              placeholder="Notes (optional)"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />

            <button
              onClick={handleAddAppointment}
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
