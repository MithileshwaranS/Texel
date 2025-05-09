import React, { useEffect, useState } from "react";
import { 
  FaWeight, 
  FaMoneyBillWave, 
  FaCalculator, 
  FaIndustry, 
  FaToolbox, 
  FaFileAlt,
  FaPercentage,
  FaTruck,
  FaFileSignature
} from "react-icons/fa";
import { Tab } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Switch } from '@headlessui/react';
import { FiMoon, FiSun } from 'react-icons/fi';

// Custom Components
const TextInput = ({ label, value, onChange, type = "text", placeholder = "", icon: Icon, className = "" }) => (
  <div className={`flex flex-col ${className}`}>
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
      {Icon && <Icon className="mr-2" size={14} />}
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
    />
  </div>
);

const DropdownField = ({ label, value, onChange, options, icon: Icon }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
      {Icon && <Icon className="mr-2" size={14} />}
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
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

const ResultCard = ({ title, value, icon: Icon, color = "bg-white dark:bg-gray-800" }) => (
  <motion.div 
    whileHover={{ scale: 1.03 }}
    className={`${color} p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-xl font-semibold text-gray-800 dark:text-white mt-1">
          {value || "0.000"}
        </p>
      </div>
      {Icon && (
        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
          <Icon size={18} />
        </div>
      )}
    </div>
  </motion.div>
);

const SectionHeader = ({ title, icon: Icon, color = "text-blue-600 dark:text-blue-400" }) => (
  <h2 className={`text-lg font-semibold mb-4 flex items-center ${color}`}>
    <Icon className="mr-2" />
    {title}
  </h2>
);

function Costing() {
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
  const [warpDyeing, setWarpDyeing] = useState("");
  const [weftDyeing, setWeftDyeing] = useState("");
  const [initWeftCost, setInitWeftCost] = useState("");
  const [initWarpCost, setInitWarpCost] = useState("");
  const [weaving, setWeaving] = useState("");
  const [washing, setWashing] = useState("");
  const [profit, setProfit] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [saveprofit, setSaveProfit] = useState("");
  const [gst, setGst] = useState("");
  const [transport, setTransport] = useState("");
  const [finaltotal, setFinalTotal] = useState("");
  const [yarnCount, setYarnCount] = useState([]);
  const [darkMode, setDarkMode] = useState(true);

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Constants
  const warpCountOptions = yarnCount?.map(y => y?.yarn_count) || [];
  const weftCountOptions = yarnCount?.map(y => y.yarn_count) || [];
  
  const getHanksWt = (count) => {
    const found = yarnCount.find(y => y.yarn_count === count);
    return found ? found.hanks_wt : 0;
  };

  // Helper function
  const toNum = (val) => parseFloat(val || 0);

  // Effects
  useEffect(() => {
    setDisplayName(designName);
  }, [designName]);

  useEffect(() => {
    // Fetch data from API
    fetch(`http://localhost:3000/api/yarnCounts`)
      .then(response => response.json())
      .then(data => setYarnCount(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    if (width && reed && warpCount) {
      const weight = ((toNum(width) * toNum(reed) * 1.35) / 840) * getHanksWt(warpCount);
      setWarpWeight(weight.toFixed(3));
    }
  }, [width, reed, warpCount]);

  useEffect(() => {
    if (width && pick && weftCount) {
      const weight = ((toNum(width) * toNum(pick) * 1.35) / 840 * getHanksWt(weftCount));
      setWeftWeight(weight.toFixed(3));
    }
  }, [width, pick, weftCount]);

  useEffect(() => {
    if (initWarpCost && warpDyeing && warpweight) {
      const cost = (toNum(initWarpCost) + toNum(warpDyeing)) * toNum(warpweight);
      setWarpCost(cost.toFixed(3));
    }
  }, [initWarpCost, warpDyeing, warpweight]);

  useEffect(() => {
    if (initWeftCost && weftDyeing && weftweight) {
      const cost = (toNum(initWeftCost) + toNum(weftDyeing)) * toNum(weftweight);
      setWeftCost(cost.toFixed(3));
    }
  }, [initWeftCost, weftDyeing, weftweight]);

  useEffect(() => {
    if (warpCost && weftCost && weaving && washing) {
      const profitVal = (toNum(warpCost) + toNum(weftCost) + toNum(weaving) + toNum(washing)) * 0.12;
      setProfit(profitVal.toFixed(3));
      setSaveProfit(profitVal.toFixed(3));
    }
  }, [warpCost, weftCost, weaving, washing]);

  useEffect(() => {
    if (warpCost && weftCost && weaving && washing && saveprofit) {
      const total = toNum(warpCost) + toNum(weftCost) + toNum(weaving) + toNum(washing) + toNum(saveprofit);
      setTotalCost(total.toFixed(3));
    }
  }, [warpCost, weftCost, weaving, washing, saveprofit]);

  useEffect(() => {
    if (totalCost) {
      const gstVal = toNum(totalCost) * 0.05;
      setGst(gstVal.toFixed(3));
    }
  }, [totalCost]);

  useEffect(() => {
    if (totalCost && gst && transport) {
      const sum = toNum(totalCost) + toNum(gst) + toNum(transport);
      setFinalTotal(sum.toFixed(3));
    }
  }, [totalCost, gst, transport]);

  const renderInputs = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Fabric Specifications */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <SectionHeader title="Fabric Specifications" icon={FaToolbox} color="text-blue-600 dark:text-blue-400" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <TextInput
            label="Width (inches)"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            type="number"
            icon={FaToolbox}
            min={0}
          />
          <DropdownField
            label="Warp Count"
            value={warpCount}
            onChange={(e) => setWarpCount(e.target.value)}
            options={warpCountOptions}
            icon={FaWeight}
          />
          <TextInput
            label="Reed"
            value={reed}
            onChange={(e) => setReed(e.target.value)}
            type="number"
            icon={FaIndustry}
            min={0}
          />
          <DropdownField
            label="Weft Count"
            value={weftCount}
            onChange={(e) => setWeftCount(e.target.value)}
            options={weftCountOptions}
            icon={FaWeight}
          />
          <TextInput
            label="Pick"
            value={pick}
            onChange={(e) => setPick(e.target.value)}
            type="number"
            icon={FaIndustry}
            min={0}
          />
        </div>
      </div>

      {/* Material Costs */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <SectionHeader title="Material Costs" icon={FaMoneyBillWave} color="text-green-600 dark:text-green-400" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <TextInput
            label="Warp Cost (per unit)"
            value={initWarpCost}
            onChange={(e) => setInitWarpCost(e.target.value)}
            type="number"
            icon={FaMoneyBillWave}
            min={0}
          />
          <TextInput
            label="Weft Cost (per unit)"
            value={initWeftCost}
            onChange={(e) => setInitWeftCost(e.target.value)}
            type="number"
            icon={FaMoneyBillWave}
            min={0}
          />
          <TextInput
            label="Warp Dyeing Cost"
            value={warpDyeing}
            onChange={(e) => setWarpDyeing(e.target.value)}
            type="number"
            icon={FaIndustry}
            min={0}
          />
          <TextInput
            label="Weft Dyeing Cost"
            value={weftDyeing}
            onChange={(e) => setWeftDyeing(e.target.value)}
            type="number"
            icon={FaIndustry}
            min={0}
          />
        </div>
      </div>

      {/* Processing Costs */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <SectionHeader title="Processing Costs" icon={FaIndustry} color="text-purple-600 dark:text-purple-400" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TextInput
            label="Weaving Cost"
            value={weaving}
            onChange={(e) => setWeaving(e.target.value)}
            type="number"
            icon={FaIndustry}
            min={0}
          />
          <TextInput
            label="Washing Cost"
            value={washing}
            onChange={(e) => setWashing(e.target.value)}
            type="number"
            icon={FaIndustry}
            min={0}
          />
          <TextInput
            label="Transport Cost"
            value={transport}
            onChange={(e) => setTransport(e.target.value)}
            type="number"
            icon={FaTruck}
            min={0}
          />
        </div>
      </div>
    </motion.div>
  );

  const renderResults = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Weight Calculations */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <SectionHeader title="Weight Calculations" icon={FaWeight} color="text-yellow-600 dark:text-yellow-400" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResultCard
            title="Warp Weight"
            value={warpweight}
            icon={FaWeight}
            color="bg-yellow-50 dark:bg-yellow-900/20"
          />
          <ResultCard
            title="Weft Weight"
            value={weftweight}
            icon={FaWeight}
            color="bg-yellow-50 dark:bg-yellow-900/20"
          />
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <SectionHeader title="Cost Breakdown" icon={FaMoneyBillWave} color="text-blue-600 dark:text-blue-400" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ResultCard
            title="Warp Cost"
            value={warpCost}
            icon={FaMoneyBillWave}
            color="bg-blue-50 dark:bg-blue-900/20"
          />
          <ResultCard
            title="Weft Cost"
            value={weftCost}
            icon={FaMoneyBillWave}
            color="bg-blue-50 dark:bg-blue-900/20"
          />
          <ResultCard
            title="Profit (12%)"
            value={profit}
            icon={FaPercentage}
            color="bg-green-50 dark:bg-green-900/20"
          />
          <ResultCard
            title="Total Cost"
            value={totalCost}
            icon={FaCalculator}
            color="bg-purple-50 dark:bg-purple-900/20"
          />
        </div>
      </div>

      {/* Final Costs */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <SectionHeader title="Final Costs" icon={FaCalculator} color="text-green-600 dark:text-green-400" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ResultCard
            title="GST (5%)"
            value={gst}
            icon={FaPercentage}
            color="bg-red-50 dark:bg-red-900/20"
          />
          <ResultCard
            title="Transport Cost"
            value={transport}
            icon={FaTruck}
            color="bg-indigo-50 dark:bg-indigo-900/20"
          />
          <ResultCard
            title="Final Total"
            value={finaltotal}
            icon={FaMoneyBillWave}
            color="bg-green-50 dark:bg-green-900/20"
          />
        </div>
      </div>
    </motion.div>
  );

  const renderSummary = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Design Info */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <SectionHeader title="Design Information" icon={FaFileSignature} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Design Name</p>
            <p className="font-medium text-gray-800 dark:text-white mt-1">{designName || "-"}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
            <p className="font-medium text-gray-800 dark:text-white mt-1">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <SectionHeader title="Fabric Specifications" icon={FaToolbox} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Width (inches)", value: width },
            { label: "Reed", value: reed },
            { label: "Pick", value: pick },
            { label: "Warp Count", value: warpCount },
            { label: "Weft Count", value: weftCount },
          ].map((item, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
              <p className="font-medium text-gray-800 dark:text-white mt-1">{item.value || "-"}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weights */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <SectionHeader title="Weight Calculations" icon={FaWeight} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Warp Weight", value: warpweight },
            { label: "Weft Weight", value: weftweight },
          ].map((item, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
              <p className="font-medium text-gray-800 dark:text-white mt-1">{item.value || "-"}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Costs */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <SectionHeader title="Cost Breakdown" icon={FaMoneyBillWave} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Warp Cost", value: warpCost },
            { label: "Weft Cost", value: weftCost },
            { label: "Weaving Cost", value: weaving },
            { label: "Washing Cost", value: washing },
            { label: "Profit (12%)", value: profit },
            { label: "Total Cost", value: totalCost },
          ].map((item, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
              <p className="font-medium text-gray-800 dark:text-white mt-1">{item.value || "-"}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final Costs */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <SectionHeader title="Final Costs" icon={FaCalculator} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "GST (5%)", value: gst },
            { label: "Transport", value: transport },
            { label: "Final Total", value: finaltotal, highlight: true },
          ].map((item, index) => (
            <div key={index} className={`${item.highlight ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-700'} p-4 rounded-lg`}>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
              <p className={`font-medium mt-1 ${item.highlight ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-white'}`}>
                {item.value || "-"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-4">
              <FaCalculator size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                Costing Calculator
              </h1>
              {displayedName && (
                <p className="text-blue-600 dark:text-blue-400 font-medium">
                  Design: <span className="font-bold">{displayedName}</span>
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-64">
              <TextInput
                label="Design Name"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                placeholder="Enter design name..."
                icon={FaFileSignature}
              />
            </div>
            
            <Switch
              checked={darkMode}
              onChange={setDarkMode}
              className={`${
                darkMode ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Toggle dark mode</span>
              <span
                className={`${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
              <span className="absolute left-1 top-1">
                <FiMoon className={`h-4 w-4 ${darkMode ? 'text-white' : 'text-gray-400'}`} />
              </span>
              <span className="absolute right-1 top-1">
                <FiSun className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-yellow-500'}`} />
              </span>
            </Switch>
          </div>
        </div>

        {/* Tabs */}
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            {[
              { id: 1, icon: FaCalculator, label: "Inputs" },
              { id: 2, icon: FaMoneyBillWave, label: "Results" },
              { id: 3, icon: FaFileAlt, label: "Summary" }
            ].map((tab) => (
              <Tab
                key={tab.id}
                className={({ selected }) =>
                  `w-full py-3 text-sm font-medium rounded-lg transition-all flex items-center justify-center space-x-2 ${
                    selected
                      ? 'bg-white dark:bg-gray-800 shadow text-blue-700 dark:text-blue-400'
                      : 'text-blue-600 dark:text-blue-300 hover:bg-white/[0.12] hover:text-blue-800 dark:hover:text-white'
                  }`
                }
              >
                <tab.icon />
                <span>{tab.label}</span>
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-6">
            <Tab.Panel>{renderInputs()}</Tab.Panel>
            <Tab.Panel>{renderResults()}</Tab.Panel>
            <Tab.Panel>{renderSummary()}</Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}

export default Costing;