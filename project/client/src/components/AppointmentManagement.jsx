import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";

export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false); // For scheduling modal
  const [filter, setFilter] = useState("All"); // Filter state
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    appointmentId: null,
  }); // Cancel confirmation

  // New appointment form state
  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    doctorId: "",
    appointmentDateTime: "",
    notes: "",
  });

  // ✅ Fetch appointments from backend on load
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointments(res.data);
    } catch (error) {
      console.error("❌ Error fetching appointments:", error);
    }
  };

  // ✅ Cancel appointment with confirmation
  const handleCancelAppointment = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/${confirmModal.appointmentId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update state
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === confirmModal.appointmentId
            ? { ...appt, status: "cancelled" }
            : appt
        )
      );

      // Close modal
      setConfirmModal({ show: false, appointmentId: null });
    } catch (error) {
      console.error("❌ Error cancelling appointment:", error);
    }
  };

  // ✅ Add new appointment
  const handleAddAppointment = async () => {
    if (
      !newAppointment.patientName ||
      !newAppointment.doctorId ||
      !newAppointment.appointmentDateTime
    ) {
      alert("⚠️ Please fill all required fields!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments`,
        newAppointment,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAppointments((prev) => [...prev, res.data]);
      setShowModal(false);
      setNewAppointment({
        patientName: "",
        doctorId: "",
        appointmentDateTime: "",
        notes: "",
      });
    } catch (error) {
      console.error("❌ Error adding appointment:", error);
    }
  };

  return (
    <div>
      {/* Filter dropdown */}
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
            <option>cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointment list */}
      <div className="space-y-2">
        {appointments
          .filter((appt) =>
            filter === "All"
              ? true
              : appt.status.toLowerCase() === filter.toLowerCase()
          )
          .map((appt, index) => (
            <div
              key={appt.id}
              className="flex justify-between items-center bg-zinc-900 p-4 rounded-lg"
            >
              <div>
                {/* Index number */}
                <h3 className="font-bold flex items-center gap-2">
                  <span className="text-white">{index + 1}</span>{" "}
                  {appt.patientName}
                </h3>
                <p className="text-sm text-gray-400">Doctor ID: {appt.doctorId}</p>
                <p className="text-sm text-gray-400">
                  Time: {new Date(appt.appointmentDateTime).toLocaleString()}
                </p>
                {appt.notes && (
                  <p className="text-sm text-gray-400">Notes: {appt.notes}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Status Badge */}
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold capitalize ${
                    appt.status === "cancelled"
                      ? "bg-red-100 text-red-600 border border-red-400"
                      : "bg-blue-100 text-blue-600 border border-blue-400"
                  }`}
                >
                  {appt.status}
                </span>

                {/* Cancel Button (only show if NOT cancelled) */}
                {appt.status !== "cancelled" && (
                  <button
                    onClick={() =>
                      setConfirmModal({ show: true, appointmentId: appt.id })
                    }
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>

      {/* Schedule New Appointment */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full mt-4 bg-white text-black py-2 rounded font-semibold"
      >
        Schedule New Appointment
      </button>

      {/* Add Appointment Modal */}
      {showModal && (
        <Modal
          title="Schedule New Appointment"
          onClose={() => setShowModal(false)}
        >
          <div className="space-y-3">
            <input
              className="w-full px-2 py-1 rounded bg-zinc-800 text-white"
              placeholder="Patient Name"
              value={newAppointment.patientName}
              onChange={(e) =>
                setNewAppointment((prev) => ({
                  ...prev,
                  patientName: e.target.value,
                }))
              }
            />
            <select
              className="w-full px-2 py-1 rounded bg-zinc-800 text-white"
              value={newAppointment.doctorId}
              onChange={(e) =>
                setNewAppointment((prev) => ({
                  ...prev,
                  doctorId: e.target.value,
                }))
              }
            >
              <option value="">Select Doctor</option>
              <option value="1">Dr. Smith</option>
              <option value="2">Dr. Johnson</option>
            </select>
            <input
              type="datetime-local"
              className="w-full px-2 py-1 rounded bg-zinc-800 text-white"
              value={newAppointment.appointmentDateTime}
              onChange={(e) =>
                setNewAppointment((prev) => ({
                  ...prev,
                  appointmentDateTime: e.target.value,
                }))
              }
            />
            <input
              className="w-full px-2 py-1 rounded bg-zinc-800 text-white"
              placeholder="Notes (optional)"
              value={newAppointment.notes}
              onChange={(e) =>
                setNewAppointment((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
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

      {/* Cancel Confirmation Modal */}
      {confirmModal.show && (
        <Modal
          title="Cancel Appointment"
          onClose={() => setConfirmModal({ show: false, appointmentId: null })}
        >
          <p className="mb-4 text-sm text-gray-300">
            Are you sure you want to cancel this appointment?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() =>
                setConfirmModal({ show: false, appointmentId: null })
              }
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
            >
              No
            </button>
            <button
              onClick={handleCancelAppointment}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
            >
              Yes, Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
