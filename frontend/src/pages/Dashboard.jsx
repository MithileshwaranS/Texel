import React from "react";
import { FaHome } from "react-icons/fa";

function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold flex items-center mb-6">
        <FaHome className="mr-2" />
        Dashboard
      </h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p>Welcome to your textile management dashboard. Overview metrics and quick actions will appear here.</p>
      </div>
    </div>
  );
}

export default Dashboard;