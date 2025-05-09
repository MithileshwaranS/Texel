import React from "react";
import { FaBoxOpen } from "react-icons/fa";

function Inventory() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold flex items-center mb-6">
        <FaBoxOpen className="mr-2" />
        Inventory Management
      </h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p>Inventory tracking and management will appear here.</p>
      </div>
    </div>
  );
}

export default Inventory;