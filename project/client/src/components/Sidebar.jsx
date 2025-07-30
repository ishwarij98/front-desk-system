import { useRouter } from "next/router";

export default function Sidebar() {
  const router = useRouter();

  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Doctors", path: "/doctors" },
    { name: "All Appointments", path: "/all-appointments" },
  ];

  return (
    <div className="w-60 bg-zinc-900 p-6 flex flex-col">
      {/* Logo */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black font-bold text-sm">
          🩺
        </div>
        <h2 className="text-lg font-bold">Clinic Front Desk</h2>
      </div>

      {/* Navigation */}
      <ul className="space-y-2">
        {links.map((link) => (
          <li
            key={link.path}
            onClick={() => router.push(link.path)}
            className={`cursor-pointer px-3 py-2 rounded hover:bg-zinc-800 transition ${
              router.pathname === link.path ? "bg-zinc-800 font-bold" : ""
            }`}
          >
            {link.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
