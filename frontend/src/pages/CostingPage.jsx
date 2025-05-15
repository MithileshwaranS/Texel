import React, { useEffect, useState } from "react";
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
  FaPlus
} from "react-icons/fa";
import { Grid } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Custom Components
const TextInput = ({ label, value, onChange, type = "text", placeholder = "", icon: Icon, className = "", min, step, required = true }) => (
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
);

const DropdownField = ({ label, value, onChange, options, icon: Icon, required = true }) => (
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
);

const ResultCard = ({ title, value, icon: Icon, color = "bg-white" }) => (
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
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
    </div>
    <p className="text-xl font-semibold text-gray-800 mt-1">
      {value || "0.000"}
    </p>
  </motion.div>
);

const SectionCard = ({ title, icon: Icon, children, color = "text-blue-600" }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
  >
    <h2 className={`text-sm font-semibold mb-4 flex items-center ${color} uppercase tracking-wider`}>
      {Icon && <Icon className="mr-2" size={14} />}
      {title}
    </h2>
    <div className="space-y-4">
      {children}
    </div>
  </motion.div>
);

const SubmitButton = ({ disabled, onClick }) => (
  <motion.button
    whileHover={!disabled ? { scale: 1.02 } : {}}
    whileTap={!disabled ? { scale: 0.98 } : {}}
    onClick={onClick}
    disabled={disabled}
    className={`w-full py-3 px-6 rounded-xl font-medium text-white transition-all ${
      disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md'
    } relative overflow-hidden`}
  >
    <span className="relative z-10">Submit Design</span>
    {!disabled && (
      <motion.span 
        className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity"
        whileHover={{ opacity: 0.1 }}
      />
    )}
  </motion.button>
);

