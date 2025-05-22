import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaImage,
  FaTrash,
  FaCloudUploadAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import Toast from "../components/common/Toast";

function NewDesign() {
  const kolkataDate = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());

  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [designName, setDesignName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  const [designDate, setDesignDate] = useState(kolkataDate);

  // Image states
  const [designImagePublicId, setDesignImagePublicId] = useState("");
  const [designImage, setDesignImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadController, setUploadController] = useState(null);
  const [fileName, setFileName] = useState("");

  const showToast = (message, type = "success") => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ ...toast, visible: false }), 3000);
  };

  const removeImage = useCallback(() => {
    setDesignImage("");
    setDesignImagePublicId("");
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setToast({
      message: "Image removed. You can upload another.",
      type: "info",
    });
  }, []);

  const handleImageUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_API_CLOUD_PRESET);

    const controller = new AbortController();
    setUploadController(controller);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_API_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
          signal: controller.signal,
        }
      );

      const data = await response.json();
      setDesignImage(data.secure_url);
      setDesignImagePublicId(data.public_id);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Upload cancelled");
      } else {
        console.error("Upload failed:", error);
        setToast({
          message: "Image upload failed. Please try again.",
          type: "error",
        });
      }
    } finally {
      setUploading(false);
      setUploadController(null);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const [day, month, year] = designDate.split("/");
      const formattedDate = `${year}-${month}-${day}`; // ISO format
      const body = {
        designName,
        designImage,
        designImagePublicId,
        designDate: formattedDate,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/newDesign`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create design");
      }

      showToast("Design added successfully!", "success");

      // Reset the form
      setDesignName("");
      setDesignImage("");
      setFileName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error submitting design:", error.message);
      showToast(error.message || "Something went wrong", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 relative font-sans">
      {toast.visible && (
        <div className="fixed top-4 right-4 z-50">
          <Toast message={toast.message} type={toast.type} />
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Back button with smooth hover effect */}
        <motion.button
          onClick={() => navigate(-1)}
          whileHover={{ x: -4 }}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors mb-8 group"
        >
          <FaArrowLeft className="transition-transform group-hover:-translate-x-0.5" />
          <span className="font-medium">Back to Dashboard</span>
        </motion.button>

        {/* Form container with glass morphism effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl border border-white/20"
        >
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Create New Design
            </h1>
            <p className="text-gray-500">
              Fill in the details below to add a new design
            </p>
          </div>

          {/* Date display */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <FaCalendarAlt className="text-gray-400" />
              <span>Design Date</span>
            </div>
            <div className="px-4 py-3 bg-white rounded-lg border border-gray-200 shadow-sm text-gray-800 w-full md:w-64">
              {designDate}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Design Name Field */}
            <div className="mb-8">
              <label
                htmlFor="designName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Design Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="designName"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
                  value={designName}
                  onChange={(e) => setDesignName(e.target.value)}
                  placeholder="Enter design name"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400 text-xs">Required</span>
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="mb-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 text-sm font-semibold mb-4 text-indigo-600 uppercase tracking-wider">
                  <FaImage />
                  <span>Design Image</span>
                </div>

                <div className="space-y-4">
                  <div className="relative group">
                    <div
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
                        designImage
                          ? "border-emerald-200 bg-emerald-50/50"
                          : "border-gray-300 hover:border-indigo-300 bg-gray-50/50"
                      }`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploading}
                      />
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <motion.div
                          animate={{ y: designImage ? 0 : [-2, 2, -2] }}
                          transition={{ repeat: Infinity, duration: 3 }}
                        >
                          <FaCloudUploadAlt
                            className={`text-4xl ${
                              designImage ? "text-emerald-500" : "text-gray-400"
                            }`}
                          />
                        </motion.div>

                        {designImage ? (
                          <>
                            <div className="relative mt-4 group">
                              <motion.img
                                src={designImage}
                                alt="Preview"
                                className="h-40 object-contain rounded-lg shadow-sm"
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3 }}
                              />
                              <motion.div
                                className="absolute -top-3 -right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                whileHover={{ scale: 1.05 }}
                              >
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    removeImage();
                                  }}
                                  className="p-2 bg-white rounded-full shadow-md text-red-600 hover:bg-red-50 transition-colors"
                                  title="Remove"
                                >
                                  <FaTrash size={14} />
                                </button>
                              </motion.div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2 truncate max-w-xs">
                              {fileName}
                            </p>
                            <p className="text-xs text-emerald-600 mt-1 font-medium">
                              Upload successful!
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-medium text-gray-700">
                              {uploading
                                ? "Uploading your image..."
                                : "Drag & drop or click to browse"}
                            </p>
                            <p className="text-xs text-gray-500">
                              Supports: JPG, PNG, GIF (Max 5MB)
                            </p>
                            {uploading && (
                              <div className="w-full mt-3">
                                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                                    initial={{ width: 0 }}
                                    animate={{ width: "45%" }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {uploading && (
                      <motion.button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          uploadController?.abort();
                          removeImage();
                        }}
                        className="mt-3 px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors"
                        whileTap={{ scale: 0.95 }}
                      >
                        Cancel Upload
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <motion.button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(-1);
                }}
                className="px-6 py-3 border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>

              <motion.button
                type="submit"
                disabled={isSubmitting || !designImage}
                className={`px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                  isSubmitting || !designImage
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                }`}
                whileHover={{ scale: isSubmitting || !designImage ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting || !designImage ? 1 : 0.98 }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  "Create Design"
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default NewDesign;
