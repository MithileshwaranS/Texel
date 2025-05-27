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
  FaCalculator,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdOutlineDesignServices } from "react-icons/md";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import HeaderItem from "./components/common/HeaderItem";
import DesignSheet from "./pages/DesignSheet";
import Dashboard from "./pages/Dashboard";
import Costing from "./pages/CostingPage";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import Customers from "./pages/Customers";
import Settings from "./pages/Settings";
import DesignDetail from "./components/common/DesignDetail";
import NewDesign from "./pages/NewDesign";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: "dashboard", icon: FaHome, label: "Dashboard", path: "/" },
    { id: "costing", icon: FaCalculator, label: "Costing", path: "/costing" },
    {
      id: "design",
      icon: MdOutlineDesignServices,
      label: "Design",
      path: "/design",
    },
    {
      id: "inventory",
      icon: FaBoxOpen,
      label: "Inventory",
      path: "/inventory",
    },
    { id: "reports", icon: FaChartLine, label: "Reports", path: "/reports" },
    { id: "customers", icon: FaUsers, label: "Customers", path: "/customers" },
    { id: "settings", icon: FaCog, label: "YarnDetails", path: "/settings" },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Only show header if user is authenticated */}
      {localStorage.getItem("userId") && (
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <FaIndustry className="text-blue-600 text-2xl mr-2" />
                <span className="text-xl font-bold text-gray-800">Texel</span>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:block">
                <ul className="flex items-center space-x-2">
                  {navItems.map((item) => (
                    <HeaderItem
                      key={item.id}
                      icon={item.icon}
                      label={item.label}
                      active={location.pathname === item.path}
                      onClick={() => navigate(item.path)}
                    />
                  ))}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <FaSignOutAlt className="mr-2" size={14} />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </li>
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

            {/* Mobile Navigation - Add Logout to mobile menu */}
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
                  <HeaderItem
                    icon={FaSignOutAlt}
                    label="Logout"
                    onClick={handleLogout}
                    className="text-red-600 hover:bg-red-50"
                  />
                </ul>
              </nav>
            )}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4">
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/costing"
            element={
              <ProtectedRoute>
                <Costing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/design"
            element={
              <ProtectedRoute>
                <DesignSheet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <Inventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/new-design"
            element={
              <ProtectedRoute>
                <NewDesign />
              </ProtectedRoute>
            }
          />
          <Route
            path="/designdetails/:designId"
            element={
              <ProtectedRoute>
                <DesignDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Catch all route - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
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