function CostingPage() {
  // State
  const [designName, setDesignName] = useState("");
  const [displayedName, setDisplayName] = useState("");
  const [width, setWidth] = useState("");
  const [weaving, setWeaving] = useState("");
  const [washing, setWashing] = useState(8);
  const [profit, setProfit] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [saveprofit, setSaveProfit] = useState("");
  const [gst, setGst] = useState("");
  const [transport, setTransport] = useState(7);
  const [mending, setMending] = useState(10);
  const [finaltotal, setFinalTotal] = useState("");
  const [yarnCount, setYarnCount] = useState([]);
  const [yarnPrice, setYarnPrice] = useState([]);
  const [toast, setToast] = useState(null);
  const [profitPercent, setprofitPercent] = useState(0.15);
  const [designDate, setDesignDate] = useState(new Date().toISOString().split('T')[0]);
  const [twisting, setTwisting] = useState(0);
  
  // Warp and Weft states
  const [warps, setWarps] = useState([
    { count: "", reed: "", cost: "", dyeing: 300, constant: 1.35 }
  ]);
  
  const [wefts, setWefts] = useState([
    { count: "", pick: "", cost: "", dyeing: 300, constant: 1.35 }
  ]);
  
  // Calculated weights
  const [warpWeights, setWarpWeights] = useState([]);
  const [weftWeights, setWeftWeights] = useState([]);

  // useEffect(() => {
  //   console.log("🔍 Warps:", warps);
  //   console.log("🔍 Warp Weights:", warpWeights);
  //   console.log("🔍 Wefts:", wefts);
  //   console.log("🔍 Weft Weights:", weftWeights);
  // }, [warps, warpWeights, wefts, weftWeights]);

  // Calculated costs
  const [warpCost, setWarpCost] = useState("");
  const [weftCost, setWeftCost] = useState("");

  const Toast = ({ message, type, onClose }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-lg flex items-center ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } text-white z-50`}
    >
      <span className="text-sm font-medium">{message}</span>
      <button 
        onClick={onClose}
        className="ml-4 text-white hover:text-gray-200 transition-colors"
      >
        <FaTimes size={14} />
      </button>
    </motion.div>
  );

  // Helper functions
  const toNum = (val) => parseFloat(val || 0);

  const getHanksWt = (count) => {
    const found = yarnCount.find(y => y.yarn_count === count);
    return found ? found.hanks_wt : 0;
  };

  const getYarnPrice = (count) => {
    const found = yarnPrice.find(y => y.yarn_count === count);
    return found ? found.yarnprice : 0;
  };

  const sortYarnCounts = (counts) => {
    const regularCounts = [];
    const twistedCounts = [];

    counts.forEach(count => {
      if (count.includes('/')) {
        twistedCounts.push(count);
      } else {
        regularCounts.push(count);
      }
    });

    const parseCount = (str) => {
      if (str.includes('/')) {
        const [prefix, base] = str.replace('s', '').split('/').map(Number);
        return prefix * base;
      } else {
        return parseInt(str.replace('s', ''));
      }
    };

    regularCounts.sort((a, b) => parseCount(a) - parseCount(b));
    twistedCounts.sort((a, b) => parseCount(a) - parseCount(b));

    return [...regularCounts, ...twistedCounts];
  };

  // Warp and Weft management
  const addWarp = () => {
    setWarps([...warps, { count: "", reed: "", cost: "", dyeing: 300, constant: 1.35 }]);
  };

  const removeWarp = (index) => {
    if (warps.length > 1) {
      const newWarps = [...warps];
      newWarps.splice(index, 1);
      setWarps(newWarps);
    }
  };

  const addWeft = () => {
    setWefts([...wefts, { count: "", pick: "", cost: "", dyeing: 300, constant: 1.35 }]);
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

  // Form submission
  const onSubmitForm = async (e) => {
    try {
      e.preventDefault();
      if (!checkAllFieldsFilled()) {
        setToast({
          message: 'Please fill all required fields',
          type: 'error'
        });
        return;
      }

      const body = {
        designName,
        width,
        warps,
        wefts,
        weaving,
        washing,
        profit,
        totalCost,
        saveprofit,
        gst,
        transport,
        finaltotal,
        designDate,
        mending,
        twisting,
        profitPercent,
        warpWeights,
        weftWeights,
        warpCost,
        weftCost
        
      };
      console.log(body)

      const response = await fetch(`http://localhost:3000/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const result = await response.json();

      if (response.status === 409) {
        setToast({
          message: result.message,
          type: 'error'
        });
        return;
      }

      if (response.ok) {
        setToast({
          message: 'Design submitted successfully!',
          type: 'success',
        });
        // Reset all fields
        setDesignName('');
        setWidth('');
        setWarps([{ count: "", reed: "", cost: "", dyeing: 300, constant: 1.35 }]);
        setWefts([{ count: "", pick: "", cost: "", dyeing: 300, constant: 1.35 }]);
        setWarpWeights([]);
        setWeftWeights([]);
        setWeaving('');
        setWashing(8);
        setProfit('');
        setTotalCost('');
        setSaveProfit('');
        setGst('');
        setTransport(7);
        setFinalTotal('');
        setMending(10);
        setTwisting(0);
        setDesignDate(new Date().toISOString().split('T')[0]);
        
      } else {
        setToast({
          message: 'Failed to submit design. Please try again.',
          type: 'error'
        });
      }
    } catch (err) {
      console.log(err.message);
      setToast({
        message: 'An error occurred. Please try again.',
        type: 'error'
      });
    }
  };

  const checkAllFieldsFilled = () => {
    if (!designName || !width) return false;
    
    // Check all warps
    for (const warp of warps) {
      if (!warp.count || !warp.reed || !warp.cost || !warp.dyeing) return false;
    }
    
    // Check all wefts
    for (const weft of wefts) {
      if (!weft.count || !weft.pick || !weft.cost || !weft.dyeing) return false;
    }
    
    return weaving !== "" && washing !== "" && transport !== "";
  };

  // Effects
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    setDisplayName(designName);
  }, [designName]);

  // Calculate weights whenever inputs change
  useEffect(() => {
    if (width) {
      const newWarpWeights = warps.map(warp => {
        if (warp.count && warp.reed) {
          return ((toNum(width) * toNum(warp.reed) * toNum(warp.constant || 1.35)) / 840 * getHanksWt(warp.count)).toFixed(3);
        }
        return "0.000";
      });
      setWarpWeights(newWarpWeights);
    }
  }, [width, warps]);

  useEffect(() => {
    if (width) {
      const newWeftWeights = wefts.map(weft => {
        if (weft.count && weft.pick) {
          return ((toNum(width) * toNum(weft.pick) * toNum(weft.constant || 1.35)) / 840 * getHanksWt(weft.count)).toFixed(3);
        }
        return "0.000";
      });
      setWeftWeights(newWeftWeights);
    }
  }, [width, wefts]);

  // Calculate costs whenever weights or prices change
  useEffect(() => {
    const totalWarpCost = warps.reduce((sum, warp, index) => {
      if (warp.cost!=null && warp.dyeing!=null && warpWeights[index]!=null) {
        return sum + (toNum(warp.cost) + toNum(warp.dyeing)) * toNum(warpWeights[index]);
      }
      return sum;
    }, 0);
    setWarpCost(toNum(totalWarpCost.toFixed(3)));
  }, [warps, warpWeights]);

  useEffect(() => {
    const totalWeftCost = wefts.reduce((sum, weft, index) => {
      if (weft.cost!=null && weft.dyeing!=null && weftWeights[index]!=null) {
        return sum + (toNum(weft.cost) + toNum(weft.dyeing)) * toNum(weftWeights[index]);
      }
      return sum;
    }, 0);
    setWeftCost(totalWeftCost.toFixed(3));
  }, [wefts, weftWeights]);

  // Calculate profit, total cost, GST, and final total
  useEffect(() => {
    if (warpCost!=null && weftCost!=null && weaving!=null && washing!=null && mending!=null && twisting!=null) {
      const profitVal = (toNum(warpCost) + toNum(weftCost) + toNum(weaving) + toNum(washing) + toNum(mending) + toNum(twisting) +toNum(transport)) * profitPercent;
      setProfit(profitVal.toFixed(3));
      setSaveProfit(profitVal.toFixed(3));
    }
  }, [warpCost, weftCost, weaving, washing, profitPercent, mending, twisting,transport]);

  useEffect(() => {
    if (warpCost!=null && weftCost!=null && weaving!=null && washing!=null && saveprofit!=null && transport!=null && mending!=null && twisting!=null) {
      const total = toNum(warpCost) + toNum(weftCost) + toNum(weaving) + toNum(washing) + toNum(saveprofit) + toNum(mending) + toNum(twisting) + toNum(transport);
      setTotalCost(total.toFixed(3));
    }
  }, [warpCost, weftCost, weaving, washing, saveprofit, transport, mending, twisting]);

  useEffect(() => {
    if (totalCost) {
      const gstVal = toNum(totalCost) * 0.05;
      setGst(gstVal.toFixed(3));
    }
  }, [totalCost]);

  useEffect(() => {
    if (totalCost && gst) {
      const sum = toNum(totalCost) + toNum(gst);
      setFinalTotal(sum.toFixed(3));
    }
  }, [totalCost, gst]);

  // Fetch yarn data
  useEffect(() => {
    fetch(`http://localhost:3000/api/yarnCounts`)
      .then(response => response.json())
      .then(data => setYarnCount(data))
      .catch(error => console.error('Error fetching data:', error));

    fetch(`http://localhost:3000/api/yarnPrice`)
      .then(response => response.json())
      .then(data => setYarnPrice(data))
      .catch(error => console.error('Error fetching data', error));
  }, []);

  // Set initial costs when counts are selected
 useEffect(() => {
  const newWarps = warps.map((warp) => {
    if (warp.count) {
      return {
        ...warp,
        cost: getYarnPrice(warp.count),
      };
    }
    return warp;
  });

  setWarps(newWarps);
}, [warps.map(w => w.count).join(',')]);


