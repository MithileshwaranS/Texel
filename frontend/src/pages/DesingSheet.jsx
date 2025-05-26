import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";

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
  FaSave,
} from "react-icons/fa";

// --- Predefined Colors ---
export const predefinedColors = [
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
  compact = false,
  hideLabel = false,
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {!hideLabel && (
        <label className="text-xs font-medium text-gray-500 mb-1 flex items-center uppercase tracking-wider">
          {Icon && <Icon className="mr-2 text-gray-400" size={12} />}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${
          compact ? "py-1 text-sm" : "py-2"
        } px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-800 shadow-sm`}
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

const ColorInput = ({
  value,
  onChange,
  label,
  compact = false,
  hideLabel = false,
  availableColors = predefinedColors,
}) => {
  // Initialize with false since we want to show dropdown by default
  const [isCustomColor, setIsCustomColor] = useState(false);
  const [colorName, setColorName] = useState("");

  useEffect(() => {
    // Check if the color exists in available colors
    const matchedColor = availableColors.find((c) => c.value === value);
    if (matchedColor) {
      setIsCustomColor(false);
      setColorName(matchedColor.label);
    } else if (value) {
      setIsCustomColor(true);
      setColorName("");
    }
  }, [value, availableColors]);

  const handleColorChange = (e) => {
    if (e.target.value === "custom") {
      setIsCustomColor(true);
      onChange({ target: { value: "#000000" } }); // Set a default color for custom
    } else {
      setIsCustomColor(false);
      onChange(e);
    }
  };

  return (
    <div className="flex flex-col">
      {!hideLabel && (
        <label className="text-xs font-medium text-gray-500 mb-1 flex items-center uppercase tracking-wider">
          <FaPalette className="mr-2 text-gray-400" size={12} />
          {label}
          <span className="text-red-500 ml-1">*</span>
        </label>
      )}
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || "#000000"}
          onChange={handleColorChange}
          className="w-8 h-8 rounded cursor-pointer"
        />
        <select
          value={value || ""}
          onChange={handleColorChange}
          className={`${
            compact ? "py-1 text-sm" : "py-2"
          } flex-1 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-800 shadow-sm appearance-none`}
        >
          <option value="">Select a color</option>
          {availableColors.map((color, index) => (
            <option key={index} value={color.value}>
              {color.label}
            </option>
          ))}
        </select>
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
  noPadding = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 relative"
    >
      <div className={`${noPadding ? "p-4" : "p-6"}`}>
        <div className="flex items-center border-b border-gray-100 pb-4 mb-4">
          {Icon && <Icon className={`mr-3 ${color}`} size={16} />}
          <h2
            className={`text-base font-semibold ${color} uppercase tracking-wider`}
          >
            {title}
          </h2>
        </div>
        <div className="space-y-5">{children}</div>
      </div>
    </motion.div>
  );
};

const getLegendNumberForColor = (colorLegend, color) => {
  const found = colorLegend.find((item) => item.color === color);
  return found ? found.serial : null;
};

const ColorLegendInput = ({ value, onChange, label, colorLegend }) => {
  const [inputMode, setInputMode] = useState("select"); // 'select' or 'input'
  const [customName, setCustomName] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const isPredefinedColor = predefinedColors.some(
    (c) => c.value === selectedColor
  );

  useEffect(() => {
    if (value) {
      const isPredefined = predefinedColors.some(
        (c) => c.value === value.color
      );
      setInputMode(isPredefined ? "select" : "input");
      setSelectedColor(value.color);
      if (!isPredefined) {
        setCustomName(value.name);
      }
    }
  }, [value]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const predefined = predefinedColors.find((c) => c.value === color);
    if (predefined) {
      onChange({
        color,
        name: predefined.label,
        serial: value?.serial || "",
      });
      setInputMode("select");
    } else {
      setInputMode("input");
    }
  };

  const handleNameChange = (e) => {
    setCustomName(e.target.value);
    onChange({
      color: selectedColor,
      name: e.target.value,
      serial: value?.serial || "",
    });
  };

  const handleSerialChange = (e) => {
    onChange({
      color: selectedColor,
      name:
        inputMode === "select"
          ? predefinedColors.find((c) => c.value === selectedColor)?.label || ""
          : customName,
      serial: e.target.value,
    });
  };

  // Update the ColorLegendInput component
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-4">
        {/* Color Selection - Takes 8 columns */}
        <div className="col-span-8">
          <label className="text-xs font-medium text-gray-500 mb-1 flex items-center uppercase tracking-wider">
            <FaPalette className="mr-2 text-gray-400" size={12} />
            {label}
            <span className="text-red-500 ml-1">*</span>
          </label>

          <div className="flex items-center gap-2">
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => handleColorSelect(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
            />

            <select
              value={selectedColor}
              onChange={(e) => handleColorSelect(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-800 shadow-sm appearance-none"
            >
              <option value="">Select a color</option>
              {predefinedColors.map((color, index) => (
                <option key={index} value={color.value}>
                  {color.label}
                </option>
              ))}
              <option value="custom">Custom Color...</option>
            </select>
          </div>
        </div>

        {/* Legend Number - Takes 4 columns */}
        <div className="col-span-4">
          <label className="text-xs font-medium text-gray-500 mb-1 flex items-center uppercase tracking-wider">
            Legend No.
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={value?.serial || ""}
            onChange={handleSerialChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-800 shadow-sm"
          />
        </div>
      </div>

      {/* Custom Color Name Input - Show only when needed */}
      {inputMode === "input" && selectedColor && (
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 flex items-center uppercase tracking-wider">
            Custom Color Name
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            value={customName}
            onChange={handleNameChange}
            placeholder="Enter color name"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-800 shadow-sm"
          />
        </div>
      )}
    </div>
  );
};

function DesignSheet() {
  const [colorLegend, setColorLegend] = useState([]);
  const getColorName = (hex) => {
    const legendEntry = colorLegend.find((l) => l.color === hex);
    if (legendEntry) return legendEntry.name;

    const found = predefinedColors.find((c) => c.value === hex);
    return found ? found.label : hex;
  };

  useEffect(() => {
    console.log("Color Legend Updated:", colorLegend);
  });

  // State management
  const [designName, setDesignName] = useState("");
  const [partialThreads, setPartialThreads] = useState([]);
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
    {
      color: "#000000",
      threadCount: "",
      colorName: getColorName("#000000"),
    },
  ]);
  const [totalThreadSum, setTotalThreadSum] = useState(0);
  const [totalOrderWidth, setTotalORderWidth] = useState(0);
  const [legendFormData, setLegendFormData] = useState({
    color: "",
    name: "",
    serial: "",
  });

  const [warpWeights, setWarpWeights] = useState([]);
  const [threadSummary, setThreadSummary] = useState([]);
  const [repeatInfo, setRepeatInfo] = useState(null);
  const [totalThreads, setTotalThreads] = useState(0);
  const [finalThreadSummary, setFinalThreadSummary] = useState([]);
  const [threadWeights, setThreadWeights] = useState([]);
  const [TotalThreadWeights, setTotalThreadWeights] = useState([]);

  const getAvailableColors = () => {
    return colorLegend.map((item) => {
      const predefined = predefinedColors.find((c) => c.value === item.color);
      return (
        predefined || { value: item.color, label: getColorName(item.color) }
      );
    });
  };

  useEffect(() => {
    if (repeatInfo && repeatInfo.stoppingIndex >= 0) {
      const partialThreadsData = [];

      // Calculate threads up to stopping index
      for (let i = 0; i < repeatInfo.stoppingIndex; i++) {
        const design = warpDesigns[i];
        const threadCount = parseInt(design.threadCount) || 0;
        if (threadCount > 0) {
          partialThreadsData.push({
            color: design.color,
            legendNumber: getLegendNumberForColor(colorLegend, design.color),
            threadCount: threadCount,
            colorName: getColorName(design.color),
          });
        }
      }

      // Add the partial thread count for stopping color
      if (repeatInfo.adjustedValue > 0) {
        const stoppingDesign = warpDesigns[repeatInfo.stoppingIndex];
        partialThreadsData.push({
          color: stoppingDesign.color,
          legendNumber: getLegendNumberForColor(
            colorLegend,
            stoppingDesign.color
          ),
          threadCount: repeatInfo.adjustedValue,
          colorName: getColorName(stoppingDesign.color),
        });
      }

      setPartialThreads(partialThreadsData);
    }
  }, [repeatInfo, warpDesigns, colorLegend]);

  // Then modify the useEffect that calculates weights:
  useEffect(() => {
    if (warpWeights.length > 0 && totalThreads > 0) {
      const totalWarpWeight = warpWeights.reduce(
        (sum, weight) => sum + parseFloat(weight || 0),
        0
      );

      // Calculate individual weights
      const weights = finalThreadSummary.map(
        ({ color, legendNumber, finalCount }) => {
          const threadPercentage = finalCount / totalThreads;
          const weightForColor = totalWarpWeight * threadPercentage;
          const totalWeightForColor = weightForColor * totalOrderWidth;

          return {
            color,
            legendNumber,
            threadCount: finalCount,
            weight: weightForColor.toFixed(3),
            totalWeight: totalWeightForColor.toFixed(3),
          };
        }
      );

      // Add total row data
      const totalRow = {
        color: null,
        legendNumber: "total",
        threadCount: totalThreads,
        weight: totalWarpWeight.toFixed(3),
        totalWeight: (
          totalWarpWeight * parseFloat(totalOrderWidth || 0)
        ).toFixed(3),
      };

      // Set threadWeights with both individual weights and total
      setThreadWeights([...weights, totalRow]);
    }
  }, [warpWeights, totalThreads, finalThreadSummary, totalOrderWidth]);

  //calculate total threads
  useEffect(() => {
    if (!repeatInfo) {
      setTotalThreads(totalThreadSum);
      setFinalThreadSummary(
        threadSummary.map(({ color, legendNumber, totalThreadCount }) => ({
          color,
          legendNumber,
          finalCount: totalThreadCount,
        }))
      );
      return;
    }

    // Total threads in design
    const partialRepeatSum = warpDesigns
      .slice(0, repeatInfo.stoppingIndex)
      .reduce((sum, design) => sum + (parseInt(design.threadCount) || 0), 0);
    const total =
      totalThreadSum * repeatInfo.repeat +
      partialRepeatSum +
      (repeatInfo.adjustedValue || 0);
    setTotalThreads(total);

    // Final count for each color
    const updatedSummary = threadSummary.map(
      ({ color, legendNumber, totalThreadCount }) => {
        let finalCount = totalThreadCount * repeatInfo.repeat;
        const designIndex = warpDesigns.findIndex((d) => d.color === color);

        if (designIndex >= 0 && designIndex < repeatInfo.stoppingIndex) {
          finalCount += parseInt(warpDesigns[designIndex].threadCount) || 0;
        } else if (designIndex === repeatInfo.stoppingIndex) {
          finalCount += repeatInfo.adjustedValue || 0;
        }

        return { color, legendNumber, finalCount };
      }
    );

    setFinalThreadSummary(updatedSummary);
  }, [repeatInfo, warpDesigns, totalThreadSum, threadSummary]);

  // Calculate each color total thread
  useEffect(() => {
    const threadSummary = {};
    let sum = 0;

    for (const { color, threadCount } of warpDesigns) {
      const count = parseInt(threadCount);
      const safeCount = isNaN(count) ? 0 : count;
      const legendNumber = getLegendNumberForColor(colorLegend, color);

      if (!threadSummary[legendNumber]) {
        threadSummary[legendNumber] = {
          legendNumber,
          color,
          totalThreadCount: 0,
        };
      }

      threadSummary[legendNumber].totalThreadCount += safeCount;
      sum += safeCount;
    }

    setThreadSummary(Object.values(threadSummary));
    setTotalThreadSum(sum);
  }, [warpDesigns, colorLegend]);

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
    const availableColors = getAvailableColors();
    const defaultColor =
      availableColors.length > 0 ? availableColors[0].value : "#000000";

    setWarpDesigns([
      ...warpDesigns,
      {
        color: defaultColor,
        threadCount: "",
        colorName: getColorName(defaultColor),
      },
    ]);
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
    const newValue = value.target ? value.target.value : value;

    if (field === "color") {
      const availableColors = getAvailableColors();
      const isValidColor = availableColors.some((c) => c.value === newValue);
      if (!isValidColor && availableColors.length > 0) {
        newDesigns[index][field] = availableColors[0].value;
        newDesigns[index].colorName = availableColors[0].label;
      } else {
        newDesigns[index][field] = newValue;
        newDesigns[index].colorName = getColorName(newValue);
      }
    } else {
      newDesigns[index][field] = newValue;
    }

    setWarpDesigns(newDesigns);
  };

  // Replace the handleLegendFormSubmit function
  const handleLegendFormSubmit = (e) => {
    e.preventDefault();
    if (!legendFormData.color) {
      toast.error("Please select a color", {
        icon: "🎨",
      });
      return;
    }

    const isPredefined = predefinedColors.some(
      (c) => c.value === legendFormData.color
    );
    const name = isPredefined
      ? predefinedColors.find((c) => c.value === legendFormData.color)?.label ||
        ""
      : legendFormData.name;

    if (!name) {
      toast.error("Please enter a color name", {
        icon: "✏️",
      });
      return;
    }
    if (!legendFormData.serial) {
      toast.error("Please enter a legend number", {
        icon: "🔢",
      });
      return;
    }

    const serialNumber = parseInt(legendFormData.serial);

    // Check if serial number already exists
    if (colorLegend.some((item) => item.serial === serialNumber)) {
      toast.error("This legend number is already in use", {
        icon: "❌",
        description: "Please choose a different number",
      });
      return;
    }

    // Check if color already exists (for both predefined and custom colors)
    if (colorLegend.some((item) => item.color === legendFormData.color)) {
      toast.error("This color is already in the legend", {
        icon: "🎨",
        description: "Each color can only be used once",
      });
      return;
    }

    // Add new color to legend
    setColorLegend((prev) => [
      ...prev,
      {
        color: legendFormData.color,
        name,
        serial: serialNumber,
      },
    ]);

    // Show success message
    toast.success("Color added to legend successfully", {
      icon: "✅",
    });

    // Reset form
    setLegendFormData({
      color: "",
      name: "",
      serial: "",
    });
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

  function findRepeatInfo(target, threadCounts, colors) {
    const totalSum = threadCounts.reduce((acc, val) => acc + val, 0);
    const repeat = Math.floor(target / totalSum);
    let cumulative = repeat * totalSum;

    for (let i = 0; i < threadCounts.length; i++) {
      if (cumulative + threadCounts[i] >= target) {
        const difference = cumulative + threadCounts[i] - target;
        return {
          repeat,
          stoppingIndex: i,
          color: colors[i],
          originalValue: threadCounts[i],
          adjustedValue: threadCounts[i] - difference,
          difference,
        };
      }
      cumulative += threadCounts[i];
    }

    return null;
  }

  useEffect(() => {
    const threadCounts = warpDesigns.map((d) => parseInt(d.threadCount) || 0);
    const colors = warpDesigns.map((d) => d.colorName || getColorName(d.color));
    const target = totalYarn;

    const info = findRepeatInfo(target, threadCounts, colors);
    setRepeatInfo(info);
  }, [warpDesigns, totalYarn]);

  useEffect(() => {
    console.log("Warp Designs Updated:", warpDesigns);
  });
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              style: {
                background: "#22c55e",
              },
            },
            error: {
              style: {
                background: "#ef4444",
              },
            },
          }}
        />
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600 mr-4">
              <FaBoxOpen size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                Design Sheet
              </h1>
              <p className="text-xs md:text-sm text-gray-500">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column - Specifications */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <SectionCard
              title="Fabric Specifications"
              icon={FaToolbox}
              color="text-blue-600"
            >
              <div className="space-y-4 md:space-y-6">
                <TextInput
                  label="Total Order Width (m)"
                  value={totalOrderWidth}
                  onChange={(e) => setTotalORderWidth(e.target.value)}
                  type="number"
                  icon={FaToolbox}
                  min={0}
                  step="0.01"
                />
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

            <SectionCard
              title="Color Legend"
              icon={FaPalette}
              color="text-green-600"
            >
              <form onSubmit={handleLegendFormSubmit}>
                <ColorLegendInput
                  value={legendFormData}
                  onChange={setLegendFormData}
                  label="Add to Color Legend"
                  colorLegend={colorLegend}
                />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full mt-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2 font-medium text-sm"
                >
                  <FaPlus size={14} />
                  Add to Legend
                </motion.button>
              </form>

              <div className="mt-6">
                <h4 className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                  Current Color Legend
                </h4>
                {colorLegend.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {colorLegend.map((l, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        className="p-3 rounded-lg bg-gray-50 border border-gray-200 flex items-start gap-3 relative"
                      >
                        <div className="flex-shrink-0 flex flex-col items-center">
                          <span
                            className="w-8 h-8 rounded border border-gray-300"
                            style={{ background: l.color }}
                          ></span>
                          <span className="text-xs mt-1 text-gray-500">
                            #{l.color.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <h5 className="font-medium text-gray-800">
                              {l.name}
                            </h5>
                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                              {l.serial}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">
                              {predefinedColors.some((c) => c.value === l.color)
                                ? "Predefined"
                                : "Custom"}
                            </span>
                            <button
                              className="text-red-400 hover:text-red-600 transition-colors p-1"
                              onClick={() =>
                                setColorLegend(
                                  colorLegend.filter((_, i) => i !== idx)
                                )
                              }
                              aria-label="Remove color"
                            >
                              <FaTimes size={12} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-sm text-gray-500">
                      No colors added to legend yet. Add your first color above.
                    </p>
                  </div>
                )}
              </div>
            </SectionCard>

            {/* Warp Design Section */}
            <SectionCard
              title="Warp Design"
              icon={FaPalette}
              color="text-purple-600"
              noPadding
            >
              <div className="space-y-4">
                {/* Column headings - Keep this fixed */}
                <div className="grid grid-cols-12 gap-4 px-4 pt-3 bg-white sticky top-0 z-10 border-b border-gray-100">
                  <div className="col-span-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No.
                  </div>
                  <div className="col-span-6 md:col-span-7 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Color
                  </div>
                  <div className="col-span-5 md:col-span-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thread Count
                  </div>
                </div>

                {/* Scrollable design list */}
                <div className="max-h-[500px] overflow-y-auto">
                  <div className="divide-y divide-gray-100">
                    {warpDesigns.map((design, index) => (
                      <div
                        key={`design-${index}`}
                        className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 transition-colors relative group"
                      >
                        <div className="col-span-1 flex items-center">
                          <span className="text-sm font-medium text-gray-600">
                            {index + 1}
                          </span>
                        </div>

                        <div className="col-span-6 md:col-span-7 relative">
                          <ColorInput
                            value={design.color}
                            onChange={(e) =>
                              handleWarpDesignChange(index, "color", e)
                            }
                            availableColors={getAvailableColors()}
                            compact
                            hideLabel
                          />
                          <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-purple-100 text-purple-800 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border border-purple-200">
                            {getLegendNumberForColor(
                              colorLegend,
                              design.color
                            ) || "?"}
                          </div>
                        </div>
                        <div className="col-span-5 md:col-span-4">
                          <TextInput
                            value={design.threadCount}
                            onChange={(e) =>
                              handleWarpDesignChange(
                                index,
                                "threadCount",
                                e.target.value
                              )
                            }
                            type="number"
                            min={0}
                            step="1"
                            compact
                            hideLabel
                          />
                        </div>
                        {warpDesigns.length > 1 && (
                          <button
                            onClick={() => removeWarpDesign(index)}
                            className="absolute -right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50"
                            aria-label="Remove design"
                          >
                            <FaTimes size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Keep the buttons outside the scroll area */}
                <div className="px-4 pb-3 border-t border-gray-100 bg-white">
                  {colorLegend.length > 0 ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={addWarpDesign}
                      className="w-full py-2 bg-purple-50 text-purple-600 rounded-lg border border-purple-200 hover:bg-purple-100 transition-all flex items-center justify-center gap-2 font-medium text-sm"
                    >
                      <FaPlus size={14} />
                      Add Design
                    </motion.button>
                  ) : (
                    <div className="text-center text-sm text-gray-500">
                      Please add colors to the Color Legend first
                    </div>
                  )}
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Right Column - Results & Summary */}
          <div className="space-y-4 md:space-y-6">
            <SectionCard
              title="Quick Summary"
              icon={FaCalculator}
              color="text-indigo-600"
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
                    icon={FaSlidersH}
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
              title="Threads Per Color / Pattern"
              icon={FaCalculator}
              color="text-indigo-600"
            >
              <div className="grid grid-cols-2 gap-4">
                {threadSummary.map(
                  ({ color, legendNumber, totalThreadCount }) => (
                    <div
                      key={legendNumber}
                      className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-4 border border-gray-100"
                    >
                      <span className="text-sm font-medium text-gray-600">
                        {getColorName(color)}
                      </span>
                      <span className="text-xs text-gray-400 mb-1">
                        (Color {legendNumber})
                      </span>
                      <span className="text-lg font-bold text-gray-800">
                        {totalThreadCount} Threads
                      </span>
                    </div>
                  )
                )}
              </div>
              <div className="mt-4">
                <ResultCard
                  title="Total Threads per Pattern"
                  value={totalThreadSum}
                  icon={FaSlidersH}
                  color="bg-green-50"
                />
              </div>
            </SectionCard>
            <SectionCard
              title="Total Threads Per Color"
              icon={FaCalculator}
              color="text-indigo-600"
            >
              {repeatInfo && (
                <div className="mt-4">
                  <ResultCard
                    title="Repeat Info"
                    value={
                      <>
                        Repeat: <b>{repeatInfo.repeat}</b>
                        <br />
                        Stop at Color: <b>{repeatInfo.color}</b> (Index{" "}
                        {repeatInfo.stoppingIndex + 1})
                        <br />
                        Original: <b>{repeatInfo.originalValue}</b>, Adjusted:{" "}
                        <b>{repeatInfo.adjustedValue}</b>
                        <br />
                        Difference: <b>{repeatInfo.difference}</b>
                      </>
                    }
                    icon={FaCalculator}
                    color="bg-yellow-50"
                  />
                </div>
              )}
            </SectionCard>
            {repeatInfo && partialThreads.length > 0 && (
              <div className="mt-4">
                <ResultCard
                  title="Partial Thread Distribution"
                  icon={FaCalculator}
                  color="bg-yellow-50"
                  value={
                    <div className="w-full">
                      <div className="text-sm text-gray-600 mb-2">
                        Partial pattern threads (0.
                        {Math.round((repeatInfo.repeat * 100) % 100)} repeat):
                      </div>
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="text-left text-xs font-medium text-gray-500">
                              Color
                            </th>
                            <th className="text-right text-xs font-medium text-gray-500">
                              Threads
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {partialThreads.map((thread, index) => (
                            <tr key={index}>
                              <td className="py-2">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-4 h-4 rounded-full border border-gray-200"
                                    style={{ backgroundColor: thread.color }}
                                  />
                                  <span className="text-sm">
                                    {thread.colorName} (Color{" "}
                                    {thread.legendNumber})
                                  </span>
                                </div>
                              </td>
                              <td className="py-2 text-right text-sm">
                                {thread.threadCount}
                              </td>
                            </tr>
                          ))}
                          <tr className="font-medium">
                            <td className="py-2">Total</td>
                            <td className="py-2 text-right">
                              {partialThreads.reduce(
                                (sum, t) => sum + t.threadCount,
                                0
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  }
                />
              </div>
            )}
          </div>
        </div>
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <FaWeight className="text-indigo-600" />
              <h3 className="font-semibold text-xl text-gray-800">
                Thread Weight Distribution
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5"
                    >
                      Color
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5"
                    >
                      Thread Count
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5"
                    >
                      Weight (kg)
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5"
                    >
                      Total Weight (kg)
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5"
                    >
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {threadWeights.map(
                    ({
                      color,
                      legendNumber,
                      threadCount,
                      weight,
                      totalWeight,
                    }) => (
                      <tr
                        key={`weight-${legendNumber}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-6 h-6 rounded-full border border-gray-200 flex-shrink-0"
                              style={{ backgroundColor: color }}
                            />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">
                                {getColorName(color)}
                              </span>
                              <span className="text-xs text-gray-500">
                                Color {legendNumber}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                          {threadCount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                          {parseFloat(weight).toFixed(3)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                          {parseFloat(totalWeight).toFixed(3)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                          {((threadCount / totalThreads) * 100).toFixed(2)}%
                        </td>
                      </tr>
                    )
                  )}
                  <tr className="bg-gray-50 font-medium">
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      Total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                      {totalThreads.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                      {warpWeights
                        .reduce(
                          (sum, weight) => sum + parseFloat(weight || 0),
                          0
                        )
                        .toFixed(3)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                      {(
                        warpWeights.reduce(
                          (sum, weight) => sum + parseFloat(weight || 0),
                          0
                        ) * parseFloat(totalOrderWidth || 0)
                      ).toFixed(3)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                      100%
                    </td> */}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Color Pattern Bar */}

        <div className="w-full flex justify-center mt-6 md:mt-8">
          <div
            className="flex flex-row items-end w-full max-w-4xl rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm p-2"
            style={{ height: "200px" }}
          >
            {(() => {
              let strips = [];
              let totalThreads = 0;

              // Build the full pattern as per repeatInfo
              if (repeatInfo) {
                // Full repeats
                for (let r = 0; r < repeatInfo.repeat; r++) {
                  warpDesigns.forEach((design) => {
                    const count = parseInt(design.threadCount) || 0;
                    const legendNumber = getLegendNumberForColor(
                      colorLegend,
                      design.color
                    );
                    for (let i = 0; i < count; i++) {
                      strips.push({
                        color: design.color,
                        title: legendNumber
                          ? `Color ${legendNumber}`
                          : getColorName(design.color),
                      });
                    }
                  });
                }
                // Partial up to stoppingIndex
                for (let i = 0; i < repeatInfo.stoppingIndex; i++) {
                  const design = warpDesigns[i];
                  const count = parseInt(design.threadCount) || 0;
                  const legendNumber = getLegendNumberForColor(
                    colorLegend,
                    design.color
                  );
                  for (let j = 0; j < count; j++) {
                    strips.push({
                      color: design.color,
                      title: legendNumber
                        ? `Color ${legendNumber}`
                        : getColorName(design.color),
                    });
                  }
                }
                // Adjusted value for the stopping color
                if (repeatInfo.adjustedValue > 0) {
                  const adjustedColor =
                    warpDesigns[repeatInfo.stoppingIndex]?.color;
                  const legendNumber = getLegendNumberForColor(
                    colorLegend,
                    adjustedColor
                  );
                  for (let i = 0; i < repeatInfo.adjustedValue; i++) {
                    strips.push({
                      color: adjustedColor,
                      title: legendNumber
                        ? `Color ${legendNumber}`
                        : getColorName(adjustedColor),
                    });
                  }
                }
              } else {
                // No repeatInfo: just show all strips as usual
                warpDesigns.forEach((design) => {
                  const count = parseInt(design.threadCount) || 0;
                  const legendNumber = getLegendNumberForColor(
                    colorLegend,
                    design.color
                  );
                  for (let i = 0; i < count; i++) {
                    strips.push({
                      color: design.color,
                      title: legendNumber
                        ? `Color ${legendNumber}`
                        : getColorName(design.color),
                    });
                  }
                });
              }

              totalThreads = strips.length;

              // Calculate the length of a single pattern repeat
              const singlePatternLength = warpDesigns.reduce(
                (sum, d) => sum + (parseInt(d.threadCount) || 0),
                0
              );

              // Limit the number of boxes for display
              const MAX_BOXES = 400;
              let displayStrips = [];
              let boxSize = 2; // px
              let markerIndex = null;

              if (totalThreads > MAX_BOXES) {
                // Group threads into boxes
                const groupSize = Math.ceil(totalThreads / MAX_BOXES);
                let threadCounter = 0;
                let markerPlaced = false;
                for (let i = 0; i < totalThreads; i += groupSize) {
                  // If marker falls within this group, split the group at the marker
                  if (
                    !markerPlaced &&
                    threadCounter < singlePatternLength &&
                    threadCounter + groupSize > singlePatternLength
                  ) {
                    // First part before marker
                    const beforeMarker = strips.slice(
                      i,
                      i + (singlePatternLength - threadCounter)
                    );
                    if (beforeMarker.length > 0) {
                      const colorCount = {};
                      beforeMarker.forEach((s) => {
                        colorCount[s.color] = (colorCount[s.color] || 0) + 1;
                      });
                      const mainColor = Object.entries(colorCount).sort(
                        (a, b) => b[1] - a[1]
                      )[0][0];
                      displayStrips.push({
                        color: mainColor,
                        title:
                          beforeMarker[0].title +
                          (beforeMarker.length > 1
                            ? ` (+${beforeMarker.length - 1})`
                            : ""),
                      });
                    }
                    // Place marker after the first repeat
                    markerIndex = displayStrips.length;
                    markerPlaced = true;
                    // Second part after marker
                    const afterMarker = strips.slice(
                      i + (singlePatternLength - threadCounter),
                      i + groupSize
                    );
                    if (afterMarker.length > 0) {
                      const colorCount = {};
                      afterMarker.forEach((s) => {
                        colorCount[s.color] = (colorCount[s.color] || 0) + 1;
                      });
                      const mainColor = Object.entries(colorCount).sort(
                        (a, b) => b[1] - a[1]
                      )[0][0];
                      displayStrips.push({
                        color: mainColor,
                        title:
                          afterMarker[0].title +
                          (afterMarker.length > 1
                            ? ` (+${afterMarker.length - 1})`
                            : ""),
                      });
                    }
                  } else {
                    // Normal grouping
                    const group = strips.slice(i, i + groupSize);
                    const colorCount = {};
                    group.forEach((s) => {
                      colorCount[s.color] = (colorCount[s.color] || 0) + 1;
                    });
                    const mainColor = Object.entries(colorCount).sort(
                      (a, b) => b[1] - a[1]
                    )[0][0];
                    displayStrips.push({
                      color: mainColor,
                      title:
                        group[0].title +
                        (group.length > 1 ? ` (+${group.length - 1})` : ""),
                    });
                    // Place marker if the marker falls exactly after this group
                    if (
                      !markerPlaced &&
                      threadCounter + group.length === singlePatternLength
                    ) {
                      markerIndex = displayStrips.length;
                      markerPlaced = true;
                    }
                  }
                  threadCounter += groupSize;
                }
                boxSize = Math.max(2, Math.floor(800 / displayStrips.length));
              } else {
                displayStrips = strips;
                boxSize = Math.max(2, Math.floor(800 / totalThreads));
                markerIndex = singlePatternLength;
              }

              return displayStrips.map((strip, idx) => (
                <React.Fragment key={idx}>
                  <div
                    style={{
                      width: `${boxSize}px`,
                      height: "100%",
                      background: strip.color,
                      marginRight: "0px",
                      minWidth: "2px",
                      display: "inline-block",
                    }}
                    title={strip.title}
                  />
                </React.Fragment>
              ));
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesignSheet;
