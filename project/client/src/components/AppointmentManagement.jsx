import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";

export default function AppointmentManagement({ refreshDoctorSchedule }) {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("All");

  // Confirm cancel modal
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    appointmentId: null,
    doctorId: null,
  });

  // Confirm delete modal
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    appointmentId: null,
    doctorId: null,
  });

  // Edit appointment modal state
  const [editModal, setEditModal] = useState({
    show: false,
    appointment: null,
  });

  const [editAppointmentData, setEditAppointmentData] = useState({
    patientName: "",
    appointmentDateTime: "",
    status: "booked",
  });

  // New appointment form state
  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    doctorId: "",
    appointmentDateTime: "",
    notes: "",
  });

  // Load doctors and appointments
  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
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

  // Cancel appointment
  const handleCancelAppointment = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/${confirmModal.appointmentId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === confirmModal.appointmentId
            ? { ...appt, status: "cancelled" }
            : appt
        )
      );

      if (refreshDoctorSchedule && confirmModal.doctorId) {
        refreshDoctorSchedule(confirmModal.doctorId);
      }

      setConfirmModal({ show: false, appointmentId: null, doctorId: null });
    } catch (error) {
      console.error("❌ Error cancelling appointment:", error);
    }
  };

  // Delete appointment
  const handleDeleteAppointment = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/${deleteModal.appointmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAppointments((prev) =>
        prev.filter((appt) => appt.id !== deleteModal.appointmentId)
      );

      if (refreshDoctorSchedule && deleteModal.doctorId) {
        refreshDoctorSchedule(deleteModal.doctorId);
      }

      setDeleteModal({ show: false, appointmentId: null, doctorId: null });
    } catch (error) {
      console.error("❌ Error deleting appointment:", error);
    }
  };

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

      if (refreshDoctorSchedule && newAppointment.doctorId) {
        refreshDoctorSchedule(newAppointment.doctorId);
      }
    } catch (error) {
      console.error("❌ Error adding appointment:", error);
    }
  };

  const handleSaveEditAppointment = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/${editModal.appointment.id}`,
        {
          patientName: editAppointmentData.patientName,
          appointmentDateTime: editAppointmentData.appointmentDateTime,
          status: editAppointmentData.status,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === editModal.appointment.id
            ? { ...appt, ...editAppointmentData }
            : appt
        )
      );

      if (refreshDoctorSchedule && editModal.appointment.doctorId) {
        refreshDoctorSchedule(editModal.appointment.doctorId);
      }

      setEditModal({ show: false, appointment: null });
    } catch (error) {
      console.error("❌ Error editing appointment:", error);
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
        {appointments.filter((appt) =>
          filter === "All"
            ? true
            : appt.status.toLowerCase() === filter.toLowerCase()
        ).length === 0 ? (
          <p className="text-gray-400 text-center py-6">
            No appointments found.
          </p>
        ) : (
          appointments
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
                  <h3 className="font-bold flex items-center gap-2">
                    <span className="text-white">{index + 1}</span>{" "}
                    {appt.patientName}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Doctor: {getDoctorName(appt.doctorId)}
                  </p>

                  <p className="text-sm text-gray-400">
                    Time: {new Date(appt.appointmentDateTime).toLocaleString()}
                  </p>
                  {appt.notes && (
                    <p className="text-sm text-gray-400">Notes: {appt.notes}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold capitalize ${
                      appt.status === "cancelled"
                        ? "bg-red-100 text-red-600 border border-red-400"
                        : "bg-blue-100 text-blue-600 border border-blue-400"
                    }`}
                  >
                    {appt.status}
                  </span>

                  {/* Edit Button */}
                  <button
                    onClick={() => {
                      setEditModal({ show: true, appointment: appt });
                      setEditAppointmentData({
                        patientName: appt.patientName,
                        appointmentDateTime: appt.appointmentDateTime,
                        status: appt.status,
                      });
                    }}
                    className="bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1 rounded text-xs"
                  >
                    Edit
                  </button>

                  {/* Cancel Button */}
                  {appt.status !== "cancelled" && (
                    <button
                      onClick={() =>
                        setConfirmModal({
                          show: true,
                          appointmentId: appt.id,
                          doctorId: appt.doctorId,
                        })
                      }
                      className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Cancel
                    </button>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() =>
                      setDeleteModal({
                        show: true,
                        appointmentId: appt.id,
                        doctorId: appt.doctorId,
                      })
                    }
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
        )}
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
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))}
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

      {/* Edit Appointment Modal */}
      {editModal.show && (
        <Modal
          title="Edit Appointment"
          onClose={() => setEditModal({ show: false, appointment: null })}
        >
          <div className="space-y-3">
            <input
              type="text"
              value={editAppointmentData.patientName}
              onChange={(e) =>
                setEditAppointmentData((prev) => ({
                  ...prev,
                  patientName: e.target.value,
                }))
              }
              placeholder="Patient Name"
              className="w-full px-2 py-1 rounded bg-zinc-800 text-white"
            />
            <input
              type="datetime-local"
              value={editAppointmentData.appointmentDateTime}
              onChange={(e) =>
                setEditAppointmentData((prev) => ({
                  ...prev,
                  appointmentDateTime: e.target.value,
                }))
              }
              className="w-full px-2 py-1 rounded bg-zinc-800 text-white"
            />
            <select
              value={editAppointmentData.status}
              onChange={(e) =>
                setEditAppointmentData((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
              className="w-full px-2 py-1 rounded bg-zinc-800 text-white"
            >
              <option value="booked">Booked</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={handleSaveEditAppointment}
              className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-semibold"
            >
              Save Changes
            </button>
          </div>
        </Modal>
      )}

      {/* Cancel Confirmation Modal */}
      {confirmModal.show && (
        <Modal
          title="Cancel Appointment"
          onClose={() =>
            setConfirmModal({
              show: false,
              appointmentId: null,
              doctorId: null,
            })
          }
        >
          <p className="mb-4 text-sm text-gray-300">
            Are you sure you want to cancel this appointment?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() =>
                setConfirmModal({
                  show: false,
                  appointmentId: null,
                  doctorId: null,
                })
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

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <Modal
          title="Delete Appointment"
          onClose={() =>
            setDeleteModal({ show: false, appointmentId: null, doctorId: null })
          }
        >
          <p className="mb-4 text-sm text-gray-300">
            This will permanently remove the appointment from the database. Are
            you sure?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() =>
                setDeleteModal({
                  show: false,
                  appointmentId: null,
                  doctorId: null,
                })
              }
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
            >
              No
            </button>
            <button
              onClick={handleDeleteAppointment}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
            >
              Yes, Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
