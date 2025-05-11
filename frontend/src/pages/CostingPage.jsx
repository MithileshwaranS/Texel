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
  FaTimes
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
  const [reed, setReed] = useState("");
  const [pick, setPick] = useState("");
  const [warpweight, setWarpWeight] = useState("");
  const [weftweight, setWeftWeight] = useState("");
  const [warpCount, setWarpCount] = useState("");
  const [weftCount, setWeftCount] = useState("");
  const [warpCost, setWarpCost] = useState("");
  const [weftCost, setWeftCost] = useState("");
  const [warpDyeing, setWarpDyeing] = useState(300);
  const [weftDyeing, setWeftDyeing] = useState(300);
  const [initWeftCost, setInitWeftCost] = useState("");
  const [initWarpCost, setInitWarpCost] = useState("");
  const [weaving, setWeaving] = useState("");
  const [washing, setWashing] = useState(8);
  const [profit, setProfit] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [saveprofit, setSaveProfit] = useState("");
  const [gst, setGst] = useState("");
  const [transport, setTransport] = useState(7);
  const [mending,setMending] = useState(10);
  const [finaltotal, setFinalTotal] = useState("");
  const [yarnCount, setYarnCount] = useState([]);
  const [yarnPrice,setYarnPrice] = useState([]);
  const [numWarpConstant,setWarpNumConstant] = useState(1.35);
  const [numWeftConstant,setWeftNumConstant] = useState(1.35);
  const [toast, setToast] = useState(null);
  const [profitPercent,setprofitPercent] = useState(0.15);
  const [designDate,setDesignDate] = useState(new Date().toISOString().split('T')[0]);
  const [twisting,setTwisting] = useState(0);

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
        reed,
        pick,
        warpweight,
        weftweight,
        warpCount,
        weftCount,
        warpCost,
        weftCost,
        warpDyeing,
        weftDyeing,
        initWeftCost,
        initWarpCost,
        weaving,
        washing,
        profit,
        totalCost,
        saveprofit,
        gst,
        transport,
        finaltotal,
        designDate
      };

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
        setReed('');
        setPick('');
        setWarpWeight('');
        setWeftWeight('');
        setWarpCount('');
        setWeftCount('');
        setWarpCost('');
        setWeftCost('');
        setWarpDyeing(300);
        setWeftDyeing(300);
        setInitWeftCost('');
        setInitWarpCost('');
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
    const requiredFields = [
      designName,
      width,
      reed,
      pick,
      warpCount,
      weftCount,
      initWarpCost,
      initWeftCost,
      warpDyeing,
      weftDyeing,
      weaving,
      washing,
      transport
    ];
    
    return requiredFields.every(field => field !== "" && field !== undefined && field !== null);
  };

  // Constants
  const warpCountOptions = yarnCount?.map(y => y?.yarn_count) || [];
  const weftCountOptions = yarnCount?.map(y => y.yarn_count) || [];
  
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

  const sortedWarpCountOptions = sortYarnCounts([...warpCountOptions]);
  const sortedWeftCountOptions = sortYarnCounts([...weftCountOptions]);

  const getHanksWt = (count) => {
    const found = yarnCount.find(y => y.yarn_count === count);
    return found ? found.hanks_wt : 0;
  };

  const getYarnPrice = (count) => {
    const found = yarnPrice.find(y => y.yarn_count === count);
    return found ? found.yarnprice : 0;
  }

  // Helper function
  const toNum = (val) => parseFloat(val || 0);

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

  useEffect(() => {
    // Fetch data from API
    fetch(`http://localhost:3000/api/yarnCounts`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setYarnCount(data)})
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetch(`http://localhost:3000/api/yarnPrice`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setYarnPrice(data)})
      .catch(error => console.error('Error fetching data', error));
  }, []);

  useEffect(() => {
    if (warpCount!=null) {
      setInitWarpCost(getYarnPrice(`${warpCount}`))
    }
  }, [warpCount]);

  useEffect(() => {
    if (weftCount!=null) {
      setInitWeftCost(getYarnPrice(`${weftCount}`))
    }
  }, [weftCount]);

  useEffect(() => {
    if (width!=null && reed!=null && warpCount!=null) {
      const weight = ((toNum(width) * toNum(reed) * toNum(numWarpConstant)) / 840 * getHanksWt(warpCount));
      setWarpWeight(weight.toFixed(3));
    }
  }, [width, reed, warpCount, numWarpConstant]);

  useEffect(() => {
    if (width!=null && pick!=null && weftCount!=null) {
      const weight = ((toNum(width) * toNum(pick) * toNum(numWeftConstant)) / 840 * getHanksWt(weftCount));
      setWeftWeight(weight.toFixed(3));
    }
  }, [width, pick, weftCount, numWeftConstant]);

  useEffect(() => {
    if (initWarpCost!=null && warpDyeing!=null && warpweight!=null) {
      const cost = (toNum(initWarpCost) + toNum(warpDyeing)) * toNum(warpweight);
      setWarpCost(cost.toFixed(3));
    }
  }, [initWarpCost, warpDyeing, warpweight]);

  useEffect(() => {
    if (initWeftCost!=null && weftDyeing!=null && weftweight!=null) {
      const cost = (toNum(initWeftCost) + toNum(weftDyeing)) * toNum(weftweight);
      setWeftCost(cost.toFixed(3));
    }
  }, [initWeftCost, weftDyeing, weftweight]);

  useEffect(() => {
    if (warpCost!=null && weftCost!=null && weaving!=null && washing!=null && mending!=null && twisting!=null) {
      const profitVal = (toNum(warpCost) + toNum(weftCost) + toNum(weaving) + toNum(washing) + toNum(mending) + toNum(twisting)) * profitPercent;
      setProfit(profitVal.toFixed(3));
      setSaveProfit(profitVal.toFixed(3));
    }
  }, [warpCost, weftCost, weaving, washing, profitPercent, mending,twisting]);

  useEffect(() => {
    if (warpCost!=null && weftCost!=null && weaving!=null && washing!=null && saveprofit!=null && transport!=null && mending!=null && twisting!=null) {
      const total = toNum(warpCost) + toNum(weftCost) + toNum(weaving) + toNum(washing) + toNum(saveprofit) + toNum(mending) + toNum(twisting) + toNum(transport);
      setTotalCost(total.toFixed(3));
    }
  }, [warpCost, weftCost, weaving, washing, saveprofit, transport, mending, twisting]);

  useEffect(() => {
    if (totalCost!=null) {
      const gstVal = toNum(totalCost) * 0.05;
      setGst(gstVal.toFixed(3));
    }
  }, [totalCost]);

  useEffect(() => {
    if (totalCost!=null && gst!=null) {
      const sum = toNum(totalCost) + toNum(gst);
      setFinalTotal(sum.toFixed(3));
    }
  }, [totalCost, gst]);

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                    <TextInput
                      label="Width (inches)"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      type="number"
                      icon={FaToolbox}
                      min={0}
                      step="0.01"
                    />


                  </div>
                </div>
                
                <DropdownField
                  label="Warp Count"
                  value={warpCount}
                  onChange={(e) => setWarpCount(e.target.value)}
                  options={sortedWarpCountOptions}
                  icon={FaWeight}
                />
                <TextInput
                  label="Reed"
                  value={reed}
                  onChange={(e) => setReed(e.target.value)}
                  type="number"
                  icon={FaIndustry}
                  min={0}
                  step="0.01"
                />
                <DropdownField
                  label="Weft Count"
                  value={weftCount}
                  onChange={(e) => setWeftCount(e.target.value)}
                  options={sortedWeftCountOptions}
                  icon={FaWeight}
                />
                <TextInput
                  label="Pick"
                  value={pick}
                  onChange={(e) => setPick(e.target.value)}
                  type="number"
                  icon={FaIndustry}
                  min={0}
                  step="0.01"
                />
                <div className="md:col-span-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    <TextInput
                      label="Warp Constant"
                      value={numWarpConstant}
                      onChange={(e) => setWarpNumConstant(e.target.value)}
                      type="number"
                      icon={FaNewspaper}
                      min={0}
                      step="0.01"
                    />
                    <TextInput
                      label="Weft Constant"
                      value={numWeftConstant}
                      onChange={(e) => setWeftNumConstant(e.target.value)}
                      type="number"
                      icon={FaNewspaper}
                      min={0}
                      step="0.01"
                    />
                    
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Material Costs" icon={FaMoneyBillWave} color="text-green-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label="Warp Cost (per unit)"
                  value={initWarpCost}
                  onChange={(e) => setInitWarpCost(e.target.value)}
                  type="number"
                  icon={FaMoneyBillWave}
                  min={0}
                  step="0.01"
                />
                <TextInput
                  label="Weft Cost (per unit)"
                  value={initWeftCost}
                  onChange={(e) => setInitWeftCost(e.target.value)}
                  type="number"
                  icon={FaMoneyBillWave}
                  min={0}
                  step="0.01"
                />
                <TextInput
                  label="Warp Dyeing Cost"
                  value={warpDyeing}
                  onChange={(e) => setWarpDyeing(e.target.value)}
                  type="number"
                  icon={FaIndustry}
                  min={0}
                  step="0.01"
                />
                <TextInput
                  label="Weft Dyeing Cost"
                  value={weftDyeing}
                  onChange={(e) => setWeftDyeing(e.target.value)}
                  type="number"
                  icon={FaIndustry}
                  min={0}
                  step="0.01"
                />
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
              <div className="grid grid-cols-1 gap-4">
                <ResultCard
                  title="Warp Weight"
                  value={warpweight}
                  icon={FaWeight}
                  color="bg-yellow-50"
                />
                <ResultCard
                  title="Weft Weight"
                  value={weftweight}
                  icon={FaWeight}
                  color="bg-yellow-50"
                />
              </div>
            </SectionCard>

            <SectionCard title="Cost Breakdown" icon={FaMoneyBillWave} color="text-blue-600">
              <div className="grid grid-cols-1 gap-4">
                <ResultCard
                  title="Warp Cost"
                  value={warpCost}
                  icon={FaMoneyBillWave}
                  color="bg-blue-50"
                />
                <ResultCard
                  title="Weft Cost"
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
                  value={(toNum(warpCost) + toNum(weftCost) + toNum(weaving) + toNum(washing) + toNum(mending) + toNum(twisting)).toFixed(3)}
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