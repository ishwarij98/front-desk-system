// src/components/Tabs.jsx

/**
 * Renders a set of tabs.
 *
 * @param {string} activeTab    - The key of the currently active tab.
 * @param {(key: string) => void} setActiveTab - Function to change the active tab.
 * @param {{ key: string; label: string }[]} tabs - Array of tabs to render.
 */
export default function Tabs({ activeTab, setActiveTab, tabs }) {
  return (
    <div className="flex space-x-4 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.key} // Unique key for React
          className={`px-4 py-2 rounded ${
            // Highlight active tab
            activeTab === tab.key
              ? "bg-zinc-700 text-white"
              : "bg-zinc-800 text-gray-400"
          }`}
          onClick={() => setActiveTab(tab.key)} // Switch tab on click
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
