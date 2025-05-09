import React, { useState, useEffect } from "react";
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
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import HeaderItem from "./components/common/HeaderItem";
import Dashboard from "./pages/Dashboard";
import Costing from "./pages/costing";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import Customers from "./pages/Customers";
import Settings from "./pages/Settings";

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: "dashboard", icon: FaHome, label: "Dashboard", path: "/" },
    { id: "costing", icon: FaCalculator, label: "Costing", path: "/costing" },
    { id: "inventory", icon: FaBoxOpen, label: "Inventory", path: "/inventory" },
    { id: "reports", icon: FaChartLine, label: "Reports", path: "/reports" },
    { id: "customers", icon: FaUsers, label: "Customers", path: "/customers" },
    { id: "settings", icon: FaCog, label: "Settings", path: "/settings" }
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <FaIndustry className="text-blue-600 text-2xl mr-2" />
              <span className="text-xl font-bold text-gray-800">Textile</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex space-x-2">
                {navItems.map((item) => (
                  <HeaderItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    active={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                  />
                ))}
              </ul>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden pb-4">
              <ul className="grid grid-cols-3 gap-2">
                {navItems.map((item) => (
                  <HeaderItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    active={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                  />
                ))}
              </ul>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/costing" element={<Costing />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
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