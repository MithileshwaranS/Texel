import React, { useState, useCallback } from "react";
import WarpDesignSheet from "./WarpDesignSheet";
import WeftDesignSheet from "./WeftDesignSheet";
import { FaFileSignature, FaPalette } from "react-icons/fa";

const TextInput = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  icon: Icon,
  className = "",
  required = true,
  name,
}) => {
  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      <label className="text-sm font-medium text-gray-700 flex items-center">
        {Icon && <Icon className="mr-2 text-gray-500" size={16} />}
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        name={name}
        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

const DesignSheet = () => {
  const [designType, setDesignType] = useState("warp");
  const [formData, setFormData] = useState({
    designName: "",
    colorInfo: "",
  });

  const handleInputChange = useCallback(
    (field) => (e) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    },
    []
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => setDesignType("warp")}
          className={`px-4 py-2 rounded-md font-medium ${
            designType === "warp"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Warp Design
        </button>
        <button
          onClick={() => setDesignType("weft")}
          className={`px-4 py-2 rounded-md font-medium ${
            designType === "weft"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Weft Design
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <TextInput
          label="Design Name"
          value={formData.designName}
          onChange={handleInputChange("designName")}
          icon={FaFileSignature}
          placeholder="Enter design name"
        />
        <TextInput
          label="Color"
          value={formData.colorInfo}
          onChange={handleInputChange("colorInfo")}
          icon={FaPalette}
          placeholder="Enter color"
        />
      </div>

      {designType === "warp" ? (
        <WarpDesignSheet
          designName={formData.designName}
          colorInfo={formData.colorInfo}
        />
      ) : (
        <WeftDesignSheet
          designName={formData.designName}
          colorInfo={formData.colorInfo}
        />
      )}
    </div>
  );
};

export default DesignSheet;
