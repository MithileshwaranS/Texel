import React from "react";
import { FaChartLine } from "react-icons/fa";

function Reports() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold flex items-center mb-6">
        <FaChartLine className="mr-2" />
        Reports
      </h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p>Analytics and reporting tools will appear here.</p>
      </div>
    </div>
  );
}

export default Reports;