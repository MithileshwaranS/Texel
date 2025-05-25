import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaLock, FaUser, FaBuilding } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import { FaShieldAlt } from "react-icons/fa";
import Logo from "../assets/logo.svg";

function LoginPage() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userId")) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Handle successful login
      localStorage.setItem("userId", data.userId);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          className: "rounded-xl shadow-lg",
          style: { background: "#363636", color: "#fff" },
          success: { style: { background: "#22c55e" } },
          error: { style: { background: "#ef4444" } },
        }}
      />

      {/* Professional background design */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-gray-50" />
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `url('/grid-pattern.svg')`,
            backgroundSize: "100px 100px",
            backgroundPosition: "center",
            maskImage:
              "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          }}
        />
      </div>

      {/* Content wrapper with improved backdrop blur */}
      <div className="relative z-10 w-full max-w-md px-4 py-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative"
        >
          {/* Enhanced Logo and Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.5, rotateY: 180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white text-blue-600 mb-4 shadow-lg p-4"
            >
              <img src={Logo} alt="" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Texel Admin Portal
            </h1>
            <p className="text-gray-600 text-sm">
              Enterprise Resource Management System
            </p>
          </div>

          {/* Enhanced Login Form */}
          <motion.div
            className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 border border-white/20 relative overflow-hidden"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Add subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-50/50 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <label className="text-xs font-semibold text-gray-600 mb-1 flex items-center uppercase tracking-wider">
                      <FaUser className="mr-2 text-blue-500" size={12} />
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={credentials.username}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/70 backdrop-blur-sm text-gray-800 shadow-sm"
                      placeholder="Enter your username"
                    />
                  </div>

                  <div className="relative">
                    <label className="text-xs font-semibold text-gray-600 mb-1 flex items-center uppercase tracking-wider">
                      <FaLock className="mr-2 text-blue-500" size={12} />
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/70 backdrop-blur-sm text-gray-800 shadow-sm"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium transition-all flex items-center justify-center shadow-lg shadow-blue-600/20 cursor-pointer
                ${
                  isLoading
                    ? "opacity-75 cursor-not-allowed"
                    : "hover:to-blue-600"
                }`}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>Sign In</>
                  )}
                </motion.button>
              </form>

              {/* Enhanced Security Section */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center mb-4">
                  <FaShieldAlt className="text-blue-500 mr-2" size={16} />
                  <p className="text-sm font-medium text-gray-700">
                    Enterprise Security
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 rounded-lg bg-gray-50/50 backdrop-blur-sm">
                    <div className="flex items-center justify-center text-xs text-gray-600">
                      <FaLock size={12} className="text-blue-500 mr-1" />
                      256-bit SSL
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50/50 backdrop-blur-sm">
                    <div className="text-xs text-gray-600">
                      ISO 27001 Certified
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Footer */}
          <p className="text-center text-xs text-gray-500 mt-8">
            &copy; {new Date().getFullYear()} Texel.
            <br />
            All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginPage;
