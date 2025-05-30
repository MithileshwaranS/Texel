import React from "react";
import { FaChartLine, FaFileExcel, FaPlus } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";

const ReportsHeader = ({
  title,
  onExportClick,
  onNewReport,
  onFilterToggle,
  showMobileFilter = true,
  showExport = true,
  showNewReport = true,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div className="flex items-center">
        <FaChartLine className="text-indigo-600 text-2xl md:text-3xl mr-2 md:mr-3" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          {title}
        </h1>
      </div>

      <div className="flex gap-3">
        {/* Excel Export Button */}
        {showExport && (
          <button
            onClick={onExportClick}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm cursor-pointer"
          >
            <FaFileExcel className="text-sm" />
            <span className="text-sm font-medium">Export Excel</span>
          </button>
        )}

        {/* New Report Button */}
        {showNewReport && (
          <button
            onClick={onNewReport}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
          >
            <FaPlus className="text-sm" />
            <span className="text-sm font-medium">New Report</span>
          </button>
        )}

        {/* Mobile Filter Toggle */}
        {showMobileFilter && (
          <button
            onClick={onFilterToggle}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <FiFilter className="text-gray-500" />
            <span className="text-sm font-medium">Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ReportsHeader;
