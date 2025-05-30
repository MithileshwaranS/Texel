import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ConfirmDialog from "../components/common/ConfirmDialog";
import SelectDesignsDialog from "../components/common/SelectDesignsDialog";
import CostReports from "../components/reports/CostReports";
import DesignReports from "../components/reports/DesignReports";

function Reports() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("designs");
  const [design, setDesign] = useState([]);
  const [samplingdesign, setSamplingDesign] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDesignId, setSelectedDesignId] = useState(null);
  const [selectDialogOpen, setSelectDialogOpen] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/designdetails`
      );
      const data = await response.json();
      setDesign(data);
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
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  useEffect(() => {
    fetchData();
    fetchSamplingData();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!selectedDesignId) return;

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BACKEND_URL
        }/api/deleteDesign/${selectedDesignId}`,
        { method: "DELETE" }
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

  const handleExcelDownload = async (selectedDesignIds) => {
    try {
      const queryParams = selectedDesignIds.join(",");
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BACKEND_URL
        }/api/excel?designs=${queryParams}`,
        { method: "GET" }
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("designs")}
              className={`${
                activeTab === "designs"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Cost Reports
            </button>
            <button
              onClick={() => setActiveTab("costs")}
              className={`${
                activeTab === "costs"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Design Reports
            </button>
          </nav>
        </div>

        {/* Main Content */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : activeTab === "designs" ? (
          <DesignReports
            designs={design}
            samplingDesigns={samplingdesign}
            onDelete={(id) => {
              setSelectedDesignId(id);
              setConfirmOpen(true);
            }}
            onExport={() => setSelectDialogOpen(true)}
          />
        ) : (
          <CostReports />
        )}

        {/* Modals */}
        <ConfirmDialog
          title="Delete Design"
          message="Are you sure you want to delete this design? This action cannot be undone."
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleDeleteConfirm}
        />

        <SelectDesignsDialog
          open={selectDialogOpen}
          onClose={() => setSelectDialogOpen(false)}
          onConfirm={(selectedIds) => {
            handleExcelDownload(selectedIds);
            setSelectDialogOpen(false);
          }}
          designs={design}
        />
      </div>
    </div>
  );
}

export default Reports;
