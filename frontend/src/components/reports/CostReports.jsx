import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ReportsHeader from "./ReportsHeader";
import YarnCard from "../common/CardComponent";

const ImagePreview = ({ imageUrl, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xl bg-opacity-90 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="relative max-w-[90vw] max-h-[90vh]">
        <button
          className="absolute top-4 right-4 text-white hover:text-gray-300 text-xl cursor-pointer"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        <img
          src={imageUrl}
          alt="Preview"
          className="max-w-full max-h-[90vh] object-contain rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

const CostReports = () => {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState([]);
  const [filteredDesigns, setFilteredDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchDesigns();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredDesigns(designs);
    } else {
      const filtered = designs.filter((design) =>
        design.designname.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDesigns(filtered);
    }
  }, [searchTerm, designs]);

  const fetchDesigns = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/designswithdetails`
      );
      if (!response.ok) {
        const text = await response.text();
        let errorMsg = `HTTP error! status: ${response.status}`;
        if (text && text.startsWith("<")) {
          errorMsg +=
            " (Received HTML instead of JSON. Backend may be down or endpoint is wrong.)";
        }
        throw new Error(errorMsg);
      }
      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        setError("Failed to parse backend response as JSON.");
        console.error("JSON parse error:", jsonErr);
        throw new Error("Invalid JSON from backend.");
      }
      setDesigns(data);
      setFilteredDesigns(data);
      setError(null);
    } catch (err) {
      setError(
        err.message || "Failed to fetch designs. Please try again later."
      );
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMore = (id) => {
    navigate(`/designdetails/${id}`, { state: { tab: "design" } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={fetchDesigns}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <ReportsHeader
        title="Design Reports"
        onFilterToggle={() => setMobileFiltersOpen(!mobileFiltersOpen)}
        showExport={false}
        showNewReport={false}
      />

      {/* Filter Controls Section */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative w-full max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search designs by name..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <FaTimes className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredDesigns.length} of {designs.length} designs
        {searchTerm && (
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
            {searchTerm}
          </span>
        )}
      </div>

      {/* Design Grid */}
      {filteredDesigns.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <h3 className="text-lg font-medium text-gray-600">
            No designs found
          </h3>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="mt-2 text-indigo-600 hover:text-indigo-800"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDesigns.map((design) => (
            <YarnCard
              key={design.id}
              title={design.designname}
              onViewMore={() => handleViewMore(design.id)}
              stats={[
                { label: "Warps", value: design.warps.length },
                { label: "Wefts", value: design.wefts.length },
              ]}
            />
          ))}
        </div>
      )}

      {previewImage && (
        <ImagePreview
          imageUrl={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </div>
  );
};

export default CostReports;
