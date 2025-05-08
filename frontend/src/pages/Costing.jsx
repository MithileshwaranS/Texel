import React, { useEffect, useState } from "react";
import {FaWeight, FaMoneyBillWave, FaCalculator, FaIndustry, FaToolbox } from "react-icons/fa";

// Modular Input Components
const TextInput = ({ label, value, onChange, icon: Icon, ...props }) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-medium text-gray-700 flex items-center">
      {Icon && <Icon className="mr-2" />}
      {label}
    </label>
    <input
      className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      value={value}
      onChange={onChange}
      {...props}
    />
  </div>
);

const DropdownField = ({ label, value, onChange, options, icon: Icon }) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-medium text-gray-700 flex items-center">
      {Icon && <Icon className="mr-2" />}
      {label}
    </label>
    <select
      className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      value={value}
      onChange={onChange}
    >
      <option value="" disabled>
        Select {label.toLowerCase()}
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const ResultCard = ({ title, value, icon: Icon, color = "bg-blue-50" }) => (
  <div className={`${color} p-4 rounded-xl shadow-sm border border-gray-200`}>
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-600 flex items-center">
        {Icon && <Icon className="mr-2" />}
        {title}
      </h3>
      <span className="text-lg font-semibold text-gray-800">
        {value || "Calculating..."}
      </span>
    </div>
  </div>
);

