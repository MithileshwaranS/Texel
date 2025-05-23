import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaWeight,
  FaMoneyBillWave,
  FaCalculator,
  FaIndustry,
  FaToolbox,
  FaFileSignature,
  FaNewspaper,
  FaTimes,
  FaPlus,
  FaBoxOpen,
  FaRuler,
  FaSlidersH,
  FaPalette,
} from "react-icons/fa";

// Reusable components
const TextInput = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  icon: Icon,
  className = "",
  min,
  step,
  required = true,
  name,
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-xs font-medium text-gray-500 mb-1 flex items-center uppercase tracking-wider">
        {Icon && <Icon className="mr-2 text-gray-400" size={12} />}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-800 shadow-sm"
        min={min}
        step={step}
        required={required}
        name={name}
      />
    </div>
  );
};

const DropdownField = ({
  label,
  value,
  onChange,
  options,
  icon: Icon,
  required = true,
  name,
}) => {
  return (
    <div className="flex flex-col">
      <label className="text-xs font-medium text-gray-500 mb-1 flex items-center uppercase tracking-wider">
        {Icon && <Icon className="mr-2 text-gray-400" size={12} />}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-800 shadow-sm appearance-none"
        required={required}
        name={name}
      >
        <option value="">Select {label}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
    </div>
  );
};

const ColorInput = ({ value, onChange, label }) => {
  const predefinedColors = [
    { value: "#000000", label: "Black" },
    { value: "#FFFFFF", label: "White" },
    { value: "#FF0000", label: "Red" },
    { value: "#00FF00", label: "Green" },
    { value: "#0000FF", label: "Blue" },
    { value: "#FFFF00", label: "Yellow" },
    { value: "#FF00FF", label: "Magenta" },
    { value: "#00FFFF", label: "Cyan" },
    { value: "#FFA500", label: "Orange" },
    { value: "#800080", label: "Purple" },
    { value: "#A52A2A", label: "Brown" },
    { value: "#808080", label: "Gray" },
    { value: "#F5F5DC", label: "Beige" },
    { value: "#FFC0CB", label: "Pink" },
    { value: "#008080", label: "Teal" },
    { value: "#4B0082", label: "Indigo" },
  ];

  const handleColorChange = (e) => {
    onChange(e);
  };

  const handleTextChange = (e) => {
    // Validate hex color format
    if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
      onChange(e);
    }
  };

  return (
    <div className="flex flex-col">
      <label className="text-xs font-medium text-gray-500 mb-1 flex items-center uppercase tracking-wider">
        <FaPalette className="mr-2 text-gray-400" size={12} />
        {label}
        <span className="text-red-500 ml-1">*</span>
      </label>

      <div className="grid grid-cols-1 gap-2">
        {/* Predefined color dropdown */}
        <select
          value={value}
          onChange={handleColorChange}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-800 shadow-sm appearance-none"
        >
          <option value="">Select a color</option>
          {predefinedColors.map((color, index) => (
            <option key={index} value={color.value}>
              {color.label}
            </option>
          ))}
        </select>

        {/* Color picker and hex input */}
        <div className="flex items-center">
          <input
            type="color"
            value={value}
            onChange={handleColorChange}
            className="w-8 h-8 rounded cursor-pointer mr-2"
          />
          {/* <input
            type="text"
            value={value}
            onChange={handleTextChange}
            placeholder="#RRGGBB"
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-800 shadow-sm flex-1"
          /> */}
        </div>

        {/* Color preview */}
        {/* <div className="flex items-center mt-1"> */}
        {/* <span className="text-xs text-gray-500 mr-2">Preview:</span>
          <div
            className="w-6 h-6 rounded border border-gray-300"
            style={{ backgroundColor: value || "#FFFFFF" }}
          ></div> */}
        {/* </div> */}
      </div>
    </div>
  );
};

const ResultCard = ({ title, value, icon: Icon, color = "bg-white" }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
      className={`${color} p-4 rounded-xl shadow-sm border border-gray-100 transition-all flex flex-col h-full`}
    >
      <div className="flex items-center mb-2">
        {Icon && (
          <div className="p-2 rounded-full bg-opacity-20 bg-blue-500 text-blue-600 mr-3">
            <Icon size={14} />
          </div>
        )}
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </p>
      </div>
      <p className="text-xl font-semibold text-gray-800 mt-1">
        {value || "0.000"}
      </p>
    </motion.div>
  );
};

const SectionCard = ({
  title,
  icon: Icon,
  children,
  color = "text-blue-600",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative"
    >
      <div className="flex items-center border-b border-gray-100 pb-4 mb-4">
        {Icon && <Icon className={`mr-3 ${color}`} size={16} />}
        <h2
          className={`text-base font-semibold ${color} uppercase tracking-wider`}
        >
          {title}
        </h2>
      </div>
      <div className="space-y-5">{children}</div>
    </motion.div>
  );
};

