import React, { useState } from "react";
import { 
  FaHome,
  FaChartLine,
  FaCog,
  FaUsers,
  FaBoxOpen,
  FaBars,
  FaTimes,
  FaIndustry,
  FaCalculator
} from "react-icons/fa";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import NavItem from "./components/common/NavItem";
import Dashboard from "./pages/Dashboard";
import Costing from "./pages/costing";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import Customers from "./pages/Customers";
import Settings from "./pages/Settings";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const navItems = [
    { id: "dashboard", icon: FaHome, label: "Dashboard", path: "/" },
    { id: "costing", icon: FaCalculator, label: "Costing", path: "/costing" },
    { id: "inventory", icon: FaBoxOpen, label: "Inventory", path: "/inventory" },
    { id: "reports", icon: FaChartLine, label: "Reports", path: "/reports" },
    { id: "customers", icon: FaUsers, label: "Customers", path: "/customers" },
    { id: "settings", icon: FaCog, label: "Settings", path: "/settings" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out fixed h-full z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <FaIndustry className="mr-2" />
            Texile
          </h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={window.location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  if (window.innerWidth < 768) setSidebarOpen(false);
                }}
              />
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-200 ${sidebarOpen ? "md:ml-64" : ""}`}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/costing" element={<Costing />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}