import React, { useState, useEffect } from "react";
import {
  FaChartLine,
  FaSearch,
  FaTimes,
  FaPlus,
  FaFileExcel,
} from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import YarnCard from "../components/common/CardComponent";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../components/common/ConfirmDialog";

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

function Reports() {
  const navigate = useNavigate();
  const [design, setDesign] = useState([]);
  const [filteredDesigns, setFilteredDesigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDesignId, setSelectedDesignId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [samplingdesign, setSamplingDesign] = useState([]);
  const [samplingfilteredDesigns, setSamplingFilteredDesigns] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  const getDesignStatus = (design) => {
    if (design.status === "pending") return "pending";
    if (design.status === "sent") return "sent";
    if (design.design_status === "completed") return "completed";
    else return "";
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/designdetails`
      );
      const data = await response.json();
      setDesign(data);
      setFilteredDesigns(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSamplingData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/samplingdetails`
      );
      const data = await response.json();
      setSamplingDesign(data);
      setSamplingFilteredDesigns(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchSamplingData();
  }, []);

  useEffect(() => {
    let filtered = [...design];
    let sampleFiltered = [...samplingdesign]; // Original sample list

    // Apply search filter
    if (searchTerm) {
      const searchWords = searchTerm.toLowerCase().split(/\s+/); // split by space

      filtered = filtered.filter((item) => {
        const name = item.designname.toLowerCase();
        return searchWords.every((word) => name.includes(word));
      });

      sampleFiltered = sampleFiltered.filter((item) => {
        const name = item.design_name.toLowerCase();
        return searchWords.every((word) => name.includes(word));
      });
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (item) => getDesignStatus(item) === statusFilter
      );
      sampleFiltered = sampleFiltered.filter(
        (item) => getDesignStatus(item) === statusFilter
      );
    }

    // Apply sorting
    const sortByDate = (a, b) => {
      const dateA = new Date(a.created_date);
      const dateB = new Date(b.created_date);
      return sortOption === "newest" ? dateB - dateA : dateA - dateB;
    };

    filtered.sort(sortByDate);
    sampleFiltered.sort(sortByDate);

    // Update states
    setFilteredDesigns(filtered);
    setSamplingFilteredDesigns(sampleFiltered);
  }, [searchTerm, design, samplingdesign, statusFilter, sortOption]);

  const handleViewMore = (id) => {
    navigate(`/designdetails/${id}`);
  };

  const handleDeleteClick = (id) => {
    setSelectedDesignId(id);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDesignId) return;

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BACKEND_URL
        }/api/deleteDesign/${selectedDesignId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting design:", error);
    } finally {
      setConfirmOpen(false);
      setSelectedDesignId(null);
    }
  };

  const handleDuplicate = (design_id) => {
    setTimeout(() => {
      navigate("/costing", { state: { design_id } });
    }, 500);
    console.log("logging state value", design_id);
  };

  const handleComplete = (design) => {
    const { designid } = design;
    setTimeout(() => {
      navigate("/costing", { state: { designid, useAlternate: true } });
      console.log(
        "Navigating with designid:",
        design.designid || design.design_id
      );
    }, 500);
  };

  const handleNewReport = () => {
    navigate("/new-design");
  };

  const handleExcelDownload = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/excel`,
        {
          method: "GET",
        }
      );

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Design-Report-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Excel download failed:", error);
    }
  };

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "sent", label: "Sent" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center">
            <FaChartLine className="text-indigo-600 text-2xl md:text-3xl mr-2 md:mr-3" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Design Reports
            </h1>
          </div>

          <div className="flex gap-3">
            {/* Excel Export Button */}
            <button
              onClick={handleExcelDownload}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm cursor-pointer"
            >
              <FaFileExcel className="text-sm" />
              <span className="text-sm font-medium">Export Excel</span>
            </button>

            {/* New Report Button */}
            <button
              onClick={handleNewReport}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
            >
              <FaPlus className="text-sm" />
              <span className="text-sm font-medium">New Report</span>
            </button>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              <FiFilter className="text-gray-500" />
              <span className="text-sm font-medium">Filters</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Section - Desktop */}
        <div className="hidden md:flex flex-col gap-4 mb-6">
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
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    statusFilter === option.value
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortOption(option.value)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    sortOption === option.value
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Filters Panel */}
        {mobileFiltersOpen && (
          <div className="md:hidden mb-6 bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-900">Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FaTimes />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative w-full mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search designs..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setStatusFilter(option.value)}
                    className={`w-full py-2 text-sm font-medium rounded-md transition-colors ${
                      statusFilter === option.value
                        ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                        : "text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Sort By
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortOption(option.value)}
                    className={`w-full py-2 text-sm font-medium rounded-md transition-colors ${
                      sortOption === option.value
                        ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                        : "text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredDesigns.length + samplingfilteredDesigns.length} of{" "}
          {design.length + samplingdesign.length} designs
          {statusFilter !== "all" && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
              {statusFilter}
            </span>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {/* No Results Message */}
            {filteredDesigns.length === 0 &&
              samplingfilteredDesigns.length === 0 &&
              !isLoading && (
                <div className="bg-white p-6 rounded-lg shadow text-center border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No designs found
                  </h3>
                  <p className="text-gray-500">
                    {statusFilter !== "all"
                      ? `No ${statusFilter} designs matching your search`
                      : "Try adjusting your search query"}
                  </p>
                </div>
              )}

            {/* Design Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...filteredDesigns, ...samplingfilteredDesigns].map((item) => {
                const status = getDesignStatus(item);
                const date = item.created_at
                  ? formatDate(item.created_at)
                  : item.created_date
                  ? formatDate(item.created_date)
                  : "No date available";

                const title =
                  item.designname && item.design_name
                    ? `${item.designname} / ${item.design_name}`
                    : item.designname || item.design_name;

                const imageURL = item.designimage || item.designimage_url;

                const commonProps = {
                  date,
                  title,
                  imageURL,
                  status,
                };
                const itemKey = item.design_id || item.designid;

                if (status === "") {
                  return (
                    <YarnCard
                      key={item.design_id || item.designid}
                      {...commonProps}
                      onImageClick={() => setPreviewImage(imageURL)}
                      onViewMore={() => handleViewMore(itemKey)}
                      onDelete={() => handleDeleteClick(itemKey)}
                      onDuplicate={() => handleDuplicate(itemKey)}
                    />
                  );
                }
                if (status === "pending") {
                  return (
                    <YarnCard
                      key={item.design_id || item.designid}
                      {...commonProps}
                      onImageClick={() => setPreviewImage(imageURL)}
                      onComplete={() => handleComplete(item)}
                    />
                  );
                }
                if (status === "completed" || status === "sent") {
                  return (
                    <YarnCard
                      key={item.design_id || item.designid}
                      {...commonProps}
                      onImageClick={() => setPreviewImage(imageURL)}
                      onViewMore={() => handleViewMore(itemKey)}
                      onDelete={() => handleDeleteClick(itemKey)}
                      onDuplicate={() => handleDuplicate(itemKey)}
                    />
                  );
                }
              })}
            </div>
          </>
        )}

        {/* Image Preview Modal */}
        {previewImage && (
          <ImagePreview
            imageUrl={previewImage}
            onClose={() => setPreviewImage(null)}
          />
        )}

        {/* Confirm Dialog */}
        <ConfirmDialog
          title="Delete Design"
          message="Are you sure you want to delete this design? This action cannot be undone."
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </div>
  );
}

export default Reports;
