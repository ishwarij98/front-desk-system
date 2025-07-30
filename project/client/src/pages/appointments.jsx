// src/pages/all-appointments.jsx
import Layout from "../components/Layout";

export default function AllAppointmentsPage() {
  const appointments = [
    {
      patient: "Alice Brown",
      doctor: "Dr. Smith",
      date: "27 Dec 2024",
      time: "10:00 AM",
      status: "Booked",
      color: "bg-blue-200 text-blue-900",
    },
    {
      patient: "Charlie Davis",
      doctor: "Dr. Johnson",
      date: "27 Dec 2024",
      time: "11:30 AM",
      status: "Completed",
      color: "bg-green-200 text-green-900",
    },
    {
      patient: "Eva White",
      doctor: "Dr. Lee",
      date: "28 Dec 2024",
      time: "2:00 PM",
      status: "Cancelled",
      color: "bg-red-200 text-red-900",
    },
  ];

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Front Desk Dashboard</h1>

      <div className="bg-zinc-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">All Appointments</h2>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-zinc-400">
              <th className="py-2 px-4">Patient</th>
              <th className="py-2 px-4">Doctor</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Time</th>
              <th className="py-2 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt, idx) => (
              <tr
                key={idx}
                className="border-b border-zinc-700 hover:bg-zinc-900"
              >
                <td className="py-2 px-4">{appt.patient}</td>
                <td className="py-2 px-4">{appt.doctor}</td>
                <td className="py-2 px-4">{appt.date}</td>
                <td className="py-2 px-4">{appt.time}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${appt.color}`}
                  >
                    {appt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
