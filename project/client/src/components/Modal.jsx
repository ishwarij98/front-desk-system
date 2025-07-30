export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-zinc-900 text-white p-6 rounded-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          ✖
        </button>
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="text-sm text-gray-400 mb-4">Enter the appointment details.</p>
        {children}
      </div>
    </div>
  );
}
