import React from "react";
import { FaUsers } from "react-icons/fa";

function Customers() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold flex items-center mb-6">
        <FaUsers className="mr-2" />
        Customer Management
      </h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p>Customer information and order history will appear here.</p>
      </div>
    </div>
  );
}

export default Customers;