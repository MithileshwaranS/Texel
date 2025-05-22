import React from "react";
import { motion } from "framer-motion";
import {
  FaWeight,
  FaMoneyBillWave,
  FaCalculator,
  FaIndustry,
  FaToolbox,
  FaPercentage,
  FaTruck,
  FaFileSignature,
  FaNewspaper,
  FaCalendarAlt,
  FaTimes,
  FaPlus,
  FaImage,
  FaExpand,
  FaTrash,
} from "react-icons/fa";

const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-lg flex items-center ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    } text-white z-50`}
  >
    <span className="text-sm font-medium">{message}</span>
    <button
      onClick={onClose}
      className="ml-4 text-white hover:text-gray-200 transition-colors"
    >
      <FaTimes size={14} />
    </button>
  </motion.div>
);

export default Toast;
