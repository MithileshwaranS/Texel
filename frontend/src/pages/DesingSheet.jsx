import React, { useState, useEffect, useMemo, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaWeight,
  FaMoneyBillWave,
  FaCalculator,
  FaIndustry,
  FaToolbox,
  FaPercentage,
  FaTruck,
  FaFileSignature,
  FaNewspaper,
  FaCalendarAlt,
  FaTimes,
  FaPlus,
  FaImage,
  FaExpand,
  FaTrash,
  FaBoxOpen,
  FaRuler,
  FaSlidersH,
} from "react-icons/fa";
import { Tonality } from "@mui/icons-material";

// Memoized components to prevent unnecessary re-renders
const TextInput = React.memo(
  ({
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
  }) => (
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
      />
    </div>
  )
);

const DropdownField = React.memo(
  ({ label, value, onChange, options, icon: Icon, required = true }) => (
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
      >
        <option value="">Select {label}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
);

const ResultCard = React.memo(
  ({ title, value, icon: Icon, color = "bg-white" }) => (
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
  )
);

const SectionCard = React.memo(
  ({ title, icon: Icon, children, color = "text-blue-600" }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
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
  )
);

function DesignSheet() {
  // State management
  const [designName, setDesignName] = useState("");
  const [width, setWidth] = useState("");
  const [reed, setReed] = useState("");
  const [pick, setPick] = useState("");
  const [yarnCount, setYarnCount] = useState([]);
  const [yarnPrice, setYarnPrice] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalYarn, setTotalYarn] = useState();
  const [warps, setWarps] = useState([
    { count: "", reed: "", cost: "", dyeing: 300, constant: 1.45 },
  ]);

  const [wefts, setWefts] = useState([
    { count: "", pick: "", cost: "", dyeing: 300, constant: 1.45 },
  ]);

  // Fetch yarn details - runs only once on mount
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
  }, []); // Empty dependency array ensures this runs only once

  // Helper functions
  const removeWarp = (index) => {
    if (warps.length > 1) {
      const newWarps = [...warps];
      newWarps.splice(index, 1);
      setWarps(newWarps);
    }
  };

  const removeWeft = (index) => {
    if (wefts.length > 1) {
      const newWefts = [...wefts];
      newWefts.splice(index, 1);
      setWefts(newWefts);
    }
  };

  const handleWarpChange = (index, field, value) => {
    const newWarps = [...warps];
    newWarps[index][field] = value;
    setWarps(newWarps);
  };

  const handleWeftChange = (index, field, value) => {
    const newWefts = [...wefts];
    newWefts[index][field] = value;
    setWefts(newWefts);
  };
  const addWeft = () => {
    setWefts([
      ...wefts,
      { count: "", pick: "", cost: "", dyeing: 300, constant: 1.45 },
    ]);
  };

  const addWarp = () => {
    setWarps([
      ...warps,
      { count: "", reed: "", cost: "", dyeing: 300, constant: 1.45 },
    ]);
  };
  const toNum = (val) => parseFloat(val || 0);

  const getHanksWt = useMemo(
    () => (count) => {
      const found = yarnCount.find((y) => y.yarn_count === count);
      return found ? found.hanks_wt : 0;
    },
    [yarnCount]
  );

  const sortYarnCounts = useMemo(
    () => (counts) => {
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
    },
    []
  );

  // Memoized derived values to prevent unnecessary recalculations
  const warpCountOptions = useMemo(
    () => yarnCount?.map((y) => y?.yarn_count) || [],
    [yarnCount]
  );
  const weftCountOptions = useMemo(
    () => yarnCount?.map((y) => y.yarn_count) || [],
    [yarnCount]
  );

  const sortedWarpCountOptions = useMemo(
    () => sortYarnCounts([...warpCountOptions]),
    [warpCountOptions, sortYarnCounts]
  );
  const sortedWeftCountOptions = useMemo(
    () => sortYarnCounts([...weftCountOptions]),
    [weftCountOptions, sortYarnCounts]
  );

  //Calculations
  useEffect(() => {
    if (width != null && warps?.length) {
      const total_yarn = warps.reduce((acc, warp) => {
        if (warp.reed) {
          return acc + toNum(width) * toNum(warp.reed);
        }
        return acc;
      }, 0);

      console.log("Calculated total_yarn:", total_yarn);
      setTotalYarn(total_yarn);
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
                        value={warp.count || warp.warpcount}
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

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-700">
                      Weft Specifications
                    </h3>
                    <button
                      onClick={addWeft}
                      className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors flex items-center"
                    >
                      <FaPlus size={10} className="mr-1" /> Add Weft
                    </button>
                  </div>

                  {wefts.map((weft, index) => (
                    <div
                      key={`weft-${index}`}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 relative"
                    >
                      <div className="absolute -top-2 -left-2 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {index + 1}
                      </div>
                      {wefts.length > 1 && (
                        <button
                          onClick={() => removeWeft(index)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FaTimes size={14} />
                        </button>
                      )}

                      <DropdownField
                        label="Weft Count"
                        value={weft.count || weft.weftcount}
                        onChange={(e) =>
                          handleWeftChange(index, "count", e.target.value)
                        }
                        options={sortedWeftCountOptions}
                        icon={FaWeight}
                      />
                      <TextInput
                        label="Pick"
                        value={weft.pick}
                        onChange={(e) =>
                          handleWeftChange(index, "pick", e.target.value)
                        }
                        type="number"
                        icon={FaIndustry}
                        min={0}
                        step="0.01"
                      />
                      <TextInput
                        label="Weft Constant"
                        value={weft.constant}
                        onChange={(e) =>
                          handleWeftChange(index, "constant", e.target.value)
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

            {/* Additional sections can be added here */}
            <SectionCard
              title="Yarn Details"
              icon={FaWeight}
              color="text-green-600"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* <DropdownField
                    label="Warp Yarn Count"
                    value={warpCount}
                    onChange={(e) => setWarpCount(e.target.value)}
                    options={sortedWarpCountOptions}
                    icon={FaWeight}
                  />
                  <DropdownField
                    label="Weft Yarn Count"
                    value={""}
                    onChange={() => {}}
                    options={sortedWeftCountOptions}
                    icon={FaWeight}
                  /> */}
                </div>
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
              <div className="space-y-4">
                <ResultCard
                  title="Fabric Width"
                  value={`${width || 0} inches`}
                  icon={FaRuler}
                  color="bg-blue-50"
                />
                <ResultCard
                  title="Total Thread"
                  value={totalYarn}
                  icon={FaSlidersH}
                  color="bg-green-50"
                />
                {/* <ResultCard
                  title="Warp Count"
                  value={warpCount || "Not selected"}
                  icon={FaWeight}
                  color="bg-yellow-50"
                /> */}
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

export default React.memo(DesignSheet);
