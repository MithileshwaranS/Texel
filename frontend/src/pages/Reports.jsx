import React, { useState, useEffect } from "react";
import { FaChartLine, FaSearch } from "react-icons/fa";
import YarnCard from '../components/common/CardComponent';
import DesignDetail from "../components/common/DesignDetail";
import { useNavigate } from "react-router-dom";


function Reports() {
   const navigate = useNavigate();
  const [design, setDesign] = useState([]);
  const [filteredDesigns, setFilteredDesigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3000/api/designdetails`);
        
        const data = await response.json();
        setDesign(data);
        console.log("Fetched data:", data);
        setFilteredDesigns(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = design.filter(item =>
      item.designname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDesigns(filtered);
  }, [searchTerm, design]);


  
  const handleViewMore = (id) => {
   
    console.log("View More clicked for designno:", id);
    navigate(`/designdetails/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <FaChartLine className="text-indigo-600 text-3xl mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Design Reports</h1>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-64 lg:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search designs..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-600">
          Showing {filteredDesigns.length} of {design.length} designs
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {/* No Results Message */}
            {filteredDesigns.length === 0 && !isLoading && (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No designs found</h3>
                <p className="text-gray-500">Try adjusting your search query</p>
              </div>
            )}

            {/* Design Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDesigns.map((item) => (
                <YarnCard
                  key={item.designname}
                  title={item.designname}
                  onViewMore={() => handleViewMore(item.designno)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Reports;