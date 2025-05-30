import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import YarnCard from "../common/CardComponent";
import { useNavigate } from "react-router-dom";
import ReportsHeader from "./ReportsHeader";

function DesignReports({ designs, samplingDesigns, onDelete, onExport }) {
  const navigate = useNavigate();
  const [filteredDesigns, setFilteredDesigns] = useState([]);
  const [samplingfilteredDesigns, setSamplingFilteredDesigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
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

  useEffect(() => {
    let filtered = [...designs];
    let sampleFiltered = [...samplingDesigns];

    // Apply search filter
    if (searchTerm) {
      const searchWords = searchTerm.toLowerCase().split(/\s+/);

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
      const dateA = new Date(a.created_at || a.created_date);
      const dateB = new Date(b.created_at || b.created_date);
      return sortOption === "newest" ? dateB - dateA : dateA - dateB;
    };

    filtered.sort(sortByDate);
    sampleFiltered.sort(sortByDate);

    setFilteredDesigns(filtered);
    setSamplingFilteredDesigns(sampleFiltered);
  }, [searchTerm, designs, samplingDesigns, statusFilter, sortOption]);

  const handleViewMore = (id) => {
    navigate(`/costdetails/${id}`, { state: { tab: "cost" } });
  };

  const handleDuplicate = (design_id) => {
    navigate("/costing", { state: { design_id } });
  };

  const handleComplete = (design) => {
    const { designid } = design;
    navigate("/costing", { state: { designid, useAlternate: true } });
  };

  const handleNewReport = () => {
    navigate("/new-design");
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
    <div>
      <ReportsHeader
        title="Cost reports"
        onExportClick={onExport}
        onNewReport={handleNewReport}
        onFilterToggle={() => setMobileFiltersOpen(!mobileFiltersOpen)}
      />

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
          {/* ... Mobile filters content ... */}
        </div>
      )}

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredDesigns.length + samplingfilteredDesigns.length} of{" "}
        {designs.length + samplingDesigns.length} designs
        {statusFilter !== "all" && (
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
            {statusFilter}
          </span>
        )}
      </div>

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
          const itemKey = item.design_id || item.designid;

          return (
            <YarnCard
              key={itemKey}
              date={date}
              title={title}
              imageURL={imageURL}
              status={status}
              onImageClick={() => setPreviewImage(imageURL)}
              onViewMore={
                status !== "pending" ? () => handleViewMore(itemKey) : undefined
              }
              onDelete={
                status !== "pending" ? () => onDelete(itemKey) : undefined
              }
              onDuplicate={
                status !== "pending"
                  ? () => handleDuplicate(itemKey)
                  : undefined
              }
              onComplete={
                status === "pending" ? () => handleComplete(item) : undefined
              }
            />
          );
        })}
      </div>
    </div>
  );
}

export default DesignReports;