// Main Component
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
  const [activeTab, setActiveTab] = useState("inputs");

  // Constants
  const warpCountOptions = ["16s", "20s", "30s", "40s", "60s", "84s"];
  const weftCountOptions = ["56KH"];

  // Helper function
  const toNum = (val) => parseFloat(val || 0);

  // Effects
  useEffect(() => {
    setDisplayName(designName);
  }, [designName]);

  useEffect(() => {
    if (width && reed) {
      const weight = ((toNum(width) * toNum(reed) * 1.5) / 840) * 0.0056;
      setWarpWeight(weight.toFixed(3));
    }
  }, [width, reed]);

  useEffect(() => {
    if (width && pick) {
      const weight = ((toNum(width) * toNum(pick) * 1.45) / 840) * 0.0151;
      setWeftWeight(weight.toFixed(3));
    }
  }, [width, pick]);

  useEffect(() => {
    if (initWarpCost && warpDyeing && warpweight) {
      const cost = (toNum(initWarpCost) + toNum(warpDyeing)) * toNum(warpweight);
      setWarpCost(cost.toFixed(2));
    }
  }, [initWarpCost, warpDyeing, warpweight]);

  useEffect(() => {
    if (initWeftCost && weftDyeing && weftweight) {
      const cost = (toNum(initWeftCost) + toNum(weftDyeing)) * toNum(weftweight);
      setWeftCost(cost.toFixed(2));
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
      const gst = totalCost * 0.05;
      setGst(gst.toFixed(3));
    }
  }, [totalCost]);

  useEffect(() => {
    if (totalCost && gst && transport) {
      const sum = toNum(totalCost) + toNum(gst) + toNum(transport);
      setFinalTotal(sum.toFixed(3));
    }
  }, [totalCost, gst, transport]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center">
                <FaIndustry className="mr-3" />
                Textile Costing Calculator
              </h1>
              {displayedName && (
                <p className="mt-2 text-blue-100 font-medium">
                  Design: <span className="font-bold">{displayedName}</span>
                </p>
              )}
            </div>
            <div className="mt-4 md:mt-0">
              <TextInput
                label="Design Name"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                placeholder="Enter design name..."
                className="w-full md:w-64"
                icon={FaToolbox}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-3 font-medium text-sm flex items-center ${activeTab === "inputs" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("inputs")}
          >
            <FaCalculator className="mr-2" />
            Inputs
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm flex items-center ${activeTab === "results" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("results")}
          >
            <FaMoneyBillWave className="mr-2" />
            Results
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "inputs" ? (
            <div className="space-y-8">
              {/* Fabric Specifications */}
              <div className="bg-blue-50 p-4 rounded-xl">
                <h2 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                  <FaToolbox className="mr-2" />
                  Fabric Specifications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <TextInput
                    label="Width (inches)"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    type="number"
                  />
                  <DropdownField
                    label="Warp Count"
                    value={warpCount}
                    onChange={(e) => setWarpCount(e.target.value)}
                    options={warpCountOptions}
                  />
                  <TextInput
                    label="Reed"
                    value={reed}
                    onChange={(e) => setReed(e.target.value)}
                    type="number"
                  />
                  <DropdownField
                    label="Weft Count"
                    value={weftCount}
                    onChange={(e) => setWeftCount(e.target.value)}
                    options={weftCountOptions}
                  />
                  
                  <TextInput
                    label="Pick"
                    value={pick}
                    onChange={(e) => setPick(e.target.value)}
                    type="number"
                  />
                </div>
              </div>

              {/* Material Costs */}
              <div className="bg-green-50 p-4 rounded-xl">
                <h2 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                  <FaMoneyBillWave className="mr-2" />
                  Material Costs
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <TextInput
                    label="Warp Cost (per unit)"
                    value={initWarpCost}
                    onChange={(e) => setInitWarpCost(e.target.value)}
                    type="number"
                  />
                  <TextInput
                    label="Weft Cost (per unit)"
                    value={initWeftCost}
                    onChange={(e) => setInitWeftCost(e.target.value)}
                    type="number"
                  />
                  <TextInput
                    label="Warp Dyeing Cost"
                    value={warpDyeing}
                    onChange={(e) => setWarpDyeing(e.target.value)}
                    type="number"
                  />
                  <TextInput
                    label="Weft Dyeing Cost"
                    value={weftDyeing}
                    onChange={(e) => setWeftDyeing(e.target.value)}
                    type="number"
                  />
                </div>
              </div>

              {/* Processing Costs */}
              <div className="bg-purple-50 p-4 rounded-xl">
                <h2 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                  <FaIndustry className="mr-2" />
                  Processing Costs
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <TextInput
                    label="Weaving Cost"
                    value={weaving}
                    onChange={(e) => setWeaving(e.target.value)}
                    type="number"
                  />
                  <TextInput
                    label="Washing Cost"
                    value={washing}
                    onChange={(e) => setWashing(e.target.value)}
                    type="number"
                  />
                  <TextInput
                    label="Transport Cost"
                    value={transport}
                    onChange={(e) => setTransport(e.target.value)}
                    type="number"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Weight Calculations */}
              <div className="bg-yellow-50 p-4 rounded-xl">
                <h2 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
                  <FaWeight className="mr-2" />
                  Weight Calculations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              {/* Cost Breakdown */}
              <div className="bg-blue-50 p-4 rounded-xl">
                <h2 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                  <FaMoneyBillWave className="mr-2" />
                  Cost Breakdown
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <ResultCard
                    title="Warp Cost"
                    value={warpCost}
                    icon={FaMoneyBillWave}
                  />
                  <ResultCard
                    title="Weft Cost"
                    value={weftCost}
                    icon={FaMoneyBillWave}
                  />
                  <ResultCard
                    title="Profit"
                    value={profit}
                    icon={FaMoneyBillWave}
                    color="bg-green-50"
                  />
                  <ResultCard
                    title="Total Cost"
                    value={totalCost}
                    icon={FaMoneyBillWave}
                    color="bg-blue-100"
                  />
                </div>
              </div>

              {/* Final Costs */}
              <div className="bg-green-50 p-4 rounded-xl">
                <h2 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                  <FaCalculator className="mr-2" />
                  Final Costs
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ResultCard
                    title="GST (5%)"
                    value={gst}
                    icon={FaCalculator}
                  />
                  <ResultCard
                    title="Transport Cost"
                    value={transport}
                    icon={FaCalculator}
                  />
                  <ResultCard
                    title="Final Total"
                    value={finaltotal}
                    icon={FaCalculator}
                    color="bg-green-100"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Costing;