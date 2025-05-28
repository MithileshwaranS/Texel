import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPalette,
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

export default function ColorSettings() {
  const [colors, setColors] = useState([]);
  const [filteredColors, setFilteredColors] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    colorValue: "",
    colorLabel: "",
  });
  const [errors, setErrors] = useState({
    colorValue: false,
    colorLabel: false,
  });

  useEffect(() => {
    fetchColors();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredColors(colors);
    } else {
      const filtered = colors.filter((color) =>
        color.colorlabel.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredColors(filtered);
    }
  }, [searchTerm, colors]);

  const fetchColors = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/colors`
      );
      const data = await response.json();
      setColors(data);
      setFilteredColors(data);
    } catch (error) {
      console.error("Error fetching colors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ colorValue: "", colorLabel: "" });
    setErrors({ colorValue: false, colorLabel: false });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ colorValue: "", colorLabel: "" });
    setErrors({ colorValue: false, colorLabel: false });
  };

  const handleEditDialog = (color) => {
    setOpenDialog(true);
    setIsEditing(true);
    setCurrentId(color.id);
    setFormData({
      colorValue: color.colorvalue,
      colorLabel: color.colorlabel,
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
      colorValue: !formData.colorValue,
      colorLabel: !formData.colorLabel,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const endpoint = isEditing
        ? `${import.meta.env.VITE_API_BACKEND_URL}/api/colors/${currentId}`
        : `${import.meta.env.VITE_API_BACKEND_URL}/api/colors`;

      const response = await fetch(endpoint, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchColors();
        handleCloseDialog();
      } else {
        console.error("Failed to save color");
      }
    } catch (error) {
      console.error("Error saving color:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this color?")) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BACKEND_URL}/api/colors/${id}`,
          { method: "DELETE" }
        );

        if (response.ok) {
          await fetchColors();
        } else {
          console.error("Failed to delete color");
        }
      } catch (error) {
        console.error("Error deleting color:", error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center">
          <motion.div
            whileHover={{ rotate: 30 }}
            className="p-3 rounded-lg bg-white shadow-sm border border-gray-200 text-blue-600 mr-4"
          >
            <FaPalette className="text-xl" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Color Management
            </h2>
            <p className="text-gray-500">Add and manage your color palette</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOpenDialog}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          <FaPlus size={14} />
          <span>Add Color</span>
        </motion.button>
      </div>

      {/* Color List */}
      <motion.div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Search Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search colors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
              Total: {filteredColors.length} colors
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredColors.length === 0 ? (
            <div className="text-center py-12">
              <FaPalette className="mx-auto text-gray-400 text-3xl mb-4" />
              <h3 className="text-lg font-medium text-gray-700">
                No colors found
              </h3>
              <p className="text-gray-500 mt-1">
                {searchTerm
                  ? "Try a different search term"
                  : "Add your first color to get started"}
              </p>
            </div>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Color</TableCell>
                    <TableCell>Label</TableCell>
                    <TableCell>Hex Value</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredColors.map((color) => (
                    <TableRow key={color.id}>
                      <TableCell>
                        <div
                          className="w-8 h-8 rounded-full border border-gray-200"
                          style={{ backgroundColor: color.colorvalue }}
                        />
                      </TableCell>
                      <TableCell>{color.colorlabel}</TableCell>
                      <TableCell>{color.colorvalue}</TableCell>
                      <TableCell align="right">
                        <div className="flex justify-end space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditDialog(color)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                          >
                            <FaEdit />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(color.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                          >
                            <FaTrash />
                          </motion.button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </motion.div>

      {/* Add/Edit Color Modal */}
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
              className="bg-white rounded-xl shadow-xl w-full max-w-md"
            >
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {isEditing ? "Edit Color" : "Add New Color"}
                  </h3>
                  <button
                    onClick={handleCloseDialog}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color Value
                    </label>
                    <input
                      type="color"
                      name="colorValue"
                      value={formData.colorValue}
                      onChange={handleInputChange}
                      className="w-full h-12 rounded-lg border border-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color Label
                    </label>
                    <input
                      type="text"
                      name="colorLabel"
                      value={formData.colorLabel}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${
                        errors.colorLabel ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Enter color name"
                    />
                    {errors.colorLabel && (
                      <p className="mt-1 text-sm text-red-500">
                        Color label is required
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6">
                  <button
                    onClick={handleCloseDialog}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {isEditing ? "Update" : "Add"} Color
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
