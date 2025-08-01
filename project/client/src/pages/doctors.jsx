"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // named import
import Modal from "../components/Modal";

export default function DoctorsPage() {
  // --- State ---
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Add/Edit Doctor modal state
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [doctorForm, setDoctorForm] = useState({
    name: "",
    specialization: "",
    gender: "Male",
    location: "",
    availability: "",
  });

  // Schedule modal state
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [apptLoading, setApptLoading] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    appointmentDateTime: "",
    patientName: "",
    notes: "",
  });

  // Auto refresh appointments every 5 sec when schedule modal is open
  useEffect(() => {
    let interval;
    if (selectedDoctor) {
      interval = setInterval(() => fetchAppointments(selectedDoctor.id), 5000);
    }
    return () => clearInterval(interval);
  }, [selectedDoctor]);

  // On mount: check role & load doctors
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const { role } = jwtDecode(token);
      setIsAdmin(role === "admin");
    } catch {
      console.warn("Invalid token");
    }
    fetchDoctors();
  }, []);

  // Fetch all doctors
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/doctors`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDoctors(data);
    } catch (err) {
      console.error("❌ Error fetching doctors:", err);
      alert("Failed to load doctors.");
    } finally {
      setLoading(false);
    }
  };

  // --- Doctor CRUD ---
  const openAddDoctor = () => {
    setEditingDoctor(null);
    setDoctorForm({
      name: "",
      specialization: "",
      gender: "Male",
      location: "",
      availability: "",
    });
    setShowDoctorModal(true);
  };

  const openEditDoctor = (doc) => {
    setEditingDoctor(doc);
    setDoctorForm({
      name: doc.name,
      specialization: doc.specialization,
      gender: doc.gender,
      location: doc.location,
      availability: doc.availability,
    });
    setShowDoctorModal(true);
  };

  const handleSaveDoctor = async () => {
    const token = localStorage.getItem("token");
    try {
      if (editingDoctor) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/doctors/${editingDoctor.id}`,
          doctorForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/doctors`,
          doctorForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setShowDoctorModal(false);
      fetchDoctors();
    } catch (err) {
      console.error("❌ Error saving doctor:", err);
      alert("Failed to save doctor.");
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!confirm("Delete this doctor?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/doctors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDoctors();
    } catch (err) {
      console.error("❌ Error deleting doctor:", err);
      alert("Failed to delete doctor.");
    }
  };

  // --- Schedule handlers ---
  const fetchAppointments = async (doctorId) => {
    setApptLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments?doctorId=${doctorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Filter cancelled appointments (if backend not updated yet)
      setAppointments(data.filter((appt) => appt.status !== "cancelled"));
    } catch (err) {
      console.error("❌ Error fetching appointments:", err);
      alert("Failed to load appointments.");
    } finally {
      setApptLoading(false);
    }
  };

  const handleAddAppointment = async () => {
    if (!newAppointment.patientName || !newAppointment.appointmentDateTime) {
      alert("⚠️ Please fill all fields!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments`,
        {
          ...newAppointment,
          doctorId: selectedDoctor.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments((prev) => [...prev, data]);
      setNewAppointment({
        appointmentDateTime: "",
        patientName: "",
        notes: "",
      });
    } catch (err) {
      console.error("❌ Error adding appointment:", err);
      alert("Failed to add appointment.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Doctor Profiles</h1>

      {/* Add Doctor Button (Admin only) */}
      {isAdmin && (
        <button
          onClick={openAddDoctor}
          className="mb-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
        >
          + Add Doctor
        </button>
      )}

      <div className="bg-zinc-800 p-6 rounded-lg">
        {loading ? (
          <p className="text-gray-400">Loading doctors…</p>
        ) : doctors.length === 0 ? (
          <p className="text-gray-400">No doctors available.</p>
        ) : (
          <div className="space-y-4">
            {doctors.map((doc, idx) => (
              <div
                key={doc.id}
                className="flex items-center justify-between bg-zinc-900 p-4 rounded-lg"
              >
                <div>
                  <h3 className="font-bold text-lg">
                    #{idx + 1} {doc.name}
                  </h3>
                  <p className="text-zinc-400">{doc.specialization}</p>
                  <p className="text-zinc-400 text-sm">
                    🧑‍⚕️ {doc.gender} 📍 {doc.location}
                  </p>
                  <p className="text-zinc-400 text-sm">
                    ⏰ Availability: {doc.availability}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedDoctor(doc);
                      fetchAppointments(doc.id);
                    }}
                    className="bg-white text-black px-4 py-2 rounded-md font-semibold hover:bg-zinc-200"
                  >
                    View Schedule
                  </button>

                  {isAdmin && (
                    <>
                      <button
                        onClick={() => openEditDoctor(doc)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteDoctor(doc.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Doctor Modal */}
      {showDoctorModal && (
        <Modal
          title={editingDoctor ? "Edit Doctor" : "Add Doctor"}
          onClose={() => setShowDoctorModal(false)}
        >
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Name"
              value={doctorForm.name}
              onChange={(e) =>
                setDoctorForm({ ...doctorForm, name: e.target.value })
              }
              className="w-full px-2 py-1 rounded bg-zinc-800 text-white"
            />
            <input
              type="text"
              placeholder="Specialization"
              value={doctorForm.specialization}
              onChange={(e) =>
                setDoctorForm({
                  ...doctorForm,
                  specialization: e.target.value,
                })
              }
              className="w-full px-2 py-1 rounded bg-zinc-800 text-white"
            />
            <select
              value={doctorForm.gender}
              onChange={(e) =>
                setDoctorForm({ ...doctorForm, gender: e.target.value })
              }
              className="w-full px-2 py-1 rounded bg-zinc-800 text-white"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <input
              type="text"
              placeholder="Location"
              value={doctorForm.location}
              onChange={(e) =>
                setDoctorForm({ ...doctorForm, location: e.target.value })
              }
              className="w-full px-2 py-1 rounded bg-zinc-800 text-white"
            />
            <input
              type="text"
              placeholder="Availability (e.g. Mon-Fri 9-5)"
              value={doctorForm.availability}
              onChange={(e) =>
                setDoctorForm({ ...doctorForm, availability: e.target.value })
              }
              className="w-full px-2 py-1 rounded bg-zinc-800 text-white"
            />
            <button
              onClick={handleSaveDoctor}
              className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-semibold"
            >
              Save
            </button>
          </div>
        </Modal>
      )}

      {/* Schedule Modal */}
      {selectedDoctor && (
        <Modal
          title={`Schedule for ${selectedDoctor.name}`}
          onClose={() => setSelectedDoctor(null)}
        >
          {/* Appointment list */}
          <div className="max-h-[40vh] overflow-y-auto mb-4">
            {apptLoading ? (
              <p className="text-gray-400">Loading appointments…</p>
            ) : appointments.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-zinc-400 sticky top-0 bg-zinc-800">
                    <th className="py-2 px-3">#</th>
                    <th className="py-2 px-3">Date & Time</th>
                    <th className="py-2 px-3">Patient</th>
                    <th className="py-2 px-3">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt, i) => (
                    <tr
                      key={appt.id}
                      className="border-b border-zinc-700 hover:bg-zinc-900"
                    >
                      <td className="py-2 px-3">{i + 1}</td>
                      <td className="py-2 px-3">
                        {new Date(appt.appointmentDateTime).toLocaleString()}
                      </td>
                      <td className="py-2 px-3">{appt.patientName}</td>
                      <td className="py-2 px-3">{appt.notes || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-400">No appointments scheduled.</p>
            )}
          </div>

          {/* Add Appointment form */}
          <div className="space-y-3">
            <input
              type="datetime-local"
              value={newAppointment.appointmentDateTime}
              onChange={(e) =>
                setNewAppointment((p) => ({
                  ...p,
                  appointmentDateTime: e.target.value,
                }))
              }
              className="w-full px-2 py-1 rounded bg-zinc-800 text-white"
            />
            <input
              type="text"
              placeholder="Patient Name"
              value={newAppointment.patientName}
              onChange={(e) =>
                setNewAppointment((p) => ({
                  ...p,
                  patientName: e.target.value,
                }))
              }
              className="w-full px-2 py-1 rounded bg-zinc-800 text-white"
            />
            <input
              type="text"
              placeholder="Notes (optional)"
              value={newAppointment.notes}
              onChange={(e) =>
                setNewAppointment((p) => ({ ...p, notes: e.target.value }))
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
