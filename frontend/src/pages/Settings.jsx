import { FaCog, FaPlus, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from "react";

function Settings() {
  const [rows, setRows] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    yarnCount: '',
    hanksWt: '',
    yarnPrice: ''
  });
  const [errors, setErrors] = useState({
    yarnCount: false,
    hanksWt: false,
    yarnPrice: false
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setIsEditing(false);
    setCurrentId(null);
  };

const handleEditDialog = (row) => {
  setOpenDialog(true);
  setIsEditing(true);
  setCurrentId(row.id);
  setFormData({
    yarnCount: row.yarn_count,  // Make sure these field names match your API response
    hanksWt: row.hanks_wt || '',  // Added fallback in case field is missing
    yarnPrice: row.yarnprice || ''  // Make sure this matches your API field name
  });
};

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      yarnCount: '',
      hanksWt: '',
      yarnPrice: ''
    });
    setErrors({
      yarnCount: false,
      hanksWt: false,
      yarnPrice: false
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      yarnCount: !formData.yarnCount,
      hanksWt: !formData.hanksWt,
      yarnPrice: !formData.yarnPrice
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleAddYarn = async () => {
  if (!validateForm()) return;

  try {
    const endpoint = isEditing
      ? `http://localhost:3000/api/editYarn/${currentId}`
      : "http://localhost:3000/api/addYarn";
    
    const method = isEditing ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method: method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      // Refresh data
      const res = await fetch("http://localhost:3000/api/yarnDetails");
      const data = await res.json();
      setRows(data);

      if (data.length > 0) {
        setHeaders((prevHeaders) => {
          // Check if "actions" is already in headers, add it if not
          const currentHeaders = Object.keys(data[0]);
          if (!currentHeaders.includes('actions')) {
            currentHeaders.push('actions');
          }
          return currentHeaders;
        });
      }

      handleCloseDialog();
    } else {
      console.error(isEditing ? "Failed to update yarn." : "Failed to add yarn.");
    }
  } catch (error) {
    console.error(`Error ${isEditing ? 'updating' : 'adding'} yarn:`, error);
  }
};


  const handleDeleteYarn = async (id) => {
  if (window.confirm("Are you sure you want to delete this yarn?")) {
    try {
      const response = await fetch(`http://localhost:3000/api/deleteYarn/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        // Refresh data
        const res = await fetch("http://localhost:3000/api/yarnDetails");
        const data = await res.json();
        setRows(data);

        if (data.length > 0) {
          setHeaders((prevHeaders) => {
            // Check if "actions" is already in headers, add it if not
            const currentHeaders = Object.keys(data[0]);
            if (!currentHeaders.includes('actions')) {
              currentHeaders.push('actions');
            }
            return currentHeaders;
          });
        }
      } else {
        console.error("Failed to delete yarn.");
      }
    } catch (error) {
      console.error("Error deleting yarn:", error);
    }
  }
};


  useEffect(() => {
    fetch(`http://localhost:3000/api/yarnDetails`)
      .then((res) => res.json())
      .then((data) => {
        setRows(data);
        if (data.length > 0) {
          setHeaders([...Object.keys(data[0]), 'actions']);
        }
      })
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
              <FaCog className="text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
              <p className="text-gray-500">Manage your yarn details and configurations</p>
            </div>
          </div>
          
          <button
            onClick={handleOpenDialog}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <FaPlus size={14} />
            <span>Add Yarn</span>
          </button>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <span className="w-2 h-6 bg-blue-500 rounded-full mr-3"></span>
              Yarn Details
            </h2>
          </div>
          
          {/* Table Container */}
          <div className="p-4 md:p-6">
            <TableContainer component={Paper} elevation={0} className="border border-gray-200 rounded-lg">
              <Table sx={{ minWidth: 650 }} aria-label="yarn details table">
                <TableHead>
                  <TableRow className="bg-gray-50">
                    {headers.map((header, index) => (
                      <TableCell 
                        key={header} 
                        align={index === 0 ? 'left' : header === 'actions' ? 'center' : 'right'}
                        className="font-semibold text-gray-700 py-3"
                      >
                        {header === 'actions' ? 'Actions' : header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow 
                      key={i} 
                      className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
                    >
                      {headers.map((header) => (
                        header === 'actions' ? (
                          <TableCell 
                            key="actions" 
                            align="center"
                            className="py-3 text-gray-600"
                          >
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => handleEditDialog(row)}
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteYarn(row.id)}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </TableCell>
                        ) : (
                          <TableCell 
                            key={header} 
                            align={header === headers[0] ? 'left' : 'right'}
                            className="py-3 text-gray-600"
                          >
                            {row[header]}
                          </TableCell>
                        )
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>

      {/* Modern Modal */}
      {openDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all duration-300 scale-95 animate-fadeIn">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {isEditing ? 'Edit Yarn' : 'Add New Yarn'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {isEditing ? 'Update the yarn details below' : 'Enter the yarn details below'}
                </p>
              </div>
              <button 
                onClick={handleCloseDialog}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-5 space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yarn Count *</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="yarnCount"
                      value={formData.yarnCount}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.yarnCount ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'} focus:ring-2 focus:border-transparent transition-all placeholder-gray-400`}
                      placeholder="e.g. 40/1"
                    />
                    {errors.yarnCount && (
                      <p className="mt-2 text-sm text-red-500 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        This field is required
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hanks Weight *</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="hanksWt"
                      value={formData.hanksWt}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.hanksWt ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'} focus:ring-2 focus:border-transparent transition-all placeholder-gray-400`}
                      placeholder="e.g. 1.5 kg"
                    />
                    {errors.hanksWt && (
                      <p className="mt-2 text-sm text-red-500 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        This field is required
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yarn Price *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <input
                      type="text"
                      name="yarnPrice"
                      value={formData.yarnPrice}
                      onChange={handleInputChange}
                      className={`w-full pl-8 pr-4 py-3 rounded-lg border ${errors.yarnPrice ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'} focus:ring-2 focus:border-transparent transition-all placeholder-gray-400`}
                      placeholder="0.00"
                    />
                    {errors.yarnPrice && (
                      <p className="mt-2 text-sm text-red-500 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        This field is required
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
              <button
                onClick={handleCloseDialog}
                className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddYarn}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow hover:shadow-md transition-all hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                {isEditing ? 'Update Yarn' : 'Add Yarn'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;