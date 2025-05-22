import {
  FaCog,
  FaPlus,
  FaTimes,
  FaEdit,
  FaTrash,
  FaSearch,
} from "react-icons/fa";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Settings() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    yarnCount: "",
    hanksWt: "",
    yarnPrice: "",
  });
  const [errors, setErrors] = useState({
    yarnCount: false,
    hanksWt: false,
    yarnPrice: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter rows based on search term
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredRows(rows);
    } else {
      const filtered = rows.filter(
        (row) =>
          row.yarn_count &&
          row.yarn_count
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredRows(filtered);
    }
  }, [searchTerm, rows]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      yarnCount: "",
      hanksWt: "",
      yarnPrice: "",
    });
  };

  const handleEditDialog = (row) => {
    setOpenDialog(true);
    setIsEditing(true);
    setCurrentId(row.id);
    setFormData({
      yarnCount: row.yarn_count,
      hanksWt: row.hanks_wt || "",
      yarnPrice: row.yarnprice || "",
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      yarnCount: "",
      hanksWt: "",
      yarnPrice: "",
    });
    setErrors({
      yarnCount: false,
      hanksWt: false,
      yarnPrice: false,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      yarnCount: !formData.yarnCount,
      hanksWt: !formData.hanksWt,
      yarnPrice: !formData.yarnPrice,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleAddYarn = async () => {
    if (!validateForm()) return;

    try {
      const endpoint = isEditing
        ? `${import.meta.env.VITE_API_BACKEND_URL}/api/editYarn/${currentId}`
        : `${import.meta.env.VITE_API_BACKEND_URL}/api/addYarn`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchYarnData();
        handleCloseDialog();
      } else {
        console.error(
          isEditing ? "Failed to update yarn." : "Failed to add yarn."
        );
      }
    } catch (error) {
      console.error(`Error ${isEditing ? "updating" : "adding"} yarn:`, error);
    }
  };

  const handleDeleteYarn = async (id) => {
    if (window.confirm("Are you sure you want to delete this yarn?")) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BACKEND_URL}/api/deleteYarn/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          await fetchYarnData();
        } else {
          console.error("Failed to delete yarn.");
        }
      } catch (error) {
        console.error("Error deleting yarn:", error);
      }
    }
  };

  const fetchYarnData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/yarnDetails`
      );
      const data = await res.json();
      setRows(data);
      setFilteredRows(data);

      if (data.length > 0) {
        const currentHeaders = Object.keys(data[0]);
        if (!currentHeaders.includes("actions")) {
          currentHeaders.push("actions");
        }
        setHeaders(currentHeaders);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchYarnData();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      {/* Main Container */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
        >
          <div className="flex items-center mb-4 md:mb-0">
            <motion.div
              whileHover={{ rotate: 30 }}
              className="p-3 rounded-lg bg-white shadow-sm border border-gray-200 text-blue-600 mr-4"
            >
              <FaCog className="text-xl" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
              <p className="text-gray-500">
                Manage your yarn details and configurations
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenDialog}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <FaPlus size={14} />
            <span>Add Yarn</span>
          </motion.button>
        </motion.div>

        {/* Content Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
        >
          {/* Card Header with Search */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center">
              <span className="w-2 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full mr-3"></span>
              <h2 className="text-lg font-semibold text-gray-800">
                Yarn Details
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search yarns..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
                Total: {filteredRows.length}{" "}
                {filteredRows.length === 1 ? "entry" : "entries"}
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="p-4 md:p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredRows.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  {searchTerm ? (
                    <FaSearch className="text-gray-400 text-3xl" />
                  ) : (
                    <FaCog className="text-gray-400 text-3xl" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-700">
                  {searchTerm
                    ? "No matching yarns found"
                    : "No yarn details found"}
                </h3>
                <p className="mt-1 text-gray-500">
                  {searchTerm
                    ? "Try a different search term"
                    : "Add your first yarn to get started"}
                </p>
                {!searchTerm && (
                  <button
                    onClick={handleOpenDialog}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaPlus className="mr-2" /> Add Yarn
                  </button>
                )}
              </div>
            ) : (
              <TableContainer
                component={Paper}
                elevation={0}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <Table sx={{ minWidth: 650 }} aria-label="yarn details table">
                  <TableHead>
                    <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                      {headers.map((header, index) => (
                        <TableCell
                          key={header}
                          align={
                            index === 0
                              ? "left"
                              : header === "actions"
                              ? "center"
                              : "right"
                          }
                          className="font-semibold text-gray-700 py-3 border-b border-gray-200"
                        >
                          {header === "actions"
                            ? "Actions"
                            : header
                                .split("_")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join(" ")}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRows.map((row, i) => (
                      <TableRow
                        key={i}
                        className={`${
                          i % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-blue-50 transition-colors duration-150`}
                      >
                        {headers.map((header) =>
                          header === "actions" ? (
                            <TableCell
                              key="actions"
                              align="center"
                              className="py-3 text-gray-600 border-b border-gray-200"
                            >
                              <div className="flex justify-center space-x-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleEditDialog(row)}
                                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
                                  title="Edit"
                                >
                                  <FaEdit />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDeleteYarn(row.id)}
                                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors"
                                  title="Delete"
                                >
                                  <FaTrash />
                                </motion.button>
                              </div>
                            </TableCell>
                          ) : (
                            <TableCell
                              key={header}
                              align={header === headers[0] ? "left" : "right"}
                              className="py-3 text-gray-600 border-b border-gray-200"
                            >
                              {row[header]}
                            </TableCell>
                          )
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Modern Modal */}
      <AnimatePresence>
        {openDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {isEditing ? "Edit Yarn" : "Add New Yarn"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {isEditing
                      ? "Update the yarn details below"
                      : "Enter the yarn details below"}
                  </p>
                </div>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  onClick={handleCloseDialog}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes />
                </motion.button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-5">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yarn Count *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="yarnCount"
                        value={formData.yarnCount}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.yarnCount
                            ? "border-red-400 focus:ring-red-300"
                            : "border-gray-300 focus:ring-blue-300"
                        } focus:ring-2 focus:border-transparent transition-all placeholder-gray-400`}
                        placeholder="e.g. 40/1"
                      />
                      {errors.yarnCount && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-500 flex items-center"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          This field is required
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hanks Weight *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="hanksWt"
                        value={formData.hanksWt}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.hanksWt
                            ? "border-red-400 focus:ring-red-300"
                            : "border-gray-300 focus:ring-blue-300"
                        } focus:ring-2 focus:border-transparent transition-all placeholder-gray-400`}
                        placeholder="e.g. 1.5 kg"
                      />
                      {errors.hanksWt && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-500 flex items-center"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          This field is required
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yarn Price *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">₹</span>
                      </div>
                      <input
                        type="text"
                        name="yarnPrice"
                        value={formData.yarnPrice}
                        onChange={handleInputChange}
                        className={`w-full pl-8 pr-4 py-3 rounded-lg border ${
                          errors.yarnPrice
                            ? "border-red-400 focus:ring-red-300"
                            : "border-gray-300 focus:ring-blue-300"
                        } focus:ring-2 focus:border-transparent transition-all placeholder-gray-400`}
                        placeholder="0.00"
                      />
                      {errors.yarnPrice && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-500 flex items-center"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          This field is required
                        </motion.p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 p-5 border-t border-gray-100 bg-gray-50">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCloseDialog}
                  className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors hover:bg-gray-200"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddYarn}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow hover:shadow-md transition-all hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  {isEditing ? "Update Yarn" : "Add Yarn"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Settings;
