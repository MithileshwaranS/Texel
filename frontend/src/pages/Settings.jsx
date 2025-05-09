import React from "react";
import { FaCog } from "react-icons/fa";

function Settings() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold flex items-center mb-6">
        <FaCog className="mr-2" />
        Settings
      </h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p>Application configuration and user settings will appear here.</p>
      </div>
    </div>
  );
}

export default Settings;