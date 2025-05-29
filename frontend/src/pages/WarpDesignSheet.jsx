import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import html2canvas from "html2canvas";

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
  FaDownload,
} from "react-icons/fa";

const createPatternSVG = (
  designs,
  totalWidth,
  totalHeight,
  repeatInfo,
  totalYarn
) => {
  const singlePatternLength = designs.reduce(
    (sum, d) => sum + (parseInt(d.threadCount) || 0),
    0
  );

  let svgContent = "";
  let currentX = 0;

  // Calculate total pattern width including remaining portion
  const totalPatternWidth =
    ((repeatInfo.repeat * singlePatternLength +
      (repeatInfo.adjustedValue || 0)) /
      totalYarn) *
    totalWidth;

  // Add padding to ensure no overlap
  const patternPadding = 40;
  const labelPadding = 60;
  const effectiveHeight = totalHeight - labelPadding;

  // Function to create a pattern section
  const createSection = (designList, isPartial = false) => {
    let sectionX = 0;
    const sectionTotalThreads = designList.reduce(
      (sum, d) => sum + (parseInt(d.threadCount) || 0),
      0
    );

    // Calculate section width based on total threads proportion
    const sectionWidth = (sectionTotalThreads / totalYarn) * totalWidth;

    designList.forEach((design) => {
      const threadCount = parseInt(design.threadCount) || 0;
      if (threadCount <= 0) return;

      // Calculate segment width based on proportion within this section
      const width = (threadCount / sectionTotalThreads) * sectionWidth;

      svgContent += `<rect x="${currentX + sectionX}" y="${
        patternPadding / 2
      }" width="${width}" height="${effectiveHeight}" fill="${design.color}"/>`;
      sectionX += width;
    });

    currentX += sectionWidth;
    return sectionWidth;
  };

  // Add full repeats
  for (let i = 0; i < repeatInfo.repeat; i++) {
    const sectionWidth = createSection(designs);

    // Add separator line with improved styling
    if (i < repeatInfo.repeat - 1 || repeatInfo.adjustedValue > 0) {
      svgContent += `
        <g>
          <!-- Main pattern separator line -->
          <line 
            x1="${currentX}" 
            y1="0" 
            x2="${currentX}" 
            y2="${totalHeight}" 
            stroke="#666" 
            stroke-width="2.5"
            stroke-dasharray="8,6"
            vector-effect="non-scaling-stroke"
          />
          <!-- Extended line in label area with reduced opacity -->
          <line 
            x1="${currentX}" 
            y1="${effectiveHeight + patternPadding / 2}" 
            x2="${currentX}" 
            y2="${totalHeight}" 
            stroke="#666" 
            stroke-width="2.5"
            stroke-dasharray="8,6"
            opacity="0.4"
            vector-effect="non-scaling-stroke"
          />
        </g>`;
    }
  }

  // Add partial section if exists
  let remainingWidth = 0;
  if (repeatInfo.stoppingIndex >= 0 && repeatInfo.adjustedValue > 0) {
    const partialDesigns = [
      ...designs.slice(0, repeatInfo.stoppingIndex),
      {
        ...designs[repeatInfo.stoppingIndex],
        threadCount: repeatInfo.adjustedValue,
      },
    ];
    remainingWidth = createSection(partialDesigns, true);
  }

  // Add labels with improved spacing and alignment
  let labelX = 0;
  const labelY = effectiveHeight + labelPadding;
  const labelFontSize = "14px";

  // Add repeat labels
  for (let i = 0; i < repeatInfo.repeat; i++) {
    const sectionWidth = (singlePatternLength / totalYarn) * totalWidth;
    svgContent += `
      <text 
        x="${labelX + sectionWidth / 2}" 
        y="${labelY}" 
        text-anchor="middle" 
        fill="#666" 
        font-size="${labelFontSize}"
        font-weight="500"
      >
        Repeat ${i + 1}
      </text>
    `;
    labelX += sectionWidth;
  }

  // Add remaining label with proper spacing
  if (repeatInfo.adjustedValue > 0) {
    svgContent += `
      <text 
        x="${labelX + remainingWidth / 2}" 
        y="${labelY}" 
        text-anchor="middle" 
        fill="#666" 
        font-size="${labelFontSize}"
        font-weight="500"
      >
        Remaining
      </text>
    `;
  }

  // Add background for better visibility
  const backgroundSvg = `
    <rect 
      x="0" 
      y="0" 
      width="${totalWidth}" 
      height="${totalHeight}" 
      fill="white"
    />
  `;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" 
         width="${totalWidth}" 
         height="${totalHeight}"
         style="background-color: white;">
      ${backgroundSvg}
      ${svgContent}
    </svg>
  `;
};

// Color conversion utilities
const rgbToHex = (r, g, b) => {
  const toHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return "#" + toHex(r) + toHex(g) + toHex(b);
};

const colorToHex = (color) => {
  if (!color) return "#000000";

  // If it's already a hex color, return as is
  if (color.startsWith("#")) {
    return color;
  }

  // Create a temporary element
  const temp = document.createElement("div");
  document.body.appendChild(temp);

  // Set the color and get computed style
  temp.style.color = color;
  const computedColor = window.getComputedStyle(temp).color;
  document.body.removeChild(temp);

  // Parse RGB values
  const match = computedColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (match) {
    const [_, r, g, b] = match.map(Number);
    return rgbToHex(r, g, b);
  }

  // Default to black if conversion fails
  return "#000000";
};

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

const ColorPicker = ({
  value,
  onChange,
  onRemove,
  inputMode = "select",
  compact = false,
  hideLabel = false,
  availableColors = [],
}) => {
  const [customColor, setCustomColor] = useState("#000000");
  const [customName, setCustomName] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [colors, setColors] = useState([]);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BACKEND_URL}/api/colors`
        );
        const data = await response.json();
        const formattedColors = data.map((color) => ({
          value: color.colorvalue,
          label: color.colorlabel,
        }));
        setColors(formattedColors);
      } catch (error) {
        console.error("Error fetching colors:", error);
      }
    };

    fetchColors();
  }, []);

  useEffect(() => {
    if (value) {
      setSelectedColor(value.color || "");
      setCustomColor(value.color || "#000000");
      setCustomName(value.name || "");
    }
  }, [value]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const predefined = colors.find((c) => c.value === color);
    if (predefined) {
      onChange({
        color,
        name: predefined.label,
      });
    } else {
      onChange({
        color,
        name: customName,
      });
    }
  };

  return (
    <div className={`flex ${compact ? "space-x-2" : "space-x-4"} items-center`}>
      {inputMode === "select" ? (
        <select
          value={selectedColor}
          onChange={(e) => handleColorSelect(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Select a color</option>
          {colors.map((color) => (
            <option key={color.value} value={color.value}>
              {color.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="color"
          value={customColor}
          onChange={(e) => {
            setCustomColor(e.target.value);
            handleColorSelect(e.target.value);
          }}
          className="w-8 h-8 rounded cursor-pointer"
        />
      )}
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

const ColorLegendInput = ({ value, onChange, label, colorLegend, colors }) => {
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    if (value) {
      setSelectedColor(value.color);
    }
  }, [value]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const predefined = colors.find((c) => c.value === color);
    if (predefined) {
      onChange({
        color,
        name: predefined.label,
        serial: value?.serial || "",
      });
    }
  };

  const handleSerialChange = (e) => {
    onChange({
      color: selectedColor,
      name: colors.find((c) => c.value === selectedColor)?.label || "",
      serial: e.target.value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <label className="text-xs font-medium text-gray-500 mb-1 flex items-center uppercase tracking-wider">
            <FaPalette className="mr-2 text-gray-400" size={12} />
            {label}
            <span className="text-red-500 ml-1">*</span>
          </label>

          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded cursor-pointer border border-gray-200"
              style={{ backgroundColor: selectedColor }}
            />

            <select
              value={selectedColor}
              onChange={(e) => handleColorSelect(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-800 shadow-sm appearance-none"
            >
              <option value="">Select a color</option>
              {colors.map((color) => (
                <option key={color.value} value={color.value}>
                  {color.label}
                </option>
              ))}
            </select>
          </div>
        </div>

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
    </div>
  );
};

function WarpDesignSheet({
  color,
  onChangeDesignType,
  onChangeDesignName,
  onChangeColorName,
}) {
  const [colorLegend, setColorLegend] = useState([]);
  const [isPatternVisible, setIsPatternVisible] = useState(false);
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState("#000000");

  const getColorName = (hex) => {
    const legendEntry = colorLegend.find((l) => l.color === hex);
    if (legendEntry) return legendEntry.name;

    const found = colors.find((c) => c.value === hex);
    return found ? found.label : hex;
  };

  // State management
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
      color: color || "#000000",
      threadCount: "",
      colorName: getColorName(color || "#000000"),
    },
  ]);
  const [totalThreadSum, setTotalThreadSum] = useState(0);
  const [totalOrderWidth, setTotalORderWidth] = useState(0);
  const [legendFormData, setLegendFormData] = useState({
    color: "",
    name: "",
    serial: "",
  });

  const [designName, setDesignName] = useState("");
  const [warpWeights, setWarpWeights] = useState([]);
  const [threadSummary, setThreadSummary] = useState([]);
  const [repeatInfo, setRepeatInfo] = useState(null);
  const [totalThreads, setTotalThreads] = useState(0);
  const [finalThreadSummary, setFinalThreadSummary] = useState([]);
  const [threadWeights, setThreadWeights] = useState([]);
  const [TotalThreadWeights, setTotalThreadWeights] = useState([]);
  const [finalData, setFinalData] = useState(null);

  // Add new state for the pattern ref
  const patternRef = React.useRef(null);

  const saveData = async () => {
    try {
      // First create the finalData object
      const finalDataObj = {
        totalThreadSum: totalThreadSum,
        designName: designName,
        partialThreads: partialThreads,
        colorName: getColorName(selectedColor),
        warps: warps.map((warp) => ({
          count: warp.count,
          reed: warp.reed,
          constant: warp.constant,
        })),
        totalOrderWidth,
        WarpOrder: warpDesigns.map((warp) => ({
          color: warp.color,
          threadCount: warp.threadCount,
          colorName: getColorName(warp.color),
        })),
        width,
        totalThreads,
        warpWeights,
        threadSummary: threadSummary.map((thread) => ({
          color: thread.color,
          legendNumber: thread.legendNumber,
          totalThreadCount: thread.totalThreadCount,
        })),
        threadWeights: threadWeights.map((weight) => {
          // Find corresponding thread in threadSummary for single repeat count
          const threadSummaryItem = threadSummary.find(
            (t) => t.color === weight.color
          );
          return {
            color: weight.color ? getColorName(weight.color) : "Total",
            colorValue: weight.color,
            legendNumber: weight.legendNumber,
            threadCount: weight.threadCount,
            weight: weight.weight,
            totalWeight: weight.totalWeight,
            singleRepeatThread: threadSummaryItem?.totalThreadCount || 0,
          };
        }),
      };

      // Set the final data state
      setFinalData(finalDataObj);

      // Send to backend
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/save-design`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalDataObj),
        }
      );
      const data = await response.json();
      console.log(data);
      toast.success("Design saved successfully!");
      onChangeDesignName(designName);
      onChangeColorName(selectedColor);
      onChangeDesignType("weft");
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save design");
    }
  };

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BACKEND_URL}/api/colors`
        );
        const data = await response.json();
        // Transform the data to match the expected format
        const formattedColors = data.map((color) => ({
          value: color.colorvalue,
          label: color.colorlabel,
        }));
        setColors(formattedColors);
      } catch (error) {
        console.error("Error fetching colors:", error);
      }
    };

    fetchColors();
  }, []);

  const getAvailableColors = () => {
    return colorLegend.map((item) => {
      const predefined = colors.find((c) => c.value === item.color);
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

    // Calculate total threads in full repeats
    const fullRepeatThreads = totalThreadSum * repeatInfo.repeat;

    // Calculate threads in partial section
    let partialThreads = 0;
    const colorThreadCounts = new Map(); // Use Map to track threads per color

    // First, add threads from full repeats for each color
    threadSummary.forEach(({ color, legendNumber, totalThreadCount }) => {
      colorThreadCounts.set(color, totalThreadCount * repeatInfo.repeat);
    });

    // Then add threads from partial section
    if (repeatInfo.stoppingIndex >= 0) {
      // Add complete sections in partial repeat
      for (let i = 0; i < repeatInfo.stoppingIndex; i++) {
        const design = warpDesigns[i];
        const threadCount = parseInt(design.threadCount) || 0;
        const currentCount = colorThreadCounts.get(design.color) || 0;
        colorThreadCounts.set(design.color, currentCount + threadCount);
        partialThreads += threadCount;
      }

      // Add the partial section
      if (repeatInfo.adjustedValue > 0) {
        const stoppingDesign = warpDesigns[repeatInfo.stoppingIndex];
        const currentCount = colorThreadCounts.get(stoppingDesign.color) || 0;
        colorThreadCounts.set(
          stoppingDesign.color,
          currentCount + repeatInfo.adjustedValue
        );
        partialThreads += repeatInfo.adjustedValue;
      }
    }

    // Set total threads
    const total = fullRepeatThreads + partialThreads;
    setTotalThreads(total);

    // Create final summary
    const updatedSummary = Array.from(colorThreadCounts.entries()).map(
      ([color, count]) => ({
        color,
        legendNumber: getLegendNumberForColor(colorLegend, color),
        finalCount: count,
      })
    );

    setFinalThreadSummary(updatedSummary);
  }, [repeatInfo, warpDesigns, totalThreadSum, threadSummary, colorLegend]);

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
          colorName: getColorName(color),
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
      const newDesigns = warpDesigns.filter((_, i) => i !== index);
      setWarpDesigns(newDesigns);
      // Reset pattern visibility when designs change
      setIsPatternVisible(false);
      setRepeatInfo(null);
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
    // Reset pattern visibility when designs change
    setIsPatternVisible(false);
    setRepeatInfo(null);
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

    const isPredefined = colors.some((c) => c.value === legendFormData.color);
    const name = isPredefined
      ? colors.find((c) => c.value === legendFormData.color)?.label || ""
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

  const validatePatternInputs = () => {
    // Check if we have any colors in the legend
    if (colorLegend.length === 0) {
      toast.error("Please add colors to the legend first");
      return false;
    }

    // Check if we have any warp designs
    if (warpDesigns.length === 0) {
      toast.error("Please add at least one design");
      return false;
    }

    // Check if all designs have valid colors and thread counts
    const invalidDesign = warpDesigns.find(
      (design) => !design.color || !design.threadCount
    );
    if (invalidDesign) {
      toast.error("Please fill in all color and thread count fields");
      return false;
    }

    // Check if width is set
    if (!width) {
      toast.error("Please enter the width");
      return false;
    }

    return true;
  };

  const generatePattern = () => {
    if (!validatePatternInputs()) return;

    const threadCounts = warpDesigns.map((d) => parseInt(d.threadCount) || 0);
    const colors = warpDesigns.map((d) => d.colorName || getColorName(d.color));
    const target = totalYarn;

    const info = findRepeatInfo(target, threadCounts, colors);
    setRepeatInfo(info);
    setIsPatternVisible(true);

    toast.success("Pattern generated successfully!");
  };

  // Update the downloadPattern function
  const downloadPattern = async () => {
    if (!repeatInfo || !warpDesigns.length) {
      toast.error("No pattern to download");
      return;
    }

    try {
      toast.loading("Generating pattern image...", { id: "download-toast" });
      const svgContent = createPatternSVG(
        warpDesigns,
        1200,
        400,
        repeatInfo,
        totalYarn
      );

      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/uploadPattern`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            svgContent,
            designName: designName || "pattern",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload pattern");
      }

      const { url, publicId } = await response.json();

      const link = document.createElement("a");
      link.href = url;
      link.download = `${designName || "pattern"}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Pattern downloaded successfully!", {
        id: "download-toast",
      });

      return { publicId, url };
    } catch (error) {
      console.error("Error downloading pattern:", error);
      toast.error("Failed to download pattern", { id: "download-toast" });
    }
  };

  // Update the pattern rendering code
  const createPatternGroup = (designs, isPartial = false) => {
    // Calculate total threads in this group
    const groupTotalThreads = designs.reduce((sum, design) => {
      return sum + (parseInt(design.threadCount) || 0);
    }, 0);

    // Calculate width based on proportion of total threads
    const totalWidth = (groupTotalThreads / totalYarn) * 100;

    // Declare arrays for labels and separators
    const labels = [];
    const separators = [];

    return (
      <div
        className="flex flex-col relative"
        style={{
          width: `${totalWidth}%`,
          minWidth: isPartial ? "50px" : minWidthPerRepeat + "px",
        }}
      >
        <div className="flex h-40">
          {designs.map((design, idx) => {
            const threadCount = parseInt(design.threadCount) || 0;
            if (threadCount <= 0) return null;

            // Calculate segment width based on proportion within this group
            const segmentWidth = (threadCount / groupTotalThreads) * 100;

            // Convert color to hex
            const hexColor = colorToHex(design.color);

            return (
              <div
                key={idx}
                style={{
                  width: `${segmentWidth}%`,
                  backgroundColor: hexColor,
                  minWidth: "3px",
                }}
                className="h-full"
                data-color={hexColor}
              />
            );
          })}
        </div>
      </div>
    );
  };

  // Update useEffect to watch for color prop changes
  useEffect(() => {
    if (color && warpDesigns.length > 0) {
      const newDesigns = [...warpDesigns];
      newDesigns[0] = {
        ...newDesigns[0],
        color: color,
        colorName: getColorName(color),
      };
      setWarpDesigns(newDesigns);
    }
  }, [color]);

  // Add new function to handle state logging
  const handleSubmitState = () => {
    // Create final data object with specific values
    const finalDataObj = {
      designName: designName,
      colorName: getColorName(selectedColor),
      warps: warps.map((warp) => ({
        count: warp.count,
        reed: warp.reed,
        constant: warp.constant,
      })),
      totalOrderWidth,
      width,
      totalThreads,
      warpWeights,
      threadSummary: threadSummary.map((thread) => ({
        color: getColorName(thread.color),
        legendNumber: thread.legendNumber,
        totalThreadCount: thread.totalThreadCount,
      })),
      threadWeights: threadWeights.map((weight) => {
        // Find corresponding thread in threadSummary for single repeat count
        const threadSummaryItem = threadSummary.find(
          (t) => t.color === weight.color
        );
        return {
          color: weight.color ? getColorName(weight.color) : "Total",
          colorValue: weight.color,
          legendNumber: weight.legendNumber,
          threadCount: weight.threadCount,
          weight: weight.weight,
          totalWeight: weight.totalWeight,
          singleRepeatThread: threadSummaryItem?.totalThreadCount || 0,
        };
      }),
    };

    // Set the final data state
    setFinalData(finalDataObj);

    // Log the values
    console.log("Design Name:", designName);
    console.log("Selected Color:", {
      color: selectedColor,
      colorName: getColorName(selectedColor),
    });
    console.log("Final Data:", finalDataObj);

    const allState = {
      designName,
      selectedColor,
      partialThreads,
      width,
      yarnCount,
      yarnPrice,
      isLoading,
      totalYarn,
      warpTotalThread,
      warps,
      warpDesigns,
      totalThreadSum,
      totalOrderWidth,
      legendFormData,
      warpWeights,
      threadSummary,
      repeatInfo,
      totalThreads,
      finalThreadSummary,
      threadWeights,
      TotalThreadWeights,
      colorLegend,
    };

    console.log("Current Warp Design State:", allState);
  };

  // Add useEffect to watch finalData changes
  useEffect(() => {
    if (finalData) {
      console.log("Updated Final Data:", finalData);
    }
  }, [finalData]);

  // Add new button component
  const SubmitButton = () => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={saveData}
      className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
    >
      <FaSave size={14} />
      <span className="text-sm font-medium">Save Design</span>
    </motion.button>
  );

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
                Warp Design Sheet
              </h1>
              <p className="text-xs md:text-sm text-gray-500">
                Design your Warp
              </p>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Design Name"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                placeholder="Enter design name"
                icon={FaFileSignature}
                required={true}
              />
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-500 mb-1 flex items-center uppercase tracking-wider">
                  <FaPalette className="mr-2 text-gray-400" size={12} />
                  Color
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={selectedColor}
                  onChange={(e) => {
                    setSelectedColor(e.target.value);
                    // Update initial warp design color
                    setWarpDesigns([
                      {
                        color: e.target.value,
                        threadCount: "",
                        colorName: getColorName(e.target.value),
                      },
                    ]);
                  }}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-800 shadow-sm appearance-none"
                >
                  <option value="">Select a color</option>
                  {colors.map((color) => (
                    <option key={color.value} value={color.value}>
                      {color.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
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
                  colors={colors}
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
                              {colors.some((c) => c.value === l.color)
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
                          <select
                            value={design.color}
                            onChange={(e) =>
                              handleWarpDesignChange(
                                index,
                                "color",
                                e.target.value
                              )
                            }
                            className="block w-full px-3 py-1 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-800 shadow-sm appearance-none"
                          >
                            <option value="">Select a color</option>
                            {colorLegend.map((legendColor) => (
                              <option
                                key={legendColor.serial}
                                value={legendColor.color}
                              >
                                {legendColor.name} (Color {legendColor.serial})
                              </option>
                            ))}
                          </select>
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
                  {colors.length > 0 ? (
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
            {/* <SectionCard
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
            </SectionCard> */}
          </div>
        </div>
        <div className="mt-6">
          {repeatInfo && (
            <div className="mt-4 mb-5">
              <ResultCard
                title="Partial Thread Distribution"
                icon={FaCalculator}
                color="bg-yellow-50"
                value={
                  <div className="w-full">
                    <div className="text-md text-gray-600 mb-2">
                      Total Repeat : {repeatInfo.repeat}
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
                        {partialThreads.length > 0 ? (
                          partialThreads.map((thread, index) => (
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
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="2"
                              className="py-4 text-center text-sm text-gray-500"
                            >
                              No partial threads - Complete repeat pattern
                            </td>
                          </tr>
                        )}
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
        <div className="w-full flex flex-col items-center mt-6 md:mt-8">
          <div className="w-full max-w-6xl bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-semibold text-gray-800">
                Pattern Visualization
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={generatePattern}
                  className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <FaCalculator size={14} />
                  <span className="text-sm font-medium">Generate Pattern</span>
                </button>
                {isPatternVisible && (
                  <>
                    <button
                      onClick={downloadPattern}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <FaDownload size={14} />
                      <span className="text-sm font-medium">
                        Download Pattern
                      </span>
                    </button>
                    <SubmitButton />
                  </>
                )}
              </div>
            </div>

            {/* Pattern Container */}
            {isPatternVisible && repeatInfo && (
              <div className="relative">
                {/* Pattern Display */}
                <div className="w-full overflow-x-auto">
                  <div
                    ref={patternRef}
                    className="flex flex-row items-end min-w-full bg-white"
                    style={{
                      minHeight: "200px",
                      paddingBottom: "40px",
                    }}
                  >
                    {(() => {
                      let displayElements = [];
                      const singlePatternLength = warpDesigns.reduce(
                        (sum, d) => sum + (parseInt(d.threadCount) || 0),
                        0
                      );

                      if (!repeatInfo || !singlePatternLength) return null;

                      // Calculate minimum width per repeat to ensure visibility
                      const minWidthPerRepeat = 90;
                      const totalRepeats =
                        repeatInfo.repeat +
                        (repeatInfo.adjustedValue > 0 ? 1 : 0);
                      const containerWidth = Math.max(
                        totalRepeats * minWidthPerRepeat,
                        150
                      );

                      // Declare arrays for labels and separators
                      const labels = [];
                      const separators = [];

                      // Function to create a pattern group
                      const createPatternGroup = (
                        designs,
                        isPartial = false
                      ) => {
                        // Calculate total threads in this group
                        const groupTotalThreads = designs.reduce(
                          (sum, design) => {
                            return sum + (parseInt(design.threadCount) || 0);
                          },
                          0
                        );

                        // Calculate width based on proportion of total threads
                        const totalWidth =
                          (groupTotalThreads / totalYarn) * 100;

                        return (
                          <div
                            className="flex flex-col relative"
                            style={{
                              width: `${totalWidth}%`,
                              minWidth: isPartial
                                ? "50px"
                                : minWidthPerRepeat + "px",
                            }}
                          >
                            <div className="flex h-40">
                              {designs.map((design, idx) => {
                                const threadCount =
                                  parseInt(design.threadCount) || 0;
                                if (threadCount <= 0) return null;

                                // Calculate segment width based on proportion within this group
                                const segmentWidth =
                                  (threadCount / groupTotalThreads) * 100;

                                // Convert color to hex
                                const hexColor = colorToHex(design.color);

                                return (
                                  <div
                                    key={idx}
                                    style={{
                                      width: `${segmentWidth}%`,
                                      backgroundColor: hexColor,
                                      minWidth: "3px",
                                    }}
                                    className="h-full"
                                    data-color={hexColor}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        );
                      };

                      // Add full repeats
                      for (let i = 0; i < repeatInfo.repeat; i++) {
                        displayElements.push(createPatternGroup(warpDesigns));

                        // Add label
                        labels.push(
                          <div
                            key={`label-${i}`}
                            className="absolute text-xs text-gray-600 font-medium"
                            style={{
                              left: `${
                                ((i * singlePatternLength) / totalYarn) * 100
                              }%`,
                              bottom: "-25px",
                              transform: "translateX(-50%)",
                            }}
                          >
                            Repeat {i + 1}
                          </div>
                        );

                        // Add separator (except for last repeat)
                        if (
                          i < repeatInfo.repeat - 1 ||
                          repeatInfo.adjustedValue > 0
                        ) {
                          separators.push(
                            <div
                              key={`separator-${i}`}
                              className="absolute h-full w-0.5 bg-gray-300"
                              style={{
                                left: `${
                                  (((i + 1) * singlePatternLength) /
                                    totalYarn) *
                                  100
                                }%`,
                                transform: "translateX(-50%)",
                              }}
                            />
                          );
                        }
                      }

                      // Add partial repeat if exists
                      if (
                        repeatInfo.stoppingIndex >= 0 &&
                        repeatInfo.adjustedValue > 0
                      ) {
                        const partialDesigns = [
                          ...warpDesigns.slice(0, repeatInfo.stoppingIndex),
                          {
                            ...warpDesigns[repeatInfo.stoppingIndex],
                            threadCount: repeatInfo.adjustedValue,
                          },
                        ];

                        displayElements.push(
                          createPatternGroup(partialDesigns, true)
                        );
                        labels.push(
                          <div
                            key="label-remaining"
                            className="absolute text-xs text-gray-600 font-medium"
                            style={{
                              right: "0",
                              bottom: "-25px",
                              transform: "translateX(50%)",
                            }}
                          >
                            Remaining
                          </div>
                        );
                      }

                      return (
                        <div
                          className="relative"
                          style={{ width: containerWidth + "px" }}
                        >
                          <div className="relative flex">
                            {separators}
                            {displayElements}
                          </div>
                          {labels}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {colorLegend.map((l, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-sm border border-gray-200"
                        style={{ backgroundColor: l.color }}
                      />
                      <span className="text-xs text-gray-600">
                        Color {l.serial}: {l.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WarpDesignSheet;
