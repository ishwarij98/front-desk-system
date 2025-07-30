// src/pages/all-appointments.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../components/Modal";
import toast from "react-hot-toast";

export default function AllAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Confirm + Edit modal state
  const [confirmModal, setConfirmModal] = useState({ show: false, appointmentId: null });
  const [editModal, setEditModal] = useState({ show: false, appointment: null });

  // Fetch all appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/appointments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(res.data);
      } catch (err) {
        toast.error("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // Filtered + searched list
  const visibleAppointments = appointments
    .filter((appt) => (filterStatus === "All" ? true : appt.status === filterStatus.toLowerCase()))
    .filter((appt) => appt.patientName.toLowerCase().includes(searchTerm.toLowerCase()));

  // Cancel appointment
  const handleConfirmCancel = async () => {
    const id = confirmModal.appointmentId;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a)));
      toast.success("Appointment cancelled");
    } catch (err) {
      toast.error("Failed to cancel");
    } finally {
      setConfirmModal({ show: false, appointmentId: null });
    }
  };

  // Save edits (reschedule / status)
  const handleSaveEdit = async () => {
    const appt = editModal.appointment;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/${appt.id}`,
        {
          status: appt.status,
          appointmentDateTime: appt.appointmentDateTime,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setAppointments((prev) =>
        prev.map((a) => (a.id === appt.id ? appt : a))
      );
      toast.success("Appointment updated");
      setEditModal({ show: false, appointment: null });
    } catch (err) {
      toast.error("Failed to update appointment");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">All Appointments</h1>

      {/* Filters */}
      <div className="flex justify-between items-center mb-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-zinc-900 text-white px-3 py-1 rounded"
        >
          <option>All</option>
          <option>Booked</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>

        <div className="flex">
          <input
            type="text"
            placeholder="Search patient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-zinc-900 text-white px-3 py-1 rounded-l"
          />
          <button className="bg-white text-black px-3 rounded-r">🔍</button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse bg-zinc-800 rounded-lg">
          <thead>
            <tr className="text-zinc-400">
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Patient</th>
              <th className="py-2 px-4">Doctor ID</th>
              <th className="py-2 px-4">Date & Time</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : visibleAppointments.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-400">
                  No appointments found.
                </td>
              </tr>
            ) : (
              visibleAppointments.map((appt, idx) => (
                <tr
                  key={appt.id}
                  className="border-b border-zinc-700 hover:bg-zinc-900"
                >
                  <td className="py-2 px-4">{idx + 1}</td>
                  <td className="py-2 px-4">{appt.patientName}</td>
                  <td className="py-2 px-4">{appt.doctorId}</td>
                  <td className="py-2 px-4">
                    {new Date(appt.appointmentDateTime).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 capitalize">{appt.status}</td>
                  <td className="py-2 px-4 space-x-2">
                    <button
                      onClick={() =>
                        setEditModal({ show: true, appointment: { ...appt } })
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    {appt.status !== "cancelled" && (
                      <button
                        onClick={() =>
                          setConfirmModal({ show: true, appointmentId: appt.id })
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Cancel Modal */}
      {confirmModal.show && (
        <Modal
          title="Cancel Appointment"
          onClose={() => setConfirmModal({ show: false, appointmentId: null })}
        >
          <p className="mb-4 text-gray-300">
            Are you sure you want to cancel this appointment?
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setConfirmModal({ show: false, appointmentId: null })}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
            >
              No
            </button>
            <button
              onClick={handleConfirmCancel}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
            >
              Yes, Cancel
            </button>
          </div>
        </Modal>
      )}

      {/* Edit Appointment Modal */}
      {editModal.show && (
        <Modal
          title="Edit Appointment"
          onClose={() => setEditModal({ show: false, appointment: null })}
        >
          <div className="space-y-3">
            <input
              type="datetime-local"
              value={editModal.appointment.appointmentDateTime.slice(0, 16)}
              onChange={(e) =>
                setEditModal((prev) => ({
                  ...prev,
                  appointment: {
                    ...prev.appointment,
                    appointmentDateTime: e.target.value,
                  },
                }))
              }
              className="w-full px-2 py-1 rounded bg-zinc-800 text-white"
            />

            <select
              value={editModal.appointment.status}
              onChange={(e) =>
                setEditModal((prev) => ({
                  ...prev,
                  appointment: { ...prev.appointment, status: e.target.value },
                }))
              }
              className="w-full px-2 py-1 rounded bg-zinc-800 text-white"
            >
              <option value="booked">Booked</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              onClick={handleSaveEdit}
              className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-semibold"
            >
              Save Changes
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
