'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import Tabs from "../components/Tabs";
import QueueManagement from "../components/QueueManagement";
import AppointmentManagement from "../components/AppointmentManagement";
import DoctorsPage from "./doctors";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("queue");
  const [userRole, setUserRole] = useState("staff");
  const router = useRouter();

  // ✅ Track currently selected doctor & a reference to DoctorPage's fetch function
  const selectedDoctorRef = useRef(null);
  const fetchAppointmentsRef = useRef(null);

  // Decode token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    try {
      const { role } = jwtDecode(token);
      setUserRole(role || "staff");
    } catch {
      router.replace("/login");
    }
  }, [router]);

  // Build tabs
  const tabs = [
    { key: "queue", label: "Queue Management" },
    { key: "appointments", label: "Appointment Management" },
    { key: "doctors", label: "Doctors" },
  ];

  /**
   * ✅ Expose a refreshDoctorSchedule function for AppointmentManagement & QueueManagement
   * If Doctor's modal is open and fetchAppointments exists, refresh it.
   */
  const refreshDoctorSchedule = (doctorId) => {
    if (
      fetchAppointmentsRef.current &&
      selectedDoctorRef.current &&
      selectedDoctorRef.current.id === doctorId
    ) {
      fetchAppointmentsRef.current(doctorId);
    }
  };

  /**
   * ✅ Pass these down to DoctorsPage so it can set selectedDoctor and fetchAppointments
   * when the "View Schedule" modal is opened.
   */
  const handleSetDoctorModalContext = (doctor, fetchAppointmentsFn) => {
    selectedDoctorRef.current = doctor;
    fetchAppointmentsRef.current = fetchAppointmentsFn;
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <h1 className="text-2xl font-bold mb-4 px-6">Front Desk Dashboard</h1>

      <div className="px-6">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
      </div>

      <div className="p-6 rounded-lg mt-2 bg-gray-900 mx-6">
        {activeTab === "queue" && (
          <QueueManagement refreshDoctorSchedule={refreshDoctorSchedule} />
        )}

        {activeTab === "appointments" && (
          <AppointmentManagement refreshDoctorSchedule={refreshDoctorSchedule} />
        )}

        {activeTab === "doctors" && (
          <DoctorsPage setDoctorModalContext={handleSetDoctorModalContext} />
        )}
      </div>
    </div>
  );
}