useEffect(() => {
  const newWefts = wefts.map((weft) => {
    if (weft.count) {
      return {
        ...weft,
        cost: getYarnPrice(weft.count), // always update based on count
      };
    }
    return weft;
  });

  setWefts(newWefts);
}, [wefts.map(w => w.count).join(',')]); // depend only on counts


  // Get yarn count options
  const warpCountOptions = yarnCount?.map(y => y?.yarn_count) || [];
  const weftCountOptions = yarnCount?.map(y => y.yarn_count) || [];
  
  const sortedWarpCountOptions = sortYarnCounts([...warpCountOptions]);
  const sortedWeftCountOptions = sortYarnCounts([...weftCountOptions]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 mr-4 shadow-sm">
              <FaCalculator size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Fabric Costing Calculator
              </h1>
              {displayedName && (
                <p className="text-blue-600 font-medium mt-1">
                  Design: <span className="font-bold">{displayedName}</span>
                </p>
              )}
            </div>
          </div>
          
          <div className="w-full md:w-80">
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextInput
                  label="Design Name"
                  value={designName}
                  onChange={(e) => setDesignName(e.target.value)}
                  placeholder="Enter design name..."
                  icon={FaFileSignature}
                  required={true}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-500 mb-1 flex items-center uppercase tracking-wider">
                    <FaCalendarAlt className="mr-2 text-gray-400" size={12} />
                    Design Date
                  </label>
                  <div className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-800 shadow-sm">
                    {designDate}
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Inputs */}
          <div className="lg:col-span-2 space-y-6">
            <SectionCard title="Fabric Specifications" icon={FaToolbox} color="text-blue-600">
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
                    <h3 className="text-sm font-medium text-gray-700">Warp Specifications</h3>
                    <button 
                      onClick={addWarp}
                      className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors flex items-center"
                    >
                      <FaPlus size={10} className="mr-1" /> Add Warp
                    </button>
                  </div>
                  
                  {warps.map((warp, index) => (
                    <div key={`warp-${index}`} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 relative">
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
                        onChange={(e) => handleWarpChange(index, 'count', e.target.value)}
                        options={sortedWarpCountOptions}
                        icon={FaWeight}
                      />
                      <TextInput
                        label="Reed"
                        value={warp.reed}
                        onChange={(e) => handleWarpChange(index, 'reed', e.target.value)}
                        type="number"
                        icon={FaIndustry}
                        min={0}
                        step="0.01"
                      />
                      <TextInput
                        label="Warp Constant"
                        value={warp.constant}
                        onChange={(e) => handleWarpChange(index, 'constant', e.target.value)}
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
                    <h3 className="text-sm font-medium text-gray-700">Weft Specifications</h3>
                    <button 
                      onClick={addWeft}
                      className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors flex items-center"
                    >
                      <FaPlus size={10} className="mr-1" /> Add Weft
                    </button>
                  </div>
                  
                  {wefts.map((weft, index) => (
                    <div key={`weft-${index}`} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 relative">
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
                        value={weft.count}
                        onChange={(e) => handleWeftChange(index, 'count', e.target.value)}
                        options={sortedWeftCountOptions}
                        icon={FaWeight}
                      />
                      <TextInput
                        label="Pick"
                        value={weft.pick}
                        onChange={(e) => handleWeftChange(index, 'pick', e.target.value)}
                        type="number"
                        icon={FaIndustry}
                        min={0}
                        step="0.01"
                      />
                      <TextInput
                        label="Weft Constant"
                        value={weft.constant}
                        onChange={(e) => handleWeftChange(index, 'constant', e.target.value)}
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

            <SectionCard title="Material Costs" icon={FaMoneyBillWave} color="text-green-600">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700">Warp Costs</h3>
                  {warps.map((warp, index) => (
                    <div key={`warp-cost-${index}`} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 relative">
                      <div className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {index + 1}
                      </div>
                      <TextInput
                        label="Warp Cost (per unit)"
                        value={warp.cost}
                        onChange={(e) => handleWarpChange(index, 'cost', e.target.value)}
                        type="number"
                        icon={FaMoneyBillWave}
                        min={0}
                        step="0.01"
                      />
                      <TextInput
                        label="Warp Dyeing Cost"
                        value={warp.dyeing}
                        onChange={(e) => handleWarpChange(index, 'dyeing', e.target.value)}
                        type="number"
                        icon={FaIndustry}
                        min={0}
                        step="0.01"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700">Weft Costs</h3>
                  {wefts.map((weft, index) => (
                    <div key={`weft-cost-${index}`} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 relative">
                      <div className="absolute -top-2 -left-2 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {index + 1}
                      </div>
                      <TextInput
                        label="Weft Cost (per unit)"
                        value={weft.cost}
                        onChange={(e) => handleWeftChange(index, 'cost', e.target.value)}
                        type="number"
                        icon={FaMoneyBillWave}
                        min={0}
                        step="0.01"
                      />
                      <TextInput
                        label="Weft Dyeing Cost"
                        value={weft.dyeing}
                        onChange={(e) => handleWeftChange(index, 'dyeing', e.target.value)}
                        type="number"
                        icon={FaIndustry}
                        min={0}
                        step="0.01"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Processing Costs" icon={FaIndustry} color="text-purple-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label="Weaving Cost"
                  value={weaving}
                  onChange={(e) => setWeaving(e.target.value)}
                  type="number"
                  icon={FaIndustry}
                  min={0}
                  step="0.01"
                />
                <TextInput
                  label="Washing Cost"
                  value={washing}
                  onChange={(e) => setWashing(e.target.value)}
                  type="number"
                  icon={FaIndustry}
                  min={0}
                  step="0.01"
                />
                <TextInput
                  label="Mending Cost"
                  value={mending}
                  onChange={(e) => setMending(e.target.value)}
                  type="number"
                  icon={FaIndustry}
                  min={0}
                  step="0.01"
                />
                <TextInput
                  label="Twisting Cost"
                  value={twisting}
                  onChange={(e) => setTwisting(e.target.value)}
                  type="number"
                  icon={FaTruck}
                  min={0}
                  step="0.01"
                />
                <TextInput
                  label="Transport Cost"
                  value={transport}
                  onChange={(e) => setTransport(e.target.value)}
                  type="number"
                  icon={FaTruck}
                  min={0}
                  step="0.01"
                />
                <TextInput
                  label="Profit %"
                  value={(profitPercent * 100).toFixed(0)}
                  onChange={(e) => setprofitPercent(e.target.value / 100)}
                  type="number"
                  icon={FaPercentage}
                  min={0}
                  max={100}
                  step="1"
                />
              </div>
            </SectionCard>
            
            <motion.div whileHover={{ scale: 1.005 }}>
              <SubmitButton 
                disabled={!checkAllFieldsFilled()} 
                onClick={onSubmitForm} 
              />
            </motion.div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            <SectionCard title="Weight Calculations" icon={FaWeight} color="text-yellow-600">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Warp Weights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                
                <h3 className="text-sm font-medium text-gray-700 mt-6">Weft Weights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {weftWeights.map((weight, index) => (
                    <ResultCard
                      key={`weft-weight-${index}`}
                      title={`Weft ${index + 1} Weight`}
                      value={weight}
                      icon={FaWeight}
                      color="bg-yellow-50"
                    />
                  ))}
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Cost Breakdown" icon={FaMoneyBillWave} color="text-blue-600">
              <div className="grid grid-cols-1 gap-4">
                <ResultCard
                  title="Total Warp Cost"
                  value={warpCost}
                  icon={FaMoneyBillWave}
                  color="bg-blue-50"
                />
                <ResultCard
                  title="Total Weft Cost"
                  value={weftCost}
                  icon={FaMoneyBillWave}
                  color="bg-blue-50"
                />
                <ResultCard
                  title="Processing Cost"
                  value={(toNum(weaving) + toNum(washing) + toNum(mending) + toNum(twisting)).toFixed(3)}
                  icon={FaIndustry}
                  color="bg-purple-50"
                />
              </div>
            </SectionCard>

            <SectionCard title="Final Costs" icon={FaCalculator} color="text-green-600">
              <div className="grid grid-cols-1 gap-4">
                <ResultCard
                  title={`Profit (${(profitPercent * 100).toFixed(0)}%)`}
                  value={profit}
                  icon={FaPercentage}
                  color="bg-green-50"
                />
                <ResultCard
                  title="Subtotal"
                  value={(toNum(warpCost) + toNum(weftCost) + toNum(weaving) + toNum(washing) + toNum(mending) + toNum(twisting) + toNum(profit)).toFixed(3)}
                  icon={FaCalculator}
                  color="bg-gray-50"
                />
                <ResultCard
                  title="GST (5%)"
                  value={gst}
                  icon={FaPercentage}
                  color="bg-red-50"
                />
                <ResultCard
                  title="Final Total"
                  value={finaltotal}
                  icon={FaMoneyBillWave}
                  color="bg-green-50"
                />
              </div>
            </SectionCard>
          </div>
        </div>
        
        <AnimatePresence>
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default CostingPage;