function DesignSheet() {
  // State management
  const [designName, setDesignName] = useState("");
  const [width, setWidth] = useState("");
  const [yarnCount, setYarnCount] = useState([]);
  const [yarnPrice, setYarnPrice] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalYarn, setTotalYarn] = useState(0);
  const [warpTotalThread, setWarpTotalThread] = useState([]);
  const [warps, setWarps] = useState([
    { count: "", reed: "", cost: "", dyeing: 300, constant: 1.45 },
  ]);
  const [warpDesigns, setWarpDesigns] = useState([
    { color: "#000000", threadCount: "" },
  ]);
  const [warpWeights, setWarpWeights] = useState([]);

  // Fetch yarn details
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [countsResponse, priceResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/yarnCounts`),
          fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/yarnPrice`),
        ]);

        const countsData = await countsResponse.json();
        const priceData = await priceResponse.json();

        setYarnCount(countsData);
        setYarnPrice(priceData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper functions
  const removeWarp = (index) => {
    if (warps.length > 1) {
      const newWarps = [...warps];
      newWarps.splice(index, 1);
      setWarps(newWarps);
    }
  };

  const handleWarpChange = (index, field, value) => {
    const newWarps = [...warps];
    newWarps[index][field] = value;
    setWarps(newWarps);
  };

  const addWarp = () => {
    setWarps([
      ...warps,
      { count: "", reed: "", cost: "", dyeing: 300, constant: 1.45 },
    ]);
  };

  const addWarpDesign = () => {
    setWarpDesigns([...warpDesigns, { color: "#000000", threadCount: "" }]);
  };

  const removeWarpDesign = (index) => {
    if (warpDesigns.length > 1) {
      const newDesigns = [...warpDesigns];
      newDesigns.splice(index, 1);
      setWarpDesigns(newDesigns);
    }
  };

  const handleWarpDesignChange = (index, field, value) => {
    const newDesigns = [...warpDesigns];
    newDesigns[index][field] = value.target ? value.target.value : value;
    setWarpDesigns(newDesigns);
  };

  const toNum = (val) => parseFloat(val || 0);

  const getHanksWt = (count) => {
    const found = yarnCount.find((y) => y.yarn_count === count);
    return found ? found.hanks_wt : 0;
  };

  const sortYarnCounts = (counts) => {
    const regularCounts = [];
    const twistedCounts = [];

    counts.forEach((count) => {
      if (count.includes("/")) {
        twistedCounts.push(count);
      } else {
        regularCounts.push(count);
      }
    });

    const parseCount = (str) => {
      if (str.includes("/")) {
        const [prefix, base] = str.replace("s", "").split("/").map(Number);
        return prefix * base;
      } else {
        return parseInt(str.replace("s", ""));
      }
    };

    regularCounts.sort((a, b) => parseCount(a) - parseCount(b));
    twistedCounts.sort((a, b) => parseCount(a) - parseCount(b));

    return [...regularCounts, ...twistedCounts];
  };

  // Derived values
  const warpCountOptions = yarnCount?.map((y) => y?.yarn_count) || [];
  const weftCountOptions = yarnCount?.map((y) => y.yarn_count) || [];
  const sortedWarpCountOptions = sortYarnCounts([...warpCountOptions]);
  const sortedWeftCountOptions = sortYarnCounts([...weftCountOptions]);

  // Calculations
  useEffect(() => {
    if (width != null && warps?.length) {
      const warpTotals = warps.map((warp) => {
        if (warp.reed) {
          return toNum(width) * toNum(warp.reed);
        }
        return 0;
      });

      const total_yarn = warpTotals.reduce((acc, value) => acc + value, 0);
      setTotalYarn(total_yarn);
      setWarpTotalThread(warpTotals);
    }
  }, [width, warps]);

  useEffect(() => {
    if (width) {
      const newWarpWeights = warps.map((warp) => {
        if (warp.count && warp.reed) {
          return (
            ((toNum(width) * toNum(warp.reed) * toNum(warp.constant || 1.45)) /
              840) *
            getHanksWt(warp.count)
          ).toFixed(3);
        }
        return "0.000";
      });
      setWarpWeights(newWarpWeights);
    }
  }, [width, warps]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600 mr-4">
              <FaBoxOpen size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Design Sheet</h1>
              <p className="text-sm text-gray-500">
                Create and manage fabric specifications
              </p>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <TextInput
              label="Design Name"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              placeholder="Enter design name"
              icon={FaFileSignature}
              className="w-full"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Specifications */}
          <div className="lg:col-span-2 space-y-6">
            <SectionCard
              title="Fabric Specifications"
              icon={FaToolbox}
              color="text-blue-600"
            >
              <div className="space-y-6">
                <TextInput
                  label="Width (inches)"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  type="number"
                  icon={FaToolbox}
                  min={0}
                  step="0.01"
                />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-700">
                      Warp Specifications
                    </h3>
                    <button
                      onClick={addWarp}
                      className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors flex items-center"
                    >
                      <FaPlus size={10} className="mr-1" /> Add Warp
                    </button>
                  </div>

                  {warps.map((warp, index) => (
                    <div
                      key={`warp-${index}`}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 relative"
                    >
                      <div className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {index + 1}
                      </div>
                      {warps.length > 1 && (
                        <button
                          onClick={() => removeWarp(index)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FaTimes size={14} />
                        </button>
                      )}

                      <DropdownField
                        label="Warp Count"
                        value={warp.count}
                        onChange={(e) =>
                          handleWarpChange(index, "count", e.target.value)
                        }
                        options={sortedWarpCountOptions}
                        icon={FaWeight}
                      />
                      <TextInput
                        label="Reed"
                        value={warp.reed}
                        onChange={(e) =>
                          handleWarpChange(index, "reed", e.target.value)
                        }
                        type="number"
                        icon={FaIndustry}
                        min={0}
                        step="0.01"
                      />
                      <TextInput
                        label="Warp Constant"
                        value={warp.constant}
                        onChange={(e) =>
                          handleWarpChange(index, "constant", e.target.value)
                        }
                        type="number"
                        icon={FaNewspaper}
                        min={0}
                        step="0.01"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>

            {/* Warp Design Section */}
            <SectionCard
              title="Warp Design"
              icon={FaPalette}
              color="text-green-600"
            >
              <div className="space-y-4">
                <div className="space-y-4">
                  {warpDesigns.map((design, index) => (
                    <div
                      key={`design-${index}`}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 relative"
                    >
                      <div className="absolute -top-2 -left-2 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {index + 1}
                      </div>
                      {warpDesigns.length > 1 && (
                        <button
                          onClick={() => removeWarpDesign(index)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FaTimes size={14} />
                        </button>
                      )}

                      <ColorInput
                        label="Color"
                        value={design.color}
                        onChange={(e) =>
                          handleWarpDesignChange(index, "color", e)
                        }
                      />
                      <TextInput
                        label="Thread Count"
                        value={design.threadCount}
                        onChange={(e) =>
                          handleWarpDesignChange(
                            index,
                            "threadCount",
                            e.target.value
                          )
                        }
                        type="number"
                        icon={FaSlidersH}
                        min={0}
                        step="1"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Hover Add Button at Bottom */}
              <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={addWarpDesign}
                  className="p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
                  aria-label="Add warp design"
                >
                  <FaPlus size={16} />
                </motion.button>
              </div>
            </SectionCard>
          </div>

          {/* Right Column - Results & Summary */}
          <div className="space-y-6">
            <SectionCard
              title="Quick Summary"
              icon={FaCalculator}
              color="text-purple-600"
            >
              <ResultCard
                title="Fabric Width"
                value={`${width || 0} inches`}
                icon={FaRuler}
                color="bg-blue-50"
              />
              <div
                className={`grid gap-4 ${
                  warps.length === 1
                    ? "grid-cols-1"
                    : "grid-cols-1 sm:grid-cols-2"
                }`}
              >
                {warpWeights.map((weight, index) => (
                  <ResultCard
                    key={`warp-weight-${index}`}
                    title={`Warp ${index + 1} Weight`}
                    value={weight}
                    icon={FaWeight}
                    color="bg-yellow-50"
                  />
                ))}
              </div>

              <div
                className={`grid gap-4 ${
                  warps.length === 1
                    ? "grid-cols-1"
                    : "grid-cols-1 sm:grid-cols-2"
                }`}
              >
                {warpTotalThread.map((threadCount, index) => (
                  <ResultCard
                    key={`Warp-${index}-Thread`}
                    title={`Warp ${index + 1} Thread`}
                    value={threadCount}
                    icon={FaWeight}
                    color="bg-yellow-50"
                  />
                ))}
              </div>
              <div className="space-y-4">
                <ResultCard
                  title="Total Thread"
                  value={totalYarn}
                  icon={FaSlidersH}
                  color="bg-green-50"
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Calculations"
              icon={FaCalculator}
              color="text-indigo-600"
            >
              <div className="grid grid-cols-1 gap-4">
                <ResultCard
                  title="Estimated Weight"
                  value="0.000 kg/m²"
                  icon={FaWeight}
                  color="bg-gray-50"
                />
                <ResultCard
                  title="Production Cost"
                  value="$0.00"
                  icon={FaMoneyBillWave}
                  color="bg-gray-50"
                />
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesignSheet;
